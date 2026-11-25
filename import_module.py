"""
Kayan & Njogu Motors — International Vehicle Import Module
Sourcing: Manual Uploads & API Integrations
Countries: Japan (JPY), United Kingdom (GBP), Dubai / UAE (AED), South Africa (ZAR)
"""

import json
from datetime import datetime, timedelta

# ==============================================================================
# Sourcing Countries & Live Exchange Rates (to KES)
# ==============================================================================

DEFAULT_COUNTRIES = [
    {
        "id": "JP",
        "name": "Japan",
        "currency": "JPY",
        "symbol": "¥",
        "exchange_rate_kes": 0.88,  # 1 JPY = ~0.88 KES
        "shipping_port": "Yokohama / Kobe",
        "typical_transit_days": 32,
        "steering": "RHD (Right Hand Drive)",
        "flag": "🇯🇵",
        "description": "Premier source for authentic Grade 4.5+ auction SUVs, JEVIC certified odometers, and low-mileage Toyotas."
    },
    {
        "id": "GB",
        "name": "United Kingdom",
        "currency": "GBP",
        "symbol": "£",
        "exchange_rate_kes": 168.50,  # 1 GBP = ~168.50 KES
        "shipping_port": "Southampton / Tilbury",
        "typical_transit_days": 28,
        "steering": "RHD (Right Hand Drive)",
        "flag": "🇬🇧",
        "description": "Commanding British luxury (Range Rover, Mercedes-Benz, BMW, Porsche) with full main dealer service logs and high UK specifications."
    },
    {
        "id": "AE",
        "name": "Dubai / UAE",
        "currency": "AED",
        "symbol": "AED",
        "exchange_rate_kes": 35.40,  # 1 AED = ~35.40 KES
        "shipping_port": "Jebel Ali, Dubai",
        "typical_transit_days": 18,
        "steering": "RHD / Sourced GCC Export Spec",
        "flag": "🇦🇪",
        "description": "Ultra-fast 18-day shipping from Jebel Ali. Desert-spec cooling, exclusive flagship V8/V6 Land Cruisers and high-trim executive SUVs."
    },
    {
        "id": "ZA",
        "name": "South Africa",
        "currency": "ZAR",
        "symbol": "R",
        "exchange_rate_kes": 7.35,  # 1 ZAR = ~7.35 KES
        "shipping_port": "Durban Port",
        "typical_transit_days": 14,
        "steering": "RHD (Right Hand Drive)",
        "flag": "🇿🇦",
        "description": "Heavy-duty 4x4 double cab pickups (Toyota Hilux GD-6, Land Cruiser 79 Series, Ford Ranger Raptor) and rugged off-road conversions."
    }
]

DEFAULT_PROVIDERS = [
    {
        "id": "PROV-USS-JP",
        "name": "USS Japan Auto Auctions Network",
        "country_id": "JP",
        "provider_type": "API",
        "api_endpoint": "https://api.uss-auctions.jp/v2/inventory",
        "api_key_masked": "uss_live_tokyo_9921****",
        "status": "Connected (Live Feed)",
        "vehicles_synced": 4
    },
    {
        "id": "PROV-BCA-UK",
        "name": "British Car Auctions (BCA) & UK Dealer Feed",
        "country_id": "GB",
        "provider_type": "API",
        "api_endpoint": "https://api.bca-europe.co.uk/partner/v1/feed",
        "api_key_masked": "bca_uk_partner_4410****",
        "status": "Connected (Live Feed)",
        "vehicles_synced": 3
    },
    {
        "id": "PROV-EMIRATES-AE",
        "name": "Emirates Auction & Dubai Auto Zone",
        "country_id": "AE",
        "provider_type": "API",
        "api_endpoint": "https://api.emiratesauction.ae/v1/export-kenya",
        "api_key_masked": "ea_dubai_gcc_8832****",
        "status": "Connected (Live Feed)",
        "vehicles_synced": 2
    },
    {
        "id": "PROV-AUTOTRADER-ZA",
        "name": "WesBank / AutoTrader Commercial SA",
        "country_id": "ZA",
        "provider_type": "API",
        "api_endpoint": "https://api.autotrader.co.za/syndication/kenya",
        "api_key_masked": "za_wesbank_feed_1092****",
        "status": "Connected (Live Feed)",
        "vehicles_synced": 2
    },
    {
        "id": "PROV-MANUAL",
        "name": "Kayan & Njogu Direct Overseas Sourcing",
        "country_id": "ALL",
        "provider_type": "Manual",
        "api_endpoint": "Internal Showroom Manual Entry",
        "api_key_masked": "N/A - Direct Executive Upload",
        "status": "Active",
        "vehicles_synced": 5
    }
]

