/**
 * Kayan & Njogu Motors — Initial Vehicle Catalog & Storage Layer
 * Premier Luxury Automotive Showroom, Nairobi, Kenya
 */

const INITIAL_VEHICLES = [
  {
    id: "KNM-101",
    make: "Toyota",
    model: "Land Cruiser 300 GR Sport",
    year: 2022,
    price: 22500000,
    mileage: 18500,
    engine: "3.3L V6 Twin-Turbo Diesel (3,346 cc)",
    fuel: "Diesel",
    transmission: "10-Speed Automatic",
    drive: "4WD",
    body: "SUV",
    color: "Precious White Pearl",
    importStatus: "Fresh Japan Import",
    registration: "Unregistered (Ready for KDF plate)",
    status: "Available",
    badge: "Featured",
    images: [
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "E-KDSS Electronic Kinetic Suspension",
      "Heads-Up Display (HUD)",
      "14-Speaker JBL Premium Sound System",
      "360-Degree Panoramic View Monitor",
      "Heated & Ventilated Front and Rear Leather Seats",
      "Multi-Terrain Select with Crawl Control",
      "Triple-Zone Automatic Climate Control",
      "Electric Sunroof & Power Tailgate"
    ],
    description: "The ultimate flagship off-roader. This 2022 Toyota Land Cruiser 300 GR Sport combines unmatched luxury with Dakar-proven durability. Powered by the high-torque 3.3L V6 twin-turbo diesel engine with Toyota's revolutionary Electronic Kinetic Dynamic Suspension System (E-KDSS). Flawless condition, verified mileage, ready for immediate delivery in Nairobi."
  },
  {
    id: "KNM-102",
    make: "Mercedes-Benz",
    model: "GLE 450 AMG Line 4MATIC",
    year: 2021,
    price: 14800000,
    mileage: 32000,
    engine: "3.0L Inline-6 Turbo with EQ Boost (2,999 cc)",
    fuel: "Petrol",
    transmission: "9G-TRONIC Automatic",
    drive: "AWD",
    body: "SUV",
    color: "Obsidian Black Metallic",
    importStatus: "UK Direct Import",
    registration: "KDE 889Y",
    status: "Available",
    badge: "Featured",
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "MBUX Dual 12.3-inch Digital Cockpit",
      "Burmester High-End Surround Sound",
      "Panoramic Sliding Glass Sunroof",
      "Airmatic Adaptive Air Suspension",
      "AMG Sports Exterior & 21-inch AMG Multi-spoke Alloys",
      "64-Color Ambient Interior Lighting",
      "Active Distance Assist DISTRONIC",
      "Nappa Leather Upholstery with Memory Seats"
    ],
    description: "A masterclass in modern executive elegance. This Mercedes-Benz GLE 450 AMG Line delivers silky-smooth inline-6 power enhanced with mild-hybrid EQ Boost technology. UK import with complete Mercedes-Benz main dealer service history. Finished in prestigious Obsidian Black with pristine black Nappa leather."
  },
  {
    id: "KNM-103",
    make: "Toyota",
    model: "Land Cruiser Prado TX-L",
    year: 2020,
    price: 9200000,
    mileage: 41000,
    engine: "2.8L D-4D Turbo Diesel (2,755 cc)",
    fuel: "Diesel",
    transmission: "6-Speed Automatic",
    drive: "4WD",
    body: "SUV",
    color: "Metallic Bronze Mica",
    importStatus: "Japan Import",
    registration: "KDC 512B",
    status: "Available",
    badge: "Popular",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "7-Passenger Luxury Seating Configuration",
      "Beige Leather Upholstery with Heated Seats",
      "Full Modellista Aero Styling Bodykit",
      "Factory Centre Console Cool Box",
      "Toyota Safety Sense (PCS, LDA, AHB)",
      "Push-to-Start Keyless Go",
      "Sunroof with Tilt & Slide",
      "Reverse Camera with Parking Sensors"
    ],
    description: "The gold standard of reliability on East African roads. This 2020 Toyota Land Cruiser Prado TX-L comes fully equipped with genuine Modellista styling, 7 plush leather seats, and the robust 2.8L D-4D diesel engine. Outstanding fuel economy, immaculate suspension, and ready for long-distance family travel or diplomatic duties."
  },
  {
    id: "KNM-104",
    make: "Range Rover",
    model: "Vogue Autobiography",
    year: 2020,
    price: 19800000,
    mileage: 28000,
    engine: "3.0L V6 Supercharged (2,995 cc)",
    fuel: "Petrol",
    transmission: "8-Speed Automatic",
    drive: "4WD",
    body: "SUV",
    color: "Carpathian Grey Metallic",
    importStatus: "UK Direct Import",
    registration: "KDD 304K",
    status: "Available",
    badge: "Special Offer",
    images: [
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Executive Class Rear Seating with Massage",
      "1,700W Meridian Signature Sound System",
      "Soft-Close Doors & Deployable Side Steps",
      "Pixel-Laser LED Headlights with Signature DRL",
      "Semi-Aniline Perforated Leather Interior",
      "Electronic Air Suspension with Dynamic Response",
      "Four-Zone Climate Control & Rear Entertainment",
      "Sliding Panoramic Roof with Gesture Sunblind"
    ],
    description: "Peerless British luxury and commanding presence. The Range Rover Autobiography is the pinnacle of executive transport. Finished in stealth Carpathian Grey over Duo-tone Ebony/Ivory Semi-Aniline leather with massage seating, dual rear screens, and deployable side steps. Verified UK mileage."
  },
  {
    id: "KNM-105",
    make: "BMW",
    model: "X5 xDrive40i M Sport",
    year: 2021,
    price: 13500000,
    mileage: 35000,
    engine: "3.0L BMW TwinPower Turbo Inline-6 (2,998 cc)",
    fuel: "Petrol",
    transmission: "8-Speed Steptronic Sport",
    drive: "AWD",
    body: "SUV",
    color: "Mineral White Metallic",
    importStatus: "UK Direct Import",
    registration: "KDE 112L",
    status: "Available",
    badge: "Popular",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "M Sport Aerodynamic Body Styling & M Exhaust",
      "BMW Live Cockpit Professional with iDrive 7",
      "Harman Kardon Surround Sound System",
      "Sky Lounge Panoramic Glass Sunroof",
      "Adaptive M Suspension & M Sport Brakes",
      "BMW Laserlight with High-Beam Assistant",
      "Wireless Apple CarPlay & Android Auto",
      "Vernasca Leather Upholstery with Heated Front Seats"
    ],
    description: "The benchmark of dynamic sports utility. This BMW X5 xDrive40i pairs the award-winning B58 turbocharged engine with M Sport precision engineering. Effortless acceleration, razor-sharp handling, and an interior loaded with premium tech. One owner vehicle imported directly from the UK."
  },
  {
    id: "KNM-106",
    make: "Porsche",
    model: "Cayenne Coupe V6",
    year: 2021,
    price: 17200000,
    mileage: 24000,
    engine: "3.0L Turbocharged V6 (2,995 cc)",
    fuel: "Petrol",
    transmission: "8-Speed Tiptronic S",
    drive: "AWD",
    body: "Coupe",
    color: "Crayon / Chalk Grey",
    importStatus: "UK Direct Import",
    registration: "KDD 901Z",
    status: "Reserved",
    badge: "Exclusive",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Sport Chrono Package with Mode Switch",
      "21-Inch RS Spyder Design Alloy Wheels",
      "Fixed Panoramic Glass Roof",
      "BOSE Surround Sound Audio System",
      "Adaptive Air Suspension with PASM",
      "LED Matrix Headlights including PDLS Plus",
      "Adaptive Rear Spoiler with Auto Extension",
      "Sports Seats with 14-Way Power Adjustment"
    ],
    description: "Unmistakable Porsche sports car DNA in a sculptured SUV silhouette. The Cayenne Coupe turns heads in sought-after Crayon grey over two-tone leather. Features the Sport Chrono package, active rear aero spoiler, and lightning-fast Tiptronic S transmission."
  },
  {
    id: "KNM-107",
    make: "Subaru",
    model: "Outback 2.5i Touring EyeSight",
    year: 2020,
    price: 4850000,
    mileage: 46000,
    engine: "2.5L Boxer 4-Cylinder (2,498 cc)",
    fuel: "Petrol",
    transmission: "Lineartronic CVT",
    drive: "AWD",
    body: "Crossover",
    color: "Ice Silver Metallic",
    importStatus: "Japan Import",
    registration: "KDC 778H",
    status: "Available",
    badge: "New Arrival",
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Subaru EyeSight Ver.3 Driver Assistance",
      "Java Brown Nappa Luxury Leather",
      "Symmetrical All-Wheel Drive with X-Mode",
      "Harman Kardon 12-Speaker Sound System",
      "Hands-Free Power Sensor Tailgate",
      "Electric Sunroof & Heated Steering Wheel",
      "Steering Responsive LED Headlamps",
      "Roof Rails with Integrated Crossbars"
    ],
    description: "The quintessential lifestyle touring vehicle for Kenya. This Subaru Outback Touring combines legendary symmetrical all-wheel drive stability with executive-grade Java Brown Nappa leather comfort. Equipped with dual X-Mode for muddy escapes to Naivasha or Maasai Mara."
  },
  {
    id: "KNM-108",
    make: "Toyota",
    model: "Harrier 2.0 Elegance G-Spec",
    year: 2018,
    price: 4350000,
    mileage: 52000,
    engine: "2.0L Dual VVT-i (1,986 cc)",
    fuel: "Petrol",
    transmission: "Super CVT-i Automatic",
    drive: "2WD",
    body: "SUV",
    color: "Pearl White Crystal",
    importStatus: "Japan Import",
    registration: "KDB 933M",
    status: "Available",
    badge: "Popular",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "JBL Synthesis Audio System",
      "Half-Leather & Suede Sport Seats",
      "Toyota Safety Sense (Pre-Crash Safety)",
      "Smart Power Tailgate with Memory",
      "18-inch Two-Tone Machined Alloy Wheels",
      "LED Sequential Turn Signal Headlights",
      "Eco & Sport Drive Modes",
      "Dual-Zone Digital Climate Control"
    ],
    description: "Immaculate condition Toyota Harrier Elegance. Low verified mileage from Japan, pristine interior, and whisper-quiet ride. Fuel efficient 2.0L engine ideal for daily Nairobi commuting with unmistakable luxury styling."
  },
  {
    id: "KNM-109",
    make: "Audi",
    model: "Q7 50 TDI S-Line Quattro",
    year: 2020,
    price: 12900000,
    mileage: 38000,
    engine: "3.0L V6 Turbo Diesel MHEV (2,967 cc)",
    fuel: "Diesel",
    transmission: "8-Speed Tiptronic",
    drive: "AWD",
    body: "SUV",
    color: "Daytona Grey Pearl",
    importStatus: "UK Direct Import",
    registration: "KDD 405Q",
    status: "Available",
    badge: "New Arrival",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Full 7-Seat Capability with Power 3rd Row",
      "Audi Virtual Cockpit Plus with 3D Navigation",
      "Matrix LED Headlights with Dynamic Indicators",
      "Adaptive Air Suspension (S-Line Tuned)",
      "Bang & Olufsen 3D Premium Sound System",
      "Valcona Leather S-Embossed Sports Seats",
      "Panoramic Glass Sunroof",
      "Top-View 360-degree Cameras"
    ],
    description: "A commanding 7-seater German SUV built for long family journeys and effortless highway touring. Mild-hybrid turbo diesel delivers exceptional power and efficiency. Loaded with S-Line styling, Daytona Grey pearl exterior, and full Bang & Olufsen audio."
  },
  {
    id: "KNM-110",
    make: "Toyota",
    model: "Hilux GR Sport 4WD Double Cab",
    year: 2022,
    price: 7600000,
    mileage: 19000,
    engine: "2.8L GD-6 Turbo Diesel (2,755 cc)",
    fuel: "Diesel",
    transmission: "6-Speed Automatic",
    drive: "4WD",
    body: "Pickup",
    color: "Emotional Red with Black Accents",
    importStatus: "Fresh Import",
    registration: "KDE 004X",
    status: "Available",
    badge: "Special Offer",
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "GR Sport Dedicated Monotube Shock Absorbers",
      "GR Perforated Leather / Suede Racing Seats",
      "360-Degree Panoramic View Monitor",
      "JBL High-Resolution Audio System",
      "Heavy Duty Bedliner & Roll Bar",
      "Paddle Shifters on Leather Steering Wheel",
      "Factory Rear Differential Lock",
      "LED Projector Headlights & Fog Lamps"
    ],
    description: "Toughness meets Gazoo Racing performance. The Hilux GR Sport features dedicated rally-tuned suspension for superior stability on gravel, tarmac, and rough Kenyan terrain. Striking red and black styling, paddle shifters, and heavy-duty load capacity."
  }
];

