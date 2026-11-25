/**
 * Kayan & Njogu Motors — Main Client Application Logic
 * Nairobi, Kenya
 */

document.addEventListener("DOMContentLoaded", function () {
  // Application State
  const state = {
    currency: "KES", // 'KES' or 'USD'
    usdExchangeRate: 130, // 1 USD = ~130 KES
    vehicles: [],
    filteredVehicles: [],
    compareBasket: [],
    activeTab: "all",
    searchQuery: "",
    selectedMake: "",
    selectedBody: "",
    selectedPriceRange: ""
  };

  // Initialize Data
  function init() {
    state.vehicles = StorageManager.getVehicles();
    state.filteredVehicles = [...state.vehicles];

    renderTeam();
    populateVehicleDropdowns();
    renderInventory();
    setupEventListeners();
    setupMobileExperience();
    setupFinancingCalculator();
    setupCurrencyToggle();

    // Sync with live Flask REST API when running on server
    fetch("/api/vehicles")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.success && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
          state.vehicles = data.vehicles;
          state.filteredVehicles = [...state.vehicles];
          StorageManager.saveVehicles(data.vehicles);
          populateVehicleDropdowns();
          renderInventory();
        }
      })
      .catch(() => {});
  }

  // Currency Formatter
  function formatMoney(amountKes) {
    if (state.currency === "USD") {
      const usdAmount = Math.round(amountKes / state.usdExchangeRate);
      return "$" + usdAmount.toLocaleString("en-US");
    }
    return "KSh " + Number(amountKes).toLocaleString("en-KE");
  }

  // Format Mileage
  function formatKm(km) {
    return Number(km).toLocaleString("en-US") + " km";
  }

  // Render Team Members
  function renderTeam() {
    const teamGrid = document.getElementById("teamGrid");
    if (!teamGrid) return;

    teamGrid.innerHTML = INITIAL_TEAM.map(member => `
      <div class="team-card">
        <img src="${member.image}" alt="${member.name}" class="team-avatar">
        <div class="team-body">
          <h3 class="team-name">${member.name}</h3>
          <div class="team-role">${member.role}</div>
          <p class="team-bio">${member.bio}</p>
          <div class="team-contact-links">
            <a href="tel:${member.phone.replace(/\s+/g, '')}" class="team-contact-link">
              <span>📞</span> ${member.phone}
            </a>
            <a href="mailto:${member.email}" class="team-contact-link">
              <span>✉️</span> ${member.email}
            </a>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Populate Test Drive Vehicle Dropdown
  function populateVehicleDropdowns() {
    const tdSelect = document.getElementById("tdVehicleSelect");
    if (!tdSelect) return;

    tdSelect.innerHTML = `<option value="">-- Choose a Vehicle --</option>` + 
      state.vehicles.map(car => `
        <option value="${car.id}">${car.year} ${car.make} ${car.model} (${car.registration}) - ${formatMoney(car.price)}</option>
      `).join("");
  }

  // Render Vehicles in Inventory Grid
  function renderInventory() {
    const grid = document.getElementById("carsGrid") || document.getElementById("homeFeaturedGrid");
    const countBadge = document.getElementById("inventoryCountBadge");
    if (!grid) return;

    // Filter by tab
    let list = state.vehicles.filter(car => {
      if (state.activeTab === "all") return true;
      if (state.activeTab === "Featured") return car.badge === "Featured";
      if (state.activeTab === "New Arrival") return car.badge === "New Arrival";
      if (state.activeTab === "Popular") return car.badge === "Popular";
      if (state.activeTab === "Special Offer") return car.badge === "Special Offer";
      return true;
    });

    // Filter by Search Query
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(car => 
        car.make.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.color.toLowerCase().includes(q) ||
        car.registration.toLowerCase().includes(q) ||
        car.year.toString().includes(q)
      );
    }

    // Filter by Make
    if (state.selectedMake) {
      list = list.filter(car => car.make.toLowerCase() === state.selectedMake.toLowerCase());
    }

    // Filter by Body Type
    if (state.selectedBody) {
      list = list.filter(car => car.body.toLowerCase() === state.selectedBody.toLowerCase());
    }

    // Filter by Budget
    if (state.selectedPriceRange) {
      const [min, max] = state.selectedPriceRange.split("-").map(Number);
      list = list.filter(car => car.price >= min && car.price <= max);
    }

    state.filteredVehicles = list;

    if (countBadge) {
      countBadge.textContent = `${list.length} Vehicles Found`;
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🏎️</div>
          <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 8px;">No Vehicles Match Your Selected Criteria</h3>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Try loosening your filters or resetting the search parameters.</p>
          <button class="btn btn-gold" id="gridResetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("gridResetFiltersBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", resetAllFilters);
      }
      return;
    }

    grid.innerHTML = list.map(car => {
      const isCompared = state.compareBasket.includes(car.id);
      const statusClass = car.status === "Available" ? "status-available" :
                          car.status === "Reserved" ? "status-reserved" : "status-sold";

      const waMessage = encodeURIComponent(
        `Hello Kayan & Njogu Motors! I am interested in the ${car.year} ${car.make} ${car.model} (Ref: ${car.id}) listed at ${formatMoney(car.price)}. Is it available for private viewing in your Nairobi showroom?`
      );
      const waUrl = `https://wa.me/254712345678?text=${waMessage}`;

      return `
        <div class="car-card" data-id="${car.id}">
          <div class="car-thumb-wrap">
            <a href="vehicle-details.html?id=${car.id}">
              <img src="${car.images[0]}" alt="${car.make} ${car.model}" class="car-thumb" loading="lazy">
            </a>
            ${car.badge ? `<span class="car-badge-top">${car.badge}</span>` : ""}
            <span class="car-status-pill ${statusClass}">${car.status}</span>
          </div>

          <div class="car-content">
            <div class="car-meta-top">
              <span class="car-year-make">${car.year} &bull; ${car.make}</span>
              <span class="car-registration">${car.registration}</span>
            </div>

            <a href="vehicle-details.html?id=${car.id}">
              <h3 class="car-title">${car.model}</h3>
            </a>

            <div class="car-specs-grid">
              <div class="car-spec-item" title="Mileage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                <span>${formatKm(car.mileage)}</span>
              </div>
              <div class="car-spec-item" title="Transmission">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 12h12"/></svg>
                <span>${car.transmission.split(' ')[0]}</span>
              </div>
              <div class="car-spec-item" title="Fuel Type">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22h12M4 9h10M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L20 7"/></svg>
                <span>${car.fuel}</span>
              </div>
              <div class="car-spec-item" title="Drivetrain">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/></svg>
                <span>${car.drive}</span>
              </div>
            </div>

            <div class="car-footer">
              <div class="car-price-block">
                <span class="price-label">Showroom Price</span>
                <span class="car-price">${formatMoney(car.price)}</span>
                ${state.currency === "KES" ? `<span class="car-price-usd">~ $${Math.round(car.price / state.usdExchangeRate).toLocaleString()} USD</span>` : ""}
              </div>

              <div class="car-actions">
                <a href="vehicle-details.html?id=${car.id}" class="btn btn-gold btn-sm">
                  Details
                </a>
                <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm" title="Chat on WhatsApp" rel="noopener">
                  💬
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Inventory Tabs
    const tabs = document.querySelectorAll("#inventoryTabs .tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", function () {
        tabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        state.activeTab = this.dataset.tab;
        renderInventory();
      });
    });

    // Search and Filters
    const searchInput = document.getElementById("filterSearch");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.searchQuery = this.value;
        renderInventory();
      });
    }

    const makeSelect = document.getElementById("filterMake");
    if (makeSelect) {
      makeSelect.addEventListener("change", function () {
        state.selectedMake = this.value;
        renderInventory();
      });
    }

    const bodySelect = document.getElementById("filterBody");
    if (bodySelect) {
      bodySelect.addEventListener("change", function () {
        state.selectedBody = this.value;
        renderInventory();
      });
    }

    const priceSelect = document.getElementById("filterPrice");
    if (priceSelect) {
      priceSelect.addEventListener("change", function () {
        state.selectedPriceRange = this.value;
        renderInventory();
      });
    }

    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", resetAllFilters);
    }

    // Modal Close Buttons
    const closeCarModalBtn = document.getElementById("closeCarModalBtn");
    if (closeCarModalBtn) {
      closeCarModalBtn.addEventListener("click", () => closeModal("carDetailsModal"));
    }

    const closeTestDriveModalBtn = document.getElementById("closeTestDriveModalBtn");
    if (closeTestDriveModalBtn) {
      closeTestDriveModalBtn.addEventListener("click", () => closeModal("testDriveModal"));
    }

    const closeCompareModalBtn = document.getElementById("closeCompareModalBtn");
    if (closeCompareModalBtn) {
      closeCompareModalBtn.addEventListener("click", () => closeModal("compareModal"));
    }

    // Header & Hero Test Drive Buttons
    const headerTestDriveBtn = document.getElementById("headerTestDriveBtn");
    if (headerTestDriveBtn) {
      headerTestDriveBtn.addEventListener("click", () => openTestDriveModal());
    }

    const heroBookDriveBtn = document.getElementById("heroBookDriveBtn");
    if (heroBookDriveBtn) {
      heroBookDriveBtn.addEventListener("click", () => openTestDriveModal());
    }

    // Navigation Compare Button
    const navCompareBtn = document.getElementById("navCompareBtn");
    if (navCompareBtn) {
      navCompareBtn.addEventListener("click", openCompareModal);
    }

    const dockOpenCompareBtn = document.getElementById("dockOpenCompareBtn");
    if (dockOpenCompareBtn) {
      dockOpenCompareBtn.addEventListener("click", openCompareModal);
    }

    const dockClearCompareBtn = document.getElementById("dockClearCompareBtn");
    if (dockClearCompareBtn) {
      dockClearCompareBtn.addEventListener("click", clearCompareBasket);
    }

    // Form Submissions
    setupFormSubmissions();
  }

  // Universal Mobile Menu Drawer & Sticky Bottom Action Bar
  function setupMobileExperience() {
    const navbar = document.querySelector(".header .navbar");
    const navLinks = document.querySelector(".header .nav-links");
    if (navbar && navLinks) {
      let mobileMenuBtn = navbar.querySelector(".mobile-menu-btn") || document.getElementById("mobileMenuBtn");
      if (!mobileMenuBtn) {
        mobileMenuBtn = document.createElement("button");
        mobileMenuBtn.className = "mobile-menu-btn";
        mobileMenuBtn.id = "mobileMenuBtn";
        mobileMenuBtn.setAttribute("aria-label", "Toggle Navigation");
        mobileMenuBtn.textContent = "☰";
        navbar.appendChild(mobileMenuBtn);
      }

      mobileMenuBtn.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("mobile-open");
        mobileMenuBtn.textContent = isOpen ? "✕" : "☰";
        document.body.style.overflow = isOpen ? "hidden" : "";
      });

      navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("mobile-open");
          mobileMenuBtn.textContent = "☰";
          document.body.style.overflow = "";
        });
      });
    }

    // Add Mobile Sticky Quick Action Bar if not present
    if (!document.querySelector(".mobile-bottom-bar")) {
      const path = window.location.pathname;
      const bar = document.createElement("nav");
      bar.className = "mobile-bottom-bar";
      bar.setAttribute("aria-label", "Mobile Quick Actions");
      bar.innerHTML = `
        <a href="inventory.html" class="mobile-bar-item ${path.includes('inventory') ? 'highlight' : ''}">
          <span class="mb-icon">🚗</span>
          <span>Showroom</span>
        </a>
        <a href="imports.html" class="mobile-bar-item ${path.includes('imports') ? 'highlight' : ''}">
          <span class="mb-icon">🌐</span>
          <span>Imports</span>
        </a>
        <a href="https://wa.me/254712345678?text=Hello%20Kayan%20%26%20Njogu%20Motors%2C%20I%20would%20like%20assistance%20sourcing%20a%20vehicle." target="_blank" rel="noopener" class="mobile-bar-item">
          <span class="mb-icon">💬</span>
          <span>WhatsApp</span>
        </a>
        <a href="tel:+254712345678" class="mobile-bar-item highlight">
          <span class="mb-icon">📞</span>
          <span>Call Desk</span>
        </a>
      `;
      document.body.appendChild(bar);
    }
  }

  // Reset Filters
  function resetAllFilters() {
    state.searchQuery = "";
    state.selectedMake = "";
    state.selectedBody = "";
    state.selectedPriceRange = "";
    state.activeTab = "all";

    const searchInput = document.getElementById("filterSearch");
    const makeSelect = document.getElementById("filterMake");
    const bodySelect = document.getElementById("filterBody");
    const priceSelect = document.getElementById("filterPrice");

    if (searchInput) searchInput.value = "";
    if (makeSelect) makeSelect.value = "";
    if (bodySelect) bodySelect.value = "";
    if (priceSelect) priceSelect.value = "";

    const tabs = document.querySelectorAll("#inventoryTabs .tab-btn");
    tabs.forEach(t => t.classList.remove("active"));
    if (tabs[0]) tabs[0].classList.add("active");

    renderInventory();
  }

  // Global helper to filter by make from footer
  window.filterByMake = function(make) {
    state.selectedMake = make;
    const makeSelect = document.getElementById("filterMake");
    if (makeSelect) makeSelect.value = make;
    const invSection = document.getElementById("inventory");
    if (invSection) invSection.scrollIntoView({ behavior: "smooth" });
    renderInventory();
  };

  // Currency Toggle Logic
  function setupCurrencyToggle() {
    const buttons = document.querySelectorAll("#currencyToggle .currency-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", function () {
        buttons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        state.currency = this.dataset.currency;

        // Update hero price
        const heroCarPrice = document.getElementById("heroCarPrice");
        if (heroCarPrice) {
          heroCarPrice.textContent = formatMoney(22500000);
        }

        renderInventory();
        updateFinancingOutputs();
      });
    });
  }

  // Financing Calculator Logic
  function setupFinancingCalculator() {
    const priceRange = document.getElementById("calcPriceRange");
    const priceInput = document.getElementById("calcPriceInput");
    const depositRange = document.getElementById("calcDepositRange");
    const termRange = document.getElementById("calcTermRange");
    const rateRange = document.getElementById("calcRateRange");

    if (!priceRange || !depositRange || !termRange || !rateRange) return;

    priceRange.addEventListener("input", function () {
      priceInput.value = this.value;
      updateFinancingOutputs();
    });

    priceInput.addEventListener("input", function () {
      priceRange.value = this.value;
      updateFinancingOutputs();
    });

    depositRange.addEventListener("input", updateFinancingOutputs);
    termRange.addEventListener("input", updateFinancingOutputs);
    rateRange.addEventListener("input", updateFinancingOutputs);

    const applyBtn = document.getElementById("calcApplyBtn");
    if (applyBtn) {
      applyBtn.addEventListener("click", function () {
        const price = Number(priceInput.value);
        const contactSubject = document.getElementById("contactSubject");
        const contactMessage = document.getElementById("contactMessage");
        if (contactSubject && contactMessage) {
          contactSubject.value = "Financing Assistance";
          contactMessage.value = `Hello Kayan & Njogu Motors, I would like to request bank asset financing pre-approval for a vehicle valued at ${formatMoney(price)}. My intended deposit is ${document.getElementById("calcDepositDisplay").textContent} over a term of ${termRange.value} months.`;
          document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    updateFinancingOutputs();
  }

  function updateFinancingOutputs() {
    const priceInput = document.getElementById("calcPriceInput");
    const depositRange = document.getElementById("calcDepositRange");
    const termRange = document.getElementById("calcTermRange");
    const rateRange = document.getElementById("calcRateRange");

    if (!priceInput || !depositRange || !termRange || !rateRange) return;

    const price = Number(priceInput.value) || 12000000;
    const depositPercent = Number(depositRange.value);
    const depositAmount = (price * depositPercent) / 100;
    const principal = price - depositAmount;
    const termMonths = Number(termRange.value);
    const annualRate = Number(rateRange.value);
    const monthlyRate = annualRate / 100 / 12;

    // Monthly Payment Amortization Formula
    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      const compound = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = principal * ((monthlyRate * compound) / (compound - 1));
    } else {
      monthlyPayment = principal / termMonths;
    }

    const totalRepaid = (monthlyPayment * termMonths) + depositAmount;
    const totalInterest = (monthlyPayment * termMonths) - principal;

    // UI Updates
    document.getElementById("calcPriceDisplay").textContent = formatMoney(price);
    document.getElementById("calcDepositDisplay").textContent = `${formatMoney(depositAmount)} (${depositPercent}%)`;
    document.getElementById("calcTermDisplay").textContent = `${termMonths} Months (${Math.round(termMonths / 12 * 10) / 10} Yrs)`;
    document.getElementById("calcRateDisplay").textContent = `${annualRate.toFixed(1)}%`;

    document.getElementById("calcMonthlyResult").textContent = formatMoney(Math.round(monthlyPayment));
    document.getElementById("breakdownPrice").textContent = formatMoney(price);
    document.getElementById("breakdownDeposit").textContent = formatMoney(depositAmount);
    document.getElementById("breakdownPrincipal").textContent = formatMoney(principal);
    document.getElementById("breakdownInterest").textContent = formatMoney(Math.round(totalInterest));
    document.getElementById("breakdownTotal").textContent = formatMoney(Math.round(totalRepaid));
  }

  // Comparison Logic
  window.toggleCompare = function (vehicleId) {
    const idx = state.compareBasket.indexOf(vehicleId);
    if (idx > -1) {
      state.compareBasket.splice(idx, 1);
    } else {
      if (state.compareBasket.length >= 3) {
        alert("You can compare a maximum of 3 vehicles simultaneously.");
        return;
      }
      state.compareBasket.push(vehicleId);
    }

    updateCompareDock();
    renderInventory();
  };

  function updateCompareDock() {
    const dock = document.getElementById("floatingCompareBar");
    const countBadge = document.getElementById("compareCountBadge");
    const thumbsWrap = document.getElementById("compareDockThumbs");
    const dockText = document.getElementById("compareDockText");

    if (countBadge) countBadge.textContent = state.compareBasket.length;

    if (!dock) return;

    if (state.compareBasket.length > 0) {
      dock.classList.add("show");
      if (dockText) {
        dockText.textContent = `Comparing ${state.compareBasket.length} vehicle${state.compareBasket.length > 1 ? 's' : ''}`;
      }
      if (thumbsWrap) {
        thumbsWrap.innerHTML = state.compareBasket.map(id => {
          const car = state.vehicles.find(c => c.id === id);
          return car ? `<img src="${car.images[0]}" class="compare-mini-thumb" alt="${car.make}" title="${car.year} ${car.make} ${car.model}">` : "";
        }).join("");
      }
    } else {
      dock.classList.remove("show");
    }
  }

  function clearCompareBasket() {
    state.compareBasket = [];
    updateCompareDock();
    renderInventory();
  }

  function openCompareModal() {
    if (state.compareBasket.length < 2) {
      alert("Please select at least 2 vehicles to compare.");
      return;
    }

    const container = document.getElementById("compareTableContainer");
    if (!container) return;

    const comparedCars = state.vehicles.filter(c => state.compareBasket.includes(c.id));

    let html = `
      <table class="compare-table">
        <thead>
          <tr>
            <th style="width: 20%;">Specification</th>
            ${comparedCars.map(car => `
              <th style="width: ${80 / comparedCars.length}%;">
                <div style="height: 140px; border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 10px;">
                  <img src="${car.images[0]}" style="width: 100%; height: 100%; object-fit: cover;" alt="${car.make}">
                </div>
                <div style="font-size: 1.1rem; font-weight: 700; color: #fff;">${car.year} ${car.make}</div>
                <div style="font-size: 0.95rem; color: var(--accent-gold);">${car.model}</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-top: 6px;">${formatMoney(car.price)}</div>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          <tr><th>Showroom Status</th>${comparedCars.map(c => `<td><strong style="color: var(--accent-gold);">${c.status}</strong></td>`).join("")}</tr>
          <tr><th>Import & Reg</th>${comparedCars.map(c => `<td>${c.importStatus} (${c.registration})</td>`).join("")}</tr>
          <tr><th>Mileage</th>${comparedCars.map(c => `<td>${formatKm(c.mileage)}</td>`).join("")}</tr>
          <tr><th>Engine Spec</th>${comparedCars.map(c => `<td>${c.engine}</td>`).join("")}</tr>
          <tr><th>Fuel Type</th>${comparedCars.map(c => `<td>${c.fuel}</td>`).join("")}</tr>
          <tr><th>Transmission</th>${comparedCars.map(c => `<td>${c.transmission}</td>`).join("")}</tr>
          <tr><th>Drive Configuration</th>${comparedCars.map(c => `<td>${c.drive}</td>`).join("")}</tr>
          <tr><th>Body Style</th>${comparedCars.map(c => `<td>${c.body} (${c.color})</td>`).join("")}</tr>
          <tr>
            <th>Key Features</th>
            ${comparedCars.map(c => `
              <td style="font-size: 0.8rem; line-height: 1.5;">
                <ul style="padding-left: 16px;">
                  ${c.features.slice(0, 5).map(f => `<li>${f}</li>`).join("")}
                </ul>
              </td>
            `).join("")}
          </tr>
          <tr>
            <th>WhatsApp Enquiry</th>
            ${comparedCars.map(c => {
              const msg = encodeURIComponent(`Hi Kayan & Njogu Motors! I am comparing the ${c.year} ${c.make} ${c.model} (${c.id}) and would like to arrange a viewing.`);
              return `<td><a href="https://wa.me/254712345678?text=${msg}" target="_blank" class="btn btn-whatsapp btn-sm" style="width: 100%;">Enquire Now</a></td>`;
            }).join("")}
          </tr>
        </tbody>
      </table>
    `;

    container.innerHTML = html;
    openModal("compareModal");
  }

  // Open Vehicle Details Modal
  window.openCarDetailsModal = function (carId) {
    const car = state.vehicles.find(c => c.id === carId);
    if (!car) return;

    const modalBody = document.getElementById("carModalContent");
    if (!modalBody) return;

    const waMessage = encodeURIComponent(
      `Hello Kayan & Njogu Motors! I am reviewing the ${car.year} ${car.make} ${car.model} (Stock Ref: ${car.id}, Price: ${formatMoney(car.price)}). Is it currently available for showroom inspection?`
    );
    const waUrl = `https://wa.me/254712345678?text=${waMessage}`;

    modalBody.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
        <div>
          <span class="section-tag">${car.importStatus} &bull; ${car.registration}</span>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff; line-height: 1.2;">
            ${car.year} ${car.make} ${car.model}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Stock ID: ${car.id} &bull; Color: ${car.color} &bull; Status: <strong style="color: var(--accent-gold);">${car.status}</strong></p>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Showroom Asking Price</div>
          <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-gold);">${formatMoney(car.price)}</div>
          <div style="font-size: 0.85rem; color: #94a3b8;">~ $${Math.round(car.price / state.usdExchangeRate).toLocaleString()} USD</div>
        </div>
      </div>

      <!-- Gallery -->
      <div class="gallery-main">
        <img id="mainGalleryImg" src="${car.images[0]}" alt="${car.make} ${car.model}">
      </div>

      <div class="gallery-thumbs">
        ${car.images.map((img, i) => `
          <div class="gallery-thumb-item ${i === 0 ? 'active' : ''}" onclick="switchGalleryImg('${img}', this)">
            <img src="${img}" alt="Thumbnail ${i + 1}">
          </div>
        `).join("")}
      </div>

      <!-- Description -->
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
        <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 8px;">Vehicle Overview</h4>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;">${car.description}</p>
      </div>

      <!-- Specifications Grid -->
      <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 14px;">Technical Specifications</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 28px;">
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Engine Capacity</div>
          <strong style="color: #fff; font-size: 0.95rem;">${car.engine}</strong>
        </div>
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Fuel Type</div>
          <strong style="color: #fff; font-size: 0.95rem;">${car.fuel}</strong>
        </div>
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Transmission</div>
          <strong style="color: #fff; font-size: 0.95rem;">${car.transmission}</strong>
        </div>
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Drivetrain</div>
          <strong style="color: #fff; font-size: 0.95rem;">${car.drive}</strong>
        </div>
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Certified Mileage</div>
          <strong style="color: #fff; font-size: 0.95rem;">${formatKm(car.mileage)}</strong>
        </div>
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Registration Status</div>
          <strong style="color: #fff; font-size: 0.95rem;">${car.registration}</strong>
        </div>
      </div>

      <!-- Equipment Checklist -->
      <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 14px;">Premium Equipment & Features</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px; margin-bottom: 30px;">
        ${car.features.map(f => `
          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--text-main);">
            <span style="color: var(--accent-gold);">✓</span>
            <span>${f}</span>
          </div>
        `).join("")}
      </div>

      <!-- Modal Actions -->
      <div style="display: flex; gap: 14px; flex-wrap: wrap; border-top: 1px solid var(--border-light); padding-top: 24px;">
        <a href="${waUrl}" target="_blank" class="btn btn-whatsapp" style="flex: 1;" rel="noopener">
          Chat on WhatsApp with Symo &bull; Sales
        </a>
        <button class="btn btn-gold" style="flex: 1;" onclick="bookDriveForVehicle('${car.id}')">
          Schedule Test Drive
        </button>
        <button class="btn btn-outline" onclick="prefillFinanceCalc(${car.price})">
          Calculate Financing
        </button>
      </div>
    `;

    openModal("carDetailsModal");
  };

  window.switchGalleryImg = function (src, el) {
    const mainImg = document.getElementById("mainGalleryImg");
    if (mainImg) mainImg.src = src;
    document.querySelectorAll(".gallery-thumb-item").forEach(t => t.classList.remove("active"));
    if (el) el.classList.add("active");
  };

  // Open Test Drive Modal with prefilled vehicle
  window.bookDriveForVehicle = function (carId) {
    closeModal("carDetailsModal");
    openTestDriveModal(carId);
  };

  window.openTestDriveModal = function (carId) {
    const tdSelect = document.getElementById("tdVehicleSelect");
    if (tdSelect && carId) {
      tdSelect.value = carId;
    }
    // Set min date to tomorrow
    const tdDate = document.getElementById("tdDate");
    if (tdDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tdDate.min = tomorrow.toISOString().split("T")[0];
      tdDate.value = tomorrow.toISOString().split("T")[0];
    }
    openModal("testDriveModal");
  };

  window.prefillFinanceCalc = function (price) {
    closeModal("carDetailsModal");
    const priceRange = document.getElementById("calcPriceRange");
    const priceInput = document.getElementById("calcPriceInput");
    if (priceRange && priceInput) {
      priceRange.value = price;
      priceInput.value = price;
      updateFinancingOutputs();
    }
    document.getElementById("financing").scrollIntoView({ behavior: "smooth" });
  };

  // Generic Modal Control
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "auto";
    }
  }

  // Handle Form Submissions
  function setupFormSubmissions() {
    // 1. Test Drive Form
    const tdForm = document.getElementById("testDriveBookingForm");
    if (tdForm) {
      tdForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const vehicleId = document.getElementById("tdVehicleSelect").value;
        const car = state.vehicles.find(c => c.id === vehicleId) || {};

        const booking = {
          id: "TD-" + Math.floor(100 + Math.random() * 900),
          customerName: document.getElementById("tdName").value.trim(),
          customerPhone: document.getElementById("tdPhone").value.trim(),
          customerEmail: document.getElementById("tdEmail").value.trim(),
          vehicleId: vehicleId,
          vehicleName: car.make ? `${car.year} ${car.make} ${car.model}` : "General Fleet Inquiry",
          preferredDate: document.getElementById("tdDate").value,
          preferredTime: document.getElementById("tdTime").value,
          licenseConfirmed: document.getElementById("tdLicense").checked,
          notes: document.getElementById("tdNotes").value.trim(),
          status: "Pending",
          createdAt: new Date().toISOString()
        };

        const existingDrives = StorageManager.getTestDrives();
        existingDrives.unshift(booking);
        StorageManager.saveTestDrives(existingDrives);

        // Also post to Flask API if running
        fetch("/api/test-drives", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking)
        }).catch(() => {});

        tdForm.reset();
        closeModal("testDriveModal");
        alert(`Test drive request submitted successfully! Reference #${booking.id}.\nOur manager Kiiru Njogu or sales representative Symo Miogo will contact you via ${booking.customerPhone} to finalize your arrival time.`);
      });
    }

    // 2. Sell Your Car Form
    const sellForm = document.getElementById("sellCarForm");
    if (sellForm) {
      sellForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const submission = {
          id: "SELL-" + Math.floor(100 + Math.random() * 900),
          ownerName: document.getElementById("sellName").value.trim(),
          ownerPhone: document.getElementById("sellPhone").value.trim(),
          ownerEmail: document.getElementById("sellEmail").value.trim(),
          make: document.getElementById("sellMake").value.trim(),
          model: document.getElementById("sellModel").value.trim(),
          year: Number(document.getElementById("sellYear").value),
          mileage: Number(document.getElementById("sellMileage").value),
          registration: document.getElementById("sellReg").value.trim(),
          askingPrice: Number(document.getElementById("sellPrice").value),
          condition: document.getElementById("sellCondition").value.trim(),
          status: "Under Review",
          date: new Date().toISOString().slice(0, 16).replace("T", " ")
        };

        const existingSubmissions = StorageManager.getSellSubmissions();
        existingSubmissions.unshift(submission);
        StorageManager.saveSellSubmissions(existingSubmissions);

        // Also post to Flask API if running
        fetch("/api/sell-submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission)
        }).catch(() => {});

        sellForm.reset();
        alert(`Thank you, ${submission.ownerName}! Your vehicle valuation request for the ${submission.year} ${submission.make} ${submission.model} (Reg: ${submission.registration}) has been submitted.\nKiiru Njogu will review your submission and contact you within 24 hours.`);
      });
    }

    // 3. General Contact Form
    const contactForm = document.getElementById("generalContactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const inquiry = {
          id: "INQ-" + Math.floor(100 + Math.random() * 900),
          customerName: document.getElementById("contactName").value.trim(),
          customerPhone: document.getElementById("contactPhone").value.trim(),
          customerEmail: document.getElementById("contactEmail").value.trim(),
          vehicleId: "GENERAL",
          vehicleName: document.getElementById("contactSubject").value,
          type: document.getElementById("contactSubject").value,
          message: document.getElementById("contactMessage").value.trim(),
          status: "New",
          date: new Date().toISOString().slice(0, 16).replace("T", " ")
        };

        const inquiries = StorageManager.getInquiries();
        inquiries.unshift(inquiry);
        StorageManager.saveInquiries(inquiries);

        // Also post to Flask API if running
        fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inquiry)
        }).catch(() => {});

        contactForm.reset();
        alert(`Thank you, ${inquiry.customerName}. Your inquiry has been delivered directly to Kayan & Njogu Motors.\nReference: #${inquiry.id}.`);
      });
    }
  }

  // Initialize
  init();
});
