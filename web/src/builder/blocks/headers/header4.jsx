import React, { useState, useEffect } from 'react';
import { 
  Factory, Stamp, Calculator, Briefcase, Globe, IndianRupee, Lightbulb, MoreHorizontal, 
  Phone, Menu, X, ChevronDown, Clock, Award, Search, ArrowRight, CheckCircle2, 
  Building2, Mail, MapPin, CheckCircle, FileText, Star, Users, Check, HelpCircle, 
  MessageSquare, Zap, ShieldCheck, TrendingUp, Anchor, Truck, Hammer, FileCheck,
  ChevronRight, Download, PlayCircle, Loader2
} from 'lucide-react';

/* --- SHARED DATA --- */
/* Storing components instead of JSX elements to avoid rendering issues */
const SERVICES_DATA = [
  {
    id: 'machinery',
    title: 'Machinery & Industrial',
    icon: Factory,
    items: ['Machinery Sourcing', 'Vendor Verification', 'Turnkey Factory Setup', 'Technology Upgradation']
  },
  {
    id: 'iso',
    title: 'Certification & ISO',
    icon: Stamp,
    items: ['ISO 9001, 14001, 45001', 'ISO 27001 (Info Sec)', 'CE Marking & FDA', 'GMP / HACCP / Halal']
  },
  {
    id: 'accounting',
    title: 'Accounting & Tax',
    icon: Calculator,
    items: ['Cloud Accounting', 'GST Reg & Returns', 'Income Tax Filing', 'Statutory & Tax Audits']
  },
  {
    id: 'registration',
    title: 'Business Registration',
    icon: Briefcase,
    items: ['Pvt Ltd / LLP / OPC', 'Section 8 (NGO)', 'Start-up India Reg', 'FSSAI & Trade License']
  },
  {
    id: 'govt',
    title: 'Govt. Portals',
    icon: Globe,
    items: ['GeM Seller/OEM Reg', 'GeM Product Listing', 'TReDS', 'RERA Registration']
  },
  {
    id: 'msme',
    title: 'Ind. & MSME Loans',
    icon: IndianRupee,
    items: ['Project Reports (DPR)', 'Term Loans', 'CGTMSE & PMEGP', 'Subsidy Guidance']
  },
  {
    id: 'branding',
    title: 'Branding & Startup',
    icon: Lightbulb,
    items: ['Business Plans', 'Website & Branding', 'Vendor Empanelment', 'HR Policy & SOPs']
  },
  {
    id: 'utility',
    title: 'Utility Services',
    icon: MoreHorizontal,
    items: ['Trademark & IP', 'PAN / TAN Apps', 'Digital Marketing', 'Digital Signatures']
  }
];

