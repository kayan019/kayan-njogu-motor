from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    surname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    education = db.Column(db.String(150), nullable=True)
    role = db.Column(db.String(30), nullable=False, default="customer", index=True) # super_admin, manager, sales_rep, customer
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_2fa_enabled = db.Column(db.Boolean, default=False, nullable=False)
    two_factor_secret = db.Column(db.String(255), nullable=True) # Fernet encrypted
    failed_login_attempts = db.Column(db.Integer, default=0, nullable=False)
    locked_until = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    recovery_codes = db.relationship("TwoFactorRecoveryCode", back_populates="user", cascade="all, delete-orphan")
    audit_logs = db.relationship("AuditLog", back_populates="user")

    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)

    @property
    def full_name(self):
        return f"{self.first_name} {self.surname}"

    def is_super_admin(self):
        return self.role == "super_admin"

    def is_staff(self):
        return self.role in ("super_admin", "manager", "sales_rep")

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"
