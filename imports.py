from datetime import datetime
import json
from app.extensions import db

class ImportCountry(db.Model):
    __tablename__ = "import_countries"

    id = db.Column(db.String(10), primary_key=True) # JP, GB, AE, ZA
    name = db.Column(db.String(100), nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    exchange_rate_kes = db.Column(db.Float, nullable=False)
    shipping_port = db.Column(db.String(100), nullable=False)
    typical_transit_days = db.Column(db.Integer, nullable=False)
    steering = db.Column(db.String(50), nullable=False)
    flag = db.Column(db.String(10), nullable=False)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "currency": self.currency,
            "symbol": self.symbol,
            "exchange_rate_kes": self.exchange_rate_kes,
            "shipping_port": self.shipping_port,
            "typical_transit_days": self.typical_transit_days,
            "steering": self.steering,
            "flag": self.flag,
            "description": self.description
        }

class ImportProvider(db.Model):
    __tablename__ = "import_providers"

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    country_id = db.Column(db.String(10), nullable=False)
    provider_type = db.Column(db.String(30), nullable=False, default="API")
    api_endpoint = db.Column(db.String(255), nullable=True)
    api_key_masked = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(50), default="Connected")
    vehicles_synced = db.Column(db.Integer, default=0)
    last_sync = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "country_id": self.country_id,
            "provider_type": self.provider_type,
            "api_endpoint": self.api_endpoint,
            "api_key_masked": self.api_key_masked,
            "status": self.status,
            "vehicles_synced": self.vehicles_synced,
            "last_sync": self.last_sync.strftime("%Y-%m-%d %H:%M:%S") if self.last_sync else None
        }

class ImportVehicle(db.Model):
    __tablename__ = "import_vehicles"

    id = db.Column(db.String(50), primary_key=True)
    make = db.Column(db.String(50), nullable=False, index=True)
    model = db.Column(db.String(100), nullable=False, index=True)
    year = db.Column(db.Integer, nullable=False, index=True)
    country_id = db.Column(db.String(10), nullable=False, index=True)
    foreign_price = db.Column(db.Float, nullable=False)
    foreign_currency = db.Column(db.String(10), nullable=False)
    cif_mombasa_kes = db.Column(db.BigInteger, nullable=False)
    duty_taxes_kes = db.Column(db.BigInteger, nullable=False)
    estimated_landed_cost_kes = db.Column(db.BigInteger, nullable=False, index=True)
    mileage = db.Column(db.Integer, nullable=False)
    engine = db.Column(db.String(100), nullable=False)
    fuel = db.Column(db.String(50), nullable=False)
    transmission = db.Column(db.String(50), nullable=False)
    drive = db.Column(db.String(50), nullable=False)
    body = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=False)
    steering = db.Column(db.String(50), default="RHD")
    export_port = db.Column(db.String(100), nullable=False)
    auction_grade = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="Overseas Stock")
    source_type = db.Column(db.String(30), default="API") # API or Manual
    provider_id = db.Column(db.String(50), nullable=True)
    featured = db.Column(db.Integer, default=0)
    images = db.Column(db.Text, nullable=False) # JSON
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    photos = db.relationship("ImportVehiclePhoto", back_populates="vehicle", cascade="all, delete-orphan")

    def get_images(self):
        try:
            return json.loads(self.images)
        except Exception:
            return [self.images] if self.images else []

    def to_dict(self):
        return {
            "id": self.id,
            "make": self.make,
            "model": self.model,
            "year": self.year,
            "country_id": self.country_id,
            "foreign_price": self.foreign_price,
            "foreign_currency": self.foreign_currency,
            "cif_mombasa_kes": self.cif_mombasa_kes,
            "duty_taxes_kes": self.duty_taxes_kes,
            "estimated_landed_cost_kes": self.estimated_landed_cost_kes,
            "mileage": self.mileage,
            "engine": self.engine,
            "fuel": self.fuel,
            "transmission": self.transmission,
            "drive": self.drive,
            "body": self.body,
            "color": self.color,
            "steering": self.steering,
            "export_port": self.export_port,
            "auction_grade": self.auction_grade,
            "status": self.status,
            "source_type": self.source_type,
            "provider_id": self.provider_id,
            "featured": self.featured,
            "images": self.get_images(),
            "description": self.description,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

class ImportVehiclePhoto(db.Model):
    __tablename__ = "import_vehicle_photos"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.String(50), db.ForeignKey("import_vehicles.id"), nullable=False)
    photo_url = db.Column(db.String(500), nullable=False)
    caption = db.Column(db.String(150), nullable=True)
    sort_order = db.Column(db.Integer, default=0)

    vehicle = db.relationship("ImportVehicle", back_populates="photos")

