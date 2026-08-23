const { MongoClient } = require('mongodb');

const travelTaxiItems = [
  // ----------------------------------------------------
  // 1. TAXI SERVICE & CAB TRAVELS (6 Services)
  // ----------------------------------------------------
  {
    name: "Local City Taxi Booking (Hourly Hatchback / Sedan / SUV)",
    slug: "local-city-taxi-booking-hourly-package",
    category: "Taxi Service & Cab Travels",
    type: "SERVICE",
    description: "24/7 instant local city cab rental with verified professional drivers. Choose from 4 Hr / 40 KM, 8 Hr / 80 KM, or 12 Hr / 120 KM packages. AC Hatchback, Swift Dzire, Etios, Ertiga, and Innova Crysta available.",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 1499,
    tags: ["taxi", "cab booking", "local taxi", "city cab", "tirupati taxi", "dzire cab", "innova cab"],
    seoKeywords: ["local taxi booking Tirupati", "hourly cab rental", "outstation taxi service", "24/7 city cab"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Airport Pickup & Drop Taxi Service (Tirupati / Chennai / Bangalore / Hyd)",
    slug: "airport-pickup-drop-taxi-service",
    category: "Taxi Service & Cab Travels",
    type: "SERVICE",
    description: "Guaranteed on-time airport pickup & drop service with flight tracking, zero cancellation fees, clean sanitized cabs, luggage assistance, and toll-inclusive transparent pricing.",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df515122519?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 1999,
    tags: ["airport taxi", "airport drop", "airport pickup cab", "tirupati airport cab", "chennai airport drop"],
    seoKeywords: ["airport taxi service Tirupati", "Tirupati to Chennai airport drop", "airport cab pickup", "flight transfer cab"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Outstation One-Way & Roundtrip Cab Service",
    slug: "outstation-one-way-roundtrip-cab-service",
    category: "Taxi Service & Cab Travels",
    type: "SERVICE",
    description: "Affordable outstation cab bookings to Chennai, Bangalore, Vijayawada, Vizag, Vellore, and Pondicherry. Pay only for one-way distance or opt for all-inclusive daily outstation packages.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 2999,
    tags: ["outstation taxi", "one way cab", "intercity taxi", "long distance cab", "tirupati to bangalore cab"],
    seoKeywords: ["one way outstation cab", "Tirupati to Bangalore taxi fare", "intercity cab travels", "outstation taxi operator"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Tirumala Hill Temple Taxi Package (Tirupati to Tirumala Roundtrip)",
    slug: "tirumala-hill-temple-taxi-package",
    category: "Taxi Service & Cab Travels",
    type: "SERVICE",
    description: "Specialized Tirumala Balaji Temple hill climbing taxi service with experienced mountain drivers, ghat road permit assistance, room drop, and darshan waiting package.",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 1799,
    tags: ["tirumala taxi", "balaji darshan cab", "ghat road taxi", "temple cab package", "tirupati to tirumala cab"],
    seoKeywords: ["Tirumala hill taxi price", "Tirupati railway station to Tirumala cab", "balaji temple darshan taxi", "tirumala ghat road cab"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Luxury Wedding & VIP Escort Taxi (Audi / BMW / Mercedes / Fortuner)",
    slug: "luxury-wedding-vip-escort-taxi",
    category: "Taxi Service & Cab Travels",
    type: "SERVICE",
    description: "Chauffeur-driven luxury cars for weddings, VIP guest transfers, corporate executives, and special celebrations. Floral car decoration included upon request.",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 9999,
    tags: ["vip taxi", "wedding car cab", "luxury taxi", "audi rental", "bmw cab", "fortuner wedding car"],
    seoKeywords: ["luxury wedding car rental Tirupati", "audi bmw taxi hire", "vip escort car service", "bride groom wedding car"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "24/7 Corporate & Employee Commute Taxi Service",
    slug: "corporate-employee-commute-taxi-service",
    category: "Taxi Service & Cab Travels",
    type: "SERVICE",
    description: "Dedicated corporate cab fleet management for IT companies, hospitals, manufacturing units, and businesses. Automated billing, GPS tracking, and vetted drivers.",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 2499,
    tags: ["corporate taxi", "office cab", "employee commute", "monthly taxi contract", "company cab service"],
    seoKeywords: ["corporate taxi service Tirupati", "employee transport cab", "company monthly cab contract", "bpo cab service"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },

  // ----------------------------------------------------
  // 2. CAR RENTAL AGENCY (4 Services & Products)
  // ----------------------------------------------------
  {
    name: "Self-Drive Car Rental (Hatchback / Swift / i20 - 24 Hours)",
    slug: "self-drive-car-rental-hatchback-swift-i20",
    category: "Car Rental Agency",
    type: "SERVICE",
    description: "Unlimited KM self-drive car rentals with zero security deposit hassles. Fully insured Swift, Baleno, i20, and WagonR delivered to your doorstep or airport terminal.",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 1899,
    tags: ["self drive car", "car rental agency", "rent swift", "daily car rental", "unlimited km car rental"],
    seoKeywords: ["self drive car rental Tirupati", "rent swift self drive", "car rental agency near me", "unlimited km self drive"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "SUV Self-Drive Car Rental (Creta / Thar / Fortuner / Scorpio)",
    slug: "suv-self-drive-car-rental-creta-thar-fortuner",
    category: "Car Rental Agency",
    type: "SERVICE",
    description: "Drive powerful 4x4 SUVs for road trips, hill stations, and long drives. Fully maintained Mahindra Thar, Hyundai Creta, Scorpio N, and Toyota Fortuner for rent.",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 3999,
    tags: ["thar rental", "fortuner rental", "suv car rental", "self drive suv", "scorpio self drive"],
    seoKeywords: ["Thar rental self drive Tirupati", "Fortuner car rental price", "SUV self drive rental", "Creta car hire"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Chauffeur-Driven Executive Car Rental Service",
    slug: "chauffeur-driven-executive-car-rental",
    category: "Car Rental Agency",
    type: "SERVICE",
    description: "Premium sedan and luxury car rentals with uniform-clad experienced drivers. Ideal for business trips, delegates, airport transfers, and VIP movement.",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 2999,
    tags: ["driver car rental", "chauffeur car", "executive car hire", "business car rental"],
    seoKeywords: ["chauffeur driven car rental Tirupati", "executive car hire with driver", "luxury sedan driver rental"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Wedding Luxury Car Rental with Flower Decoration Package",
    slug: "wedding-luxury-car-rental-flower-decoration",
    category: "Car Rental Agency",
    type: "SERVICE",
    description: "Exclusive bride & groom wedding car rental service featuring Jaguar, Mercedes-Benz E-Class, BMW 5 Series, and Audi A6. Includes custom floral decoration and professional chauffeur.",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 14999,
    tags: ["wedding car rental", "decorated car for wedding", "mercedes wedding car", "audi wedding car"],
    seoKeywords: ["wedding car rental with decoration Tirupati", "luxury marriage car hire", "decorated car for groom"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },

  // ----------------------------------------------------
  // 3. CAR LEASING SERVICE (3 Services)
  // ----------------------------------------------------
  {
    name: "Monthly Commercial Car Leasing for Businesses & Fleet",
    slug: "monthly-commercial-car-leasing-business-fleet",
    category: "Car Leasing Service",
    type: "SERVICE",
    description: "Flexible 1-month to 12-month commercial vehicle leasing for companies, startups, and tour operators. Zero heavy down payment, free routine maintenance, and replacement vehicle guarantee.",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 24999,
    tags: ["car leasing", "commercial car lease", "monthly car lease", "corporate car lease"],
    seoKeywords: ["commercial car leasing Tirupati", "monthly car lease for business", "corporate car rental lease"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Long-Term Corporate Fleet Leasing (12 to 36 Months)",
    slug: "long-term-corporate-fleet-leasing",
    category: "Car Leasing Service",
    type: "SERVICE",
    description: "End-to-end corporate car leasing solutions with complete tax benefits, fleet tracking, insurance coverage, and 24/7 roadside assistance.",
    imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 44999,
    tags: ["suv leasing", "fleet leasing", "long term car lease", "corporate fleet leasing"],
    seoKeywords: ["long term corporate car leasing", "fleet leasing service Tirupati", "company car leasing package"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "EV Electric Car Commercial Lease (Tata Nexon EV / MG ZS EV)",
    slug: "ev-electric-car-commercial-lease",
    category: "Car Leasing Service",
    type: "SERVICE",
    description: "Eco-friendly electric vehicle leasing for green businesses, hotel shuttles, and urban commute. Tata Nexon EV, Tiago EV, and MG ZS EV with charging station support.",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 29999,
    tags: ["ev lease", "electric car leasing", "nexon ev lease", "green fleet leasing"],
    seoKeywords: ["EV car leasing Tirupati", "Tata Nexon EV commercial lease", "electric car rental for corporate"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },

  // ----------------------------------------------------
  // 4. TRAVEL AGENCY & TOUR PACKAGES (5 Services)
  // ----------------------------------------------------
  {
    name: "Tirupati Temple Special Package Tour (Darshan + Transport + Hotel)",
    slug: "tirupati-temple-special-package-tour",
    category: "Travel Agency & Tour Packages",
    type: "SERVICE",
    description: "All-inclusive Tirumala Balaji Special Entry Darshan tour package. Includes AC vehicle pickup from station/airport, 3-star hotel room for fresh-up, laddu prasadam, and guide assistance.",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 4999,
    tags: ["tirupati tour", "darshan package", "travel agency", "temple package", "balaji tour package"],
    seoKeywords: ["Tirupati balaji darshan tour package", "Tirupati travel agency", "special entry darshan package", "tirupati hotel transport package"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "South India Pilgrimage Tour Package (Tirupati - Kanchipuram - Rameshwaram)",
    slug: "south-india-pilgrimage-tour-package",
    category: "Travel Agency & Tour Packages",
    type: "SERVICE",
    description: "Guided 7-Day temple tour across Tirupati, Kalahasti, Kanchipuram, Mahabalipuram, Puducherry, Madurai, and Rameshwaram with AC bus/car transport and hotel stays.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 14999,
    tags: ["pilgrimage tour", "kanchipuram travel", "south india tour", "rameshwaram package"],
    seoKeywords: ["South India temple tour package", "Rameshwaram Tirupati tour package", "pilgrimage tour travels"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Domestic & International Flight Ticket Booking Service",
    slug: "flight-ticket-booking-service",
    category: "Travel Agency & Tour Packages",
    type: "SERVICE",
    description: "Instant flight booking assistance with zero convenience fees, group booking discounts, seat selection, meal preferences, and 24/7 web check-in support.",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 499,
    tags: ["flight booking", "air ticket agency", "cheap airfares", "travel agent flight"],
    seoKeywords: ["flight ticket agent Tirupati", "cheap air ticket booking", "international flight agency"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Passport & Visa Documentation Assistance Service",
    slug: "passport-visa-documentation-assistance",
    category: "Travel Agency & Tour Packages",
    type: "SERVICE",
    description: "Hassle-free Tatkal passport application, document verification, appointment booking, and tourist/business visa processing for USA, UK, Europe (Schengen), Dubai, Singapore, and Malaysia.",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 1499,
    tags: ["passport agency", "visa assistance", "dubai visa agent", "tatkal passport agent"],
    seoKeywords: ["passport consultant Tirupati", "tourist visa agent near me", "dubai visa processing"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Customized Family Holiday & Honeymoon Tour Packages",
    slug: "customized-family-holiday-honeymoon-tour-packages",
    category: "Travel Agency & Tour Packages",
    type: "SERVICE",
    description: "Tailor-made vacation packages to Kerala, Goa, Kashmir, Himachal Pradesh, Thailand, Bali, and Dubai. Includes flights, luxury resort stays, sightseeing tours, and candlelit dinners.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
    ],
    defaultPrice: 19999,
    tags: ["holiday package", "honeymoon tour", "kerala package", "goa trip agent", "dubai tour package"],
    seoKeywords: ["honeymoon package tour travels", "Kerala holiday tour agency Tirupati", "international tour operator"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  }
];

async function seedTravelTaxiLibrary() {
  console.log('Connecting to MongoDB via MongoClient...');
  const mongoUri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/reviewflow';
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Connected to MongoDB successfully.');
    const db = client.db();
    const collection = db.collection('ProductServiceLibrary');

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of travelTaxiItems) {
      const now = new Date();
      const updateDoc = { ...item, updatedAt: now };
      const result = await collection.updateOne(
        { name: item.name, category: item.category },
        { 
          $set: updateDoc,
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }

    console.log(`Finished seeding Taxi, Car Rental, Leasing & Travel Agency library into MongoDB! Created: ${createdCount}, Updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error seeding Travel & Taxi library via MongoClient:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedTravelTaxiLibrary();
}

module.exports = { travelTaxiItems, seedTravelTaxiLibrary };