# ==============================================================================
# Landed Cost Calculator Service (conforming with KRA / Mombasa Port tariffs)
# ==============================================================================

class LandedCostCalculator:
    """
    Computes landed costs in Kenyan Shillings (KES):
    - FOB (Foreign currency converted to KES)
    - Freight & Marine Insurance to Mombasa
    - Customs Value (CIF Mombasa)
    - KRA Import Duty (35% on CIF)
    - KRA Excise Duty (20% for commercial/small, 25-35% for luxury passenger SUVs)
    - VAT (16% on CIF + Import Duty + Excise Duty)
    - Railway Development Levy - RDL (3.5% on CIF)
    - Import Declaration Fee - IDF (2.5% on CIF)
    - Port Wharfage & CFS Handling (Mombasa)
    - Clearing Agent & NTSA Registration
    """

    EXCHANGE_RATES = {
        "JPY": 0.88,
        "GBP": 168.50,
        "AED": 35.40,
        "ZAR": 7.35,
        "USD": 130.00
    }

    FREIGHT_ESTIMATES_KES = {
        "JP": 240000,   # Japan Ro-Ro
        "GB": 350000,   # UK Southampton to Mombasa
        "AE": 180000,   # Jebel Ali to Mombasa
        "ZA": 150000    # Durban to Mombasa
    }

    @classmethod
    def calculate(cls, foreign_price, currency, country_id="JP", engine_cc=2500):
        rate = cls.EXCHANGE_RATES.get(currency.upper(), 1.0)
        fob_kes = round(foreign_price * rate)
        freight_kes = cls.FREIGHT_ESTIMATES_KES.get(country_id.upper(), 250000)
        marine_insurance_kes = round(fob_kes * 0.015)
        cif_mombasa_kes = fob_kes + freight_kes + marine_insurance_kes

        # KRA Tax Structure
        import_duty_rate = 0.35  # 35% on CIF
        import_duty_kes = round(cif_mombasa_kes * import_duty_rate)

        # Excise rate depends on engine capacity
        if engine_cc > 3000:
            excise_rate = 0.35
        elif engine_cc > 2000:
            excise_rate = 0.30
        else:
            excise_rate = 0.20

        excise_base = cif_mombasa_kes + import_duty_kes
        excise_duty_kes = round(excise_base * excise_rate)

        vat_base = cif_mombasa_kes + import_duty_kes + excise_duty_kes
        vat_kes = round(vat_base * 0.16)

        rdl_kes = round(cif_mombasa_kes * 0.035)  # 3.5%
        idf_kes = round(cif_mombasa_kes * 0.025)  # 2.5%

        total_taxes_kes = import_duty_kes + excise_duty_kes + vat_kes + rdl_kes + idf_kes

        port_charges_kes = 110000
        clearing_fee_kes = 65000
        ntsa_plates_kes = 45000

        total_landed_cost_kes = cif_mombasa_kes + total_taxes_kes + port_charges_kes + clearing_fee_kes + ntsa_plates_kes

        return {
            "foreign_price": foreign_price,
            "currency": currency.upper(),
            "exchange_rate": rate,
            "fob_kes": fob_kes,
            "freight_kes": freight_kes,
            "cif_mombasa_kes": cif_mombasa_kes,
            "import_duty_kes": import_duty_kes,
            "excise_duty_kes": excise_duty_kes,
            "vat_kes": vat_kes,
            "rdl_idf_kes": rdl_kes + idf_kes,
            "total_taxes_kes": total_taxes_kes,
            "port_charges_kes": port_charges_kes,
            "clearing_agent_kes": clearing_fee_kes,
            "ntsa_registration_kes": ntsa_plates_kes,
            "total_landed_cost_kes": total_landed_cost_kes,
            "deposit_required_kes": round(total_landed_cost_kes * 0.30)  # Standard 30% sourcing deposit
        }

