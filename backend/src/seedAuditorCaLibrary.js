const { MongoClient } = require('mongodb');

const auditorCaItems = [
  // ----------------------------------------------------
  // SERVICES (15 Services for Auditor / CA / Tax Consultant)
  // ----------------------------------------------------
  {
    name: "Income Tax Return (ITR-1 / ITR-2) Filing - Salaried Individuals",
    slug: "itr-1-itr-2-filing-salaried-individuals",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "End-to-end Income Tax Return calculation and e-filing for salaried employees, Form 16 reconciliation, Capital Gains computation, tax-saving investment advice under Old vs. New Tax Regime, and instant e-verification.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Income_Tax_Department_India_logo.png",
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 1499,
    tags: ["itr", "income tax", "salaried", "form 16", "tax return", "ca service"],
    seoKeywords: ["ITR filing online", "salaried tax return CA", "income tax filing Tirupati", "Form 16 ITR filing"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "ITR-3 & ITR-4 Presumptive Business Tax Filing",
    slug: "itr-3-itr-4-presumptive-business-tax-filing",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Tax filing for sole proprietors, freelancers, traders, and small business owners under Section 44AD / 44ADA / 44AE, balance sheet & P&L compilation, and tax minimization advisory.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Income_Tax_Department_India_logo.png",
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 3999,
    tags: ["itr3", "itr4", "business tax", "44ada", "freelancer tax", "proprietorship"],
    seoKeywords: ["business ITR filing CA", "freelancer tax consultant", "presumptive tax 44ada", "proprietorship tax filing"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "GST Registration & Monthly Return Filing (GSTR-1 & GSTR-3B)",
    slug: "gst-registration-monthly-return-filing",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "New GST registration setup, HSN/SAC code classification, monthly GSTR-1 outward supply filing, GSTR-3B ITC reconciliation with GSTR-2B, e-Way bill assistance, and annual GSTR-9 returns.",
    imageUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://www.gst.gov.in/img/logo.png",
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 2499,
    tags: ["gst", "gstr1", "gstr3b", "gst registration", "tax return", "itc"],
    seoKeywords: ["GST registration CA Tirupati", "GSTR 3B return filing", "GST consultant near me", "GST compliance package"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Statutory Audit under Companies Act 2013",
    slug: "statutory-audit-under-companies-act-2013",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Comprehensive statutory audit of company financial statements, ledger accounts verification, Ind AS / AS compliance check, internal control testing, and signing of independent Audit Report under Form 3CA/3CB.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png",
      "https://www.mca.gov.in/content/dam/mca/mca-logo.png"
    ],
    defaultPrice: 25000,
    tags: ["audit", "statutory audit", "companies act", "balance sheet", "ca audit"],
    seoKeywords: ["statutory audit CA firm", "company auditor Tirupati", "Companies Act audit report", "financial statement audit"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Tax Audit under Section 44AB",
    slug: "tax-audit-under-section-44ab",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Mandatory Tax Audit for businesses and professionals crossing turnover limits, Form 3CD audit report preparation, disallowance verification, and online e-filing with UDIN.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Income_Tax_Department_India_logo.png",
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 18500,
    tags: ["tax audit", "44ab", "form 3cd", "turnover audit", "ca tax audit"],
    seoKeywords: ["tax audit under section 44AB", "CA tax audit cost", "Form 3CD audit online", "turnover tax audit CA"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Private Limited Company & LLP Incorporation",
    slug: "private-limited-company-llp-incorporation",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Complete business incorporation including SPICe+ filing, Name Reservation (RUN), DIN allotment, PAN/TAN generation, MoA/AoA drafting, and Certificate of Incorporation (CoI).",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://www.mca.gov.in/content/dam/mca/mca-logo.png",
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Startup_India_Logo.png"
    ],
    defaultPrice: 8999,
    tags: ["incorporation", "pvt ltd", "llp", "mca", "roc filing", "company registration"],
    seoKeywords: ["Pvt Ltd company registration CA", "LLP registration Tirupati", "ROC filing consultant", "SPICe plus filing"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Monthly Accounting & Bookkeeping Services",
    slug: "monthly-accounting-bookkeeping-services",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Professional accounting & bookkeeping, Tally Prime / Zoho Books entry, Bank Reconciliation Statements (BRS), Accounts Payable & Receivable tracking, and monthly financial reporting.",
    imageUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://tallysolutions.com/wp-content/themes/tally/assets/images/tally-logo.svg",
      "https://www.zoho.com/books/images/zoho-books-logo.png"
    ],
    defaultPrice: 4999,
    tags: ["accounting", "bookkeeping", "tally", "zoho books", "brs", "financial statements"],
    seoKeywords: ["accounting services Tirupati", "outsourced bookkeeping CA", "Tally entry consultant", "monthly accounting package"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "TDS & TCS Quarterly Return Filing (Form 24Q & 26Q)",
    slug: "tds-tcs-quarterly-return-filing",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Quarterly TDS/TCS calculation, Challan 281 payment verification, Form 24Q (Salary) & Form 26Q (Non-Salary) e-filing, TRACES Form 16/16A generation, and TDS correction filings.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://contents.tin.nsdl.com/tin/images/tin_logo.gif",
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Income_Tax_Department_India_logo.png"
    ],
    defaultPrice: 2999,
    tags: ["tds", "tcs", "form 26q", "form 24q", "traces", "form 16a"],
    seoKeywords: ["TDS quarterly return filing", "TRACES Form 16A issue CA", "26Q TDS return package", "TDS consultant near me"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Income Tax Notice Resolution & Appeal Representation",
    slug: "income-tax-notice-resolution-appeal-representation",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Legal drafting and representation for Income Tax Notices under Sec 142(1), 143(1), 148, defective returns Sec 139(9), Faceless Assessment e-proceedings, and CIT(A) appeals.",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Income_Tax_Department_India_logo.png",
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 7500,
    tags: ["tax notice", "143(1)", "faceless assessment", "tax representation", "ca legal"],
    seoKeywords: ["Income tax notice reply CA", "143(1) intimation response", "faceless tax assessment consultant", "tax appeal lawyer CA"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "CMA Data Preparation & DPR for Bank Loans",
    slug: "cma-data-preparation-dpr-bank-loans",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Preparation of Credit Monitoring Arrangement (CMA) data format, projected financial statements, cash flow analysis, financial ratios, and Detailed Project Reports (DPR) for CC/OD limits and bank term loans.",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-Logo.svg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/HDFC_Bank_logo.svg"
    ],
    defaultPrice: 12000,
    tags: ["cma data", "dpr", "bank loan", "project report", "ca report"],
    seoKeywords: ["CMA report for bank loan", "project report preparation CA", "bank loan documentation Tirupati", "CC OD limit CMA format"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "CA Net Worth Certificate & Solvency Certification",
    slug: "ca-net-worth-certificate-solvency-certification",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Official CA Net Worth Certificate issued with UDIN verification for VISA applications, Student/Foreign Education loans, Government/Private Tenders, Bank Guarantees, and Solvency proof.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png",
      "https://udin.icai.org/images/logo.png"
    ],
    defaultPrice: 2500,
    tags: ["net worth certificate", "ca certificate", "udin", "visa certificate", "solvency"],
    seoKeywords: ["Net worth certificate for VISA Tirupati", "CA certificate with UDIN", "solvency certificate CA", "tender net worth certificate"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Internal Audit & Process Control Review",
    slug: "internal-audit-process-control-review",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "In-depth evaluation of operational workflows, risk identification, internal financial control (IFC) testing, physical inventory stock verification, SOP compliance, and executive audit reporting.",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 35000,
    tags: ["internal audit", "risk management", "sop audit", "stock verification"],
    seoKeywords: ["internal audit services CA", "operational audit consultant", "inventory audit firm", "risk advisory CA"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Transfer Pricing Audit & Form 15CA/15CB Certification",
    slug: "transfer-pricing-audit-form-15ca-15cb",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Form 3CEB audit report preparation, Transfer Pricing benchmarking documentation, DTAA tax treaty advisory, and Form 15CA / 15CB CA certification for outward foreign remittances.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Income_Tax_Department_India_logo.png",
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 45000,
    tags: ["transfer pricing", "15ca 15cb", "dtaa", "foreign remittance", "form 3ceb"],
    seoKeywords: ["Form 15CB certification CA", "transfer pricing audit 3CEB", "DTAA tax advisory", "foreign remittance CA certificate"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Corporate Tax Planning & Advisory",
    slug: "corporate-tax-planning-advisory",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Strategic corporate tax planning under Sec 115BAA/115BAB, capital structuring, dividend distribution planning, tax incentive optimization, and M&A tax due diligence.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 15000,
    tags: ["corporate tax", "tax planning", "financial advisory", "mna tax"],
    seoKeywords: ["corporate tax consultant Tirupati", "business tax planning CA", "tax saving advisory firm", "financial restructuring CA"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "FSSAI, Import Export Code (IEC) & MSME Licensing",
    slug: "fssai-import-export-code-iec-msme-licensing",
    category: "Auditor / CA / Tax Consultant",
    type: "SERVICE",
    description: "Business registration and licensing assistance for Food Safety (FSSAI) license, Import Export Code (IEC) from DGFT, Udyam Registration (MSME), and Shop & Establishment licenses.",
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/FSSAI_logo.svg/1200px-FSSAI_logo.svg.png",
      "https://udyamregistration.gov.in/images/logo.png"
    ],
    defaultPrice: 3500,
    tags: ["fssai", "iec", "import export code", "udyam", "msme", "business license"],
    seoKeywords: ["IEC code registration CA", "FSSAI license consultant Tirupati", "MSME Udyam registration", "business license consultant"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },

  // ----------------------------------------------------
  // PRODUCTS (7 Products for Auditor / CA / Tax Consultant)
  // ----------------------------------------------------
  {
    name: "Class 3 Digital Signature Certificate (DSC) - 2 Years USB Token",
    slug: "class-3-digital-signature-certificate-dsc-2-years",
    category: "Auditor / CA / Tax Consultant",
    type: "PRODUCT",
    description: "FIPS-certified USB Crypto Token Class 3 Digital Signature Certificate (Signing + Encryption) for Income Tax e-Filing, MCA ROC forms, e-Tendering, and GST portal e-Verification.",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://www.emudhra.com/images/emudhra-logo.png",
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Income_Tax_Department_India_logo.png"
    ],
    defaultPrice: 1499,
    tags: ["dsc", "digital signature", "class 3 dsc", "usb token", "emudhra"],
    seoKeywords: ["Class 3 Digital Signature Tirupati", "DSC for CA MCA filing", "USB Token DSC price", "eMudhra DSC provider"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Tally Prime Gold Multi-User Desktop License",
    slug: "tally-prime-gold-multi-user-desktop-license",
    category: "Auditor / CA / Tax Consultant",
    type: "PRODUCT",
    description: "Perpetual Tally Prime Gold multi-user software license for accounting firms and enterprises with unlimited LAN users, e-Way bill & e-Invoicing integration, and 1-year TSS.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://tallysolutions.com/wp-content/themes/tally/assets/images/tally-logo.svg"
    ],
    defaultPrice: 54000,
    tags: ["tally prime", "tally gold", "accounting software", "gst software"],
    seoKeywords: ["Tally Prime Gold price", "Tally multi user license CA", "Tally GST software Tirupati"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Zoho Books CA Partner Accounting Suite (1-Year Enterprise)",
    slug: "zoho-books-ca-partner-accounting-suite",
    category: "Auditor / CA / Tax Consultant",
    type: "PRODUCT",
    description: "Enterprise Cloud Accounting Software with multi-entity management, client portal, automated bank feeds, GST returns, e-invoicing API integration, and audit trial logs.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://www.zoho.com/books/images/zoho-books-logo.png"
    ],
    defaultPrice: 29999,
    tags: ["zoho books", "cloud accounting", "billing software", "zoho partner"],
    seoKeywords: ["Zoho Books enterprise license", "cloud accounting software for CA", "Zoho Books partner Tirupati"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Automated Tax Computation & Form 3CD Software Utility",
    slug: "automated-tax-computation-form-3cd-software-utility",
    category: "Auditor / CA / Tax Consultant",
    type: "PRODUCT",
    description: "Specialized desktop tax software for CA offices featuring direct e-filing, automatic depreciation calculation, Form 3CD audit report generator, and computation memo printouts.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://taxmann.com/images/taxmann-logo.png",
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 9999,
    tags: ["tax software", "winman", "computax", "taxmann", "form 3cd software"],
    seoKeywords: ["CA tax computation software", "Form 3CD tax utility", "Winman tax software price"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "GST e-Invoicing & e-Way Bill Automation Suite",
    slug: "gst-einvoicing-eway-bill-automation-suite",
    category: "Auditor / CA / Tax Consultant",
    type: "PRODUCT",
    description: "Automated middleware API system for instant JSON conversion, IRN generation, e-Invoice QR code printing, and bulk e-Way Bill generation directly from ERP or Tally.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://www.gst.gov.in/img/logo.png",
      "https://einvoice1.gst.gov.in/Images/logo.png"
    ],
    defaultPrice: 14999,
    tags: ["einvoice", "eway bill", "gst api", "tally integration", "automation"],
    seoKeywords: ["GST e invoicing software API", "bulk e way bill tool", "Tally e-invoicing addon"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "Comprehensive Indian Tax Law Manual & Legal Ready-Reckoner 2026",
    slug: "comprehensive-indian-tax-law-manual-legal-ready-reckoner-2026",
    category: "Auditor / CA / Tax Consultant",
    type: "PRODUCT",
    description: "3-Volume Printed Legal Reference set covering Income Tax Act 1961, CGST/IGST Acts, Companies Act Rules, Judicial Case Law summaries, and audit checklists for professional practice.",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://taxmann.com/images/taxmann-logo.png"
    ],
    defaultPrice: 4500,
    tags: ["tax manual", "taxmann books", "gst law book", "ca reference kit"],
    seoKeywords: ["Taxmann Income Tax Ready Reckoner 2026", "GST manual for CA", "Tax law reference books"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  },
  {
    name: "CA Firm Practice Management & Client Vault SaaS (1-Year License)",
    slug: "ca-firm-practice-management-client-vault-saas",
    category: "Auditor / CA / Tax Consultant",
    type: "PRODUCT",
    description: "All-in-one practice management tool for CA & Tax firms with job tracking, auto billing, OTP-secured client document vault, UDIN register, and automated WhatsApp payment reminders.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
    ],
    customerLogos: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/ICAI_Logo.svg/1200px-ICAI_Logo.svg.png"
    ],
    defaultPrice: 18000,
    tags: ["firm automation", "ca office software", "jamku", "task management", "client portal"],
    seoKeywords: ["CA firm office management software", "Jamku CA software license", "tax office task tracker"],
    status: "APPROVED",
    requestedBy: null,
    rejectionReason: null,
    isReferralEnabled: true,
    commissionType: "GLOBAL",
    commissionValue: null
  }
];

async function seedAuditorCaLibrary() {
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

    for (const item of auditorCaItems) {
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

    console.log(`Finished seeding Auditor / CA / Tax Consultant library into MongoDB! Created: ${createdCount}, Updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error seeding Auditor CA library via MongoClient:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedAuditorCaLibrary();
}

module.exports = { auditorCaItems, seedAuditorCaLibrary };
