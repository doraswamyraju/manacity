import React, { useState, useEffect } from 'react';
import { 
  Factory, Stamp, Calculator, Briefcase, Globe, IndianRupee, Lightbulb, MoreHorizontal, 
  Phone, Menu, X, ChevronDown, Clock, Award, Search, ArrowRight, CheckCircle2, 
  Building2, Mail, MapPin, CheckCircle, FileText, Star, Users, Check, HelpCircle, 
  MessageSquare, CreditCard, Lock, UploadCloud, Trash2, ShieldCheck, Download,
  Facebook, Twitter, Linkedin, Youtube, Instagram, BookOpen, AlertCircle, ThumbsUp,
  TrendingUp, Scale, Zap, UserCheck, Loader2
} from 'lucide-react';

/* --- DATA: SERVICES MEGA MENU --- */
const SERVICES_DATA = [
  {
    id: 'machinery',
    title: 'Machinery & Industrial',
    icon: <Factory className="w-6 h-6" />,
    items: ['Machinery Sourcing', 'Vendor Verification', 'Turnkey Factory Setup', 'Technology Upgradation']
  },
  {
    id: 'iso',
    title: 'Certification & ISO',
    icon: <Stamp className="w-6 h-6" />,
    items: ['ISO 9001, 14001, 45001', 'ISO 27001 (Info Sec)', 'CE Marking & FDA', 'GMP / HACCP / Halal']
  },
  {
    id: 'accounting',
    title: 'Accounting & Tax',
    icon: <Calculator className="w-6 h-6" />,
    items: ['Cloud Accounting', 'GST Reg & Returns', 'Income Tax Filing', 'Statutory & Tax Audits']
  },
  {
    id: 'registration',
    title: 'Business Registration',
    icon: <Briefcase className="w-6 h-6" />,
    items: ['Pvt Ltd / LLP / OPC', 'Section 8 (NGO)', 'Start-up India Reg', 'FSSAI & Trade License']
  },
  {
    id: 'govt',
    title: 'Govt. Portals',
    icon: <Globe className="w-6 h-6" />,
    items: ['GeM Seller/OEM Reg', 'GeM Product Listing', 'TReDS', 'RERA Registration']
  },
  {
    id: 'msme',
    title: 'Ind. & MSME Loans',
    icon: <IndianRupee className="w-6 h-6" />,
    items: ['Project Reports (DPR)', 'Term Loans', 'CGTMSE & PMEGP', 'Subsidy Guidance']
  },
  {
    id: 'branding',
    title: 'Branding & Startup',
    icon: <Lightbulb className="w-6 h-6" />,
    items: ['Business Plans', 'Website & Branding', 'Vendor Empanelment', 'HR Policy & SOPs']
  },
  {
    id: 'utility',
    title: 'Utility Services',
    icon: <MoreHorizontal className="w-6 h-6" />,
    items: ['Trademark & IP', 'PAN / TAN Apps', 'Digital Marketing', 'Digital Signatures']
  }
];

/* --- DATA: PACKAGES --- */
const PACKAGES = [
  {
    id: 'silver',
    name: 'Silver Plan',
    price: 6499,
    description: 'Perfect for lean startups',
    features: ['2 DSC & 2 DIN', 'Name Approval', 'MOA & AOA Drafting', 'Certificate of Incorporation', 'PAN & TAN']
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    price: 14999,
    isPopular: true,
    description: 'Everything you need to launch',
    features: ['Everything in Silver', 'MSME (Udyam) Registration', 'GST Registration', 'Bank Account Support', '1 Year Digital Support']
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    price: 24999,
    description: 'Complete compliance solution',
    features: ['Everything in Gold', 'Trademark Registration', 'Auditor Appointment', '1st Year Compliance', 'Free Website Domain']
  }
];

/* --- DATA: FAQ --- */
const FAQ_DATA = [
  { q: "What is a Private Limited Company?", a: "A Private Limited Company is a privately held small business entity, in which owner liability is limited to their shares, the firm is limited to having 50 or fewer shareholders, and shares are prohibited from being publicly traded." },
  { q: "Is a physical office required?", a: "No, a physical commercial office is not mandatory. You can register your company using a residential address as the registered office by providing a No Objection Certificate (NOC) from the owner." },
  { q: "Can a salaried person be a Director?", a: "Yes, a salaried person can become a director in a private limited company, provided their employment agreement allows it. There are no legal restrictions under the Companies Act." },
  { q: "What is the minimum capital required?", a: "The requirement for minimum paid-up capital (previously ₹1 Lakh) has been removed. You can now start a Private Limited Company with zero paid-up capital." },
  { q: "How long does the registration take?", a: "Typically, the process takes 7-10 working days. This includes DSC, DIN, Name Approval, and final Incorporation. However, it depends on MCA processing times." },
  { q: "What documents are needed for the Registered Office?", a: "You need a recent utility bill (Electricity/Gas/Water - not older than 2 months) and a Rent Agreement along with an NOC from the landlord." },
  { q: "Do I need to be present in person?", a: "No, the entire process is 100% online. All documents can be submitted digitally, and the process is managed via the MCA portal." },
  { q: "What are the annual compliances?", a: "Mandatory compliances include filing annual returns (MGT-7), financial statements (AOC-4), income tax returns, and holding an AGM (Annual General Meeting)." },
  { q: "Can NRIs/Foreigners start a company in India?", a: "Yes, Foreign Nationals and NRIs can become Directors/Shareholders. However, at least one Director must be a Resident Indian." },
  { q: "What is DIN and DSC?", a: "DIN is Director Identification Number, a unique ID for directors. DSC is Digital Signature Certificate, used to sign electronic documents filed with the MCA." },
];

