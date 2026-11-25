/**
 * Kayan & Njogu Motors — International Vehicle Import Module (Frontend Logic)
 * Sourcing: Manual Uploads & Live API Integrations (Japan, UK, Dubai, South Africa)
 */

(function () {
  'use strict';

  // Default fallback overseas inventory if API is unreachable
  const DEFAULT_OVERSEAS_VEHICLES = [
    {
      id: "IMP-JP-201",
      make: "Toyota",
      model: "Land Cruiser 300 ZX V6 Twin-Turbo",
      year: 2022,
      country_id: "JP",
      foreign_price: 8600000,
      foreign_currency: "JPY",
      cif_mombasa_kes: 7858000,
      duty_taxes_kes: 6280000,
      estimated_landed_cost_kes: 14358000,
      mileage: 14000,
      engine: "3.5L V6 Twin-Turbo Petrol (3,444 cc)",
      fuel: "Petrol",
      transmission: "10-Speed Automatic",
      drive: "4WD",
      body: "SUV",
      color: "Precious Black Pearl",
      steering: "RHD",
      export_port: "Yokohama Port",
      auction_grade: "5.0 (Pristine)",
      status: "Overseas Stock",
      source_type: "API",
      provider_id: "PROV-USS-JP",
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Pristine ZX flagship sourced from USS Tokyo auction feed. Grade 5.0 auction sheet, Modellista aero kit, sunroof, beige ventilated leather, cool box, and 14-speaker JBL surround sound."
    },
    {
      id: "IMP-JP-202",
      make: "Toyota",
      model: "Prado 2.8 TX-L 70th Anniversary Edition",
      year: 2021,
      country_id: "JP",
      foreign_price: 5400000,
      foreign_currency: "JPY",
      cif_mombasa_kes: 5073000,
      duty_taxes_kes: 3855000,
      estimated_landed_cost_kes: 9148000,
      mileage: 31000,
      engine: "2.8L D-4D Turbo Diesel (2,755 cc)",
      fuel: "Diesel",
      transmission: "6-Speed Automatic",
      drive: "4WD",
      body: "SUV",
      color: "Attitude Black Mica",
      steering: "RHD",
      export_port: "Kobe Port",
      auction_grade: "Grade 4.5",
      status: "Overseas Stock",
      source_type: "API",
      provider_id: "PROV-USS-JP",
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Special 70th Anniversary edition Prado from TAA Osaka. Saddle tongue luxury brown leather, dark chrome accents, roof rails, and 360-degree panoramic camera."
    },
    {
      id: "IMP-UK-301",
      make: "Range Rover",
      model: "D350 Autobiography LWB",
      year: 2022,
      country_id: "GB",
      foreign_price: 68500,
      foreign_currency: "GBP",
      cif_mombasa_kes: 12065000,
      duty_taxes_kes: 9890000,
      estimated_landed_cost_kes: 22175000,
      mileage: 21000,
      engine: "3.0L Inline-6 MHEV Diesel (2,997 cc)",
      fuel: "Diesel",
      transmission: "8-Speed Automatic",
      drive: "AWD",
      body: "SUV",
      color: "Santorini Black Metallic",
      steering: "RHD",
      export_port: "Southampton Port",
      auction_grade: "Grade 1 (UK BCA)",
      status: "In Transit",
      source_type: "API",
      provider_id: "PROV-BCA-UK",
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Ex-dealer demonstrator directly from Land Rover UK main dealer network. Executive class rear seating with deployed center console, Meridian 3D sound, and soft-close doors."
    },
    {
      id: "IMP-UK-302",
      make: "Mercedes-Benz",
      model: "G 400d AMG Line Premium Plus",
      year: 2021,
      country_id: "GB",
      foreign_price: 79000,
      foreign_currency: "GBP",
      cif_mombasa_kes: 13860000,
      duty_taxes_kes: 11365000,
      estimated_landed_cost_kes: 25445000,
      mileage: 26000,
      engine: "2.9L Inline-6 Turbo Diesel (2,925 cc)",
      fuel: "Diesel",
      transmission: "9G-TRONIC Automatic",
      drive: "4WD",
      body: "SUV",
      color: "Obsidian Black Metallic",
      steering: "RHD",
      export_port: "Tilbury Port",
      auction_grade: "Grade 1 (UK BCA)",
      status: "Overseas Stock",
      source_type: "API",
      provider_id: "PROV-BCA-UK",
      featured: 0,
      images: [
        "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "The quintessential luxury G-Wagon. Night Package, 20-inch AMG multi-spoke alloys, Burmester surround sound, and triple differential locks."
    },
    {
      id: "IMP-AE-401",
      make: "Toyota",
      model: "Land Cruiser 300 VXR 3.5L Twin-Turbo (GCC)",
      year: 2022,
      country_id: "AE",
      foreign_price: 285000,
      foreign_currency: "AED",
      cif_mombasa_kes: 10420000,
      duty_taxes_kes: 8336000,
      estimated_landed_cost_kes: 18976000,
      mileage: 16000,
      engine: "3.5L V6 Twin-Turbo (3,444 cc)",
      fuel: "Petrol",
      transmission: "10-Speed Automatic",
      drive: "4WD",
      body: "SUV",
      color: "Pearl White Crystal",
      steering: "RHD Sourced",
      export_port: "Jebel Ali Port",
      auction_grade: "Clean Title / Grade A",
      status: "Overseas Stock",
      source_type: "API",
      provider_id: "PROV-EMIRATES-AE",
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "GCC-spec high-capacity cooling radiator and air conditioning. Express 18-day vessel booking from Jebel Ali Port straight to Mombasa."
    },
    {
      id: "IMP-ZA-501",
      make: "Toyota",
      model: "Hilux 2.8 GD-6 Legend RS 4x4 Auto",
      year: 2022,
      country_id: "ZA",
      foreign_price: 645000,
      foreign_currency: "ZAR",
      cif_mombasa_kes: 4965000,
      duty_taxes_kes: 3475000,
      estimated_landed_cost_kes: 8660000,
      mileage: 34000,
      engine: "2.8L GD-6 Turbo Diesel (2,755 cc)",
      fuel: "Diesel",
      transmission: "6-Speed Automatic",
      drive: "4WD",
      body: "Pickup",
      color: "Glacier White",
      steering: "RHD",
      export_port: "Durban Port",
      auction_grade: "Dekra Certified A",
      status: "Overseas Stock",
      source_type: "API",
      provider_id: "PROV-AUTOTRADER-ZA",
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "South African manufactured Hilux Legend RS with motorized roller shutter, black sports styling bar, JBL premium audio, and heavy-duty suspension."
    }
  ];

  let overseasVehicles = [];
  let currentCountryFilter = 'ALL';

  // Exchange rates & Freight lookup for calculator
  const EXCHANGE_RATES = {
    JPY: 0.88,
    GBP: 168.50,
    AED: 35.40,
    ZAR: 7.35
  };

  const FREIGHT_RATES = {
    JP: 240000,
    GB: 350000,
    AE: 180000,
    ZA: 150000
  };

  // Country Flags & Display
  const COUNTRY_META = {
    JP: { flag: "🇯🇵", name: "Japan", curr: "JPY", sym: "¥" },
    GB: { flag: "🇬🇧", name: "United Kingdom", curr: "GBP", sym: "£" },
    AE: { flag: "🇦🇪", name: "Dubai / UAE", curr: "AED", sym: "AED " },
    ZA: { flag: "🇿🇦", name: "South Africa", curr: "ZAR", sym: "R " }
  };

  /**
   * Format KES currency
   */
  function formatKES(val) {
    return 'KES ' + Number(val || 0).toLocaleString('en-KE');
  }

  /**
   * Format Foreign Currency
   */
  function formatForeign(val, currency) {
    const meta = Object.values(COUNTRY_META).find(m => m.curr === currency);
    const sym = meta ? meta.sym : (currency + ' ');
    return sym + Number(val || 0).toLocaleString('en-US');
  }

  /**
   * Initialize Module
   */
  async function init() {
    await fetchVehicles();
    setupEventListeners();
    setupUrlParams();
    renderVehicles();
  }

  /**
   * Check URL params for pre-filtered country
   */
  function setupUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('country');
    if (c && ['JP', 'GB', 'AE', 'ZA', 'ALL'].includes(c.toUpperCase())) {
      setCountryFilter(c.toUpperCase());
    }
  }

  /**
   * Fetch vehicles from REST API or fallback to localStorage / defaults
   */
  async function fetchVehicles() {
    try {
      const res = await fetch('/api/imports/vehicles');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.vehicles && data.vehicles.length > 0) {
          overseasVehicles = data.vehicles;
          return;
        }
      }
    } catch (err) {
      console.warn("Backend REST API offline, falling back to local dataset:", err);
    }

    // Fallback: check localStorage or use default seeds
    const stored = localStorage.getItem('knm_import_vehicles');
    if (stored) {
      try {
        overseasVehicles = JSON.parse(stored);
      } catch (e) {
        overseasVehicles = DEFAULT_OVERSEAS_VEHICLES;
      }
    } else {
      overseasVehicles = DEFAULT_OVERSEAS_VEHICLES;
      localStorage.setItem('knm_import_vehicles', JSON.stringify(DEFAULT_OVERSEAS_VEHICLES));
    }
  }

  /**
   * Set country filter and highlight active hub card
   */
  function setCountryFilter(country) {
    currentCountryFilter = country;
    const select = document.getElementById('importCountryFilter');
    if (select) select.value = country;

    document.querySelectorAll('.country-card').forEach(card => {
      if (card.getAttribute('data-country') === country) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    renderVehicles();
  }

  /**
   * Filter and Render Overseas Stock Grid
   */
  function renderVehicles() {
    const grid = document.getElementById('importVehiclesGrid');
    const noResults = document.getElementById('noVehiclesFound');
    const countText = document.getElementById('vehicleCountText');
    if (!grid) return;

    const searchKeyword = (document.getElementById('importSearchInput')?.value || '').toLowerCase().trim();
    const sourceFilter = document.getElementById('importSourceFilter')?.value || 'ALL';
    const statusFilter = document.getElementById('importStatusFilter')?.value || 'ALL';
    const budgetFilter = parseInt(document.getElementById('importBudgetFilter')?.value || '0', 10);

    const filtered = overseasVehicles.filter(v => {
      // Country match
      if (currentCountryFilter !== 'ALL' && v.country_id !== currentCountryFilter) {
        return false;
      }
      // Source match
      if (sourceFilter !== 'ALL' && v.source_type !== sourceFilter) {
        return false;
      }
      // Status match
      if (statusFilter !== 'ALL' && v.status !== statusFilter) {
        return false;
      }
      // Budget match
      if (budgetFilter > 0 && v.estimated_landed_cost_kes > budgetFilter) {
        return false;
      }
      // Search keyword match
      if (searchKeyword) {
        const fullString = `${v.make} ${v.model} ${v.year} ${v.engine} ${v.export_port} ${v.description || ''}`.toLowerCase();
        if (!fullString.includes(searchKeyword)) {
          return false;
        }
      }
      return true;
    });

    if (countText) {
      countText.textContent = filtered.length;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    grid.innerHTML = filtered.map(v => {
      const meta = COUNTRY_META[v.country_id] || { flag: "🌐", name: v.country_id, curr: v.foreign_currency };
      const img = (v.images && v.images.length > 0) ? v.images[0] : 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80';
      const sourceBadge = v.source_type === 'API'
        ? `<span class="badge-source-api">⚡ Live API Feed</span>`
        : `<span class="badge-source-manual">Executive Showroom Sourcing</span>`;

      const statusBadge = v.status === 'In Transit'
        ? `<span style="background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.5); color: #38bdf8; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">🚢 In Transit</span>`
        : `<span style="background: rgba(255, 255, 255, 0.1); border: 1px solid var(--border-light); color: var(--text-muted); font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 4px;">📍 Overseas Stock</span>`;

      return `
        <article class="car-card">
          <div class="car-card-img-wrap">
            <img src="${img}" alt="${v.year} ${v.make} ${v.model}" loading="lazy" class="car-card-img" onerror="this.src='https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'">
            <div class="car-badge-top" style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span class="badge-import-country">${meta.flag} ${meta.name}</span>
              <span class="badge-grade">${v.auction_grade || 'Grade 4.5'}</span>
            </div>
            <div class="car-card-overlay">
              <span style="font-size: 0.8rem; color: #fff; background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 4px; backdrop-filter: blur(4px);">
                Port: ${v.export_port || 'Main Export Port'}
              </span>
            </div>
          </div>

          <div class="car-card-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: var(--text-dim); font-size: 0.8rem; font-weight: 600;">${v.year} • Ref: ${v.id}</span>
              ${sourceBadge}
            </div>

            <h3 class="car-card-title">${v.make} ${v.model}</h3>

            <!-- Specs Grid -->
            <div class="car-card-specs">
              <div class="spec-tag"><span>⚙️</span> ${v.engine || 'High-Spec'}</div>
              <div class="spec-tag"><span>⛽</span> ${v.fuel || 'Petrol'}</div>
              <div class="spec-tag"><span>🛣️</span> ${(v.mileage || 0).toLocaleString()} km</div>
              <div class="spec-tag"><span>🔄</span> ${v.transmission || 'Auto'}</div>
              <div class="spec-tag"><span>🧭</span> ${v.steering || 'RHD'}</div>
              <div class="spec-tag">${statusBadge}</div>
            </div>

            <!-- Landed Cost Box -->
            <div class="car-card-landed-box">
              <div class="car-card-landed-row">
                <span>Foreign Purchase Price:</span>
                <span style="font-weight: 600; color: #fff;">${formatForeign(v.foreign_price, v.foreign_currency)}</span>
              </div>
              <div class="car-card-landed-row">
                <span>CIF Mombasa Value:</span>
                <span>${formatKES(v.cif_mombasa_kes)}</span>
              </div>
              <div class="car-card-landed-row">
                <span>KRA Duty, Excise &amp; VAT:</span>
                <span>${formatKES(v.duty_taxes_kes)}</span>
              </div>
              <div class="car-card-landed-row highlight">
                <span>Estimated Landed Cost:</span>
                <span>${formatKES(v.estimated_landed_cost_kes)}</span>
              </div>
            </div>

            <div style="font-size: 0.82rem; color: #34d399; margin-bottom: 14px; display: flex; justify-content: space-between;">
              <span>Sourcing Deposit (30%):</span>
              <strong style="color: #34d399;">${formatKES(Math.round(v.estimated_landed_cost_kes * 0.3))}</strong>
            </div>

            <!-- Action Buttons -->
            <div class="car-card-actions">
              <button class="btn btn-gold btn-sm btn-block" onclick="window.KNMImports.openQuotation('${v.id}')">
                Request Landed Quotation
              </button>
              <a href="https://wa.me/254712345678?text=${encodeURIComponent(`Hello Kayan & Njogu Motors, I am interested in importing overseas stock: ${v.year} ${v.make} ${v.model} (Ref: ${v.id}) from ${meta.name}. Please share auction sheet and port delivery schedule.`)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="display: flex; align-items: center; justify-content: center; width: 44px; padding: 0;">
                💬
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Country card clicks
    document.querySelectorAll('.country-card').forEach(card => {
      card.addEventListener('click', () => {
        const c = card.getAttribute('data-country');
        setCountryFilter(c);
      });
    });

    // Country select dropdown
    const countrySelect = document.getElementById('importCountryFilter');
    if (countrySelect) {
      countrySelect.addEventListener('change', (e) => {
        setCountryFilter(e.target.value);
      });
    }

    // Search and filters
    ['importSearchInput', 'importSourceFilter', 'importStatusFilter', 'importBudgetFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', renderVehicles);
        el.addEventListener('change', renderVehicles);
      }
    });

    // Reset button
    const resetBtn = document.getElementById('resetImportFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (document.getElementById('importSearchInput')) document.getElementById('importSearchInput').value = '';
        if (document.getElementById('importSourceFilter')) document.getElementById('importSourceFilter').value = 'ALL';
        if (document.getElementById('importStatusFilter')) document.getElementById('importStatusFilter').value = 'ALL';
        if (document.getElementById('importBudgetFilter')) document.getElementById('importBudgetFilter').value = '';
        setCountryFilter('ALL');
      });
    }

    // Refresh / Sync Feeds button
    const refreshBtn = document.getElementById('refreshStockBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.innerHTML = '🔄 Syncing Feeds...';
        refreshBtn.disabled = true;
        try {
          const res = await fetch('/api/imports/sync-api', { method: 'POST' });
          if (res.ok) {
            const data = await res.json();
            alert(`✅ ${data.message || 'Live auction feeds synchronized successfully!'}`);
            await fetchVehicles();
            renderVehicles();
          } else {
            alert('Connected to simulated feeds (USS Japan, BCA UK, Emirates Dubai). Stock is current.');
          }
        } catch (e) {
          alert('Connected to simulated feeds (USS Japan, BCA UK, Emirates Dubai). Stock is current.');
        } finally {
          refreshBtn.innerHTML = '🔄 Sync Feeds';
          refreshBtn.disabled = false;
        }
      });
    }

    // Calculator Modal
    const openCalcBtn = document.getElementById('openCalculatorBtn');
    const calcModal = document.getElementById('calculatorModal');
    const closeCalcBtn = document.getElementById('closeCalculatorModal');
    if (openCalcBtn && calcModal) {
      openCalcBtn.addEventListener('click', () => calcModal.classList.add('open'));
    }
    if (closeCalcBtn && calcModal) {
      closeCalcBtn.addEventListener('click', () => calcModal.classList.remove('open'));
    }
    if (calcModal) {
      calcModal.addEventListener('click', (e) => {
        if (e.target === calcModal) calcModal.classList.remove('open');
      });
    }

    // Run Calculator button
    const runCalcBtn = document.getElementById('runCalculationBtn');
    if (runCalcBtn) {
      runCalcBtn.addEventListener('click', runCalculator);
    }
    const calcCountry = document.getElementById('calcCountry');
    if (calcCountry) {
      calcCountry.addEventListener('change', () => {
        const opt = calcCountry.options[calcCountry.selectedIndex];
        const curr = opt.getAttribute('data-curr') || 'JPY';
        const lbl = document.getElementById('calcCurrencyLabel');
        if (lbl) lbl.textContent = curr;
        // set default reasonable price for country
        const priceInput = document.getElementById('calcPrice');
        if (priceInput) {
          if (curr === 'JPY') priceInput.value = 6500000;
          if (curr === 'GBP') priceInput.value = 55000;
          if (curr === 'AED') priceInput.value = 240000;
          if (curr === 'ZAR') priceInput.value = 580000;
        }
      });
    }

    // Wishlist Modal
    const openWishlistBtn = document.getElementById('openWishlistModalBtn');
    const wishlistModal = document.getElementById('wishlistModal');
    const closeWishlistBtn = document.getElementById('closeWishlistModal');
    if (openWishlistBtn && wishlistModal) {
      openWishlistBtn.addEventListener('click', () => wishlistModal.classList.add('open'));
    }
    if (closeWishlistBtn && wishlistModal) {
      closeWishlistBtn.addEventListener('click', () => wishlistModal.classList.remove('open'));
    }
    if (wishlistModal) {
      wishlistModal.addEventListener('click', (e) => {
        if (e.target === wishlistModal) wishlistModal.classList.remove('open');
      });
    }

    // Wishlist Form Submit
    const wishlistForm = document.getElementById('importRequestForm');
    if (wishlistForm) {
      wishlistForm.addEventListener('submit', handleWishlistSubmit);
    }

    // Quotation Modal Close
    const closeQuoteBtn = document.getElementById('closeQuotationModal');
    const quoteModal = document.getElementById('quotationModal');
    if (closeQuoteBtn && quoteModal) {
      closeQuoteBtn.addEventListener('click', () => quoteModal.classList.remove('open'));
    }
    if (quoteModal) {
      quoteModal.addEventListener('click', (e) => {
        if (e.target === quoteModal) quoteModal.classList.remove('open');
      });
    }

    // Track Shipment Button
    const trackBtn = document.getElementById('trackOrderBtn');
    if (trackBtn) {
      trackBtn.addEventListener('click', handleTrackOrder);
    }
    const orderInput = document.getElementById('orderSearchInput');
    if (orderInput) {
      orderInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleTrackOrder();
      });
    }
  }

  /**
   * Calculator computation logic (conforming with KRA tariffs)
   */
  async function runCalculator() {
    const country = document.getElementById('calcCountry')?.value || 'JP';
    const price = parseFloat(document.getElementById('calcPrice')?.value || 0);
    const engineCc = parseInt(document.getElementById('calcEngineCc')?.value || 2500, 10);
    const curr = document.getElementById('calcCountry')?.options[document.getElementById('calcCountry').selectedIndex]?.getAttribute('data-curr') || 'JPY';

    // Try backend API first
    try {
      const res = await fetch('/api/imports/calculate-landed-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foreign_price: price, currency: curr, country_id: country, engine_cc: engineCc })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.breakdown) {
          updateCalculatorUI(data.breakdown);
          return;
        }
      }
    } catch (e) {
      // offline fallback
    }

    // Client-side computation
    const rate = EXCHANGE_RATES[curr] || 1.0;
    const fobKes = Math.round(price * rate);
    const freightKes = FREIGHT_RATES[country] || 250000;
    const marineInsurance = Math.round(fobKes * 0.015);
    const cifMombasa = fobKes + freightKes + marineInsurance;

    // KRA duties
    const importDuty = Math.round(cifMombasa * 0.35);
    let exciseRate = 0.20;
    if (engineCc > 3000) exciseRate = 0.35;
    else if (engineCc > 2000) exciseRate = 0.30;
    const exciseDuty = Math.round((cifMombasa + importDuty) * exciseRate);
    const vat = Math.round((cifMombasa + importDuty + exciseDuty) * 0.16);
    const rdlIdf = Math.round(cifMombasa * 0.06); // 3.5% RDL + 2.5% IDF
    const totalTaxes = importDuty + exciseDuty + vat + rdlIdf;

    const portCharges = 110000;
    const clearingAgent = 65000;
    const ntsaPlates = 45000;
    const totalPort = portCharges + clearingAgent + ntsaPlates;

    const totalLanded = cifMombasa + totalTaxes + totalPort;
    const deposit = Math.round(totalLanded * 0.30);

    updateCalculatorUI({
      fob_kes: fobKes,
      freight_kes: freightKes + marineInsurance,
      cif_mombasa_kes: cifMombasa,
      total_taxes_kes: totalTaxes,
      total_landed_cost_kes: totalLanded,
      deposit_required_kes: deposit
    });
  }

  function updateCalculatorUI(b) {
    document.getElementById('resFobKes').textContent = formatKES(b.fob_kes);
    document.getElementById('resFreightKes').textContent = formatKES(b.freight_kes);
    document.getElementById('resCifKes').textContent = formatKES(b.cif_mombasa_kes);
    document.getElementById('resTaxesKes').textContent = formatKES(b.total_taxes_kes);
    document.getElementById('resTotalLandedKes').textContent = formatKES(b.total_landed_cost_kes);
    document.getElementById('resDepositKes').textContent = formatKES(b.deposit_required_kes);
  }

  /**
   * Handle Bespoke Sourcing Wishlist Submission
   */
  async function handleWishlistSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitWishlistBtn');

    const payload = {
      customerName: formData.get('customerName'),
      customerPhone: formData.get('customerPhone'),
      customerEmail: formData.get('customerEmail'),
      countryPreference: formData.get('countryPreference'),
      make: formData.get('make'),
      model: formData.get('model'),
      yearMin: parseInt(formData.get('yearMin') || '2020', 10),
      maxBudgetKes: parseInt(formData.get('maxBudgetKes') || '0', 10),
      fuelPreference: formData.get('fuelPreference'),
      notes: formData.get('notes')
    };

    if (submitBtn) {
      submitBtn.innerHTML = 'Submitting Request...';
      submitBtn.disabled = true;
    }

    try {
      const res = await fetch('/api/imports/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Sourcing Request Received! Reference: ${data.id || 'REQ-SUCCESS'}. General Manager Kiiru Njogu will contact you via WhatsApp shortly.`);
        form.reset();
        document.getElementById('wishlistModal')?.classList.remove('open');
        return;
      }
    } catch (err) {
      // Offline fallback: save to localStorage
      const reqs = JSON.parse(localStorage.getItem('knm_import_requests') || '[]');
      payload.id = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
      payload.status = 'New';
      payload.created_at = new Date().toISOString();
      reqs.push(payload);
      localStorage.setItem('knm_import_requests', JSON.stringify(reqs));

      alert(`✅ Sourcing Request Logged! Reference: ${payload.id}. Our sourcing desk has received your request.`);
      form.reset();
      document.getElementById('wishlistModal')?.classList.remove('open');
    } finally {
      if (submitBtn) {
        submitBtn.innerHTML = 'Submit Sourcing Request';
        submitBtn.disabled = false;
      }
    }
  }

  /**
   * Open Quotation Modal for a vehicle
   */
  function openQuotation(vehicleId) {
    const v = overseasVehicles.find(x => x.id === vehicleId);
    if (!v) return;

    const modal = document.getElementById('quotationModal');
    const body = document.getElementById('quotationModalBody');
    if (!modal || !body) return;

    const meta = COUNTRY_META[v.country_id] || { flag: "🌐", name: v.country_id, curr: v.foreign_currency };
    const deposit = Math.round(v.estimated_landed_cost_kes * 0.3);

    body.innerHTML = `
      <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">Vehicle Profile</div>
        <div style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-top: 4px;">${v.year} ${v.make} ${v.model}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
          Origin: ${meta.flag} ${meta.name} • Port: ${v.export_port} • Auction Grade: ${v.auction_grade}
        </div>
      </div>

      <div style="background: var(--bg-primary); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 20px; font-size: 0.88rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-dim);">Foreign Purchase Price:</span>
          <strong>${formatForeign(v.foreign_price, v.foreign_currency)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-dim);">Ocean Freight &amp; Transit Insurance:</span>
          <span>Included in CIF</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-dim);">Customs Value (CIF Mombasa):</span>
          <span style="color: #38bdf8; font-weight: 600;">${formatKES(v.cif_mombasa_kes)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-dim);">KRA Import Duty (35%):</span>
          <span>${formatKES(Math.round(v.cif_mombasa_kes * 0.35))}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-dim);">Excise Duty &amp; 16% VAT:</span>
          <span>${formatKES(v.duty_taxes_kes - Math.round(v.cif_mombasa_kes * 0.35))}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-dim);">Port Wharfage, CFS &amp; NTSA Plates:</span>
          <span>KES 220,000</span>
        </div>
        <div style="border-top: 1px solid var(--border-medium); margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 800;">
          <span>Total Landed Cost (Nairobi):</span>
          <span style="color: var(--accent-gold);">${formatKES(v.estimated_landed_cost_kes)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.85rem; color: #34d399; font-weight: 700;">
          <span>Initial Sourcing Deposit (30%):</span>
          <span>${formatKES(deposit)}</span>
        </div>
      </div>

      <form id="directQuoteForm" onsubmit="window.KNMImports.submitDirectQuote(event, '${v.id}')">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
          <div class="form-group">
            <label>Your Name *</label>
            <input type="text" id="quoteCustomerName" required placeholder="Full Name" style="background: var(--bg-primary); color: #fff; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-medium); width: 100%;">
          </div>
          <div class="form-group">
            <label>WhatsApp / Phone *</label>
            <input type="tel" id="quoteCustomerPhone" required placeholder="+254 7XX XXX XXX" style="background: var(--bg-primary); color: #fff; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-medium); width: 100%;">
          </div>
        </div>
        <button type="submit" class="btn btn-gold btn-block">Download &amp; Send Official Quotation</button>
      </form>
    `;

    modal.classList.add('open');
  }

  /**
   * Submit direct quotation request
   */
  async function submitDirectQuote(e, vehicleId) {
    e.preventDefault();
    const name = document.getElementById('quoteCustomerName')?.value;
    const phone = document.getElementById('quoteCustomerPhone')?.value;
    const v = overseasVehicles.find(x => x.id === vehicleId);
    if (!v) return;

    try {
      await fetch('/api/imports/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          vehicle_description: `${v.year} ${v.make} ${v.model}`,
          foreign_purchase_price: v.foreign_price,
          foreign_currency: v.foreign_currency,
          country_id: v.country_id
        })
      });
    } catch (err) {
      // offline fallback
    }

    alert(`✅ Official quotation generated for ${name}! Our executive sourcing desk will dispatch the authenticated quotation sheet to ${phone} within 15 minutes.`);
    document.getElementById('quotationModal')?.classList.remove('open');
  }

  /**
   * Interactive 7-Stage Live Shipment Tracker
   */
  async function handleTrackOrder() {
    const input = document.getElementById('orderSearchInput');
    const orderId = (input?.value || '').trim();
    if (!orderId) {
      alert('Please enter an Order ID or Bill of Lading number.');
      return;
    }

    const trackBtn = document.getElementById('trackOrderBtn');
    if (trackBtn) {
      trackBtn.innerHTML = 'Searching Voyage...';
      trackBtn.disabled = true;
    }

    try {
      const res = await fetch(`/api/imports/track/${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          updateTrackingUI(data.order, data.tracking_events, data.documents, data.vehicle);
          return;
        }
      }
    } catch (err) {
      // offline demo fallback
    } finally {
      if (trackBtn) {
        trackBtn.innerHTML = 'Track Vessel Status';
        trackBtn.disabled = false;
      }
    }

    // Default simulated data for benchmark order
    if (orderId.toUpperCase() === 'KNM-IMP-2026-01' || orderId.toUpperCase().includes('882910') || orderId.toUpperCase().includes('HOEGH')) {
      updateTrackingUI({
        id: "KNM-IMP-2026-01",
        vehicle_title: "2022 Range Rover D350 Autobiography LWB",
        current_stage: "Shipping in Progress",
        current_location: "Indian Ocean (Approaching Kilindini)",
        vessel_name: "MV Hoegh Target",
        bill_of_lading: "BOL-NBO-882910",
        eta_mombasa: "Estimated 12 Days (Port Berth 21)",
        source_country: "🇬🇧 United Kingdom (Southampton)",
        status: "Active"
      }, [
        { stage_number: 1, title: "Vehicle Selected & Pre-Shipment Inspection", location: "BCA Nottingham UK", notes: "140-point diagnostic check passed. Full Land Rover main dealer records verified." },
        { stage_number: 2, title: "Sourcing Deposit Confirmed", location: "Kayan & Njogu Nairobi", notes: "30% commitment deposit received and escrowed into import account." },
        { stage_number: 3, title: "Purchased Abroad & JEVIC Odometer Inspection", location: "Southampton Docks", notes: "UK DVLA export documentation processed. QISJ radiation & roadworthiness certificate issued." },
        { stage_number: 4, title: "Shipping in Progress (High Seas)", location: "MV Hoegh Target", notes: "Loaded onto Ro-Ro vessel. Bill of Lading BOL-NBO-882910 issued." }
      ], [], null);
    } else {
      alert(`Order reference or Bill of Lading "${orderId}" not found. Try the benchmark test shipment: KNM-IMP-2026-01`);
    }
  }

  function updateTrackingUI(order, events, documents, vehicle) {
    document.getElementById('dispOrderId').textContent = order.id;
    document.getElementById('dispVehicleTitle').textContent = order.vehicle_title || (vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Import Vehicle');
    document.getElementById('dispCurrentStage').textContent = order.current_stage;
    document.getElementById('dispVesselName').textContent = order.vessel_name || 'Vessel Assigned';
    document.getElementById('dispBillOfLading').textContent = order.bill_of_lading || 'BOL Pending';
    document.getElementById('dispLocation').textContent = order.current_location || 'En Route';
    document.getElementById('dispEtaMombasa').textContent = order.eta_mombasa || 'Calculating ETA';

    // Map stage name or count to current stage 1-7
    const stageNames = [
      "Vehicle Selected & Inspected",
      "Quotation & Deposit Paid",
      "Purchased Abroad & Export Cert",
      "Shipping in Progress",
      "Arrived Mombasa Port",
      "KRA Customs Clearance",
      "Delivered to Nairobi Showroom"
    ];

    let currentStageIndex = 4; // default stage 4
    if (order.current_stage) {
      const matchIdx = stageNames.findIndex(s => order.current_stage.toLowerCase().includes(s.toLowerCase().substring(0, 10)));
      if (matchIdx !== -1) currentStageIndex = matchIdx + 1;
    }

    // Update 7 nodes
    for (let i = 1; i <= 7; i++) {
      const node = document.getElementById(`stageNode${i}`);
      if (!node) continue;
      node.className = 'stage-node';
      const dot = node.querySelector('.stage-dot');

      if (i < currentStageIndex) {
        node.classList.add('completed');
        if (dot) dot.textContent = '✓';
      } else if (i === currentStageIndex) {
        node.classList.add('current');
        if (dot) dot.textContent = i;
      } else {
        if (dot) dot.textContent = i;
      }
    }

    // Update progress track percentage
    const track = document.getElementById('stageTimelineTrack');
    if (track) {
      const pct = Math.round(((currentStageIndex - 1) / 6) * 100);
      track.style.setProperty('--progress-pct', `${pct}%`);
    }

    // Milestones log
    const milestonesBox = document.getElementById('trackingMilestonesLog');
    if (milestonesBox && events && events.length > 0) {
      milestonesBox.innerHTML = events.map(ev => `
        <div style="padding-left: 12px; border-left: 2px solid ${ev.stage_number < currentStageIndex ? 'var(--accent-green)' : 'var(--accent-gold)'}; font-size: 0.85rem;">
          <div style="color: ${ev.stage_number < currentStageIndex ? 'var(--accent-green)' : 'var(--accent-gold)'}; font-weight: 700;">
            Stage ${ev.stage_number}: ${ev.title}
          </div>
          <div style="color: var(--text-muted);">${ev.location ? `[${ev.location}] ` : ''}${ev.notes || ''}</div>
        </div>
      `).join('');
    }
  }

  // Public API exposure for inline HTML handlers
  window.KNMImports = {
    openQuotation,
    submitDirectQuote,
    runCalculator
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
