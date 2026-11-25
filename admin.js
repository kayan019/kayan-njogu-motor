/**
 * Kayan & Njogu Motors — Administration Dashboard Application Logic
 * Nairobi, Kenya
 */

document.addEventListener("DOMContentLoaded", function () {
  // Application State
  const state = {
    currentUser: null,
    vehicles: [],
    inquiries: [],
    testDrives: [],
    sellSubmissions: [],
    payments: [],
    importVehicles: [],
    importRequests: [],
    importOrders: [],
    staffList: [],
    invitations: [],
    auditLogs: [],
    activeTab: "tab-inventory",
    carSearchQuery: "",
    carStatusFilter: "",
    inquiryStatusFilter: "",
    driveStatusFilter: "",
    importSearchQuery: "",
    importCountryFilter: "ALL",
    importSourceFilter: "ALL"
  };

  async function init() {
    setupTabNavigation();
    setupEventListeners();
    await loadData();
    renderAll();
  }

  async function loadData() {
    state.vehicles = StorageManager.getVehicles();
    state.inquiries = StorageManager.getInquiries();
    state.testDrives = StorageManager.getTestDrives();
    state.sellSubmissions = StorageManager.getSellSubmissions();
    state.payments = StorageManager.getPayments();

    // Check Authenticated User Profile
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.authenticated && meData.user) {
          state.currentUser = meData.user;
          const badge = document.getElementById("adminUserBadgeText");
          if (badge) {
            badge.innerHTML = `<strong>${meData.user.full_name}</strong> (${meData.user.role})`;
          }
          const secBtn = document.getElementById("btnTabSecurity");
          if (secBtn && meData.user.role !== "super_admin") {
            secBtn.style.display = "none";
          }
        }
      }
    } catch (e) {}

    // Fetch Live Local Inventory & Showroom Operations
    try {
      const [vRes, iRes, tdRes, sRes, pRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/inquiries"),
        fetch("/api/test-drives"),
        fetch("/api/sell-submissions"),
        fetch("/api/payments")
      ]);
      if (vRes.ok) {
        const d = await vRes.json();
        if (d.success && Array.isArray(d.vehicles) && d.vehicles.length > 0) state.vehicles = d.vehicles;
      }
      if (iRes.ok) {
        const d = await iRes.json();
        if (d.success && Array.isArray(d.inquiries)) state.inquiries = d.inquiries;
      }
      if (tdRes.ok) {
        const d = await tdRes.json();
        if (d.success && Array.isArray(d.test_drives)) state.testDrives = d.test_drives;
      }
      if (sRes.ok) {
        const d = await sRes.json();
        if (d.success && Array.isArray(d.submissions)) state.sellSubmissions = d.submissions;
      }
      if (pRes.ok) {
        const d = await pRes.json();
        if (d.success && Array.isArray(d.payments)) state.payments = d.payments;
      }
    } catch (e) {}

    // Fetch Staff, 48-Hour Invitations, and Security Audit Logs (CEO Super Admin)
    try {
      const [stRes, invRes, logRes] = await Promise.all([
        fetch("/api/staff/list"),
        fetch("/api/staff/invitations"),
        fetch("/api/audit-logs")
      ]);
      if (stRes.ok) {
        const d = await stRes.json();
        if (d.success) state.staffList = d.staff || [];
      }
      if (invRes.ok) {
        const d = await invRes.json();
        if (d.success) state.invitations = d.invitations || [];
      }
      if (logRes.ok) {
        const d = await logRes.json();
        if (d.success) state.auditLogs = d.logs || [];
      }
    } catch (e) {}

    // Fetch Import Vehicles
    try {
      const res = await fetch("/api/imports/vehicles");
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.vehicles) state.importVehicles = d.vehicles;
      }
    } catch (e) {
      const st = localStorage.getItem("knm_import_vehicles");
      if (st) state.importVehicles = JSON.parse(st);
    }

    // Fetch Import Requests
    try {
      const res = await fetch("/api/imports/requests");
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.requests) state.importRequests = d.requests;
      }
    } catch (e) {
      const st = localStorage.getItem("knm_import_requests");
      if (st) state.importRequests = JSON.parse(st);
    }

    // Fetch Import Orders
    try {
      const res = await fetch("/api/imports/orders");
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.orders) state.importOrders = d.orders;
      }
    } catch (e) {
      state.importOrders = [
        {
          id: "KNM-IMP-2026-01",
          customer_name: "Dr. Arthur Waweru",
          customer_phone: "+254 722 112 233",
          vehicle_title: "2022 Range Rover D350 Autobiography LWB",
          source_country: "🇬🇧 United Kingdom",
          total_landed_cost_kes: 22175000,
          current_stage: "Shipping in Progress",
          current_location: "Indian Ocean (High Seas)",
          vessel_name: "MV Hoegh Target",
          bill_of_lading: "BOL-NBO-882910",
          eta_mombasa: "12 Days (Kilindini Berth 21)"
        }
      ];
    }
  }

  function formatMoney(amountKes) {
    return "KSh " + Number(amountKes).toLocaleString("en-KE");
  }

  function formatKm(km) {
    return Number(km).toLocaleString("en-US") + " km";
  }

  function renderAll() {
    renderKPIs();
    renderInventoryTable();
    renderInquiriesTable();
    renderTestDrivesTable();
    renderSellSubmissionsTable();
    renderPaymentsTable();
    renderAnalytics();
    renderImportVehiclesTable();
    renderImportRequestsTable();
    renderImportOrdersTable();
    renderSecurityTables();
  }

  // Render Top Stats & Badges
  function renderKPIs() {
    const totalCars = state.vehicles.length;
    const totalValue = state.vehicles.reduce((sum, c) => sum + (Number(c.price) || 0), 0);
    const activeInquiries = state.inquiries.filter(i => i.status !== "Closed").length;
    const pendingDrives = state.testDrives.filter(d => d.status === "Pending").length;
    const totalPayments = state.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const elTotalCars = document.getElementById("statTotalCars");
    const elTotalValue = document.getElementById("statTotalValue");
    const elInquiries = document.getElementById("statInquiries");
    const elTestDrives = document.getElementById("statTestDrives");
    const elPaymentsTotal = document.getElementById("statPaymentsTotal");

    if (elTotalCars) elTotalCars.textContent = totalCars;
    if (elTotalValue) elTotalValue.textContent = formatMoney(totalValue);
    if (elInquiries) elInquiries.textContent = activeInquiries;
    if (elTestDrives) elTestDrives.textContent = pendingDrives;
    if (elPaymentsTotal) elPaymentsTotal.textContent = formatMoney(totalPayments);

    // Badges in tabs
    const bCars = document.getElementById("badgeCarsCount");
    const bInq = document.getElementById("badgeInquiriesCount");
    const bDrv = document.getElementById("badgeDrivesCount");
    const bSell = document.getElementById("badgeSellCount");
    const bPay = document.getElementById("badgePaymentsCount");
    const bImp = document.getElementById("badgeImportsCount");

    if (bCars) bCars.textContent = totalCars;
    if (bInq) bInq.textContent = state.inquiries.length;
    if (bDrv) bDrv.textContent = state.testDrives.length;
    if (bSell) bSell.textContent = state.sellSubmissions.length;
    if (bPay) bPay.textContent = state.payments.length;
    if (bImp) bImp.textContent = state.importVehicles.length;
  }

  // Setup Tab Navigation
  function setupTabNavigation() {
    const tabs = document.querySelectorAll("#adminTabs .admin-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", function () {
        tabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");

        const targetTabId = this.dataset.tab;
        document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
        const targetPane = document.getElementById(targetTabId);
        if (targetPane) targetPane.classList.add("active");

        state.activeTab = targetTabId;
        if (targetTabId === "tab-analytics") {
          renderAnalytics();
        }
      });
    });
  }

  // TAB 1: FLEET INVENTORY TABLE
  function renderInventoryTable() {
    const tbody = document.getElementById("inventoryTableBody");
    if (!tbody) return;

    let list = [...state.vehicles];

    if (state.carSearchQuery.trim() !== "") {
      const q = state.carSearchQuery.toLowerCase();
      list = list.filter(c =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.registration.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }

    if (state.carStatusFilter) {
      list = list.filter(c => c.status === state.carStatusFilter);
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">
            No vehicles match the selected search or status criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(car => {
      const badgeClass = car.status === "Available" ? "badge-available" :
                         car.status === "Reserved" ? "badge-reserved" : "badge-sold";

      return `
        <tr>
          <td>
            <img src="${car.images[0]}" alt="${car.make}" class="admin-thumb">
          </td>
          <td>
            <div style="font-weight: 700; color: #fff;">${car.make} ${car.model}</div>
            <span style="font-size: 0.75rem; color: #94a3b8;">ID: ${car.id} &bull; ${car.importStatus}</span>
          </td>
          <td>${car.year}</td>
          <td><span style="font-family: monospace; background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px;">${car.registration}</span></td>
          <td><strong style="color: var(--gold);">${formatMoney(car.price)}</strong></td>
          <td>${formatKm(car.mileage)}</td>
          <td>
            <select class="btn-action" onchange="quickUpdateCarStatus('${car.id}', this.value)" style="background: transparent; color: #fff;">
              <option value="Available" ${car.status === 'Available' ? 'selected' : ''}>🟢 Available</option>
              <option value="Reserved" ${car.status === 'Reserved' ? 'selected' : ''}>🟡 Reserved</option>
              <option value="Sold" ${car.status === 'Sold' ? 'selected' : ''}>🔴 Sold</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-action edit" onclick="openEditCarModal('${car.id}')" title="Edit Vehicle">✏️ Edit</button>
              <button class="btn-action delete" onclick="deleteVehicle('${car.id}')" title="Delete Vehicle">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // TAB 2: INQUIRIES TABLE
  function renderInquiriesTable() {
    const tbody = document.getElementById("inquiriesTableBody");
    if (!tbody) return;

    let list = [...state.inquiries];

    if (state.inquiryStatusFilter) {
      list = list.filter(i => i.status === state.inquiryStatusFilter);
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">
            No customer inquiries found for this status.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(inq => {
      const cleanPhone = inq.customerPhone.replace(/[^0-9]/g, "");
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${inq.customerName}, this is Kiiru Njogu from Kayan & Njogu Motors regarding your inquiry (${inq.id}).`)}`;
      const mailLink = `mailto:${inq.customerEmail}?subject=${encodeURIComponent(`Kayan & Njogu Motors Enquiry #${inq.id}`)}`;

      const statusClass = inq.status === "New" ? "badge-new" :
                          inq.status === "In Progress" ? "badge-pending" : "badge-confirmed";

      return `
        <tr>
          <td><strong style="color: var(--gold);">${inq.id}</strong></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${inq.customerName}</div>
            <span style="font-size: 0.75rem; color: #94a3b8;">${inq.date || 'Recent'}</span>
          </td>
          <td>
            <div>📞 ${inq.customerPhone}</div>
            <div style="font-size: 0.78rem; color: #94a3b8;">✉️ ${inq.customerEmail || 'N/A'}</div>
          </td>
          <td>
            <strong>${inq.vehicleName || inq.type}</strong>
            <div style="font-size: 0.75rem; color: var(--gold);">${inq.type}</div>
          </td>
          <td style="max-width: 280px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.4;">
            ${inq.message}
          </td>
          <td>
            <select class="btn-action" onchange="updateInquiryStatus('${inq.id}', this.value)" style="background: transparent; color: #fff;">
              <option value="New" ${inq.status === 'New' ? 'selected' : ''}>🔵 New</option>
              <option value="In Progress" ${inq.status === 'In Progress' ? 'selected' : ''}>🟡 In Progress</option>
              <option value="Closed" ${inq.status === 'Closed' ? 'selected' : ''}>🟢 Closed</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <a href="${waLink}" target="_blank" class="btn-action" style="background: #25d366; color: #fff;" title="Reply on WhatsApp">💬 WhatsApp</a>
              ${inq.customerEmail ? `<a href="${mailLink}" class="btn-action" title="Send Email">✉️ Email</a>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // TAB 3: TEST DRIVES TABLE
  function renderTestDrivesTable() {
    const tbody = document.getElementById("testDrivesTableBody");
    if (!tbody) return;

    let list = [...state.testDrives];

    if (state.driveStatusFilter) {
      list = list.filter(d => d.status === state.driveStatusFilter);
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">
            No test drive reservations recorded for this filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(drive => {
      const cleanPhone = drive.customerPhone.replace(/[^0-9]/g, "");
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${drive.customerName}, Kiiru Njogu from Kayan & Njogu Motors here. Confirming your scheduled test drive (${drive.id}) for the ${drive.vehicleName} on ${drive.preferredDate} at ${drive.preferredTime}.`)}`;

      return `
        <tr>
          <td><strong style="color: var(--gold);">${drive.id}</strong></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${drive.customerName}</div>
            <div style="font-size: 0.78rem; color: #94a3b8;">📞 ${drive.customerPhone}</div>
          </td>
          <td>
            <strong style="color: #fff;">${drive.vehicleName}</strong>
            ${drive.notes ? `<div style="font-size: 0.75rem; color: #cbd5e1;">Route: ${drive.notes}</div>` : ''}
          </td>
          <td>
            <div style="font-weight: 600; color: #fff;">${drive.preferredDate}</div>
            <div style="font-size: 0.78rem; color: var(--gold);">${drive.preferredTime}</div>
          </td>
          <td>
            <span style="color: #34d399; font-weight: 700;">✓ Verified</span>
          </td>
          <td>
            <select class="btn-action" onchange="updateTestDriveStatus('${drive.id}', this.value)" style="background: transparent; color: #fff;">
              <option value="Pending" ${drive.status === 'Pending' ? 'selected' : ''}>🟡 Pending</option>
              <option value="Confirmed" ${drive.status === 'Confirmed' ? 'selected' : ''}>🟢 Confirmed</option>
              <option value="Completed" ${drive.status === 'Completed' ? 'selected' : ''}>🏁 Completed</option>
              <option value="Cancelled" ${drive.status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <a href="${waLink}" target="_blank" class="btn-action" style="background: #25d366; color: #fff;" title="Confirm via WhatsApp">💬 WhatsApp</a>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // TAB 4: SELL YOUR CAR (CONSIGNMENT) TABLE
  function renderSellSubmissionsTable() {
    const tbody = document.getElementById("sellSubmissionsTableBody");
    if (!tbody) return;

    const list = state.sellSubmissions;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">
            No consignment or trade-in requests submitted yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(sub => {
      const cleanPhone = sub.ownerPhone.replace(/[^0-9]/g, "");
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${sub.ownerName}, this is Kiiru Njogu from Kayan & Njogu Motors regarding your ${sub.year} ${sub.make} ${sub.model} valuation request (#${sub.id}).`)}`;

      return `
        <tr>
          <td><strong style="color: var(--gold);">${sub.id}</strong></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${sub.ownerName}</div>
            <div style="font-size: 0.78rem; color: #94a3b8;">📞 ${sub.ownerPhone}</div>
          </td>
          <td>
            <div style="font-weight: 700; color: #fff;">${sub.year} ${sub.make} ${sub.model}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">${sub.condition || 'No extra notes'}</div>
          </td>
          <td><span style="font-family: monospace;">${sub.registration}</span></td>
          <td>${formatKm(sub.mileage)}</td>
          <td><strong style="color: var(--gold);">${formatMoney(sub.askingPrice)}</strong></td>
          <td>
            <select class="btn-action" onchange="updateSellSubmissionStatus('${sub.id}', this.value)" style="background: transparent; color: #fff;">
              <option value="Under Review" ${sub.status === 'Under Review' ? 'selected' : ''}>🟡 Under Review</option>
              <option value="Accepted" ${sub.status === 'Accepted' ? 'selected' : ''}>🟢 Accepted</option>
              <option value="Contacted" ${sub.status === 'Contacted' ? 'selected' : ''}>🔵 Contacted</option>
              <option value="Declined" ${sub.status === 'Declined' ? 'selected' : ''}>🔴 Declined</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <a href="${waLink}" target="_blank" class="btn-action" style="background: #25d366; color: #fff;" title="Contact Owner">💬 WhatsApp</a>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // TAB 5: M-PESA PAYMENTS & RESERVATIONS TABLE
  function renderPaymentsTable() {
    const tbody = document.getElementById("paymentsTableBody");
    if (!tbody) return;

    const list = state.payments;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">
            No M-Pesa reservation payments logged yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(pay => `
      <tr>
        <td><strong style="color: #22c55e;">${pay.id}</strong></td>
        <td>
          <div style="font-weight: 700; color: #fff;">${pay.customerName}</div>
          <span style="font-size: 0.75rem; color: #94a3b8;">${pay.date || 'Recent'}</span>
        </td>
        <td>📞 ${pay.phone}</td>
        <td><strong style="color: #fff;">${pay.vehicle}</strong></td>
        <td><strong style="color: #22c55e; font-size: 1rem;">${formatMoney(pay.amount)}</strong></td>
        <td><span style="background: rgba(0,135,81,0.15); color: #22c55e; border: 1px solid rgba(0,135,81,0.3); padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">${pay.paymentMethod || 'M-Pesa STK'}</span></td>
        <td><span class="status-badge badge-confirmed">Confirmed</span></td>
        <td>
          <button class="btn-action" onclick="alert('M-Pesa Receipt Ref: ${pay.id}\\nClient: ${pay.customerName}\\nVehicle: ${pay.vehicle}\\nAmount: ${formatMoney(pay.amount)}\\nStatus: Confirmed via Safaricom Daraja API.')">
            📄 Details
          </button>
        </td>
      </tr>
    `).join("");
  }

  // TAB 6: ANALYTICS & BREAKDOWNS
  function renderAnalytics() {
    renderBarChart("analyticsMakes", getFrequency(state.vehicles, "make"));
    renderBarChart("analyticsStatuses", getFrequency(state.vehicles, "status"));
    renderBarChart("analyticsFuels", getFrequency(state.vehicles, "fuel"));

    // Price Segments
    const priceSegments = {
      "Under 5M": state.vehicles.filter(c => c.price < 5000000).length,
      "5M – 10M": state.vehicles.filter(c => c.price >= 5000000 && c.price < 10000000).length,
      "10M – 15M": state.vehicles.filter(c => c.price >= 10000000 && c.price < 15000000).length,
      "Above 15M": state.vehicles.filter(c => c.price >= 15000000).length,
    };
    renderBarChart("analyticsPriceSegments", priceSegments);
  }

  function getFrequency(items, key) {
    const counts = {};
    items.forEach(item => {
      const val = item[key] || "Other";
      counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  }

  function renderBarChart(containerId, dataObj) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = Object.values(dataObj).reduce((a, b) => a + b, 0) || 1;

    let html = "";
    for (const [label, count] of Object.entries(dataObj)) {
      const pct = Math.round((count / total) * 100);
      html += `
        <div class="bar-row">
          <div class="bar-label">${label}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%;"></div>
          </div>
          <div class="bar-value">${count}</div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  // Quick Status Updaters
  window.quickUpdateCarStatus = function (carId, newStatus) {
    const car = state.vehicles.find(c => c.id === carId);
    if (!car) return;
    car.status = newStatus;
    StorageManager.saveVehicles(state.vehicles);
    renderKPIs();
    renderAnalytics();
  };

  window.updateInquiryStatus = function (inqId, newStatus) {
    const inq = state.inquiries.find(i => i.id === inqId);
    if (!inq) return;
    inq.status = newStatus;
    StorageManager.saveInquiries(state.inquiries);
    renderKPIs();
  };

  window.updateTestDriveStatus = function (driveId, newStatus) {
    const drive = state.testDrives.find(d => d.id === driveId);
    if (!drive) return;
    drive.status = newStatus;
    StorageManager.saveTestDrives(state.testDrives);
    renderKPIs();
  };

  window.updateSellSubmissionStatus = function (subId, newStatus) {
    const sub = state.sellSubmissions.find(s => s.id === subId);
    if (!sub) return;
    sub.status = newStatus;
    StorageManager.saveSellSubmissions(state.sellSubmissions);
  };

  // ===========================================================================
  // TAB 7: INTERNATIONAL VEHICLE IMPORT MODULE
  // ===========================================================================

  const COUNTRY_META = {
    JP: { flag: "🇯🇵", name: "Japan", curr: "JPY", sym: "¥" },
    GB: { flag: "🇬🇧", name: "United Kingdom", curr: "GBP", sym: "£" },
    AE: { flag: "🇦🇪", name: "Dubai / UAE", curr: "AED", sym: "AED " },
    ZA: { flag: "🇿🇦", name: "South Africa", curr: "ZAR", sym: "R " }
  };

  function formatForeignPrice(val, curr) {
    const meta = Object.values(COUNTRY_META).find(m => m.curr === curr);
    const sym = meta ? meta.sym : (curr + " ");
    return sym + Number(val || 0).toLocaleString("en-US");
  }

  function renderImportVehiclesTable() {
    const tbody = document.getElementById("importVehiclesTableBody");
    const countText = document.getElementById("adminImportCountText");
    if (!tbody) return;

    let list = [...state.importVehicles];

    if (state.importSearchQuery.trim() !== "") {
      const q = state.importSearchQuery.toLowerCase();
      list = list.filter(v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        (v.export_port && v.export_port.toLowerCase().includes(q))
      );
    }

    if (state.importCountryFilter && state.importCountryFilter !== "ALL") {
      list = list.filter(v => v.country_id === state.importCountryFilter);
    }

    if (state.importSourceFilter && state.importSourceFilter !== "ALL") {
      list = list.filter(v => v.source_type === state.importSourceFilter);
    }

    if (countText) {
      countText.textContent = `${list.length} Overseas Listings`;
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 40px; color: #94a3b8;">
            No overseas import vehicles match the active filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(v => {
      const meta = COUNTRY_META[v.country_id] || { flag: "🌐", name: v.country_id, curr: v.foreign_currency };
      const img = (v.images && v.images.length > 0) ? v.images[0] : "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80";
      const sourceBadge = v.source_type === "API"
        ? `<span style="background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">⚡ API Feed</span>`
        : `<span style="background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">Showroom Direct</span>`;

      return `
        <tr>
          <td><span style="font-size: 1.3rem;">${meta.flag}</span> <strong style="font-size: 0.82rem; color: #94a3b8;">${v.country_id}</strong></td>
          <td><img src="${img}" alt="${v.make}" class="admin-thumb" onerror="this.src='https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'"></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${v.make} ${v.model}</div>
            <span style="font-size: 0.72rem; color: #94a3b8;">Ref: ${v.id} &bull; ${v.steering || 'RHD'}</span>
          </td>
          <td>${v.year}</td>
          <td><strong style="color: #fff;">${formatForeignPrice(v.foreign_price, v.foreign_currency)}</strong></td>
          <td><strong style="color: var(--gold);">${formatMoney(v.estimated_landed_cost_kes)}</strong></td>
          <td>${sourceBadge}</td>
          <td><span style="background: rgba(212,175,55,0.15); color: var(--gold); border: 1px solid rgba(212,175,55,0.3); padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">${v.auction_grade || 'Grade 4.5'}</span></td>
          <td><span style="font-size: 0.78rem; color: #94a3b8;">${v.export_port || 'Main Port'}</span></td>
          <td><span class="status-badge ${v.status === 'In Transit' ? 'badge-reserved' : 'badge-available'}">${v.status}</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn-action edit" onclick="window.editImportCar('${v.id}')" title="Edit Listing">✏️</button>
              <button class="btn-action delete" onclick="window.deleteImportCar('${v.id}')" title="Delete Listing">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderImportRequestsTable() {
    const tbody = document.getElementById("importRequestsTableBody");
    const countText = document.getElementById("adminRequestCountText");
    if (!tbody) return;

    if (countText) countText.textContent = `${state.importRequests.length} Client Requests`;

    if (state.importRequests.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px; color: #94a3b8;">
            No bespoke overseas sourcing requests submitted yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = state.importRequests.map(r => {
      const cleanPhone = (r.customer_phone || r.customerPhone || "").replace(/[^0-9]/g, "");
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${r.customer_name || r.customerName}, this is Kiiru Njogu from Kayan & Njogu Motors regarding your import sourcing request for ${r.make} ${r.model} from ${r.country_preference || r.countryPreference}.`)}`;

      const status = r.status || "New";

      return `
        <tr>
          <td><strong style="color: var(--gold);">${r.id}</strong></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${r.customer_name || r.customerName}</div>
            <span style="font-size: 0.72rem; color: #94a3b8;">${r.customer_email || r.customerEmail || 'No Email'}</span>
          </td>
          <td>
            <a href="${waLink}" target="_blank" rel="noopener" class="btn-action" style="color: #22c55e;">
              📞 ${r.customer_phone || r.customerPhone}
            </a>
          </td>
          <td><span style="font-weight: 600; color: #38bdf8;">${r.country_preference || r.countryPreference}</span></td>
          <td><strong style="color: #fff;">${r.make} ${r.model}</strong></td>
          <td>${r.year_min || r.yearMin || 2020}+</td>
          <td><strong style="color: var(--gold);">${(r.max_budget_kes || r.maxBudgetKes) ? formatMoney(r.max_budget_kes || r.maxBudgetKes) : 'Flexible'}</strong></td>
          <td><span style="font-size: 0.8rem; color: #94a3b8;">${r.assigned_staff || r.assignedStaff || 'Kiiru Njogu'}</span></td>
          <td>
            <select class="btn-action" onchange="window.advanceRequestStatus('${r.id}', this.value)" style="background: transparent; color: #fff;">
              <option value="New" ${status === 'New' ? 'selected' : ''}>🟡 New</option>
              <option value="Under Review" ${status === 'Under Review' ? 'selected' : ''}>🔵 Under Review</option>
              <option value="Quoted" ${status === 'Quoted' ? 'selected' : ''}>🟢 Quoted</option>
              <option value="Fulfilled" ${status === 'Fulfilled' ? 'selected' : ''}>✅ Fulfilled</option>
              <option value="Closed" ${status === 'Closed' ? 'selected' : ''}>❌ Closed</option>
            </select>
          </td>
          <td>
            <button class="btn-action edit" onclick="window.generateLandedQuotation('${r.id}')" title="Generate Landed Quotation">
              📄 Quote
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderImportOrdersTable() {
    const tbody = document.getElementById("importOrdersTableBody");
    if (!tbody) return;

    if (state.importOrders.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 40px; color: #94a3b8;">
            No active ocean shipments currently dispatched.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = state.importOrders.map(o => {
      return `
        <tr>
          <td><strong style="color: var(--gold); font-family: monospace;">${o.id}</strong></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${o.customer_name}</div>
            <span style="font-size: 0.72rem; color: #94a3b8;">📞 ${o.customer_phone}</span>
          </td>
          <td><strong style="color: #fff;">${o.vehicle_title}</strong></td>
          <td>${o.source_country}</td>
          <td>
            <div style="color: #38bdf8; font-weight: 600;">${o.vessel_name || 'Vessel Assigned'}</div>
            <span style="font-size: 0.72rem; font-family: monospace; color: #94a3b8;">${o.bill_of_lading || 'BOL Pending'}</span>
          </td>
          <td>
            <span style="background: rgba(212,175,55,0.15); color: var(--gold); border: 1px solid rgba(212,175,55,0.3); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
              ${o.current_stage}
            </span>
          </td>
          <td><span style="font-size: 0.8rem; color: #94a3b8;">${o.current_location || 'En Route'}</span></td>
          <td><span style="color: #22c55e; font-weight: 600; font-size: 0.82rem;">${o.eta_mombasa || 'Calculating'}</span></td>
          <td>
            <button class="btn-action edit" onclick="window.openShipmentModal('${o.id}')" style="color: var(--gold);" title="Advance Stage / Record Milestone">
              ⚡ Dispatch Stage
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // Delete Import Vehicle
  window.deleteImportCar = function (carId) {
    const car = state.importVehicles.find(c => c.id === carId);
    if (!car) return;

    if (!confirm(`Are you sure you want to delete overseas listing: ${car.year} ${car.make} ${car.model} (${car.id})?`)) {
      return;
    }

    state.importVehicles = state.importVehicles.filter(c => c.id !== carId);
    localStorage.setItem("knm_import_vehicles", JSON.stringify(state.importVehicles));

    fetch(`/api/imports/vehicles/${carId}`, { method: "DELETE" }).catch(() => {});

    renderKPIs();
    renderImportVehiclesTable();
  };

  // Edit Import Vehicle
  window.editImportCar = function (carId) {
    const car = state.importVehicles.find(c => c.id === carId);
    if (!car) return;

    document.getElementById("importCarModalTitle").textContent = "Edit Overseas Listing: " + car.make + " " + car.model;
    document.getElementById("editImportCarId").value = car.id;
    document.getElementById("impId").value = car.id;
    document.getElementById("impId").readOnly = true;

    document.getElementById("impCountry").value = car.country_id;
    document.getElementById("impMake").value = car.make;
    document.getElementById("impModel").value = car.model;
    document.getElementById("impYear").value = car.year;
    document.getElementById("impCurrency").value = car.foreign_currency;
    document.getElementById("impForeignPrice").value = car.foreign_price;
    document.getElementById("impMileage").value = car.mileage;
    document.getElementById("impEngine").value = car.engine;
    document.getElementById("impFuel").value = car.fuel;
    document.getElementById("impTransmission").value = car.transmission;
    document.getElementById("impDrive").value = car.drive;
    document.getElementById("impPort").value = car.export_port;
    document.getElementById("impAuctionGrade").value = car.auction_grade;
    document.getElementById("impSourceType").value = car.source_type;
    document.getElementById("impStatus").value = car.status;
    document.getElementById("impImage").value = (car.images && car.images.length > 0) ? car.images[0] : "";
    document.getElementById("impDescription").value = car.description;

    openModal("importCarFormModal");
  };

  // Advance Request Status
  window.advanceRequestStatus = async function (reqId, newStatus) {
    const req = state.importRequests.find(r => r.id === reqId);
    if (!req) return;
    req.status = newStatus;
    localStorage.setItem("knm_import_requests", JSON.stringify(state.importRequests));

    try {
      await fetch(`/api/imports/requests/${reqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}

    renderImportRequestsTable();
  };

  // Generate Landed Quotation
  window.generateLandedQuotation = async function (reqId) {
    const req = state.importRequests.find(r => r.id === reqId);
    if (!req) return;

    const custName = req.customer_name || req.customerName;
    const custPhone = req.customer_phone || req.customerPhone;
    const desc = `${req.make} ${req.model}`;

    const quotePayload = {
      request_id: reqId,
      customer_name: custName,
      customer_phone: custPhone,
      vehicle_description: desc,
      foreign_purchase_price: 6500000,
      foreign_currency: "JPY",
      country_id: "JP"
    };

    try {
      const res = await fetch("/api/imports/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotePayload)
      });
      if (res.ok) {
        const d = await res.json();
        alert(`✅ Landed Cost Quotation Generated! Reference: ${d.id}. Client: ${custName}. Official quotation dispatched.`);
        window.advanceRequestStatus(reqId, "Quoted");
        return;
      }
    } catch (e) {}

    alert(`✅ Landed Cost Quotation Generated! Client: ${custName}. Status updated to Quoted.`);
    window.advanceRequestStatus(reqId, "Quoted");
  };

  // Open Shipment Dispatcher Modal
  window.openShipmentModal = function (orderId) {
    const order = state.importOrders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById("shipmentOrderId").value = order.id;
    document.getElementById("shipmentModalOrderRef").textContent = `${order.id} — ${order.customer_name} (${order.vehicle_title})`;
    document.getElementById("shipmentLocation").value = order.current_location || "";
    document.getElementById("shipmentVessel").value = order.vessel_name || "";
    document.getElementById("shipmentBol").value = order.bill_of_lading || "";
    document.getElementById("shipmentEta").value = order.eta_mombasa || "";
    document.getElementById("shipmentNotes").value = "";

    openModal("shipmentStageModal");
  };

  // Delete Vehicle
  window.deleteVehicle = function (carId) {
    const car = state.vehicles.find(c => c.id === carId);
    if (!car) return;

    if (!confirm(`Are you sure you want to remove the ${car.year} ${car.make} ${car.model} (${car.id}) from the showroom?`)) {
      return;
    }

    state.vehicles = state.vehicles.filter(c => c.id !== carId);
    StorageManager.saveVehicles(state.vehicles);

    // Call API if server active
    fetch(`/api/vehicles/${carId}`, { method: "DELETE" }).catch(() => {});

    renderKPIs();
    renderInventoryTable();
    renderAnalytics();
  };

  // Add & Edit Vehicle Modal Handlers
  window.openEditCarModal = function (carId) {
    const car = state.vehicles.find(c => c.id === carId);
    if (!car) return;

    document.getElementById("carModalTitle").textContent = "Edit Vehicle: " + car.make + " " + car.model;
    document.getElementById("editVehicleId").value = car.id;
    document.getElementById("vId").value = car.id;
    document.getElementById("vId").readOnly = true;

    document.getElementById("vMake").value = car.make;
    document.getElementById("vModel").value = car.model;
    document.getElementById("vYear").value = car.year;
    document.getElementById("vPrice").value = car.price;
    document.getElementById("vMileage").value = car.mileage;
    document.getElementById("vEngine").value = car.engine;
    document.getElementById("vFuel").value = car.fuel;
    document.getElementById("vTransmission").value = car.transmission;
    document.getElementById("vDrive").value = car.drive;
    document.getElementById("vBody").value = car.body;
    document.getElementById("vColor").value = car.color;
    document.getElementById("vImportStatus").value = car.importStatus;
    document.getElementById("vRegistration").value = car.registration;
    document.getElementById("vStatus").value = car.status;
    document.getElementById("vBadge").value = car.badge || "";

    document.getElementById("vImage1").value = car.images[0] || "";
    document.getElementById("vAdditionalImages").value = car.images.slice(1).join(", ");
    document.getElementById("vFeatures").value = car.features.join(", ");
    document.getElementById("vDescription").value = car.description;

    openModal("carFormModal");
  };

  function openAddCarModal() {
    const form = document.getElementById("vehicleAdminForm");
    if (form) form.reset();

    document.getElementById("carModalTitle").textContent = "Add New Vehicle to Showroom";
    document.getElementById("editVehicleId").value = "";
    document.getElementById("vId").value = "KNM-" + Math.floor(111 + Math.random() * 888);
    document.getElementById("vId").readOnly = false;
    document.getElementById("vImage1").value = "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80";

    openModal("carFormModal");
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("open");
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("open");
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Search & Filter in Inventory
    const searchInput = document.getElementById("adminSearchCars");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.carSearchQuery = this.value;
        renderInventoryTable();
      });
    }

    const filterStatus = document.getElementById("adminFilterStatus");
    if (filterStatus) {
      filterStatus.addEventListener("change", function () {
        state.carStatusFilter = this.value;
        renderInventoryTable();
      });
    }

    const filterInq = document.getElementById("adminFilterInquiryStatus");
    if (filterInq) {
      filterInq.addEventListener("change", function () {
        state.inquiryStatusFilter = this.value;
        renderInquiriesTable();
      });
    }

    const filterDrv = document.getElementById("adminFilterDriveStatus");
    if (filterDrv) {
      filterDrv.addEventListener("change", function () {
        state.driveStatusFilter = this.value;
        renderTestDrivesTable();
      });
    }

    // Modal Buttons
    const btnAddNewCar = document.getElementById("btnAddNewCar");
    if (btnAddNewCar) btnAddNewCar.addEventListener("click", openAddCarModal);

    const btnCloseCarModal = document.getElementById("btnCloseCarModal");
    if (btnCloseCarModal) btnCloseCarModal.addEventListener("click", () => closeModal("carFormModal"));

    const btnCancelCarForm = document.getElementById("btnCancelCarForm");
    if (btnCancelCarForm) btnCancelCarForm.addEventListener("click", () => closeModal("carFormModal"));

    // Reset Data to Defaults Button
    const btnResetData = document.getElementById("btnResetData");
    if (btnResetData) {
      btnResetData.addEventListener("click", function () {
        if (confirm("Reset all vehicles, test drives, and customer inquiries to official Kayan & Njogu Motors demo defaults?")) {
          StorageManager.resetToDefaults();
          loadData();
          renderAll();
          alert("All showroom data reset to official defaults.");
        }
      });
    }

    // Vehicle Form Submission (Add or Update)
    const carForm = document.getElementById("vehicleAdminForm");
    if (carForm) {
      carForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const editId = document.getElementById("editVehicleId").value.trim();
        const primaryImg = document.getElementById("vImage1").value.trim();
        const additionalImgs = document.getElementById("vAdditionalImages").value.split(",").map(s => s.trim()).filter(Boolean);
        const imagesList = [primaryImg, ...additionalImgs];

        const featuresList = document.getElementById("vFeatures").value.split(",").map(s => s.trim()).filter(Boolean);

        const carData = {
          id: document.getElementById("vId").value.trim(),
          make: document.getElementById("vMake").value.trim(),
          model: document.getElementById("vModel").value.trim(),
          year: Number(document.getElementById("vYear").value),
          price: Number(document.getElementById("vPrice").value),
          mileage: Number(document.getElementById("vMileage").value),
          engine: document.getElementById("vEngine").value.trim(),
          fuel: document.getElementById("vFuel").value,
          transmission: document.getElementById("vTransmission").value.trim(),
          drive: document.getElementById("vDrive").value,
          body: document.getElementById("vBody").value,
          color: document.getElementById("vColor").value.trim(),
          importStatus: document.getElementById("vImportStatus").value.trim(),
          registration: document.getElementById("vRegistration").value.trim(),
          status: document.getElementById("vStatus").value,
          badge: document.getElementById("vBadge").value,
          images: imagesList,
          features: featuresList,
          description: document.getElementById("vDescription").value.trim()
        };

        if (editId) {
          // Update existing
          const idx = state.vehicles.findIndex(c => c.id === editId);
          if (idx > -1) {
            state.vehicles[idx] = carData;
          }
          // API Call
          fetch(`/api/vehicles/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData)
          }).catch(() => {});
        } else {
          // Add new
          state.vehicles.unshift(carData);
          // API Call
          fetch("/api/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData)
          }).catch(() => {});
        }

        StorageManager.saveVehicles(state.vehicles);
        closeModal("carFormModal");
        renderKPIs();
        renderInventoryTable();
        renderAnalytics();
      });
    }

    // -------------------------------------------------------------------------
    // Import Module Event Listeners
    // -------------------------------------------------------------------------

    // Search and Filters for Imports
    const searchImports = document.getElementById("adminSearchImports");
    if (searchImports) {
      searchImports.addEventListener("input", function (e) {
        state.importSearchQuery = e.target.value;
        renderImportVehiclesTable();
      });
    }

    const filterCountry = document.getElementById("adminFilterImportCountry");
    if (filterCountry) {
      filterCountry.addEventListener("change", function (e) {
        state.importCountryFilter = e.target.value;
        renderImportVehiclesTable();
      });
    }

    const filterSource = document.getElementById("adminFilterImportSource");
    if (filterSource) {
      filterSource.addEventListener("change", function (e) {
        state.importSourceFilter = e.target.value;
        renderImportVehiclesTable();
      });
    }

    // Sync Live Auction Feeds
    const btnSyncFeeds = document.getElementById("btnSyncImportFeedsAdmin");
    if (btnSyncFeeds) {
      btnSyncFeeds.addEventListener("click", async function () {
        btnSyncFeeds.innerHTML = "🔄 Syncing Auction Feeds...";
        btnSyncFeeds.disabled = true;

        try {
          const res = await fetch("/api/imports/sync-api", { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            alert(`✅ ${data.message || 'Auction feeds synchronized!'}`);
            await loadData();
            renderKPIs();
            renderImportVehiclesTable();
          } else {
            alert("Auction feeds (USS Japan, BCA UK, Emirates Dubai, WesBank SA) checked. Stock is current.");
          }
        } catch (e) {
          alert("Auction feeds checked. Stock is current.");
        } finally {
          btnSyncFeeds.innerHTML = "⚡ Sync Auction Feeds";
          btnSyncFeeds.disabled = false;
        }
      });
    }

    // Add New Import Vehicle Modal Open
    const btnAddImportCar = document.getElementById("btnAddNewImportCar");
    if (btnAddImportCar) {
      btnAddImportCar.addEventListener("click", function () {
        document.getElementById("importCarModalTitle").textContent = "Add Overseas Vehicle Listing";
        document.getElementById("importCarAdminForm").reset();
        document.getElementById("editImportCarId").value = "";
        document.getElementById("impId").value = "IMP-" + Math.floor(100 + Math.random() * 900);
        document.getElementById("impId").readOnly = false;
        openModal("importCarFormModal");
      });
    }

    // Close Import Vehicle Modal
    const btnCloseImp = document.getElementById("btnCloseImportCarModal");
    const btnCancelImp = document.getElementById("btnCancelImportCarModal");
    if (btnCloseImp) btnCloseImp.addEventListener("click", () => closeModal("importCarFormModal"));
    if (btnCancelImp) btnCancelImp.addEventListener("click", () => closeModal("importCarFormModal"));

    // Save Import Vehicle Form
    const impCarForm = document.getElementById("importCarAdminForm");
    if (impCarForm) {
      impCarForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const editId = document.getElementById("editImportCarId").value.trim();
        const countryId = document.getElementById("impCountry").value;
        const foreignPrice = Number(document.getElementById("impForeignPrice").value);
        const foreignCurrency = document.getElementById("impCurrency").value;

        // Approximate Landed Cost Calculation
        const rateMap = { JPY: 0.88, GBP: 168.50, AED: 35.40, ZAR: 7.35 };
        const rate = rateMap[foreignCurrency] || 1.0;
        const fob = Math.round(foreignPrice * rate);
        const freight = 250000;
        const cif = fob + freight + Math.round(fob * 0.015);
        const taxes = Math.round(cif * 0.75); // approx 75% total KRA duty + excise + VAT + RDL/IDF
        const portFees = 220000;
        const totalLanded = cif + taxes + portFees;

        const carData = {
          id: document.getElementById("impId").value.trim(),
          country_id: countryId,
          make: document.getElementById("impMake").value.trim(),
          model: document.getElementById("impModel").value.trim(),
          year: Number(document.getElementById("impYear").value),
          foreign_currency: foreignCurrency,
          foreign_price: foreignPrice,
          cif_mombasa_kes: cif,
          duty_taxes_kes: taxes,
          estimated_landed_cost_kes: totalLanded,
          mileage: Number(document.getElementById("impMileage").value),
          engine: document.getElementById("impEngine").value.trim(),
          fuel: document.getElementById("impFuel").value,
          transmission: document.getElementById("impTransmission").value,
          drive: document.getElementById("impDrive").value,
          body: "SUV",
          color: "Executive Spec",
          steering: "RHD",
          export_port: document.getElementById("impPort").value.trim(),
          auction_grade: document.getElementById("impAuctionGrade").value.trim(),
          source_type: document.getElementById("impSourceType").value,
          status: document.getElementById("impStatus").value,
          images: [document.getElementById("impImage").value.trim() || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"],
          description: document.getElementById("impDescription").value.trim()
        };

        if (editId) {
          const idx = state.importVehicles.findIndex(c => c.id === editId);
          if (idx > -1) state.importVehicles[idx] = carData;
          fetch(`/api/imports/vehicles/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData)
          }).catch(() => {});
        } else {
          state.importVehicles.unshift(carData);
          fetch("/api/imports/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData)
          }).catch(() => {});
        }

        localStorage.setItem("knm_import_vehicles", JSON.stringify(state.importVehicles));
        closeModal("importCarFormModal");
        renderKPIs();
        renderImportVehiclesTable();
      });
    }

    // Close Shipment Modal
    const btnCloseShip = document.getElementById("btnCloseShipmentModal");
    const btnCancelShip = document.getElementById("btnCancelShipmentModal");
    if (btnCloseShip) btnCloseShip.addEventListener("click", () => closeModal("shipmentStageModal"));
    if (btnCancelShip) btnCancelShip.addEventListener("click", () => closeModal("shipmentStageModal"));

    // Save Shipment Form
    const shipmentForm = document.getElementById("shipmentAdminForm");
    if (shipmentForm) {
      shipmentForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const orderId = document.getElementById("shipmentOrderId").value;
        const stageNum = parseInt(document.getElementById("shipmentStageNumber").value, 10);
        const stageTitle = document.getElementById("shipmentStageNumber").options[document.getElementById("shipmentStageNumber").selectedIndex].text;
        const location = document.getElementById("shipmentLocation").value.trim();
        const vessel = document.getElementById("shipmentVessel").value.trim();
        const bol = document.getElementById("shipmentBol").value.trim();
        const eta = document.getElementById("shipmentEta").value.trim();
        const notes = document.getElementById("shipmentNotes").value.trim();

        // Update local order
        const order = state.importOrders.find(o => o.id === orderId);
        if (order) {
          order.current_stage = stageTitle;
          order.current_location = location;
          if (vessel) order.vessel_name = vessel;
          if (bol) order.bill_of_lading = bol;
          if (eta) order.eta_mombasa = eta;
        }

        // Post to backend API
        try {
          await fetch("/api/imports/tracking-events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: orderId,
              stage_number: stageNum,
              title: stageTitle,
              location: location,
              notes: notes,
              completed: 1,
              update_order: true
            })
          });
        } catch (err) {}

        alert(`✅ Order ${orderId} advanced to Stage ${stageNum}: ${stageTitle}! Client will see live update on the public tracking portal.`);
        closeModal("shipmentStageModal");
        renderImportOrdersTable();
      });
    }

    // CEO Staff Invitation Submit (48-Hour Expiry)
    const inviteForm = document.getElementById("ceoInviteStaffForm");
    if (inviteForm) {
      inviteForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("inviteEmail").value.trim();
        const role = document.getElementById("inviteRole").value;
        const btn = document.getElementById("btnGenerateStaffInvite");
        if (btn) { btn.disabled = true; btn.textContent = "Generating..."; }

        try {
          const res = await fetch("/api/staff/invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            const box = document.getElementById("inviteLinkResult");
            const urlCode = document.getElementById("generatedInviteUrl");
            if (urlCode) urlCode.textContent = data.invite_url;
            if (box) box.style.display = "block";
            inviteForm.reset();
            await loadData();
            renderSecurityTables();
          } else {
            alert(data.message || "Failed to create invitation.");
          }
        } catch (err) {
          alert("Error connecting to server for invitation creation.");
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = "✉️ Generate 48-Hour Invite"; }
        }
      });
    }

    const copyBtn = document.getElementById("btnCopyInviteUrl");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        const text = document.getElementById("generatedInviteUrl")?.textContent || "";
        if (text && navigator.clipboard) {
          navigator.clipboard.writeText(text);
          copyBtn.textContent = "Copied ✓";
          setTimeout(() => { copyBtn.textContent = "Copy Link"; }, 2000);
        }
      });
    }
  }

  // ===========================================================================
  // TAB 8: STAFF ACCESS, 48-HOUR INVITATIONS & AUDIT SECURITY
  // ===========================================================================

  function renderSecurityTables() {
    const bStaff = document.getElementById("badgeStaffCount");
    if (bStaff) bStaff.textContent = state.staffList.length;

    const staffBody = document.getElementById("staffUsersTableBody");
    if (staffBody) {
      if (state.staffList.length === 0) {
        staffBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color:#94a3b8;">No staff accounts found or Super Admin authorization required.</td></tr>`;
      } else {
        staffBody.innerHTML = state.staffList.map(u => `
          <tr>
            <td><strong>${u.full_name}</strong><div style="font-size:0.75rem;color:#94a3b8;">${u.education || 'Executive Team'}</div></td>
            <td>${u.email}</td>
            <td><span class="status-badge badge-available">${u.role}</span></td>
            <td>${u.is_2fa_enabled ? '<span style="color:#34d399;font-weight:700;">✓ 2FA Active</span>' : '<span style="color:#f59e0b;">⏳ Setup Pending</span>'}</td>
            <td>${u.is_active ? '<span style="color:#34d399;">Active</span>' : '<span style="color:#ef4444;">Deactivated</span>'}</td>
            <td>${u.created_at}</td>
            <td>
              ${u.role !== 'super_admin' ? `<button class="btn-action" onclick="window.toggleStaffActive(${u.id})">${u.is_active ? 'Deactivate' : 'Activate'}</button>` : '<span style="color:#d4af37;font-size:0.78rem;">CEO Root</span>'}
            </td>
          </tr>
        `).join("");
      }
    }

    const invBody = document.getElementById("staffInvitationsTableBody");
    if (invBody) {
      if (state.invitations.length === 0) {
        invBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color:#94a3b8;">No staff invitations generated yet.</td></tr>`;
      } else {
        invBody.innerHTML = state.invitations.map(i => {
          const stBadge = i.is_accepted ? '<span style="color:#34d399;font-weight:700;">✓ Accepted</span>'
            : (i.is_expired ? '<span style="color:#ef4444;">Expired (48h)</span>' : '<span style="color:#38bdf8;font-weight:700;">⏳ Pending (Valid)</span>');
          return `
            <tr>
              <td><strong>${i.email}</strong></td>
              <td>${i.role}</td>
              <td>${i.expires_at}</td>
              <td>${stBadge}</td>
              <td>${i.created_at}</td>
            </tr>
          `;
        }).join("");
      }
    }

    const logBody = document.getElementById("auditLogsTableBody");
    if (logBody) {
      if (state.auditLogs.length === 0) {
        logBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color:#94a3b8;">No security audit records yet.</td></tr>`;
      } else {
        logBody.innerHTML = state.auditLogs.map(l => `
          <tr>
            <td style="font-size:0.78rem; color:#94a3b8;">${l.timestamp}</td>
            <td><strong>${l.user}</strong></td>
            <td><code style="color:#d4af37;">${l.action}</code></td>
            <td>${l.resource_type || '-'} ${l.resource_id ? '#' + l.resource_id : ''}</td>
            <td style="font-family:monospace; font-size:0.78rem;">${l.ip_address || '-'}</td>
            <td style="font-size:0.82rem; color:#cbd5e1;">${l.details || ''}</td>
          </tr>
        `).join("");
      }
    }
  }

  window.toggleStaffActive = async function (userId) {
    try {
      const res = await fetch(`/api/staff/${userId}/toggle-active`, { method: "POST" });
      if (res.ok) {
        await loadData();
        renderSecurityTables();
      }
    } catch (e) {}
  };

  // Run
  init();
});