const INITIAL_TEAM = [
  {
    name: "Kayan Njogu",
    role: "CEO & Managing Director",
    bio: "Founding visionary with over 15 years in international luxury automobile sourcing, vehicle homologation, and client trust across East Africa.",
    phone: "+254 712 345 678",
    email: "kayan@kayannjogumotors.co.ke",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kiiru Njogu",
    role: "General Operations Manager",
    bio: "Leading day-to-day dealership operations, vehicle quality verification, clearing and logistics, and strategic inventory acquisition.",
    phone: "+254 798 123 456",
    email: "kiiru@kayannjogumotors.co.ke",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Symo Miogo",
    role: "Senior Sales Representative",
    bio: "Automotive advisory specialist focused on bespoke client consultations, financing packages, test drives, and aftersales VIP support.",
    phone: "+254 722 987 654",
    email: "symo@kayannjogumotors.co.ke",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
  }
];

const INITIAL_INQUIRIES = [
  {
    id: "INQ-201",
    customerName: "David Mwangi",
    customerEmail: "dmwangi@ke-invest.com",
    customerPhone: "+254 722 100 234",
    vehicleId: "KNM-101",
    vehicleName: "Toyota Land Cruiser 300 GR Sport",
    type: "Price & Import Enquiry",
    message: "Interested in the LC300. Would like to confirm if duty is fully paid and whether trade-in with a 2018 Prado is accepted.",
    status: "New",
    date: "2026-11-23 14:15"
  },
  {
    id: "INQ-202",
    customerName: "Grace Wanjiku",
    customerEmail: "gwanjiku@safari-ventures.co.ke",
    customerPhone: "+254 733 456 789",
    vehicleId: "KNM-102",
    vehicleName: "Mercedes-Benz GLE 450 AMG Line",
    type: "Financing Enquiry",
    message: "Can you provide quotation for asset financing through NCBA or Stanbic for 36 months?",
    status: "In Progress",
    date: "2026-11-22 09:40"
  }
];

