"""
Kayan & Njogu Motors — Production Application Server
Nairobi, Kenya
"""

import os
from app import create_app, ensure_seeded_data
from app.extensions import db

app = create_app()

with app.app_context():
    # Automatically create database tables (users, security, audit_logs, vehicles, imports)
    db.create_all()
    ensure_seeded_data()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("================================================================")
    print("  KAYAN & NJOGU MOTORS — LUXURY AUTOMOTIVE PORTAL")
    print(f"  Live Showroom:   http://127.0.0.1:{port}/")
    print(f"  Imports Portal:  http://127.0.0.1:{port}/imports.html")
    print(f"  Staff Login:     http://127.0.0.1:{port}/auth/login")
    print(f"  Admin Dashboard: http://127.0.0.1:{port}/admin.html")
    print("================================================================")
    app.run(host="0.0.0.0", port=port, debug=False)