class ImportRequest(db.Model):
    __tablename__ = "import_requests"

    id = db.Column(db.String(50), primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(50), nullable=False)
    customer_email = db.Column(db.String(255), nullable=True)
    country_preference = db.Column(db.String(50), nullable=False)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year_min = db.Column(db.Integer, default=2019)
    max_budget_kes = db.Column(db.BigInteger, default=0)
    fuel_preference = db.Column(db.String(50), default="Any")
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), default="New")
    assigned_staff = db.Column(db.String(100), default="Kiiru Njogu")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_name": self.customer_name,
            "customer_phone": self.customer_phone,
            "customer_email": self.customer_email,
            "country_preference": self.country_preference,
            "make": self.make,
            "model": self.model,
            "year_min": self.year_min,
            "max_budget_kes": self.max_budget_kes,
            "fuel_preference": self.fuel_preference,
            "notes": self.notes,
            "status": self.status,
            "assigned_staff": self.assigned_staff,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M")
        }

class ImportQuotation(db.Model):
    __tablename__ = "import_quotations"

    id = db.Column(db.String(50), primary_key=True)
    request_id = db.Column(db.String(50), nullable=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(50), nullable=False)
    vehicle_description = db.Column(db.String(255), nullable=False)
    foreign_purchase_price = db.Column(db.Float, nullable=False)
    foreign_currency = db.Column(db.String(10), nullable=False)
    exchange_rate = db.Column(db.Float, nullable=False)
    cif_mombasa_kes = db.Column(db.BigInteger, nullable=False)
    import_duty_kes = db.Column(db.BigInteger, nullable=False)
    excise_duty_kes = db.Column(db.BigInteger, nullable=False)
    vat_kes = db.Column(db.BigInteger, nullable=False)
    rdl_idf_kes = db.Column(db.BigInteger, nullable=False)
    port_charges_kes = db.Column(db.BigInteger, nullable=False)
    clearing_agent_kes = db.Column(db.BigInteger, nullable=False)
    ntsa_registration_kes = db.Column(db.BigInteger, nullable=False)
    total_landed_cost_kes = db.Column(db.BigInteger, nullable=False)
    deposit_required_kes = db.Column(db.BigInteger, nullable=False)
    validity_date = db.Column(db.String(30), nullable=True)
    status = db.Column(db.String(30), default="Sent")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "request_id": self.request_id,
            "customer_name": self.customer_name,
            "customer_phone": self.customer_phone,
            "vehicle_description": self.vehicle_description,
            "foreign_purchase_price": self.foreign_purchase_price,
            "foreign_currency": self.foreign_currency,
            "cif_mombasa_kes": self.cif_mombasa_kes,
            "total_landed_cost_kes": self.total_landed_cost_kes,
            "deposit_required_kes": self.deposit_required_kes,
            "validity_date": self.validity_date,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M")
        }

class ImportOrder(db.Model):
    __tablename__ = "import_orders"

    id = db.Column(db.String(50), primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(50), nullable=False)
    import_vehicle_id = db.Column(db.String(50), nullable=True)
    vehicle_title = db.Column(db.String(255), nullable=False)
    source_country = db.Column(db.String(50), nullable=False)
    total_landed_cost_kes = db.Column(db.BigInteger, nullable=False)
    deposit_paid_kes = db.Column(db.BigInteger, nullable=False)
    balance_due_kes = db.Column(db.BigInteger, nullable=False)
    current_stage = db.Column(db.String(100), nullable=False, default="Shipping in Progress")
    current_location = db.Column(db.String(150), nullable=False)
    vessel_name = db.Column(db.String(100), nullable=True)
    bill_of_lading = db.Column(db.String(100), nullable=True)
    eta_mombasa = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(30), default="Active")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    tracking_events = db.relationship("ImportTrackingEvent", back_populates="order", cascade="all, delete-orphan")
    documents = db.relationship("ImportDocument", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "customer_name": self.customer_name,
            "customer_phone": self.customer_phone,
            "import_vehicle_id": self.import_vehicle_id,
            "vehicle_title": self.vehicle_title,
            "source_country": self.source_country,
            "total_landed_cost_kes": self.total_landed_cost_kes,
            "deposit_paid_kes": self.deposit_paid_kes,
            "balance_due_kes": self.balance_due_kes,
            "current_stage": self.current_stage,
            "current_location": self.current_location,
            "vessel_name": self.vessel_name,
            "bill_of_lading": self.bill_of_lading,
            "eta_mombasa": self.eta_mombasa,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M")
        }

class ImportTrackingEvent(db.Model):
    __tablename__ = "import_tracking_events"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), db.ForeignKey("import_orders.id"), nullable=False)
    stage_number = db.Column(db.Integer, nullable=False) # 1 through 7
    title = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Integer, default=0, nullable=False)
    event_timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    order = db.relationship("ImportOrder", back_populates="tracking_events")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "stage_number": self.stage_number,
            "title": self.title,
            "location": self.location,
            "notes": self.notes,
            "completed": self.completed,
            "event_timestamp": self.event_timestamp.strftime("%Y-%m-%d %H:%M")
        }

class ImportDocument(db.Model):
    __tablename__ = "import_documents"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), db.ForeignKey("import_orders.id"), nullable=False)
    document_type = db.Column(db.String(100), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    is_public_to_client = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    order = db.relationship("ImportOrder", back_populates="documents")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "document_type": self.document_type,
            "file_url": self.file_url,
            "is_public_to_client": self.is_public_to_client,
            "created_at": self.created_at.strftime("%Y-%m-%d")
        }
