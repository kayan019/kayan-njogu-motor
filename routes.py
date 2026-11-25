from datetime import datetime, timedelta
from io import BytesIO
import secrets
import hashlib
import pyotp
import qrcode
from flask import (
    Blueprint, render_template, request, redirect, url_for,
    flash, session, send_file, abort, current_app, jsonify
)
from flask_login import login_user, logout_user, login_required, current_user
from app.extensions import db, limiter
from app.models import User, StaffInvitation, AuditLog, TwoFactorRecoveryCode
from app.security import (
    encrypt_secret, decrypt_secret, roles_required,
    generate_recovery_codes, hash_code
)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

def record_audit(action, user=None, resource_type=None, resource_id=None, details=None):
    """
    Appends an immutable audit log record for security actions.
    """
    try:
        user_id = user.id if user else (current_user.id if current_user.is_authenticated else None)
        entry = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string[:500] if request.user_agent else "Unknown",
            details=details,
            timestamp=datetime.utcnow()
        )
        db.session.add(entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Audit log recording error: {e}")

# ==============================================================================
# Authentication Routes
# ==============================================================================

@auth_bp.route("/login", methods=["GET", "POST"])
@limiter.limit("10 per minute")
def login():
    if current_user.is_authenticated:
        if current_user.is_staff():
            return redirect(url_for("admin_dashboard"))
        return redirect(url_for("index"))

    ceo_exists = User.query.filter_by(role="super_admin").first() is not None

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = User.query.filter_by(email=email).first()

        # Account Lockout Check
        if user and user.locked_until and user.locked_until > datetime.utcnow():
            remaining_mins = int((user.locked_until - datetime.utcnow()).total_seconds() / 60) + 1
            flash(f"Account temporarily locked due to multiple failed attempts. Try again in {remaining_mins} minutes.", "error")
            record_audit("login_locked_attempt", user=user, details="Attempted login on locked account")
            return render_template("auth/login.html", ceo_exists=ceo_exists)

        if not user or not user.check_password(password):
            if user:
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= 5:
                    user.locked_until = datetime.utcnow() + timedelta(minutes=15)
                    flash("Account locked for 15 minutes due to 5 consecutive failed attempts.", "error")
                else:
                    flash("Invalid email or password.", "error")
                db.session.commit()
                record_audit("login_failed", user=user, details=f"Failed attempt {user.failed_login_attempts}")
            else:
                flash("Invalid email or password.", "error")
                record_audit("login_failed_unknown_user", details=f"Target email: {email}")
            return render_template("auth/login.html", ceo_exists=ceo_exists)

        if not user.is_active:
            flash("Your account has been deactivated. Contact Super Admin Kayan Njogu.", "error")
            record_audit("login_deactivated_user", user=user)
            return render_template("auth/login.html", ceo_exists=ceo_exists)

        # Reset failed attempts
        user.failed_login_attempts = 0
        user.locked_until = None
        db.session.commit()

        # Check Staff 2FA requirement
        if user.is_staff():
            session["pending_2fa_user_id"] = user.id

            if not user.is_2fa_enabled:
                flash("First-time setup: Authenticator 2FA is mandatory for Kayan & Njogu Motors staff.", "info")
                return redirect(url_for("auth.setup_2fa"))
            else:
                return redirect(url_for("auth.verify_2fa"))

        # Customer Login without 2FA
        login_user(user)
        record_audit("customer_login_success", user=user)
        flash(f"Welcome back, {user.first_name}!", "success")
        return redirect(url_for("index"))

    return render_template("auth/login.html", ceo_exists=ceo_exists)

@auth_bp.route("/setup-2fa", methods=["GET", "POST"])
def setup_2fa():
    user_id = session.get("pending_2fa_user_id")
    if not user_id:
        flash("Please log in first to configure two-factor authentication.", "error")
        return redirect(url_for("auth.login"))

    user = db.session.get(User, user_id)
    if not user:
        return redirect(url_for("auth.login"))

    if request.method == "GET":
        # Generate new TOTP Secret for this setup attempt
        secret = pyotp.random_base32()
        session["temp_totp_secret"] = secret
        return render_template("auth/setup_2fa.html", secret=secret, user=user)

    if request.method == "POST":
        code = request.form.get("code", "").strip().replace(" ", "")
        secret = session.get("temp_totp_secret")

        if not secret:
            flash("Session expired. Please start authenticator setup again.", "error")
            return redirect(url_for("auth.setup_2fa"))

        totp = pyotp.TOTP(secret)
        if not totp.verify(code, valid_window=1):
            flash("Invalid 6-digit verification code. Please check your authenticator clock and try again.", "error")
            return render_template("auth/setup_2fa.html", secret=secret, user=user)

        # Encrypt and save 2FA secret
        user.two_factor_secret = encrypt_secret(secret)
        user.is_2fa_enabled = True

        # Generate 8 single-use emergency recovery codes
        raw_recovery_codes = []
        # Clear existing recovery codes if any
        TwoFactorRecoveryCode.query.filter_by(user_id=user.id).delete()
        for raw, hashed in generate_recovery_codes(8):
            raw_recovery_codes.append(raw)
            rec = TwoFactorRecoveryCode(user_id=user.id, code_hash=hashed, is_used=False)
            db.session.add(rec)

        db.session.commit()
        session.pop("temp_totp_secret", None)
        session.pop("pending_2fa_user_id", None)

        login_user(user)
        record_audit("2fa_enabled", user=user, details="Authenticator 2FA activated with 8 recovery codes")

        flash("Two-Factor Authentication successfully activated!", "success")
        return render_template("auth/recovery_codes.html", codes=raw_recovery_codes, user=user)

@auth_bp.route("/setup-2fa-qr")
def setup_2fa_qr():
    user_id = session.get("pending_2fa_user_id")
    secret = session.get("temp_totp_secret")

    if not user_id or not secret:
        abort(403)

    user = db.session.get(User, user_id)
    if not user:
        abort(404)

    # Provisioning URI format for Google Authenticator / Authy / Microsoft Authenticator
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(
        name=user.email,
        issuer_name="Kayan & Njogu Motors"
    )

    qr = qrcode.QRCode(
        version=1,
        box_size=8,
        border=2,
        error_correction=qrcode.constants.ERROR_CORRECT_M
    )
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#070a12", back_color="#ffffff")

    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")

@auth_bp.route("/verify-2fa", methods=["GET", "POST"])
@limiter.limit("5 per minute")
def verify_2fa():
    user_id = session.get("pending_2fa_user_id")
    if not user_id:
        flash("Session expired. Please log in again.", "error")
        return redirect(url_for("auth.login"))

    user = db.session.get(User, user_id)
    if not user:
        return redirect(url_for("auth.login"))

    if request.method == "POST":
        code_input = request.form.get("code", "").strip().replace(" ", "")

        # 1. Try TOTP 6-digit Verification
        if len(code_input) == 6 and code_input.isdigit():
            decrypted_secret = decrypt_secret(user.two_factor_secret)
            if decrypted_secret:
                totp = pyotp.TOTP(decrypted_secret)
                if totp.verify(code_input, valid_window=1):
                    session.pop("pending_2fa_user_id", None)
                    login_user(user)
                    record_audit("login_2fa_success", user=user, details="Authenticator code verified")
                    flash(f"Welcome back, {user.first_name}!", "success")
                    return redirect(url_for("admin_dashboard"))

        # 2. Try Emergency Recovery Code (e.g. A9K2-X7Q4)
        input_hash = hash_code(code_input)
        rec_code = TwoFactorRecoveryCode.query.filter_by(
            user_id=user.id,
            code_hash=input_hash,
            is_used=False
        ).first()

        if rec_code:
            rec_code.is_used = True
            rec_code.used_at = datetime.utcnow()
            db.session.commit()

            session.pop("pending_2fa_user_id", None)
            login_user(user)
            record_audit("login_recovery_code_used", user=user, details="Single-use emergency recovery code used")
            flash("Logged in using Single-Use Recovery Code. Please generate new recovery codes if running low.", "warning")
            return redirect(url_for("admin_dashboard"))

        flash("Invalid verification code or recovery code.", "error")
        record_audit("login_2fa_failed", user=user, details=f"Invalid code attempt: {code_input[:3]}***")

    return render_template("auth/verify_2fa.html", user=user)

@auth_bp.route("/logout")
def logout():
    if current_user.is_authenticated:
        record_audit("logout", user=current_user)
        logout_user()
    session.clear()
    flash("You have been securely logged out.", "info")
    return redirect(url_for("auth.login"))

# ==============================================================================
# Staff Invitations (CEO Super Admin Only, 48-Hour Expiry)
# ==============================================================================

@auth_bp.route("/invite-staff", methods=["POST"])
@roles_required("super_admin")
def invite_staff():
    payload = request.get_json(silent=True) or request.form
    email = (payload.get("email") or "").strip().lower()
    role = (payload.get("role") or "sales_rep").strip()

    if not email or "@" not in email:
        return jsonify({"success": False, "message": "Valid staff email address required."}), 400

    if role not in ("manager", "sales_rep"):
        return jsonify({"success": False, "message": "Role must be 'manager' or 'sales_rep'."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"success": False, "message": "A user with this email address already exists."}), 400

    # Generate secure random token
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    expires_at = datetime.utcnow() + timedelta(hours=48) # 48-hour expiration rule

    invitation = StaffInvitation(
        email=email,
        role=role,
        token_hash=token_hash,
        created_by_id=current_user.id,
        expires_at=expires_at
    )
    db.session.add(invitation)
    db.session.commit()

    record_audit("staff_invitation_created", user=current_user, resource_type="staff_invitation", resource_id=invitation.id, details=f"Role: {role}, Email: {email}, Expiry: 48 hours")

    invite_url = url_for("auth.accept_invitation", token=raw_token, _external=True)

    return jsonify({
        "success": True,
        "message": f"Staff invitation created for {email} ({role}). Link expires in 48 hours.",
        "invite_url": invite_url,
        "expires_at": expires_at.strftime("%Y-%m-%d %H:%M UTC")
    })

@auth_bp.route("/accept-invitation/<token>", methods=["GET", "POST"])
def accept_invitation(token):
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    invitation = StaffInvitation.query.filter_by(token_hash=token_hash).first()

    if not invitation:
        flash("Invalid invitation link.", "error")
        return redirect(url_for("auth.login"))

    if invitation.is_accepted:
        flash("This invitation has already been accepted. Please log in.", "info")
        return redirect(url_for("auth.login"))

    if invitation.is_expired:
        flash("This invitation expired after 48 hours. Please request a new invitation from CEO Kayan Njogu.", "error")
        return redirect(url_for("auth.login"))

    if request.method == "POST":
        first_name = request.form.get("first_name", "").strip()
        surname = request.form.get("surname", "").strip()
        education = request.form.get("education", "").strip()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm_password", "")

        if not (first_name and surname and password):
            flash("Please complete all required fields.", "error")
            return render_template("auth/accept_invitation.html", invitation=invitation)

        if password != confirm:
            flash("Passwords do not match.", "error")
            return render_template("auth/accept_invitation.html", invitation=invitation)

        if len(password) < 12:
            flash("Password must be at least 12 characters long.", "error")
            return render_template("auth/accept_invitation.html", invitation=invitation)

        new_user = User(
            first_name=first_name,
            surname=surname,
            email=invitation.email,
            education=education,
            role=invitation.role,
            is_active=True,
            is_2fa_enabled=False
        )
        new_user.set_password(password)
        db.session.add(new_user)

        invitation.accepted_at = datetime.utcnow()
        db.session.commit()

        record_audit("staff_invitation_accepted", user=new_user, resource_type="user", resource_id=new_user.id, details=f"Joined as {invitation.role}")

        # Set session for mandatory first-time 2FA configuration
        session["pending_2fa_user_id"] = new_user.id
        flash(f"Welcome to Kayan & Njogu Motors, {first_name}! You must now configure Two-Factor Authentication to access staff functions.", "info")
        return redirect(url_for("auth.setup_2fa"))

    return render_template("auth/accept_invitation.html", invitation=invitation)