const App = () => {
  // --- APP STATE ---
  const [loading, setLoading] = useState(false); // Initial load
  const [currentStep, setCurrentStep] = useState('landing');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Header State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate Initial App Load
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if(isServicesHovered) setIsServicesHovered(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isServicesHovered]);

  // --- ACTIONS ---
  const navigateTo = (step, hash) => {
    setIsMobileMenuOpen(false);
    if(step !== currentStep) {
        setLoading(true);
        setTimeout(() => {
            setCurrentStep(step);
            setLoading(false);
            if(hash) {
                setTimeout(() => {
                    const el = document.getElementById(hash);
                    if(el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                window.scrollTo(0,0);
            }
        }, 800); // Transition simulation
    } else {
        if(hash) {
            const el = document.getElementById(hash);
            if(el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo(0,0);
        }
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    navigateTo('checkout');
  };

  const handlePaymentSuccess = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigateTo('upload');
    }, 2000);
  };

  const handleFileUpload = (docType) => {
    setUploadProgress(prev => ({ ...prev, [docType]: 0 }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [docType]: progress }));
      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFiles(prev => ({ ...prev, [docType]: true }));
      }
    }, 150);
  };

  const handleQuoteSubmit = (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
          setIsSubmitting(false);
          setIsModalOpen(false);
      }, 1500);
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // --- SUB-COMPONENTS ---

  // Preloader Component
  if (loading) {
      return (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                  <span className="text-white font-black text-3xl">MC</span>
              </div>
              <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-slate-900 tracking-widest">LOADING</span>
                  <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-300"></div>
                  </div>
              </div>
          </div>
      );
  }

  // Floating Action Buttons
  const FloatingButtons = () => (
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          {/* WhatsApp */}
          <a href="https://wa.me/918008530606" target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat on WhatsApp</span>
          </a>
          {/* Call */}
          <a href="tel:+918008530606" className="bg-black hover:bg-slate-800 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative">
              <Phone className="w-6 h-6" />
              <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Call Expert</span>
          </a>
          {/* Get Quote (Red) - Visible primarily on mobile or if needed distinct */}
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-pulse group relative">
              <Zap className="w-6 h-6 fill-current" />
              <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Get Quote</span>
          </button>
      </div>
  );

  // 1. RICH HEADER
  const Header = () => (
    <>
      <div className="bg-black text-slate-300 text-xs py-2 px-4 border-b border-slate-800 hidden lg:block">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center hover:text-white transition cursor-default"><MapPin className="w-3 h-3 mr-2 text-red-600" /> Hyderabad, India</span>
            <span className="flex items-center hover:text-white transition cursor-default"><Clock className="w-3 h-3 mr-2 text-red-600" /> Mon - Sat: 10AM - 7PM</span>
            <span className="flex items-center hover:text-white transition cursor-default"><Award className="w-3 h-3 mr-2 text-red-600" /> ISO 9001:2015 Certified</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="mailto:contact@manacity.in" className="flex items-center hover:text-red-500 transition"><Mail className="w-3 h-3 mr-2" /> contact@manacity.in</a>
            <a href="tel:+918008530606" className="flex items-center hover:text-red-500 font-bold transition"><Phone className="w-3 h-3 mr-2" /> +91 80085 30606</a>
          </div>
        </div>
      </div>
      
      <header className={`sticky top-0 z-50 transition-all duration-300 w-full ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white border-b border-slate-100 py-4'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center relative">
            <div className="flex items-center flex-shrink-0 group cursor-pointer" onClick={() => navigateTo('landing')}>
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3 shadow-lg group-hover:bg-red-600 transition duration-300 relative overflow-hidden transform group-hover:scale-105">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition duration-300"></div>
                <span className="text-white font-black text-xl tracking-tighter">MC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-black leading-none tracking-tight group-hover:text-red-600 transition-colors">ManaCity</span>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Business Solutions</span>
              </div>
            </div>

            {currentStep === 'landing' ? (
              <nav className="hidden lg:flex items-center space-x-1">
                <button onClick={() => navigateTo('landing')} className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105">Home</button>
                <button onClick={() => navigateTo('landing', 'process')} className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105">Process</button>
                <div className="relative px-2 py-4" onMouseEnter={() => setIsServicesHovered(true)} onMouseLeave={() => setIsServicesHovered(false)}>
                  <button className={`flex items-center px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 hover:scale-105 group ${isServicesHovered ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-700 hover:text-red-600 hover:bg-red-50'}`}>
                    Services <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${isServicesHovered ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] bg-white rounded-2xl shadow-2xl border-t-4 border-red-600 overflow-hidden transition-all duration-300 origin-top z-50 ${isServicesHovered ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible pointer-events-none'}`}>
                    <div className="flex">
                      <div className="w-64 bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
                        <div>
                          <h3 className="text-xl font-extrabold text-slate-900 mb-2">Our Expertise</h3>
                          <p className="text-sm text-slate-500 mb-6">From registration to expansion, we handle all your business needs under one roof.</p>
                          <div className="space-y-3">
                            <div className="flex items-center text-xs font-semibold text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> 100% Online Process</div>
                            <div className="flex items-center text-xs font-semibold text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Expert CA/CS Team</div>
                          </div>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="block w-full py-3 bg-black text-white text-center text-sm font-bold rounded-lg hover:bg-slate-800 transition transform hover:-translate-y-1 shadow-lg">Get Custom Quote</button>
                      </div>
                      <div className="flex-1 p-8 bg-white">
                        <div className="grid grid-cols-4 gap-x-6 gap-y-8">
                          {SERVICES_DATA.map((service) => (
                            <div key={service.id} className="group/item cursor-pointer" onClick={() => navigateTo('landing', 'pricing')}>
                              <div className="flex items-center space-x-3 mb-3 group-hover/item:translate-x-1 transition-transform duration-300">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover/item:bg-red-600 group-hover/item:text-white transition-colors duration-300 shadow-sm">{service.icon}</div>
                                <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover/item:text-red-600 transition-colors">{service.title}</h4>
                              </div>
                              <ul className="space-y-1.5 ml-11 border-l-2 border-slate-100 pl-3 group-hover/item:border-red-200 transition-colors">
                                {service.items.slice(0, 3).map((item, i) => (
                                  <li key={i} className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors truncate">{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigateTo('landing', 'pricing')} className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105">Pricing</button>
                <button onClick={() => navigateTo('landing', 'faq')} className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105">FAQ</button>
              </nav>
            ) : (
              <div className="hidden lg:flex items-center space-x-2 text-sm font-medium text-slate-500">
                 <span className={`${currentStep === 'checkout' ? 'text-red-600 font-bold scale-110' : ''} transition-all`}>Payment</span>
                 <ArrowRight className="w-4 h-4 animate-pulse" />
                 <span className={`${currentStep === 'upload' ? 'text-red-600 font-bold scale-110' : ''} transition-all`}>Upload Docs</span>
                 <ArrowRight className="w-4 h-4 animate-pulse" />
                 <span className={`${currentStep === 'success' ? 'text-green-600 font-bold scale-110' : ''} transition-all`}>Done</span>
              </div>
            )}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="p-2 text-slate-600 hover:text-red-600 transition transform hover:scale-110"><Search className="w-5 h-5" /></button>
              {currentStep === 'landing' && (
                <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition shadow-lg shadow-red-600/20 flex items-center transform hover:-translate-y-1 active:scale-95 group">
                  <Phone className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Get Quote
                </button>
              )}
            </div>
            <button className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-white z-[60] transform transition-transform duration-300 lg:hidden overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
           <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center mr-2"><span className="text-white font-bold">MC</span></div>
              <span className="font-bold text-lg">Menu</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-600 transition"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-4 space-y-1">
          <button onClick={() => navigateTo('landing')} className="block w-full text-left px-4 py-3 text-lg font-bold text-slate-800 hover:bg-slate-50 rounded-xl">Home</button>
          <div className="border rounded-xl overflow-hidden border-slate-100 my-2">
            <div className="bg-slate-50 px-4 py-3 font-bold text-lg flex justify-between items-center text-slate-900">Services <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">8 Cats</span></div>
            <div className="divide-y divide-slate-100">
              {SERVICES_DATA.map((service) => (
                <div key={service.id} className="bg-white">
                  <button onClick={() => setActiveMobileCategory(activeMobileCategory === service.id ? null : service.id)} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg ${activeMobileCategory === service.id ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{service.icon}</div>
                      <span className={`text-sm font-bold ${activeMobileCategory === service.id ? 'text-red-600' : 'text-slate-700'}`}>{service.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeMobileCategory === service.id ? 'rotate-180 text-red-600' : 'text-slate-400'}`} />
                  </button>
                  {activeMobileCategory === service.id && (
                     <div className="bg-slate-50 px-4 pb-4 pt-2 space-y-2 pl-14 animate-fade-in">
                        {service.items.map((item, i) => (
                           <div key={i} onClick={() => navigateTo('landing')} className="block text-sm text-slate-600 border-l-2 border-slate-200 pl-3 py-1 active:text-red-600">{item}</div>
                        ))}
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigateTo('landing', 'pricing')} className="block w-full text-left px-4 py-3 text-lg font-bold text-slate-800 hover:bg-slate-50 rounded-xl">Pricing</button>
        </div>
      </div>
    </>
  );

  // 2. MODAL FORM
  const QuoteModal = () => (
    isModalOpen && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-slide-up">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition bg-white rounded-full p-1"><X className="w-6 h-6" /></button>
          <div className="bg-black p-6 text-center">
            <h3 className="text-white font-bold text-xl">Get a Free Consultation</h3>
            <p className="text-gray-400 text-sm mt-1">Fill the form below & we will call you back.</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <input required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" placeholder="Full Name" />
              <input required type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" placeholder="Mobile Number" />
              <button disabled={isSubmitting} type="submit" className="w-full bg-red-600 text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition transform active:scale-95 flex items-center justify-center">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );

  // 3. LANDING PAGE
  const LandingPage = () => (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative bg-white pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-50 skew-x-12 opacity-50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold mb-6 border border-red-200 animate-fade-in-up"><CheckCircle className="w-4 h-4 mr-2" /> 100% Online Process</div>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6 animate-fade-in-up delay-100">Register Your <span className="text-red-600 inline-block hover:scale-105 transition-transform cursor-default">Private Limited Company</span> in Just 7 Days</h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed animate-fade-in-up delay-200">ManaCity simplifies your business launch. Get your Certificate of Incorporation, PAN, TAN, and MOA/AOA without visiting any government office.</p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                 <button onClick={() => navigateTo('landing', 'pricing')} className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-xl shadow-red-600/20 transform hover:-translate-y-1 active:scale-95">Start Registration</button>
                 <button onClick={() => navigateTo('landing', 'process')} className="px-8 py-4 rounded-xl font-bold border-2 border-slate-200 hover:border-black hover:text-black text-slate-600 transition bg-white transform hover:-translate-y-1 active:scale-95">How it Works</button>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block animate-fade-in-left delay-300">
              <div className="relative group cursor-default">
                 <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-black rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                 <div className="relative bg-white p-8 rounded-2xl border border-slate-100 shadow-2xl transform transition duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><FileText className="h-8 w-8 text-red-600"/></div>
                      <div><h3 className="font-bold text-xl text-black">Certificate of Incorporation</h3><p className="text-sm text-slate-500">Ministry of Corporate Affairs</p></div>
                    </div>
                    <div className="space-y-4 mb-8">
                        <div className="h-3 w-3/4 bg-slate-100 rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full w-1/2 bg-slate-200 animate-shimmer"></div></div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full w-1/2 bg-slate-200 animate-shimmer delay-100"></div></div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between border border-green-100">
                       <div><div className="text-xs text-green-600 font-bold uppercase">Status</div><div className="font-bold text-green-700">Approved</div></div>
                       <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Free Benefits Display */}
      <div className="bg-slate-50 py-10 border-b border-slate-200 group">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
            <h3 className="text-xl font-bold text-slate-800">Free Benefits included with Registration:</h3>
            <div className="flex space-x-6 text-sm font-medium text-slate-600">
               <span className="flex items-center hover:text-green-600 transition-colors transform hover:scale-105 cursor-default"><CheckCircle2 className="w-5 h-5 text-green-600 mr-2" /> Name Approval</span>
               <span className="flex items-center hover:text-green-600 transition-colors transform hover:scale-105 cursor-default"><CheckCircle2 className="w-5 h-5 text-green-600 mr-2" /> Digital Signatures (DSC)</span>
               <span className="flex items-center hover:text-green-600 transition-colors transform hover:scale-105 cursor-default"><CheckCircle2 className="w-5 h-5 text-green-600 mr-2" /> PAN & TAN</span>
            </div>
         </div>
      </div>

      {/* Social Proof & Trust */}
      <div className="bg-black py-12 border-t-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
          <div className="group hover:bg-slate-900/50 p-2 rounded transition"><div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">7 Days</div><div className="text-red-500 text-sm uppercase tracking-wide font-bold group-hover:text-white transition-colors">Avg. Reg Time</div></div>
          <div className="group hover:bg-slate-900/50 p-2 rounded transition"><div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">5000+</div><div className="text-red-500 text-sm uppercase tracking-wide font-bold group-hover:text-white transition-colors">Happy Clients</div></div>
          <div className="group hover:bg-slate-900/50 p-2 rounded transition"><div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">5+ Years</div><div className="text-red-500 text-sm uppercase tracking-wide font-bold group-hover:text-white transition-colors">Experience</div></div>
          <div className="group hover:bg-slate-900/50 p-2 rounded transition"><div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">100%</div><div className="text-red-500 text-sm uppercase tracking-wide font-bold group-hover:text-white transition-colors">Online Process</div></div>
        </div>
      </div>

      {/* 3 Step High Level Process */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-16"><h2 className="text-3xl font-black text-slate-900 mb-4">How It Works</h2><p className="text-lg text-slate-600">3 simple steps to start your business.</p></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[{t:"Submit Documents",d:"Upload KYC documents of directors on our portal."}, {t:"We File Application",d:"Our team creates DSC, drafts MOA/AOA and files with MCA."}, {t:"Get Incorporated",d:"Receive your Certificate of Incorporation, PAN & TAN."}].map((step, i) => (
              <div key={i} className="p-6 border border-slate-100 rounded-xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white hover:bg-slate-50">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">{i+1}</div>
                <h3 className="font-bold text-xl mb-2 group-hover:text-red-600 transition-colors">{step.t}</h3>
                <p className="text-slate-500">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PVT LTD Guide Section */}
      <section className="py-20 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl font-black text-slate-900 mb-6">What is a Private Limited Company?</h2>
               <p className="text-slate-600 mb-6 leading-relaxed">
                  A Private Limited Company is the most popular legal structure for businesses in India. It is a separate legal entity distinct from its members/directors. It offers limited liability protection to its shareholders, meaning their personal assets are safe in case of business debts.
               </p>
               <ul className="space-y-4">
                  {['Separate Legal Entity', 'Limited Liability', 'Easy Transferability', 'Perpetual Succession'].map(item => (
                     <li key={item} className="flex items-center font-medium text-slate-800 group"><CheckCircle2 className="w-5 h-5 text-red-600 mr-3 group-hover:scale-125 transition-transform" /> {item}</li>
                  ))}
               </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 transform hover:scale-105 transition-all duration-500">
               <h3 className="font-bold text-xl mb-6">Why is it preferred?</h3>
               <div className="space-y-6">
                  <div className="flex group">
                     <TrendingUp className="w-8 h-8 text-red-600 mr-4 flex-shrink-0 group-hover:-translate-y-1 transition-transform" />
                     <div><h4 className="font-bold group-hover:text-red-600 transition-colors">Fundraising</h4><p className="text-sm text-slate-500">VCs and Investors prefer to invest in Pvt Ltd companies.</p></div>
                  </div>
                  <div className="flex group">
                     <ShieldCheck className="w-8 h-8 text-red-600 mr-4 flex-shrink-0 group-hover:-translate-y-1 transition-transform" />
                     <div><h4 className="font-bold group-hover:text-red-600 transition-colors">Credibility</h4><p className="text-sm text-slate-500">Improves brand image and trust with customers and vendors.</p></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Types of Company Comparison */}
      <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-slate-900 mb-12">Types of Company Registration</h2>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="border border-slate-200 rounded-xl p-6 hover:border-red-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <h3 className="font-bold text-xl mb-2 text-slate-900">Private Limited</h3>
                  <p className="text-sm text-slate-500 mb-4">Best for Startups & Growing Businesses</p>
                  <ul className="text-sm space-y-2 mb-6">
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Min 2 Directors</li>
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> High Credibility</li>
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Easy Funding</li>
                  </ul>
               </div>
               <div className="border border-slate-200 rounded-xl p-6 hover:border-red-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <h3 className="font-bold text-xl mb-2 text-slate-900">LLP</h3>
                  <p className="text-sm text-slate-500 mb-4">Limited Liability Partnership</p>
                  <ul className="text-sm space-y-2 mb-6">
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Min 2 Partners</li>
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Low Compliance</li>
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Tax Benefits</li>
                  </ul>
               </div>
               <div className="border border-slate-200 rounded-xl p-6 hover:border-red-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <h3 className="font-bold text-xl mb-2 text-slate-900">OPC</h3>
                  <p className="text-sm text-slate-500 mb-4">One Person Company</p>
                  <ul className="text-sm space-y-2 mb-6">
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Only 1 Owner</li>
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Limited Liability</li>
                     <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Full Control</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 11 Step Detailed Process */}
      <section className="py-20 bg-slate-50">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-slate-900 mb-12">Detailed Registration Process</h2>
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-0 before:h-full before:w-0.5 before:bg-slate-200">
               {[
                  "Name Availability Search", "Apply for DSC (Digital Signature)", "Apply for DIN (Director ID)", 
                  "Name Reservation (RUN)", "Drafting MOA & AOA", "Notarization of Documents", 
                  "Filing SPICe+ Part B", "PAN & TAN Application", "GST Registration (Optional)", 
                  "Certificate of Incorporation", "Bank Account Opening"
               ].map((step, i) => (
                  <div key={i} className="flex items-center relative group">
                     <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg group-hover:scale-125 transition-transform duration-300 ring-4 ring-slate-50 group-hover:ring-red-200">{i+1}</div>
                     <div className="ml-8 bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex-1 hover:shadow-md transition-shadow group-hover:border-red-200">
                        <h4 className="font-bold text-slate-800 group-hover:text-red-600 transition-colors">{step}</h4>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Documents Required */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-12 items-center">
           <div className="lg:w-1/2">
             <h2 className="text-3xl font-black text-slate-900 mb-6">Documents Required</h2>
             <p className="text-slate-600 mb-8">We need minimal documents to get started. You can upload these on our secure portal after payment.</p>
             <div className="space-y-4">
               {['PAN Card (All Directors)', 'Aadhaar / Voter ID / Passport', 'Latest Bank Statement', 'Passport Photo', 'Electricity Bill (Office)'].map((doc, i) => (
                 <div key={i} className="flex p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-red-200 transition-colors hover:shadow-sm"><CheckCircle className="h-6 w-6 text-red-600 mr-4 flex-shrink-0" /><span className="font-bold text-slate-900">{doc}</span></div>
               ))}
             </div>
           </div>
           <div className="lg:w-1/2 bg-red-50 p-8 rounded-3xl border border-red-100 text-center transform hover:scale-105 transition-transform duration-500 shadow-xl">
              <FileText className="w-16 h-16 text-red-600 mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Check Name Availability</h3>
              <p className="text-slate-600 mb-8">Before you register, check if your preferred company name is available with MCA.</p>
              <button onClick={() => setIsModalOpen(true)} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition transform active:scale-95 shadow-lg">Check Name for Free</button>
           </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-black text-slate-900 mb-4">Registration Fees & Packages</h2><p className="text-slate-600">Transparent pricing. No hidden fees.</p></div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`bg-white rounded-2xl p-8 border transition-all duration-300 flex flex-col relative transform hover:-translate-y-4 hover:shadow-2xl ${pkg.isPopular ? 'border-red-600 shadow-xl scale-105 z-10' : 'border-slate-200 hover:border-red-300 shadow-sm'}`}>
                {pkg.isPopular && <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-md">RECOMMENDED</div>}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                <div className="text-4xl font-black text-slate-900 mb-6">{formatCurrency(pkg.price)}<span className="text-sm font-normal text-slate-500 ml-1">+ Govt Fees</span></div>
                <div className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start text-sm text-slate-700 font-medium group"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0 group-hover:scale-125 transition-transform"/>{feat}</div>
                  ))}
                </div>
                <button onClick={() => handleSelectPlan(pkg)} className={`w-full py-4 rounded-xl font-bold transition transform active:scale-95 ${pkg.isPopular ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>Select Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Requirements Grid */}
      <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16">
            <div>
               <h3 className="text-2xl font-bold mb-6 text-slate-900">Minimum Requirements</h3>
               <ul className="space-y-4">
                  {['Minimum 2 Directors', 'Minimum 2 Shareholders', 'Registered Office Address', 'No Minimum Capital Required', 'Indian Resident Director (at least 1)'].map((req, i) => (
                     <li key={i} className="flex items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"><UserCheck className="w-5 h-5 text-red-600 mr-3" /> {req}</li>
                  ))}
               </ul>
            </div>
            <div>
               <h3 className="text-2xl font-bold mb-6 text-slate-900">Deliverables Checklist</h3>
               <ul className="space-y-4">
                  {['Certificate of Incorporation (COI)', 'DIN for 2 Directors', 'DSC for 2 Directors', 'PAN & TAN', 'MOA & AOA', 'Company Master Data', 'PF & ESIC Registration'].map((del, i) => (
                     <li key={i} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100 hover:shadow-sm transition-shadow"><BookOpen className="w-5 h-5 text-red-600 mr-3" /> {del}</li>
                  ))}
               </ul>
            </div>
         </div>
      </section>

      {/* Why ManaCity */}
      <section className="py-20 bg-black text-white">
         <div className="max-w-7xl mx-auto px-4 text-center mb-12">
            <h2 className="text-3xl font-black mb-4">Why Choose ManaCity?</h2>
            <p className="text-slate-400">We are the fastest growing business services platform in India.</p>
         </div>
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
            {[
               {l: "Happy Customers", v: "5000+"},
               {l: "Years of Excellence", v: "5+"},
               {l: "Professionals", v: "50+"},
               {l: "Monthly Registrations", v: "200+"}
            ].map((metric, i) => (
               <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center hover:bg-slate-800 transition-colors transform hover:-translate-y-2 duration-300">
                  <div className="text-4xl font-black text-red-600 mb-2">{metric.v}</div>
                  <div className="text-sm font-bold text-slate-300">{metric.l}</div>
               </div>
            ))}
         </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-slate-900 mb-12">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  {n: "Rajesh K.", c: "Tech Startup", t: "ManaCity made the process seamless. Got my company registered in 6 days!"},
                  {n: "Priya S.", c: "E-commerce", t: "Best pricing in the market. No hidden charges and great support team."},
                  {n: "Amit V.", c: "Consultancy", t: "Highly professional service. The dashboard is very easy to use for uploading docs."}
               ].map((test, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                     <div className="flex text-yellow-400 mb-4"><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/></div>
                     <p className="text-slate-600 mb-6 italic">"{test.t}"</p>
                     <div className="font-bold text-slate-900">{test.n}</div>
                     <div className="text-xs text-slate-500">{test.c}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-6 shadow-sm border border-slate-200 cursor-pointer hover:border-red-200 transition-colors" onClick={() => setActiveFaqIndex(activeFaqIndex === i ? null : i)}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900 flex items-start"><HelpCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-1" />{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaqIndex === i ? 'rotate-180 text-red-600' : ''}`} />
                </div>
                {activeFaqIndex === i && <p className="mt-4 text-slate-600 ml-8 animate-fade-in">{faq.a}</p>}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
             <button className="text-red-600 font-bold hover:underline hover:text-red-800 transition-colors">View All 75 Questions</button>
          </div>
        </div>
      </section>
    </div>
  );

  // 4. CHECKOUT PAGE
  const CheckoutPage = () => {
    const gstAmount = selectedPlan.price * 0.18;
    const totalAmount = selectedPlan.price + gstAmount;
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in-up">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 lg:order-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div><div className="font-bold text-slate-900">{selectedPlan.name}</div><div className="text-xs text-slate-500">Pvt Ltd Registration</div></div>
                <div className="font-bold">{formatCurrency(selectedPlan.price)}</div>
              </div>
              <div className="py-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatCurrency(selectedPlan.price)}</span></div>
                <div className="flex justify-between text-sm text-slate-600"><span>GST (18%)</span><span>{formatCurrency(gstAmount)}</span></div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center mb-6"><span className="text-lg font-black text-slate-900">Total</span><span className="text-xl font-black text-red-600">{formatCurrency(totalAmount)}</span></div>
              <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg flex items-center justify-center font-bold"><ShieldCheck className="w-4 h-4 mr-2"/> SSL Secure Payment</div>
            </div>
          </div>
          <div className="lg:col-span-8 lg:order-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-8"><div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mr-4">1</div><h2 className="text-2xl font-bold text-slate-900">Contact Information</h2></div>
              <form onSubmit={(e) => { e.preventDefault(); handlePaymentSuccess(); }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">First Name</label><input required type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" placeholder="John" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label><input required type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" placeholder="Doe" /></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label><input required type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" placeholder="john@company.com" /></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label><input required type="tel" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" placeholder="98765 43210" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Proposed Company Name</label><input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" placeholder="VR Tech Pvt Ltd" /></div>
                </div>
                <div className="pt-8 border-t border-slate-100 mt-8">
                  <div className="flex items-center mb-6"><div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold mr-4">2</div><h2 className="text-2xl font-bold text-slate-900">Payment Method</h2></div>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border border-red-600 bg-red-50 rounded-xl cursor-pointer transition-colors hover:bg-red-100"><input type="radio" name="payment" defaultChecked className="w-5 h-5 text-red-600" /><div className="ml-4 flex-1"><span className="font-bold text-slate-900 block">Credit / Debit Card</span><span className="text-xs text-slate-500">Visa, Mastercard, RuPay</span></div></label>
                    <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors hover:bg-slate-50"><input type="radio" name="payment" className="w-5 h-5 text-red-600" /><div className="ml-4 flex-1"><span className="font-bold text-slate-900 block">UPI / Net Banking</span><span className="text-xs text-slate-500">Google Pay, PhonePe</span></div></label>
                  </div>
                </div>
                <button disabled={isSubmitting} type="submit" className="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/30 mt-6 flex justify-center items-center transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Lock className="w-5 h-5 mr-2" /> Pay {formatCurrency(totalAmount)}</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5. UPLOAD PAGE
  const UploadPage = () => {
    const requiredDocs = [{ id: 'pan', title: 'PAN Card', desc: 'Scan of PAN Card' }, { id: 'aadhar', title: 'Aadhaar Card', desc: 'Address Proof' }, { id: 'photo', title: 'Passport Photo', desc: 'Recent Photo' }, { id: 'bank', title: 'Bank Statement', desc: 'Latest Statement' }];
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between animate-slide-down">
             <div className="flex items-center"><div className="bg-white/20 p-3 rounded-full mr-4"><CheckCircle className="w-8 h-8"/></div><div><h2 className="text-xl font-bold">Payment Successful! Order #VR-9088</h2><p className="text-green-100 opacity-90">Please upload documents below.</p></div></div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100"><h1 className="text-2xl font-bold text-slate-900">Document Upload Portal</h1></div>
            <div className="p-8 grid md:grid-cols-2 gap-6">
              {requiredDocs.map((doc) => (
                <div key={doc.id} className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-red-400 hover:bg-red-50 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300"><FileText className="w-6 h-6"/></div>
                    {uploadedFiles[doc.id] && <div className="text-green-600 font-bold text-xs flex items-center bg-green-50 px-2 py-1 rounded animate-fade-in"><Check className="w-3 h-3 mr-1"/> Uploaded</div>}
                  </div>
                  <h3 className="font-bold text-slate-900">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{doc.desc}</p>
                  {uploadProgress[doc.id] > 0 && uploadProgress[doc.id] < 100 ? (<div className="w-full bg-slate-200 rounded-full h-2 mt-4"><div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress[doc.id]}%` }}></div></div>) : uploadedFiles[doc.id] ? (<div className="flex space-x-2 mt-4"><button className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">View</button><button onClick={() => setUploadedFiles(prev => ({...prev, [doc.id]: false}))} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button></div>) : (<button onClick={() => handleFileUpload(doc.id)} className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition transform hover:-translate-y-0.5"><UploadCloud className="w-4 h-4 mr-2"/> Select File</button>)}
                </div>
              ))}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => navigateTo('success')} disabled={Object.keys(uploadedFiles).length < requiredDocs.length} className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform active:scale-95">Submit Application <ArrowRight className="ml-2 w-5 h-5"/></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuccessPage = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-zoom-in">
      <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg text-center transform transition-all hover:scale-105 duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"><CheckCircle className="w-12 h-12 text-green-600"/></div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Registration Initiated!</h1>
        <p className="text-slate-600 mb-8 text-lg">Our dedicated CA will verify your documents within 2 hours.</p>
        <button onClick={() => {navigateTo('landing'); setSelectedPlan(null); setUploadedFiles({});}} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition transform active:scale-95 shadow-lg">Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-slate-800 bg-white min-h-screen selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      <Header />
      <QuoteModal />
      <FloatingButtons />
      {currentStep === 'landing' && <LandingPage />}
      {currentStep === 'checkout' && <CheckoutPage />}
      {currentStep === 'upload' && <UploadPage />}
      {currentStep === 'success' && <SuccessPage />}
      
      {/* RICH FOOTER SECTION */}
      <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Column 1: Brand & Contact */}
            <div className="lg:col-span-3 space-y-8">
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigateTo('landing')}>
                 <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                   <span className="text-black font-black text-xl">MC</span>
                 </div>
                 <div>
                   <h2 className="text-2xl font-extrabold text-white leading-none group-hover:text-red-500 transition-colors">ManaCity</h2>
                   <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase mt-1">Business Solutions</p>
                 </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                #31, Dwarawati, Subodaya Colony,<br/>
                Kukatpally, Hyderabad - 500072<br/>
                Telangana, India.
              </p>
              <a href="https://goo.gl/maps/placeholder" target="_blank" rel="noreferrer" className="inline-flex items-center text-red-500 hover:text-red-400 text-sm font-bold transition transform hover:translate-x-1">
                Open on Google Maps <ArrowRight className="w-4 h-4 ml-1" />
              </a>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1"><Youtube className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Columns 2-4: Links Grid */}
            <div className="lg:col-span-9 grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Start a Business</h3>
                <ul className="space-y-3 text-sm">
                  {['Private Limited Company', 'Limited Liability Partnership', 'One Person Company', 'Section 8 Company', 'Partnership Firm', 'Proprietorship', 'Nidhi Company', 'Producer Company'].map(item => (
                    <li key={item}><a href="#" className="hover:text-white transition-colors block py-1 transform hover:translate-x-1 duration-200">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Compliance & Tax</h3>
                <ul className="space-y-3 text-sm">
                  {['GST Registration', 'GST Return Filing', 'Income Tax Filing', 'TDS Return Filing', 'Annual Compliance', 'Accounting Services', 'Payroll Management', 'PF & ESIC Registration'].map(item => (
                    <li key={item}><a href="#" className="hover:text-white transition-colors block py-1 transform hover:translate-x-1 duration-200">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">IPR & Special</h3>
                <ul className="space-y-3 text-sm">
                  {['Trademark Registration', 'Copyright Registration', 'ISO Certification', 'MSME / Udyam Reg', 'Startup India Reg', 'Import Export Code', 'GeM Registration', 'FSSAI License'].map(item => (
                    <li key={item}><a href="#" className="hover:text-white transition-colors block py-1 transform hover:translate-x-1 duration-200">{item}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} ManaCity Business Management Solutions. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