const INITIAL_TEST_DRIVES = [
  {
    id: "TD-301",
    customerName: "Eng. Brian Kiprono",
    customerPhone: "+254 711 889 900",
    customerEmail: "bkiprono@roadworks.co.ke",
    vehicleId: "KNM-105",
    vehicleName: "BMW X5 xDrive40i M Sport",
    preferredDate: "2026-11-26",
    preferredTime: "11:00 AM",
    licenseConfirmed: true,
    status: "Confirmed",
    notes: "Prefers highway test drive along Southern Bypass."
  },
  {
    id: "TD-302",
    customerName: "Dr. Angela Mutua",
    customerPhone: "+254 720 334 556",
    customerEmail: "amutua@knh.ac.ke",
    vehicleId: "KNM-103",
    vehicleName: "Toyota Land Cruiser Prado TX-L",
    preferredDate: "2026-11-27",
    preferredTime: "02:30 PM",
    licenseConfirmed: true,
    status: "Pending",
    notes: "Visiting showroom with spouse."
  }
];

const INITIAL_SELL_SUBMISSIONS = [
  {
    id: "SELL-401",
    ownerName: "Samuel Ochieng",
    ownerPhone: "+254 725 678 123",
    ownerEmail: "sochieng@gmail.com",
    make: "Toyota",
    model: "Fortuner 2.8 GD-6",
    year: 2019,
    mileage: 68000,
    askingPrice: 5100000,
    condition: "Excellent, single owner, full service record at Toyota Kenya",
    registration: "KDA 812T",
    status: "Under Review",
    date: "2026-11-21 16:50"
  }
];

