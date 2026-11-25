# Kayan & Njogu Motors — Luxury Automotive Showroom & Dealership Management System

> **Kenya's Premier Luxury Vehicle Showroom & Direct Import Portal**  
> Physical Showroom: Karen & Ngong Road Junction, Nairobi, Kenya  
> Leadership: **Kayan Njogu** (CEO & Managing Director) &bull; **Kiiru Njogu** (General Operations Manager) &bull; **Symo Miogo** (Senior Sales Representative)

---

## 🌟 Architecture: Standalone Independent Web Pages

Every web page is completely independent and renders standalone when opened directly:

| Page URL / File | Purpose & Main Functionality |
| :--- | :--- |
| **`index.html`** (`/`) | **Homepage**: Hero flagship showcase (LC300), quick search filter, value propositions, client testimonials, and promotional banners. |
| **`inventory.html`** (`/inventory`) | **Vehicle Inventory**: Complete showroom fleet with search by make, model, year, body type, fuel, transmission, and sorting by price/year/mileage. |
| **`vehicle-details.html`** (`/vehicle-details?id=...`) | **Vehicle Details**: Full multi-angle gallery, technical specs, description, WhatsApp inquiry with auto-populated car details, VIP test-drive booking, and **M-Pesa STK Push reservation deposit with printable receipt**. |
| **`new-arrivals.html`** (`/new-arrivals`) | **New Arrivals**: Spotlight on freshly landed Japan and UK shipments with auction grade 4.5+ certificates and arrival timelines. |
| **`financing.html`** (`/financing`) | **Asset Financing Portal**: Exact mathematical amortization calculator ($M = P \frac{r(1+r)^n}{(1+r)^n - 1}$), bank partner terms (NCBA, Stanbic, Equity, Co-op, I&M), and loan pre-approval application form. |
| **`sell-your-car.html`** (`/sell-your-car`) | **Sell & Consign**: Vehicle valuation and trade-in submission intake for Kenyan car owners with immediate RTGS settlement or Karen showroom consignment. |
| **`compare.html`** (`/compare`) | **Vehicle Comparison**: Side-by-side spec comparison matrix for up to 3 vehicles (price, engine cc, transmission, drivetrain, registration, features). |
| **`about.html`** (`/about`) | **About & Team**: Company background, mission, vision, and executive bios for Kayan Njogu (CEO), Kiiru Njogu (Manager), and Symo Miogo (Sales Rep). |
| **`contact.html`** (`/contact`) | **Contact Showroom**: Nairobi location details, department phone lines, WhatsApp concierge, business hours, and interactive inquiry form. |
| **`faq.html`** (`/faq`) | **Client FAQs**: Verified mileage, customs duty, M-Pesa reservations, asset financing, and trade-in procedures. |
| **`terms.html`** (`/terms`) | **Terms & Privacy**: 48-hour reservation deposit policy, odometer guarantee, and Kenya Data Protection Act 2019 compliance. |
| **`admin.html`** (`/admin`) | **Executive Control Panel**: Real-time KPIs, fleet inventory CRUD, customer inquiries manager, test-drive booking dispatcher, consignment review, and **M-Pesa payment audit log**. |

---

## 📱 M-Pesa Daraja STK Push Integration

Customers can reserve any vehicle for 48 hours directly on `vehicle-details.html`:
1. Customer enters their Safaricom phone number (`07XX...` or `01XX...`).
2. Selects reservation deposit amount (KSh 50,000 or KSh 100,000).
3. The system triggers an instant STK Push simulation.
4. Generates an official verified transaction reference code (e.g. `MPESA-9X8K7L2M1`).
5. Generates an official printable/downloadable dealership reservation receipt.
6. Automatically logs the payment in the SQLite database and displays it on the Admin Dashboard.

---

## 🛠️ How to Run Locally

### Option 1: Direct Browser Access (Zero Installation)
Double-click any HTML file directly in any web browser (`index.html`, `inventory.html`, `vehicle-details.html`, `admin.html`). The built-in `StorageManager` enables 100% functionality with local persistent storage.

### Option 2: Full-Stack Python Flask Backend

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Launch Application**:
   ```bash
   python app.py
   ```

3. **Open in Browser**:
   - Showroom: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
   - Inventory: [http://127.0.0.1:5000/inventory.html](http://127.0.0.1:5000/inventory.html)
   - Admin Panel: [http://127.0.0.1:5000/admin.html](http://127.0.0.1:5000/admin.html)

---

## 🌐 Production Deployment Guide

### Deploying to Railway
```bash
git init
git add .
git commit -m "Kayan & Njogu Motors multi-page system"
git branch -M main
git remote add origin https://github.com/<your-username>/kayan-njogu-motors.git
git push -u origin main
```
Connect your repository in Railway; it will auto-detect `requirements.txt` and `Procfile`.

### Deploying to Render
1. Create a **New Web Service** on Render.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn app:app`
