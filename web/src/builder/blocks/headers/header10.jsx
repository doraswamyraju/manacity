import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Star,
  Users,
  Calendar,
  Camera,
  Quote,
  CheckCircle2,
  ChevronRight,
  Globe,
  Award,
  BookOpen,
  Trophy,
  Music,
  Briefcase,
  Download,
  FileText,
  ChevronDown,
  ArrowLeft,
  Newspaper,
  MessageCircle,
  Hand
} from 'lucide-react';

// --- UTILITY COMPONENTS ---

const SmartImage = ({ src, alt, fallback, className }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} flex items-center justify-center bg-slate-800 text-slate-500`}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

// --- DATA CONSTANTS ---

const WINGS = [
  {
    id: 'education',
    title: 'Education Club',
    subtitle: 'For the Blind',
    description: 'Providing scribes, stipends, and accessible exams for visually impaired students. We organize motivation seminars and provide study materials.',
    imgSrc: "2.jpg",
    fallbackIcon: <BookOpen className="w-1/2 h-1/2 text-white" />,
    badgeColor: 'bg-green-600',
    ringColor: 'border-green-400',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    accentColor: 'text-green-600',
    borderColor: 'border-green-600',
    gradient: 'from-green-600 to-green-800',
    activities: [
      'Motivation Seminars for Visually Impaired',
      'Providing Scribes for Exams',
      'Stipends for Students & Sports Players',
      'Study Material Distribution'
    ],
    forms: ['Student Form', 'Scriber Form', 'Volunteer Form', 'Stipend Form', 'Donor Form']
  },
  {
    id: 'cricket',
    title: 'Cricket Club',
    subtitle: 'Sports & Recreation',
    description: 'Organizing tournaments from Zonal to International levels to encourage blind sportsmen. Promoting physical fitness and teamwork.',
    imgSrc: "3.jpg",
    fallbackIcon: <Trophy className="w-1/2 h-1/2 text-white" />,
    badgeColor: 'bg-blue-600',
    ringColor: 'border-blue-400',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    accentColor: 'text-blue-600',
    borderColor: 'border-blue-600',
    gradient: 'from-blue-600 to-blue-800',
    activities: [
      'Club Matches for Blind Players',
      'Zone Level Cricket Tournaments',
      'State Level Championships',
      'National Level Tournaments',
      'International Level Cups'
    ],
    forms: ['Player Form', 'Umpire Form', 'Volunteer Form', 'Stipend Form', 'Donor Form']
  },
  {
    id: 'music',
    title: 'Music Club',
    subtitle: 'For the Blind',
    description: 'Conducting singing competitions at various levels to identify and nurture musical talent among the visually impaired.',
    imgSrc: "4.jpg",
    fallbackIcon: <Music className="w-1/2 h-1/2 text-white" />,
    badgeColor: 'bg-purple-600',
    ringColor: 'border-purple-400',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    accentColor: 'text-purple-600',
    borderColor: 'border-purple-600',
    gradient: 'from-purple-600 to-purple-800',
    activities: [
      'Club Level Singing Competitions',
      'Zone Level Contests',
      'State Level Championships',
      'National Singing Idol',
      'International Level Competitions'
    ],
    forms: ['Member Form', 'Singer Form', 'Judge Form', 'Supporter Form', 'Donor Form']
  },
  {
    id: 'business',
    title: 'Business Club',
    subtitle: 'For the Blind',
    description: 'Supporting visually impaired entrepreneurs through seminars, awareness meetings, and networking opportunities.',
    imgSrc: "5.jpg",
    fallbackIcon: <Briefcase className="w-1/2 h-1/2 text-white" />,
    badgeColor: 'bg-red-600',
    ringColor: 'border-red-400',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
    accentColor: 'text-red-600',
    borderColor: 'border-red-600',
    gradient: 'from-red-600 to-red-800',
    activities: [
      'Seminars for Entrepreneurs',
      'GST Awareness Meetings',
      'Business Networking Events',
      'Financial Guidance'
    ],
    forms: ['Club Member Form', 'Entrepreneur Form', 'Donor Form']
  },
  {
    id: 'awards',
    title: 'Awards',
    subtitle: 'For Unsung Heroes',
    description: 'Honoring exceptional achievements by the differently-abled and unsung heroes with prestigious medals.',
    imgSrc: "6.jpg",
    fallbackIcon: <Award className="w-1/2 h-1/2 text-white" />,
    badgeColor: 'bg-amber-500',
    ringColor: 'border-amber-200',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    accentColor: 'text-amber-600',
    borderColor: 'border-amber-500',
    gradient: 'from-amber-500 to-amber-700',
    activities: [
      'Gatla International Awards (Gold)',
      'Gatla National Awards (Silver)',
      'Gatla State Awards (Bronze)',
      'Gatla Platinum Awards (General)'
    ],
    forms: ['Nomination Form', 'Sponsor Form']
  }
];

const AWARD_DETAILS = [
  { level: "International", medal: "Gatla Gold Medal", categories: ["Blind", "Deaf & Dumb", "Physically Handicapped", "Wheelchair"], color: "from-yellow-400 to-yellow-600" },
  { level: "National", medal: "Gatla Silver Medal", categories: ["Blind", "Deaf & Dumb", "Physically Handicapped", "Wheelchair"], color: "from-slate-300 to-slate-400" },
  { level: "State", medal: "Gatla Bronze Medal", categories: ["Blind", "Deaf & Dumb", "Physically Handicapped", "Wheelchair"], color: "from-amber-700 to-amber-800" },
  { level: "Platinum", medal: "Unsung Heroes", categories: ["Normal People with Great Achievements"], color: "from-slate-200 to-white" },
];

const NEWS = [
  { date: "Oct 15, 2023", title: "National Blind Cricket Finals", category: "Cricket", summary: "State level champions proceed to the nationals in Delhi." },
  { date: "Sep 28, 2023", title: "GST Awareness Seminar", category: "Business", summary: "Helping blind entrepreneurs understand new tax regulations." },
  { date: "Aug 10, 2023", title: "International Singing Contest", category: "Music", summary: "Auditions open for the Gatla International Singing Competition." }
];

const STATS = [
  { label: "Lives Impacted", value: "35k+", icon: <Users className="w-5 h-5 md:w-6 md:h-6" /> },
  { label: "Events", value: "120+", icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" /> },
  { label: "Awards", value: "221+", icon: <Award className="w-5 h-5 md:w-6 md:h-6" /> },
  { label: "World Records", value: "33+", icon: <Globe className="w-5 h-5 md:w-6 md:h-6" /> }
];

// --- COMPONENTS ---

const FoundationLogo = ({ className = "w-16 h-16" }) => {
  const SvgFallback = (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0B1120" stroke="#FBBF24" strokeWidth="2" />
      <path d="M 35,35 L 65,35 L 65,55 C 65,70 50,80 50,80 C 50,80 35,70 35,55 Z" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
      <text x="50" y="62" fontSize="6" fill="#FBBF24" textAnchor="middle" fontWeight="bold">GATLA</text>
    </svg>
  );
  return <SmartImage src="1.jpg" alt="Gatla Foundation Logo" fallback={SvgFallback} className={className} />;
};

// Form Popup Modal
const FormModal = ({ isOpen, onClose, formTitle, wingColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className={`${wingColor} p-6 flex justify-between items-center text-white`}>
          <h3 className="text-xl font-bold font-serif">{formTitle}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none" style={{ borderColor: 'inherit' }} placeholder="Enter full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
              <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aadhar Number</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="XXXX XXXX XXXX" />
            </div>
            {/* Specific fields can be conditional based on formTitle, kept generic for now */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none" rows="3" placeholder="Enter full address"></textarea>
            </div>
            
            <div className="pt-2">
               <label className="block text-sm font-medium text-slate-700 mb-2">Upload Photo / ID</label>
               <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs text-slate-500">Click to upload</span>
               </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition">Cancel</button>
          <button className={`px-6 py-2 text-sm font-bold text-white rounded-lg shadow-lg hover:opacity-90 transition ${wingColor}`}>Submit Application</button>
        </div>
      </div>
    </div>
  );
};

// Main Navbar
const Navbar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Grouping links for better UX
  const mainLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
  ];

  const eventLinks = [
    { name: 'Events', id: 'events' }, // Past/General events
    { name: 'Upcoming Events', id: 'upcoming' },
    { name: 'Awards', id: 'awards' },
  ];

  const mediaLinks = [
    { name: 'Gallery', id: 'gallery' },
    { name: 'Press Clips', id: 'press' },
    { name: 'Blog', id: 'blog' },
  ];

  const actionLinks = [
    { name: 'Donate', id: 'donate', special: true },
    { name: 'Volunteer', id: 'volunteer', special: true },
    { name: 'Contact Us', id: 'contact' },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-[#0B1120] border-b border-amber-500/20 sticky top-0 z-50 backdrop-blur-xl bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24">
          
          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer flex-shrink-0" onClick={() => handleNavClick('home')}>
             <FoundationLogo className="w-12 h-12 md:w-16 md:h-16 animate-fade-in" />
             <div className="hidden lg:block">
               <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide leading-none">
                 GATLA <span className="text-amber-400">FOUNDATION</span>
               </h1>
               <p className="text-[9px] md:text-[10px] text-amber-200/60 tracking-[0.3em] uppercase mt-1">Excellence in Service • Tirupati</p>
             </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-8">
            {/* Main Links */}
            <div className="flex gap-6">
              {mainLinks.map((link) => (
                <button 
                  key={link.id} 
                  onClick={() => handleNavClick(link.id)}
                  className="text-xs uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>

            {/* Events Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-xs uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors font-medium">
                Happenings <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              <div className="absolute top-full left-0 w-48 bg-[#0F172A] border border-slate-700 shadow-xl rounded-b-lg overflow-hidden hidden group-hover:block pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {eventLinks.map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="block w-full text-left px-4 py-3 text-xs uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-xs uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors font-medium">
                Media <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              <div className="absolute top-full left-0 w-48 bg-[#0F172A] border border-slate-700 shadow-xl rounded-b-lg overflow-hidden hidden group-hover:block pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {mediaLinks.map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="block w-full text-left px-4 py-3 text-xs uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 items-center border-l border-slate-700 pl-6 ml-2">
              <button onClick={() => handleNavClick('contact')} className="text-xs uppercase tracking-widest text-slate-300 hover:text-white transition-colors">
                Contact
              </button>
              <button onClick={() => handleNavClick('volunteer')} className="px-4 py-2 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-all uppercase tracking-widest text-[10px] font-bold rounded-sm">
                Volunteer
              </button>
              <button onClick={() => handleNavClick('donate')} className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0B1120] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all uppercase tracking-widest text-[10px] font-bold rounded-sm shadow-lg">
                Donate
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center xl:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-amber-400 hover:bg-slate-800 rounded-md">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-[#0B1120] border-b border-amber-500/20 absolute w-full left-0 top-20 shadow-2xl overflow-y-auto max-h-[80vh]">
          <div className="p-4 space-y-1">
            {[...mainLinks, ...eventLinks, ...mediaLinks, ...actionLinks].map((link) => (
              <button 
                key={link.id} 
                onClick={() => handleNavClick(link.id)} 
                className={`block w-full text-left px-4 py-3 border-l-2 transition-all ${
                  link.special 
                    ? 'bg-slate-800 border-amber-500 text-amber-400 font-bold mt-2' 
                    : 'text-slate-300 border-transparent hover:border-amber-400 hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- PAGE SECTIONS ---

const Hero = ({ onNavigate }) => (
  <div id="home" className="relative bg-[#050914] min-h-[90vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-gradient-to-l from-[#0B1120] via-[#0B1120]/90 to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-[#050914] to-[#050914]"></div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="text-left space-y-6">
          <div className="inline-flex items-center space-x-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-amber-200 text-[10px] font-semibold tracking-widest uppercase">Official NGO Website</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1]">
            Vision Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Sight</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-lg leading-relaxed border-l-2 border-amber-500/30 pl-4">
            The Gatla Foundation represents the pinnacle of service, orchestrating a brighter future for the visually impaired through five pillars of excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button onClick={() => onNavigate('volunteer')} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0B1120] font-bold text-xs uppercase tracking-widest hover:from-amber-400 hover:to-amber-500 transition shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Join The Mission
            </button>
            <button onClick={() => onNavigate('about')} className="px-8 py-3 bg-transparent border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest hover:border-amber-500/50 hover:text-white transition">
              View Heritage
            </button>
          </div>
        </div>
        <div className="relative mt-8 md:mt-0 flex justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-blue-900/10 rounded-full animate-pulse border border-white/5"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-[#0F172A] rounded-full border-4 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex items-center justify-center z-10 relative overflow-hidden">
                  <FoundationLogo className="w-24 h-24 md:w-36 md:h-36" />
                </div>
            </div>
            <div className="hidden sm:block">
              {WINGS.map((wing, i) => (
                  <div key={i} className={`absolute w-10 h-10 ${wing.badgeColor} rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg`} 
                      style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${i * 72}deg) translate(130px) rotate(-${i * 72}deg)` }}>
                    <div className="scale-75 text-white">
                        <SmartImage src={wing.imgSrc} alt={wing.title} fallback={wing.fallbackIcon} className="w-full h-full object-contain" />
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WingCard = ({ wing, onClick }) => (
  <div onClick={onClick} className={`group relative bg-[#0F172A] border border-slate-800 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full cursor-pointer`}>
    <div className={`h-1 w-full ${wing.badgeColor}`}></div>
    <div className="p-6 md:p-8 flex flex-col flex-grow items-center text-center">
      <div className={`w-16 h-16 rounded-full ${wing.badgeColor} border-4 ${wing.ringColor} shadow-lg flex items-center justify-center mb-6 overflow-hidden p-3 group-hover:scale-110 transition-transform`}>
         <SmartImage src={wing.imgSrc} alt={wing.title} fallback={wing.fallbackIcon} className="w-full h-full object-contain" />
      </div>
      <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{wing.title}</h3>
      <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-4">{wing.subtitle}</p>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{wing.description}</p>
      
      <div className="mt-auto inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white border-b border-transparent hover:border-amber-500 pb-1">
        Visit Page <ArrowRight className="w-3 h-3 ml-2 text-amber-500" />
      </div>
    </div>
  </div>
);

// --- DEDICATED WING PAGE COMPONENT ---
const DedicatedWingPage = ({ wingId, onBack }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState("");
  
  const wing = WINGS.find(w => w.id === wingId);
  if (!wing) return null;

  const openForm = (formName) => {
    setSelectedForm(formName);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050914] text-slate-200 animate-in slide-in-from-right duration-300">
      <FormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        formTitle={selectedForm} 
        wingColor={wing.badgeColor} 
      />

      {/* Header */}
      <div className={`relative h-64 md:h-80 w-full overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${wing.gradient} opacity-90`}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <button onClick={onBack} className="absolute top-8 left-4 md:left-8 flex items-center text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest transition">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </button>
          
          <div className="flex items-center gap-6 mt-4">
            <div className={`w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-1 shadow-2xl`}>
               <div className={`w-full h-full rounded-full ${wing.badgeColor} flex items-center justify-center p-4`}>
                  <SmartImage src={wing.imgSrc} fallback={wing.fallbackIcon} className="w-full h-full object-contain" />
               </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{wing.title}</h1>
              <p className="text-white/80 text-sm md:text-base font-medium tracking-wide uppercase">{wing.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Left Column: Info & Activities */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className={`text-xl font-bold uppercase tracking-widest mb-6 ${wing.accentColor} border-b ${wing.borderColor} pb-2 inline-block`}>About The Wing</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                {wing.description} The {wing.title} is dedicated to empowering the visually impaired community through structured programs, events, and support systems. Our goal is to ensure equal opportunities and recognition.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold uppercase tracking-widest mb-6 ${wing.accentColor} border-b ${wing.borderColor} pb-2 inline-block`}>Key Activities</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {wing.activities.map((activity, idx) => (
                  <div key={idx} className="bg-[#0B1120] p-4 rounded-lg border border-slate-800 flex items-start">
                    <CheckCircle2 className={`w-5 h-5 mr-3 mt-0.5 ${wing.accentColor}`} />
                    <span className="text-slate-300 font-medium">{activity}</span>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Gallery Placeholder for Wing */}
            <section>
               <h2 className={`text-xl font-bold uppercase tracking-widest mb-6 ${wing.accentColor} border-b ${wing.borderColor} pb-2 inline-block`}>Gallery</h2>
               <div className="grid grid-cols-4 gap-2 h-32">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-slate-800 rounded-lg flex items-center justify-center text-slate-600">
                       <Camera className="w-6 h-6" />
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Right Column: Forms & Actions */}
          <div className="md:col-span-1">
            <div className="bg-[#0F172A] rounded-2xl p-6 border border-slate-800 sticky top-24">
              <h3 className="text-xl font-serif font-bold text-white mb-6">Registration & Forms</h3>
              <p className="text-sm text-slate-400 mb-6">Select a form below to apply. All applications are reviewed by our committee.</p>
              
              <div className="space-y-3">
                {wing.forms.map((form, idx) => (
                  <button 
                    key={idx}
                    onClick={() => openForm(form)}
                    className={`w-full flex items-center justify-between p-4 bg-[#0B1120] rounded-lg border border-slate-700 hover:border-current transition group text-left ${wing.accentColor}`}
                  >
                    <span className="font-bold text-sm text-slate-200 group-hover:text-white">{form}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className={`mt-8 p-4 rounded-xl ${wing.badgeColor} bg-opacity-10 border ${wing.borderColor} border-opacity-30`}>
                <h4 className="text-white font-bold text-sm mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> Need Help?
                </h4>
                <p className="text-xs text-white/70">
                  Contact our support team for assistance with filling out forms. <br/>
                  <span className="font-bold block mt-1">+91 98765 43210</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- HOME PAGE SECTIONS ---

const ProjectsSection = ({ onSelectWing }) => (
  <section id="projects" className="py-20 bg-[#050914] relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">Our Projects</h2>
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">The Five Pillars</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WINGS.map((wing) => (
          <WingCard key={wing.id} wing={wing} onClick={() => onSelectWing(wing.id)} />
        ))}
        {/* Patron Card - Generic */}
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-1 rounded-none flex flex-col h-full hover:-translate-y-2 transition-transform cursor-pointer">
           <div className="h-full bg-[#0B1120] p-8 flex flex-col items-center text-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">Become a Patron</h3>
              <p className="text-slate-300 text-xs mb-6">Join the elite circle of donors supporting this noble cause.</p>
              <button className="px-6 py-3 bg-white text-[#0B1120] text-xs font-bold uppercase tracking-widest hover:bg-amber-50 transition">Donate Now</button>
           </div>
        </div>
      </div>
    </div>
  </section>
);

const ImpactSection = () => (
  <section className="bg-amber-500 py-12 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-600/30 rounded-full mb-3 text-[#0B1120]">{stat.icon}</div>
            <h4 className="text-3xl font-serif font-bold text-[#0B1120] mb-1">{stat.value}</h4>
            <p className="text-[#0B1120] font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FounderSection = () => (
  <section id="founder" className="py-24 bg-[#050914] relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-4 relative group">
          <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-[#0F172A] p-2 border border-amber-500/30">
            <SmartImage 
              src="WhatsApp Image 2025-12-01 at 11.49.39_312413d0.jpg" 
              alt="H.E. Hon. Dr. Gatla Srinivasa Reddy" 
              fallback={<Users className="w-full h-full text-slate-600 p-12" />} 
              className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
            />
            <div className="bg-[#0B1120] p-6 text-center mt-2 border-t border-amber-500/20">
              <h3 className="text-xl font-serif font-bold text-white">H.E. Hon. Dr. Gatla Srinivasa Reddy</h3>
              <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mt-2">Founder & President</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8">
          <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Leadership Profile</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8 leading-tight">
            "Education is More Important <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Than Money</span>"
          </h3>
          
          <div className="space-y-6 text-slate-400 text-sm md:text-base leading-relaxed text-justify">
            <p className="border-l-4 border-amber-500 pl-4 italic text-slate-300">
              "An ordinary steel shop store keeper who helped more than 35,000 blind persons through his education and has now become a Doctorate and World Record Holder."
            </p>
            <p>
              Born on May 31, 1981, in the Palnadu area of Guntur District, Andhra Pradesh, Dr. Reddy came from a humble agricultural family. Despite dropping out after the 10th grade to work as a store keeper for a mere ₹500 monthly salary, he returned to education in 1999, driven by the hardships he witnessed among the disabled and poor.
            </p>
            <p>
              His journey into social service began in 2001 when he observed the severe lack of resources for blind students—no Braille books and no scribes. He voluntarily stepped in to scribe for a student, Mr. Thulasi Ram, marking the beginning of a lifelong mission. Since then, he has rendered voluntary service to over 35,000 blind individuals, orphans, and elderly people across India.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#0B1120] p-5 border border-slate-800 rounded-lg hover:border-amber-500/30 transition">
                <Globe className="w-6 h-6 text-amber-500 mb-3" />
                <h4 className="text-white font-bold mb-2">Global Recognition</h4>
                <p className="text-xs text-slate-500">Achieved 33 World Records and received an Honorary Doctorate from the Royal Academy of Global Peace, USA (2019).</p>
              </div>
              <div className="bg-[#0B1120] p-5 border border-slate-800 rounded-lg hover:border-amber-500/30 transition">
                <Trophy className="w-6 h-6 text-amber-500 mb-3" />
                <h4 className="text-white font-bold mb-2">Sports Visionary</h4>
                <p className="text-xs text-slate-500">Mentored over 500 blind cricketers, including Mr. Ajay Kumar Reddy, Captain of the Indian Blind Cricket Team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="py-20 bg-[#0B1120] relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/2 flex justify-center">
           <div className="relative w-64 h-80 bg-[#0F172A] border border-slate-700 flex flex-col items-center justify-center p-8 text-center shadow-2xl">
              <FoundationLogo className="w-20 h-20 mb-6" />
              <h4 className="text-xl font-serif text-white mb-2">Our Philosophy</h4>
              <p className="text-slate-400 italic text-sm">"We don't just help; we elevate."</p>
           </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">About The Foundation</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Empowerment through Excellence.</h3>
          <p className="text-slate-400 text-sm md:text-base mb-6 leading-relaxed">
            The <strong className="text-white">Gatla Foundation</strong> was established in Tirupati to provide platform where the visually impaired can access opportunities usually reserved for the privileged.
          </p>
          <div className="grid grid-cols-2 gap-4">
             {['Skill Development', 'Financial Inclusion', 'Social Dignity', 'Global Exposure'].map((item, i) => (
               <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" /> {item}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const UpcomingEventsSection = () => (
  <section id="upcoming" className="py-20 bg-[#080d1a] relative border-t border-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">Calendar</h2>
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">Upcoming Events</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {NEWS.map((item, idx) => (
          <div key={idx} className="bg-[#0B1120] border border-slate-800 p-6 hover:border-amber-500/30 transition group rounded-lg">
            <div className="flex items-center justify-between mb-4">
               <span className="text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded">{item.category}</span>
               <span className="text-slate-500 text-xs font-medium flex items-center"><Calendar className="w-3 h-3 mr-1" /> {item.date}</span>
            </div>
            <h4 className="text-white font-serif font-bold text-lg mb-3 group-hover:text-amber-400 transition">{item.title}</h4>
            <p className="text-slate-400 text-sm mb-4">{item.summary}</p>
            <button className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white flex items-center transition-colors">
               Details <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PressClipsSection = () => (
  <section id="press" className="py-20 bg-[#050914] relative border-t border-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">In The News</h2>
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">Press Clips</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-slate-800 rounded-lg flex items-center justify-center relative group overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all">
               <Newspaper className="w-8 h-8 text-slate-600 group-hover:text-amber-500 transition-colors" />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-3 py-1 rounded">View Article</span>
               </div>
            </div>
         ))}
      </div>
    </div>
  </section>
);

// Footer
const Footer = ({ onNavigate }) => (
  <footer id="contact" className="bg-[#02040a] text-slate-400 py-16 border-t border-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 text-sm">
         <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
               <FoundationLogo className="w-10 h-10" />
               <div>
                  <h4 className="text-white font-serif text-lg tracking-wide">GATLA FOUNDATION</h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-600">Established 2005</p>
               </div>
            </div>
            <p className="max-w-xs text-slate-500 mb-6">Empowering the visually impaired through education, sports, music, and entrepreneurship.</p>
            <div className="flex gap-4">
               {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(social => (
                  <a key={social} href="#" className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-[#0B1120] transition-colors">
                     <span className="sr-only">{social}</span>
                     <Globe className="w-4 h-4" />
                  </a>
               ))}
            </div>
         </div>
         
         <div>
            <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h5>
            <div className="space-y-3 flex flex-col items-start">
               <button onClick={() => onNavigate('blog')} className="hover:text-amber-500 transition-colors">Blog</button>
               <button onClick={() => onNavigate('gallery')} className="hover:text-amber-500 transition-colors">Gallery</button>
               <button onClick={() => onNavigate('awards')} className="hover:text-amber-500 transition-colors">Awards</button>
               <button onClick={() => onNavigate('volunteer')} className="hover:text-amber-500 transition-colors">Volunteer</button>
            </div>
         </div>
         
         <div>
            <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Contact</h5>
            <div className="space-y-3">
               <div className="flex gap-3"><Phone className="w-4 h-4 text-amber-500" /> <span>+91 98765 43210</span></div>
               <div className="flex gap-3"><Mail className="w-4 h-4 text-amber-500" /> <span>contact@gatlafoundation.org</span></div>
               <div className="flex gap-3"><MapPin className="w-4 h-4 text-amber-500 shrink-0" /> <span>12-5-44/A, Royal Avenue<br/>Tirupati, Andhra Pradesh<br/>India - 517501</span></div>
            </div>
         </div>
      </div>
      <div className="mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-700 uppercase tracking-widest flex flex-col md:flex-row justify-between items-center">
         <span>&copy; {new Date().getFullYear()} Gatla Foundation. All Rights Reserved.</span>
         <span className="mt-2 md:mt-0">Designed for a Cause.</span>
      </div>
    </div>
  </footer>
);

// Main Content
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedWingId, setSelectedWingId] = useState(null);

  // Handle navigation
  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSelectWing = (id) => {
    setSelectedWingId(id);
    setCurrentPage('wing');
    window.scrollTo(0, 0);
  };

  // Render view
  if (currentPage === 'wing' && selectedWingId) {
    return <DedicatedWingPage wingId={selectedWingId} onBack={() => handleNavigate('home')} />;
  }

  // Generic Placeholder Page for items like Blog/Gallery if they don't have full sections yet
  if (['blog', 'gallery', 'awards'].includes(currentPage)) {
     // For simplicity in this demo, directing relevant sections. 
     // Ideally these would be their own components.
     // Awards is a section on Home, so we might want to just scroll there if it's on the main page,
     // but since we are doing conditional rendering, let's keep it simple for now or redirect to home with hash.
  }

  return (
    <div className="min-h-screen bg-[#050914] font-sans text-slate-200">
      <Navbar onNavigate={handleNavigate} />
      
      {currentPage === 'home' && (
        <>
          <Hero onNavigate={handleNavigate} />
          <ImpactSection />
          <AboutSection />
          <ProjectsSection onSelectWing={handleSelectWing} />
          <UpcomingEventsSection />
          <PressClipsSection />
          <FounderSection />
        </>
      )}

      {/* Simple View for Pages that are just sections in this single-page app context */}
      {currentPage === 'about' && (
         <div className="pt-10">
            <AboutSection />
            <FounderSection />
         </div>
      )}

      {currentPage === 'projects' && (
         <div className="pt-20">
            <ProjectsSection onSelectWing={handleSelectWing} />
         </div>
      )}

      {currentPage === 'events' && (
         <div className="pt-20">
            <UpcomingEventsSection />
            {/* Could add past events here */}
         </div>
      )}
      
      {currentPage === 'upcoming' && (
         <div className="pt-20">
            <UpcomingEventsSection />
         </div>
      )}

      {currentPage === 'press' && (
         <div className="pt-20">
            <PressClipsSection />
         </div>
      )}

      {/* Volunteer / Donate / Contact typically scroll to footer or open modal */}
      {/* For this demo, they just render the main layout or specific sections if needed */}
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;