const INITIAL_PAYMENTS = [
  {
    id: "MPESA-9X8K7L2M1",
    customerName: "David Mwangi",
    phone: "+254 722 100 234",
    vehicle: "2022 Toyota Land Cruiser 300 GR Sport",
    amount: 100000,
    paymentMethod: "M-Pesa STK Push",
    status: "Confirmed",
    date: "2026-11-23 15:30"
  },
  {
    id: "MPESA-4F5G6H7J8",
    customerName: "Grace Wanjiku",
    phone: "+254 733 456 789",
    vehicle: "2021 Mercedes-Benz GLE 450 AMG Line",
    amount: 50000,
    paymentMethod: "M-Pesa STK Push",
    status: "Confirmed",
    date: "2026-11-22 10:15"
  }
];

// Unified Client Storage Manager (Works offline in browser or syncs with REST API)
const StorageManager = {
  getVehicles: function() {
    const data = localStorage.getItem("knm_vehicles");
    if (!data) {
      localStorage.setItem("knm_vehicles", JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    return JSON.parse(data);
  },
  saveVehicles: function(vehicles) {
    localStorage.setItem("knm_vehicles", JSON.stringify(vehicles));
  },
  getInquiries: function() {
    const data = localStorage.getItem("knm_inquiries");
    if (!data) {
      localStorage.setItem("knm_inquiries", JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(data);
  },
  saveInquiries: function(inquiries) {
    localStorage.setItem("knm_inquiries", JSON.stringify(inquiries));
  },
  getTestDrives: function() {
    const data = localStorage.getItem("knm_test_drives");
    if (!data) {
      localStorage.setItem("knm_test_drives", JSON.stringify(INITIAL_TEST_DRIVES));
      return INITIAL_TEST_DRIVES;
    }
    return JSON.parse(data);
  },
  saveTestDrives: function(testDrives) {
    localStorage.setItem("knm_test_drives", JSON.stringify(testDrives));
  },
  getSellSubmissions: function() {
    const data = localStorage.getItem("knm_sell_submissions");
    if (!data) {
      localStorage.setItem("knm_sell_submissions", JSON.stringify(INITIAL_SELL_SUBMISSIONS));
      return INITIAL_SELL_SUBMISSIONS;
    }
    return JSON.parse(data);
  },
  saveSellSubmissions: function(submissions) {
    localStorage.setItem("knm_sell_submissions", JSON.stringify(submissions));
  },
  getPayments: function() {
    const data = localStorage.getItem("knm_payments");
    if (!data) {
      localStorage.setItem("knm_payments", JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    return JSON.parse(data);
  },
  savePayments: function(payments) {
    localStorage.setItem("knm_payments", JSON.stringify(payments));
  },
  resetToDefaults: function() {
    localStorage.setItem("knm_vehicles", JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem("knm_inquiries", JSON.stringify(INITIAL_INQUIRIES));
    localStorage.setItem("knm_test_drives", JSON.stringify(INITIAL_TEST_DRIVES));
    localStorage.setItem("knm_sell_submissions", JSON.stringify(INITIAL_SELL_SUBMISSIONS));
    localStorage.setItem("knm_payments", JSON.stringify(INITIAL_PAYMENTS));
  }
};