# ==============================================================================
# Supplier API Adapters & Registry
# ==============================================================================

class BaseSupplierAdapter:
    def __init__(self, provider_id, country_id, name):
        self.provider_id = provider_id
        self.country_id = country_id
        self.name = name

    def fetch_live_feed(self):
        raise NotImplementedError

class JapanAuctionAPIAdapter(BaseSupplierAdapter):
    def fetch_live_feed(self):
        return [
            {
                "id": "IMP-JP-201",
                "make": "Toyota",
                "model": "Land Cruiser 300 ZX V6 Twin-Turbo",
                "year": 2022,
                "country_id": "JP",
                "foreign_price": 8600000,
                "foreign_currency": "JPY",
                "mileage": 14000,
                "engine": "3.5L V6 Twin-Turbo Petrol (3,444 cc)",
                "fuel": "Petrol",
                "transmission": "10-Speed Automatic",
                "drive": "4WD",
                "body": "SUV",
                "color": "Precious Black Pearl",
                "steering": "RHD",
                "export_port": "Yokohama",
                "auction_grade": "5.0 (Pristine)",
                "status": "Overseas Stock",
                "source_type": "API",
                "provider_id": self.provider_id,
                "featured": 1,
                "images": [
                    "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
                ],
                "description": "High-spec ZX flagship imported from USS Tokyo auction. Grade 5.0 auction sheet, Modellista aero kit, sunroof, beige leather, cool box, and JBL sound."
            },
            {
                "id": "IMP-JP-202",
                "make": "Toyota",
                "model": "Prado 2.8 TX-L 70th Anniversary Edition",
                "year": 2021,
                "country_id": "JP",
                "foreign_price": 5400000,
                "foreign_currency": "JPY",
                "mileage": 31000,
                "engine": "2.8L D-4D Turbo Diesel (2,755 cc)",
                "fuel": "Diesel",
                "transmission": "6-Speed Automatic",
                "drive": "4WD",
                "body": "SUV",
                "color": "Attitude Black Mica",
                "steering": "RHD",
                "export_port": "Kobe",
                "auction_grade": "4.5",
                "status": "Overseas Stock",
                "source_type": "API",
                "provider_id": self.provider_id,
                "featured": 1,
                "images": [
                    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
                ],
                "description": "Special 70th Anniversary edition Prado from TAA Osaka. Saddle tongue luxury brown leather, dark chrome accents, roof rails, and 360-degree camera."
            }
        ]

class UKAutoTraderBCAAdapter(BaseSupplierAdapter):
    def fetch_live_feed(self):
        return [
            {
                "id": "IMP-UK-301",
                "make": "Range Rover",
                "model": "D350 Autobiography LWB",
                "year": 2022,
                "country_id": "GB",
                "foreign_price": 68500,
                "foreign_currency": "GBP",
                "mileage": 21000,
                "engine": "3.0L Inline-6 MHEV Diesel (2,997 cc)",
                "fuel": "Diesel",
                "transmission": "8-Speed Automatic",
                "drive": "AWD",
                "body": "SUV",
                "color": "Santorini Black Metallic",
                "steering": "RHD",
                "export_port": "Southampton",
                "auction_grade": "Grade 1 (UK BCA)",
                "status": "In Transit",
                "source_type": "API",
                "provider_id": self.provider_id,
                "featured": 1,
                "images": [
                    "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80"
                ],
                "description": "Ex-dealer demonstrator directly from Land Rover UK main network. Full executive seating with rear massage tables, Meridian 3D sound, and soft-close doors."
            },
            {
                "id": "IMP-UK-302",
                "make": "Mercedes-Benz",
                "model": "G 400d AMG Line Premium Plus",
                "year": 2021,
                "country_id": "GB",
                "foreign_price": 79000,
                "foreign_currency": "GBP",
                "mileage": 26000,
                "engine": "2.9L Inline-6 Turbo Diesel (2,925 cc)",
                "fuel": "Diesel",
                "transmission": "9G-TRONIC Automatic",
                "drive": "4WD",
                "body": "SUV",
                "color": "Obsidian Black Metallic",
                "steering": "RHD",
                "export_port": "Tilbury",
                "auction_grade": "Grade 1 (UK BCA)",
                "status": "Overseas Stock",
                "source_type": "API",
                "provider_id": self.provider_id,
                "featured": 0,
                "images": [
                    "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80"
                ],
                "description": "The quintessential luxury G-Wagon. Night Package, 20-inch AMG multi-spoke alloys, Burmester surround sound, and triple differential locks."
            }
        ]

