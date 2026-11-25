from datetime import datetime
import json
from app.extensions import db

class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.String(50), primary_key=True)
    make = db.Column(db.String(50), nullable=False, index=True)
    model = db.Column(db.String(100), nullable=False, index=True)
    year = db.Column(db.Integer, nullable=False, index=True)
    price = db.Column(db.BigInteger, nullable=False, index=True) # KES
    mileage = db.Column(db.Integer, nullable=False)
    engine = db.Column(db.String(100), nullable=False)
    fuel = db.Column(db.String(50), nullable=False)
    transmission = db.Column(db.String(50), nullable=False)
    drive = db.Column(db.String(50), nullable=False)
    body = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=False)
    import_status = db.Column(db.String(100), nullable=False)
    registration = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(30), nullable=False, default="Available", index=True) # Available, Reserved, Sold
    badge = db.Column(db.String(50), nullable=True)
    images = db.Column(db.Text, nullable=False) # JSON list
    features = db.Column(db.Text, nullable=False) # JSON list
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def get_images(self):
        try:
            return json.loads(self.images)
        except Exception:
            return [self.images] if self.images else []

    def get_features(self):
        try:
            return json.loads(self.features)
        except Exception:
            return []

    def to_dict(self):
        return {
            "id": self.id,
            "make": self.make,
            "model": self.model,
            "year": self.year,
            "price": self.price,
            "mileage": self.mileage,
            "engine": self.engine,
            "fuel": self.fuel,
            "transmission": self.transmission,
            "drive": self.drive,
            "body": self.body,
            "color": self.color,
            "importStatus": self.import_status,
            "registration": self.registration,
            "status": self.status,
            "badge": self.badge,
            "images": self.get_images(),
            "features": self.get_features(),
            "description": self.description
        }

class Inquiry(db.Model):
    __tablename__ = "inquiries"

    id = db.Column(db.String(50), primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(255), nullable=True)
    customer_phone = db.Column(db.String(50), nullable=False)
    vehicle_id = db.Column(db.String(50), nullable=True)
    vehicle_name = db.Column(db.String(150), nullable=True)
    inquiry_type = db.Column(db.String(50), default="General")
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default="New")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "customerName": self.customer_name,
            "customerEmail": self.customer_email,
            "customerPhone": self.customer_phone,
            "vehicleId": self.vehicle_id,
            "vehicleName": self.vehicle_name,
            "type": self.inquiry_type,
            "message": self.message,
            "status": self.status,
            "date": self.created_at.strftime("%Y-%m-%d %H:%M")
        }

class TestDrive(db.Model):
    __tablename__ = "test_drives"

    id = db.Column(db.String(50), primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(50), nullable=False)
    customer_email = db.Column(db.String(255), nullable=True)
    vehicle_id = db.Column(db.String(50), nullable=True)
    vehicle_name = db.Column(db.String(150), nullable=False)
    preferred_date = db.Column(db.String(50), nullable=False)
    preferred_time = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), default="Pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "customerName": self.customer_name,
            "customerPhone": self.customer_phone,
            "customerEmail": self.customer_email,
            "vehicleId": self.vehicle_id,
            "vehicleName": self.vehicle_name,
            "preferredDate": self.preferred_date,
            "preferredTime": self.preferred_time,
            "notes": self.notes,
            "status": self.status,
            "date": self.created_at.strftime("%Y-%m-%d %H:%M")
        }

class SellSubmission(db.Model):
    __tablename__ = "sell_submissions"

    id = db.Column(db.String(50), primary_key=True)
    owner_name = db.Column(db.String(100), nullable=False)
    owner_phone = db.Column(db.String(50), nullable=False)
    owner_email = db.Column(db.String(255), nullable=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    mileage = db.Column(db.Integer, nullable=False)
    registration = db.Column(db.String(50), nullable=False)
    asking_price = db.Column(db.BigInteger, nullable=False)
    condition = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(30), default="Under Review")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "ownerName": self.owner_name,
            "ownerPhone": self.owner_phone,
            "ownerEmail": self.owner_email,
            "make": self.make,
            "model": self.model,
            "year": self.year,
            "mileage": self.mileage,
            "registration": self.registration,
            "askingPrice": self.asking_price,
            "condition": self.condition,
            "status": self.status,
            "date": self.created_at.strftime("%Y-%m-%d %H:%M")
        }

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.String(50), primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    vehicle = db.Column(db.String(150), nullable=False)
    amount = db.Column(db.BigInteger, nullable=False)
    payment_method = db.Column(db.String(50), default="M-Pesa STK Push")
    status = db.Column(db.String(30), default="Confirmed")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "customerName": self.customer_name,
            "phone": self.phone,
            "vehicle": self.vehicle,
            "amount": self.amount,
            "paymentMethod": self.payment_method,
            "status": self.status,
            "date": self.created_at.strftime("%Y-%m-%d %H:%M")
        }