const LIFECYCLE_STAGES = [
  {
    id: 'start',
    label: 'Start Business',
    icon: Zap,
    desc: 'Turn your idea into a legal entity.',
    services: ['Pvt Ltd Registration', 'Trademark Filing', 'Branding & Website', 'Startup India Reg']
  },
  {
    id: 'run',
    label: 'Run & Manage',
    icon: FileCheck,
    desc: 'Keep your operations compliant and efficient.',
    services: ['GST & Tax Filing', 'Accounting Outsourcing', 'HR & Payroll', 'Annual Compliance']
  },
  {
    id: 'grow',
    label: 'Grow & Expand',
    icon: TrendingUp,
    desc: 'Scale up with funding and government tenders.',
    services: ['MSME Loans (Mudra/CGTMSE)', 'GeM Registration', 'ISO Certification', 'Project Reports (DPR)']
  },
  {
    id: 'industrial',
    label: 'Industrial Setup',
    icon: Factory,
    desc: 'Establish your manufacturing unit.',
    services: ['Machinery Sourcing', 'Factory Licenses', 'Turnkey Setup', 'Import/Export Code']
  }
];

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
  // --- STATE ---
  const [activeStage, setActiveStage] = useState('start');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('landing');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if(isServicesHovered) setIsServicesHovered(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
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
        }, 800);
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

  const Header = () => (
    <>
      <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 hidden lg:block border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
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
                        <div className="grid grid-cols-4 gap-6">
                          {SERVICES_DATA.map((service) => (
                            <div key={service.id} className="group/item cursor-pointer" onClick={() => navigateTo('landing', 'pricing')}>
                              <div className="flex items-center space-x-3 mb-3 group-hover/item:translate-x-1 transition-transform duration-300">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover/item:bg-red-600 group-hover/item:text-white transition-colors duration-300 shadow-sm">
                                    {/* Render the component */}
                                    <service.icon className="w-6 h-6" />
                                </div>
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
                      <div className={`p-1.5 rounded-lg ${activeMobileCategory === service.id ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <service.icon className="w-5 h-5" />
                      </div>
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

  // Quote Modal
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

  // Floating Buttons
  const FloatingButtons = () => (
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <a href="https://wa.me/918008530606" target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat on WhatsApp</span>
          </a>
          <a href="tel:+918008530606" className="bg-black hover:bg-slate-800 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative">
              <Phone className="w-6 h-6" />
              <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Call Expert</span>
          </a>
      </div>
  );

  // Preloader
  if (loading && currentStep === 'landing' && !selectedPlan) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 animate-bounce">
          <span className="text-white font-black text-3xl">MC</span>
        </div>
        <div className="flex items-center space-x-2 text-sm font-bold tracking-widest text-slate-400">
          LOADING EXPERIENCE...
        </div>
      </div>
    );
  }

  // Checkout Components
  const CheckoutPage = () => {
    const gstAmount = selectedPlan ? selectedPlan.price * 0.18 : 0;
    const totalAmount = selectedPlan ? selectedPlan.price + gstAmount : 0;
    if (!selectedPlan) return null;

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
      
      {currentStep === 'landing' && (
        <div className="animate-fade-in">
          {/* 1. HERO SECTION */}
          <div className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 bg-slate-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50 skew-x-12 opacity-50 z-0 translate-x-1/3"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center max-w-4xl mx-auto mb-12">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-600 mb-8 animate-fade-in-up">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  India's Most Comprehensive Business Partner
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 animate-fade-in-up delay-100">
                  From Incorporation to <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Industrial Setup.</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-10 animate-fade-in-up delay-200 max-w-2xl mx-auto">
                  We don't just register companies. We help you source machinery, secure government loans, get ISO certified, and manage compliance.
                </p>
                
                {/* Interactive Search Bar */}
                <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col sm:flex-row items-center animate-fade-in-up delay-300 transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex-1 w-full px-4 py-3 flex items-center border-b sm:border-b-0 sm:border-r border-slate-100">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input type="text" placeholder="I want to..." className="w-full outline-none text-slate-700 font-medium placeholder:text-slate-400" />
                  </div>
                  <div className="px-2 py-2 w-full sm:w-auto">
                    <button className="w-full bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center">
                      Get Started <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-400 animate-fade-in-up delay-300">
                  Popular: <span className="underline decoration-dotted hover:text-red-600 cursor-pointer mx-1">Pvt Ltd Reg</span>, <span className="underline decoration-dotted hover:text-red-600 cursor-pointer mx-1">GeM Portal</span>, <span className="underline decoration-dotted hover:text-red-600 cursor-pointer mx-1">Machinery Loans</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. BUSINESS LIFECYCLE TABS */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900 mb-4">A Partner for Every Stage</h2>
                <p className="text-lg text-slate-600">Select your current business stage to see how we can help.</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {LIFECYCLE_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`px-8 py-4 rounded-2xl font-bold flex items-center transition-all duration-300 transform ${activeStage === stage.id ? 'bg-black text-white scale-105 shadow-xl' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className={`mr-3 ${activeStage === stage.id ? 'text-red-500' : 'text-slate-400'}`}>
                        <stage.icon className="w-5 h-5" />
                    </span>
                    {stage.label}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100 relative overflow-hidden transition-all duration-500">
                {LIFECYCLE_STAGES.map((stage) => (
                  stage.id === activeStage && (
                    <div key={stage.id} className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
                      <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold mb-4 uppercase tracking-wider">
                          {stage.label} Phase
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">{stage.desc}</h3>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                          At this stage, efficiency is key. ManaCity provides a dedicated suite of services tailored to {stage.label.toLowerCase()} needs, ensuring you don't waste time on bureaucracy.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {stage.services.map((srv, i) => (
                            <div key={i} className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-red-200 transition group cursor-pointer">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                              <span className="font-bold text-slate-800">{srv}</span>
                            </div>
                          ))}
                        </div>
                        <button className="mt-8 flex items-center font-bold text-red-600 hover:text-red-700 hover:underline">
                          Explore all {stage.label} Services <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative h-full min-h-[300px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-red-50 opacity-50"></div>
                        <div className="relative z-10 text-center">
                           <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                             <stage.icon className="w-10 h-10 text-red-600" />
                           </div>
                           <h4 className="font-black text-2xl text-slate-900 mb-2">ManaCity Ecosystem</h4>
                           <p className="text-sm text-slate-500">Integrated solutions for seamless growth</p>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </section>

          {/* 3. INDUSTRIAL SPOTLIGHT */}
          <section className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="flex items-center space-x-2 text-red-500 font-bold mb-4 uppercase tracking-widest text-xs">
                    <Factory className="w-4 h-4" />
                    <span>Industrial Solutions</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">Planning a Factory? <br/>We Build It With You.</h2>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    Most consultants stop at paperwork. We go further. From global machinery sourcing to turnkey factory setup and licensing, we are your industrial partners.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mr-6 border border-slate-700 hover:border-red-600 transition-colors">
                        <Anchor className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">Global Machinery Sourcing</h4>
                        <p className="text-sm text-slate-400">We import high-grade machinery from China, Korea, Taiwan & Europe with full customs support.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mr-6 border border-slate-700 hover:border-red-600 transition-colors">
                        <Hammer className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">Turnkey Setup</h4>
                        <p className="text-sm text-slate-400">Vendor identification, feasibility analysis, and on-ground setup assistance.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <button className="bg-red-600 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-600/20">Talk to Industrial Expert</button>
                    <button className="border border-slate-700 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-slate-800 transition">View Projects</button>
                  </div>
                </div>

                <div className="relative">
                   <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative z-10 bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 max-w-xs text-center transform group-hover:scale-105 transition-transform duration-300">
                         <Factory className="w-12 h-12 text-red-600 mx-auto mb-4" />
                         <h3 className="text-xl font-bold mb-2">Factory Licensing</h3>
                         <p className="text-xs text-slate-400">Pollution Control Board (PCB) NOC, Fire Safety, and Labour Department Approvals handled efficiently.</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. GOVT & FUNDING HUB */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12">
                 <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-10 relative overflow-hidden group">
                    <div className="relative z-10">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-6 text-orange-600"><Globe className="w-6 h-6"/></div>
                       <h3 className="text-3xl font-black text-slate-900 mb-4">Unlock Govt Tenders</h3>
                       <p className="text-slate-700 mb-8 leading-relaxed">Get your business registered on the <strong>GeM (Government e-Marketplace)</strong> portal. We handle Seller Registration, OEM Panel setup, and Product Listing to help you bid for government contracts.</p>
                       <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center">Start GeM Registration <ChevronRight className="ml-2 w-4 h-4"/></button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-200 rounded-full opacity-50 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                 </div>

                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 relative overflow-hidden group">
                    <div className="relative z-10">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-6 text-blue-600"><IndianRupee className="w-6 h-6"/></div>
                       <h3 className="text-3xl font-black text-slate-900 mb-4">Secure MSME Loans</h3>
                       <p className="text-slate-700 mb-8 leading-relaxed">Need capital? We assist with <strong>Project Reports (DPR)</strong> and CMA Data for Term Loans. Expert guidance on CGTMSE, PMEGP, and Mudra Loan schemes.</p>
                       <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center">Check Eligibility <ChevronRight className="ml-2 w-4 h-4"/></button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-200 rounded-full opacity-50 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                 </div>
              </div>
            </div>
          </section>

          {/* 5. WHY ManaCity? */}
          <section className="py-24 bg-slate-50">
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Why Businesses Choose Us</h2>
                <p className="text-lg text-slate-600">Stop running between 5 different consultants. We do it all.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 opacity-70 hover:opacity-100 transition-opacity">
                    <h3 className="text-xl font-bold text-slate-500 mb-6 flex items-center"><X className="w-6 h-6 mr-2" /> Traditional Consultants</h3>
                    <ul className="space-y-4 text-slate-500">
                       <li className="flex items-start"><span className="mr-3 mt-1 text-xs">❌</span> Only handle Registration paperwork.</li>
                       <li className="flex items-start"><span className="mr-3 mt-1 text-xs">❌</span> No support for Loans or Industrial setup.</li>
                       <li className="flex items-start"><span className="mr-3 mt-1 text-xs">❌</span> Manual process, requires office visits.</li>
                       <li className="flex items-start"><span className="mr-3 mt-1 text-xs">❌</span> Hidden charges for every small add-on.</li>
                    </ul>
                 </div>

                 <div className="bg-white p-8 rounded-2xl border-2 border-red-600 shadow-xl relative overflow-hidden transform md:scale-105">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">THE SMART WAY</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><CheckCircle2 className="w-6 h-6 text-green-500 mr-2" /> ManaCity Advantage</h3>
                    <ul className="space-y-4 text-slate-800 font-medium">
                       <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> End-to-End: Reg + Loans + Factory Setup.</li>
                       <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Single Point of Contact for everything.</li>
                       <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> 100% Digital Dashboard for documents.</li>
                       <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Transparent Pricing Packages.</li>
                    </ul>
                 </div>
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
      )}

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
                {/* Replaced imported Social Icons with inline SVGs to prevent crash */}
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition transform hover:scale-110 hover:-translate-y-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            {/* Columns 2-4: Links Grid */}
            <div className="lg:col-span-9 grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Start a Business</h3>
                <ul className="space-y-3 text-sm">
                  {['Private Limited Company', 'Limited Liability Partnership', 'One Person Company', 'Section 8 Company', 'Partnership Firm'].map(item => (
                    <li key={item}><a href="#" className="hover:text-white transition-colors block py-1 transform hover:translate-x-1 duration-200">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Grow & Manage</h3>
                <ul className="space-y-3 text-sm">
                  {['GST Filing', 'Accounting Services', 'MSME Loans', 'GeM Registration', 'ISO Certification'].map(item => (
                    <li key={item}><a href="#" className="hover:text-white transition-colors block py-1 transform hover:translate-x-1 duration-200">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Industrial</h3>
                <ul className="space-y-3 text-sm">
                  {['Machinery Sourcing', 'Factory License', 'Pollution Control NOC', 'Turnkey Setup', 'Import Export Code'].map(item => (
                    <li key={item}><a href="#" className="hover:text-white transition-colors block py-1">{item}</a></li>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