class DubaiAuctionAdapter(BaseSupplierAdapter):
    def fetch_live_feed(self):
        return [
            {
                "id": "IMP-AE-401",
                "make": "Toyota",
                "model": "Land Cruiser 300 VXR 3.5L Twin-Turbo (GCC)",
                "year": 2022,
                "country_id": "AE",
                "foreign_price": 285000,
                "foreign_currency": "AED",
                "mileage": 16000,
                "engine": "3.5L V6 Twin-Turbo (3,444 cc)",
                "fuel": "Petrol",
                "transmission": "10-Speed Automatic",
                "drive": "4WD",
                "body": "SUV",
                "color": "Pearl White Crystal",
                "steering": "RHD Sourced",
                "export_port": "Jebel Ali",
                "auction_grade": "Clean Title / Grade A",
                "status": "Overseas Stock",
                "source_type": "API",
                "provider_id": self.provider_id,
                "featured": 1,
                "images": [
                    "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80"
                ],
                "description": "GCC-spec cooling with high-capacity radiator and AC for severe climates. 18-day express vessel booking from Jebel Ali Port straight to Mombasa."
            }
        ]

class SouthAfricaWesBankAdapter(BaseSupplierAdapter):
    def fetch_live_feed(self):
        return [
            {
                "id": "IMP-ZA-501",
                "make": "Toyota",
                "model": "Hilux 2.8 GD-6 Legend RS 4x4 Auto",
                "year": 2022,
                "country_id": "ZA",
                "foreign_price": 645000,
                "foreign_currency": "ZAR",
                "mileage": 34000,
                "engine": "2.8L GD-6 Turbo Diesel (2,755 cc)",
                "fuel": "Diesel",
                "transmission": "6-Speed Automatic",
                "drive": "4WD",
                "body": "Pickup",
                "color": "Glacier White",
                "steering": "RHD",
                "export_port": "Durban Port",
                "auction_grade": "Dekra Certified Condition A",
                "status": "Overseas Stock",
                "source_type": "API",
                "provider_id": self.provider_id,
                "featured": 1,
                "images": [
                    "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80"
                ],
                "description": "South African built Hilux Legend RS with motorized roller shutter, black sports styling bar, JBL premium audio, and heavy-duty suspension."
            }
        ]

class SupplierRegistry:
    """
    Central registry that manages live API sync feeds from Japan, UK, Dubai, and SA.
    """
    _adapters = {
        "PROV-USS-JP": JapanAuctionAPIAdapter("PROV-USS-JP", "JP", "USS Japan Auto Auctions"),
        "PROV-BCA-UK": UKAutoTraderBCAAdapter("PROV-BCA-UK", "GB", "BCA British Car Auctions"),
        "PROV-EMIRATES-AE": DubaiAuctionAdapter("PROV-EMIRATES-AE", "AE", "Emirates Auction Dubai"),
        "PROV-AUTOTRADER-ZA": SouthAfricaWesBankAdapter("PROV-AUTOTRADER-ZA", "ZA", "WesBank / AutoTrader SA")
    }

    @classmethod
    def get_adapter(cls, provider_id):
        return cls._adapters.get(provider_id)

    @classmethod
    def sync_all(cls):
        synced_vehicles = []
        for pid, adapter in cls._adapters.items():
            vehicles = adapter.fetch_live_feed()
            # Calculate landed costs for each
            for v in vehicles:
                cost_breakdown = LandedCostCalculator.calculate(
                    foreign_price=v["foreign_price"],
                    currency=v["foreign_currency"],
                    country_id=v["country_id"]
                )
                v["cif_mombasa_kes"] = cost_breakdown["cif_mombasa_kes"]
                v["duty_taxes_kes"] = cost_breakdown["total_taxes_kes"]
                v["estimated_landed_cost_kes"] = cost_breakdown["total_landed_cost_kes"]
                synced_vehicles.append(v)
        return synced_vehicles
