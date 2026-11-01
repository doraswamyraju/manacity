import React, { useState } from 'react';
import { 
  BookOpen, 
  Music, 
  Briefcase, 
  Award, 
  Trophy, 
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
  Globe
} from 'lucide-react';

// --- DATA CONSTANTS ---

const WINGS = [
  {
    id: 'education',
    title: 'Education Club',
    subtitle: 'For the Blind',
    description: 'Empowering visually impaired students through world-class accessible learning resources.',
    icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    accentColor: 'border-green-500',
    glowColor: 'group-hover:shadow-green-900/50',
    badgeColor: 'bg-green-600',
    ringColor: 'border-green-400'
  },
  {
    id: 'cricket',
    title: 'Cricket Club',
    subtitle: 'Sports & Recreation',
    description: 'Promoting excellence in adaptive sports through professional training and tournaments.',
    icon: <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    accentColor: 'border-blue-500',
    glowColor: 'group-hover:shadow-blue-900/50',
    badgeColor: 'bg-blue-600',
    ringColor: 'border-blue-400'
  },
  {
    id: 'music',
    title: 'Music Club',
    subtitle: 'For the Blind',
    description: 'Cultivating artistic mastery with premium vocal training and symphony performances.',
    icon: <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    accentColor: 'border-purple-500',
    glowColor: 'group-hover:shadow-purple-900/50',
    badgeColor: 'bg-purple-600',
    ringColor: 'border-purple-400'
  },
  {
    id: 'business',
    title: 'Business Club',
    subtitle: 'For the Blind',
    description: 'Forging future leaders through elite entrepreneurship programs and financial strategies.',
    icon: <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    accentColor: 'border-red-500',
    glowColor: 'group-hover:shadow-red-900/50',
    badgeColor: 'bg-red-600',
    ringColor: 'border-red-400'
  },
  {
    id: 'awards',
    title: 'Awards',
    subtitle: 'For Unsung Heroes',
    description: 'Bestowing honor upon those who have made monumental contributions to humanity.',
    icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    accentColor: 'border-amber-400',
    glowColor: 'group-hover:shadow-amber-900/50',
    badgeColor: 'bg-amber-500',
    ringColor: 'border-amber-200'
  }
];

const LEADERS = [
  { name: "Dr. A. Gatla", role: "Founder & Chairman", image: "bg-slate-700" },
  { name: "Mrs. S. Reddy", role: "Director of Operations", image: "bg-slate-600" },
  { name: "Mr. K. Rao", role: "Head of Sports Wing", image: "bg-slate-500" }
];

const NEWS = [
  { 
    date: "Oct 15, 2023", 
    title: "National Blind Cricket Tournament Finalists", 
    category: "Sports",
    summary: "Our team has secured a spot in the national finals after a thrilling victory in the semis." 
  },
  { 
    date: "Sep 28, 2023", 
    title: "Launch of Digital Braille Library", 
    category: "Education",
    summary: "Over 5000 new accessible audiobooks and braille resources are now available to our students." 
  },
  { 
    date: "Aug 10, 2023", 
    title: "Entrepreneurship Summit 2023", 
    category: "Business",
    summary: "Connecting visually impaired entrepreneurs with top venture capitalists in Tirupati." 
  }
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "National Blind Cricketer",
    quote: "The Cricket Club didn't just teach me how to play; it taught me how to win at life.",
    color: "border-blue-500"
  },
  {
    name: "Lakshmi Priya",
    role: "Music Scholar",
    quote: "I found my vision through music. The foundation gave me the stage and confidence.",
    color: "border-purple-500"
  },
  {
    name: "Venkatesh",
    role: "Small Business Owner",
    quote: "With the seed funding from the Business Club, I am now financially independent.",
    color: "border-red-500"
  }
];

const STATS = [
  { label: "Lives Impacted", value: "5k+", icon: <Users className="w-5 h-5 md:w-6 md:h-6" /> },
  { label: "Events", value: "120+", icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" /> },
  { label: "Awards", value: "50+", icon: <Award className="w-5 h-5 md:w-6 md:h-6" /> },
  { label: "Volunteers", value: "300+", icon: <Heart className="w-5 h-5 md:w-6 md:h-6" /> }
];

// --- COMPONENTS ---

// Custom Logo Component mimicking the uploaded image
const FoundationLogo = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Outer Ring */}
    <circle cx="50" cy="50" r="48" fill="#0B1120" stroke="#FBBF24" strokeWidth="2" />
    <circle cx="50" cy="50" r="45" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="4 2" />
    
    {/* Text Paths */}
    <path id="curveTop" d="M 18,50 A 32,32 0 1,1 82,50" fill="none" />
    <path id="curveBottom" d="M 22,50 A 28,28 0 0,0 78,50" fill="none" />
    
    <text width="100" fontSize="11" fontWeight="bold" fill="#FBBF24" letterSpacing="1" textAnchor="middle">
      <textPath href="#curveTop" startOffset="50%">GATLA FOUNDATION</textPath>
    </text>
    <text width="100" fontSize="9" fontWeight="bold" fill="#FBBF24" letterSpacing="2" textAnchor="middle">
      <textPath href="#curveBottom" startOffset="50%">TIRUPATI</textPath>
    </text>

    {/* Center Shield */}
    <path d="M 35,35 L 65,35 L 65,55 C 65,70 50,80 50,80 C 50,80 35,70 35,55 Z" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
    
    {/* Stars */}
    <polygon points="50,40 51.5,44 56,44 52.5,47 54,51 50,48.5 46,51 47.5,47 44,44 48.5,44" fill="#FBBF24" />
    <polygon points="42,42 43,44 45,44 43.5,45.5 44,47.5 42,46.5 40,47.5 40.5,45.5 39,44 41,44" fill="#FBBF24" />
    <polygon points="58,42 59,44 61,44 59.5,45.5 60,47.5 58,46.5 56,47.5 56.5,45.5 55,44 57,44" fill="#FBBF24" />
    
    {/* Inner Text */}
    <text x="50" y="62" fontSize="6" fill="#FBBF24" textAnchor="middle" fontWeight="bold">GATLA</text>
    <text x="50" y="68" fontSize="3" fill="#FBBF24" textAnchor="middle">FOUNDATION</text>
  </svg>
);

// Navigation Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0B1120] border-b border-amber-500/20 sticky top-0 z-50 backdrop-blur-xl bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24">
          <div className="flex items-center">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-3 md:gap-4">
              <FoundationLogo className="w-12 h-12 md:w-16 md:h-16 animate-fade-in" />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide leading-none">
                  GATLA <span className="text-amber-400">FOUNDATION</span>
                </h1>
                <p className="text-[9px] md:text-[10px] text-amber-200/60 tracking-[0.3em] uppercase mt-1">Excellence in Service • Tirupati</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {['Home', 'About', 'Wings', 'News', 'Team', 'Gallery'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-xs md:text-sm uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors duration-300 font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <a href="#donate" className="px-6 py-2 md:px-8 md:py-3 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-[#0B1120] transition-all duration-300 uppercase tracking-widest text-[10px] md:text-xs font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              Donate
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-400 hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0B1120] border-b border-amber-500/20 absolute w-full left-0 top-20 md:top-24 shadow-2xl">
          <div className="px-4 py-4 space-y-2">
            {['Home', 'About', 'Wings', 'News', 'Team', 'Gallery', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 border-l-2 border-transparent hover:border-amber-400 transition-all rounded-r-md"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <a 
              href="#donate"
              className="block px-4 py-3 mt-4 text-center text-sm font-bold uppercase tracking-widest bg-amber-500 text-[#0B1120] rounded shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Donate Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <div id="home" className="relative bg-[#050914] min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-gradient-to-l from-[#0B1120] via-[#0B1120]/90 to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-[#050914] to-[#050914]"></div>
        {/* Animated Gold Dust */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full backdrop-blur-sm">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-amber-200 text-[10px] md:text-xs font-semibold tracking-widest uppercase">Official NGO Website</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1]">
              Vision Beyond <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                Sight
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-400 max-w-lg leading-relaxed border-l-2 border-amber-500/30 pl-4 md:pl-6">
              The Gatla Foundation represents the pinnacle of service, orchestrating a brighter future for the visually impaired through five pillars of excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0B1120] font-bold text-xs md:text-sm uppercase tracking-widest hover:from-amber-400 hover:to-amber-500 transition shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                Join The Mission
              </button>
              <button className="px-8 py-3 md:px-10 md:py-4 bg-transparent border border-slate-700 text-slate-300 font-bold text-xs md:text-sm uppercase tracking-widest hover:border-amber-500/50 hover:text-white transition">
                View Heritage
              </button>
            </div>
          </div>

          {/* Abstract Premium Graphic - Optimized for Mobile */}
          <div className="relative mt-8 md:mt-0 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              {/* Central Logo Representation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-blue-900/10 rounded-full animate-pulse border border-white/5"></div>
              <div className="absolute inset-4 border border-amber-500/20 rounded-full rotate-45"></div>
              <div className="absolute inset-8 border border-amber-500/20 rounded-full -rotate-12"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 md:w-48 md:h-48 bg-[#0F172A] rounded-full border-4 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex items-center justify-center z-10 relative overflow-hidden">
                    <FoundationLogo className="w-24 h-24 md:w-36 md:h-36" />
                 </div>
              </div>
              
              {/* Orbiting Elements - Hidden on very small screens to reduce clutter */}
              <div className="hidden sm:block">
                {WINGS.map((wing, i) => (
                   <div key={i} className={`absolute w-8 h-8 md:w-12 md:h-12 ${wing.badgeColor} rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg`} 
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 72}deg) translate(110px) rotate(-${i * 72}deg)`
                        }}>
                      <div className="scale-50">{wing.icon}</div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wing Card Component
const WingCard = ({ wing }) => {
  return (
    <div className={`group relative bg-[#0F172A] border border-slate-800 hover:border-amber-500/50 p-1 transition-all duration-500 hover:-translate-y-2`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative h-full bg-[#0B1120] p-6 md:p-8 flex flex-col items-center text-center overflow-hidden">
        {/* Background Letter */}
        <span className="absolute -top-6 -right-6 text-8xl md:text-9xl font-serif text-slate-800/20 group-hover:text-amber-500/5 transition-colors duration-500 select-none">
          {wing.title.charAt(0)}
        </span>

        {/* Badge Icon */}
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${wing.badgeColor} border-4 ${wing.ringColor} shadow-lg flex items-center justify-center mb-6 md:mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
           <div className="absolute inset-0 rounded-full border border-white/20"></div>
           {wing.icon}
        </div>
        
        <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-2 tracking-wide group-hover:text-amber-400 transition-colors">
          {wing.title}
        </h3>
        
        <div className="h-0.5 w-12 bg-slate-700 mb-4 group-hover:bg-amber-500 transition-colors duration-500"></div>
        
        <p className="text-[10px] md:text-xs font-bold text-amber-500/80 uppercase tracking-widest mb-4">
          {wing.subtitle}
        </p>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6 md:mb-8">
          {wing.description}
        </p>
        
        <a href={`#${wing.id}`} className="mt-auto inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white group-hover:translate-x-1 transition-all duration-300">
          Learn More <ArrowRight className="w-3 h-3 ml-2 text-amber-500" />
        </a>
      </div>
    </div>
  );
};

// News & Updates Section (New Section based on standard NGO sites)
const NewsSection = () => {
  return (
    <section id="news" className="py-20 md:py-24 bg-[#080d1a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0 text-center md:text-left w-full">
             <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">Latest Updates</h2>
             <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">News & Events</h3>
          </div>
          <a href="#" className="hidden md:flex items-center text-slate-400 hover:text-amber-400 transition uppercase text-xs font-bold tracking-widest whitespace-nowrap">
            All News <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {NEWS.map((item, idx) => (
            <div key={idx} className="group bg-[#0B1120] border border-slate-800 hover:border-amber-500/30 transition-all duration-300">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-700 group-hover:scale-105 transition-transform duration-500"></div>
                <div className="absolute top-4 left-4 bg-amber-500 text-[#0B1120] text-xs font-bold px-3 py-1 uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <div className="text-slate-500 text-xs font-medium mb-3 flex items-center">
                  <Calendar className="w-3 h-3 mr-2" /> {item.date}
                </div>
                <h4 className="text-white font-serif font-bold text-lg mb-3 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {item.summary}
                </p>
                <a href="#" className="inline-flex items-center text-amber-500 text-xs font-bold uppercase tracking-widest hover:text-white transition">
                  Read <ChevronRight className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
           <a href="#" className="inline-flex items-center text-slate-400 hover:text-amber-400 transition uppercase text-xs font-bold tracking-widest">
            View All News <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

// Leadership Section (New Section)
const TeamSection = () => {
  return (
    <section id="team" className="py-20 md:py-24 bg-[#050914] relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">Leadership</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Board of Directors</h3>
          <p className="text-slate-400 font-light text-base md:text-lg">
            Guiding our vision with decades of experience in social service and philanthropy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {LEADERS.map((leader, idx) => (
            <div key={idx} className="text-center group">
              <div className={`w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full ${leader.image} border-4 border-[#0B1120] shadow-[0_0_0_1px_rgba(251,191,36,0.2)] group-hover:shadow-[0_0_0_2px_rgba(251,191,36,0.6)] transition-all duration-300 mb-6 overflow-hidden relative`}>
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <Users className="w-12 h-12" />
                </div>
              </div>
              <h4 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{leader.name}</h4>
              <p className="text-amber-500/80 text-xs uppercase tracking-widest">{leader.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Impact Section
const ImpactSection = () => {
  return (
    <section className="bg-amber-500 py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="p-3 bg-amber-600/30 rounded-full mb-4 text-[#0B1120]">
                {stat.icon}
              </div>
              <h4 className="text-3xl md:text-5xl font-serif font-bold text-[#0B1120] mb-2">{stat.value}</h4>
              <p className="text-[#0B1120] font-bold uppercase tracking-widest text-[10px] md:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const Testimonials = () => {
  return (
    <section className="py-20 md:py-24 bg-[#0B1120] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">Success Stories</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">Voices of Change</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div key={idx} className={`bg-[#0F172A] p-6 md:p-8 border-t-4 ${item.color} relative`}>
              <Quote className="w-8 h-8 text-slate-600 mb-6" />
              <p className="text-slate-300 italic mb-6 leading-relaxed text-sm md:text-base">"{item.quote}"</p>
              <div>
                <h5 className="text-white font-bold text-lg">{item.name}</h5>
                <p className="text-amber-500/80 text-xs uppercase tracking-widest">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gallery Grid Section
const Gallery = () => {
  return (
    <section id="gallery" className="py-20 md:py-24 bg-[#050914] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="text-center md:text-left w-full md:w-auto mb-6 md:mb-0">
             <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">Our Gallery</h2>
             <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">Moments of Glory</h3>
          </div>
          <button className="hidden md:flex items-center text-slate-400 hover:text-amber-400 transition uppercase text-xs font-bold tracking-widest">
            View All Photos <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 md:gap-4 h-64 md:h-96">
          {/* Main Feature Image */}
          <div className="col-span-2 row-span-2 relative group overflow-hidden bg-slate-800 rounded-lg">
             <div className="absolute inset-0 bg-slate-700 animate-pulse"></div> 
             <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <Camera className="w-10 h-10 md:w-12 md:h-12 mb-2" />
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                <p className="text-white font-serif text-lg md:text-xl">State Cricket Championship</p>
             </div>
          </div>
          
          {/* Smaller Images */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative group overflow-hidden bg-slate-800 rounded-lg">
               <div className="absolute inset-0 bg-slate-700/50"></div>
               <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                  <Camera className="w-6 h-6 md:w-8 md:h-8" />
               </div>
               <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Mobile View All */}
        <div className="mt-6 text-center md:hidden">
            <button className="inline-flex items-center text-slate-400 hover:text-amber-400 transition uppercase text-xs font-bold tracking-widest">
            View All Photos <ArrowRight className="w-4 h-4 ml-2" />
            </button>
        </div>
      </div>
    </section>
  );
};

// Volunteer / CTA Section
const JoinUs = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-amber-600 to-amber-500 text-[#0B1120]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-6 text-white">Be The Light</h2>
        <p className="text-base md:text-xl font-medium mb-8 md:mb-10 max-w-2xl mx-auto text-amber-100">
          Whether you want to volunteer your time, sponsor a student, or partner with us corporately, your involvement changes lives.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 md:py-4 bg-[#0B1120] text-white font-bold uppercase tracking-widest hover:bg-[#1a2642] transition shadow-xl text-xs md:text-sm">
            Volunteer Now
          </button>
          <button className="px-8 py-3 md:py-4 bg-white text-amber-600 font-bold uppercase tracking-widest hover:bg-slate-100 transition shadow-xl text-xs md:text-sm">
            Partner With Us
          </button>
        </div>
      </div>
    </section>
  );
};

// Main Content
const App = () => {
  return (
    <div className="min-h-screen bg-[#050914] font-sans text-slate-200">
      <Navbar />
      <Hero />
      <ImpactSection />

      {/* About Section - Premium Dark */}
      <section id="about" className="py-20 md:py-24 bg-[#0B1120] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
            
            <div className="w-full md:w-1/2 relative order-2 md:order-1">
               <div className="aspect-[4/5] relative bg-slate-800">
                  {/* Decorative Frames */}
                  <div className="absolute -top-4 -left-4 w-full h-full border border-amber-500/20 z-0"></div>
                  <div className="absolute inset-0 bg-[#0F172A] z-10 flex flex-col items-center justify-center p-8 text-center border border-slate-700">
                      <FoundationLogo className="w-20 h-20 mb-6" />
                      <h4 className="text-xl md:text-2xl font-serif text-white mb-2">Our Core Philosophy</h4>
                      <p className="text-slate-400 italic">"We don't just help; we elevate."</p>
                  </div>
               </div>
            </div>

            <div className="w-full md:w-1/2 order-1 md:order-2">
              <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">About The Foundation</h2>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 md:mb-8 leading-tight">
                Empowerment through <br/>
                <span className="text-slate-400">Excellence.</span>
              </h3>
              
              <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed font-light">
                The <strong className="text-white">Gatla Foundation</strong> was established in Tirupati with a singular, high-caliber vision: to construct a platform where the visually impaired can access opportunities usually reserved for the privileged.
              </p>
              
              <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed font-light">
                Our approach is not charity, but investment in human potential. Through our five prestigious wings, we are redefining what is possible for the blind community in India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    <span className="text-slate-300">Skill Development</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    <span className="text-slate-300">Financial Inclusion</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    <span className="text-slate-300">Social Dignity</span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WINGS SECTION */}
      <section id="wings" className="py-20 md:py-32 bg-[#050914] relative overflow-hidden">
        {/* Decorative background line */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <div className="inline-block p-3 border-t border-b border-amber-500/30 mb-6">
                <h2 className="text-xs md:text-sm text-amber-400 font-bold tracking-[0.3em] uppercase">Organizational Structure</h2>
            </div>
            <h3 className="text-3xl md:text-5xl font-serif text-white mb-6">The Five Pillars</h3>
            <p className="text-slate-400 font-light text-base md:text-lg">
              Each wing operates as an autonomous center of excellence, united by the foundation's overarching mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {WINGS.map((wing) => (
              <WingCard key={wing.id} wing={wing} />
            ))}
            
            {/* Last card - "Become a Patron" */}
            <div className="group relative bg-gradient-to-br from-amber-600 to-amber-800 p-1 hover:-translate-y-2 transition-transform duration-500">
               <div className="h-full bg-[#0B1120] relative p-8 flex flex-col items-center text-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-amber-600/10 group-hover:bg-amber-600/20 transition-colors"></div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-amber-500 flex items-center justify-center mb-6 z-10">
                      <Star className="w-8 h-8 md:w-10 md:h-10 text-amber-400 fill-amber-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 z-10">Become a Patron</h3>
                  <p className="text-slate-300 text-sm mb-8 z-10 px-4">Join the elite circle of donors supporting this noble cause.</p>
                  <button className="z-10 px-8 py-3 bg-white text-[#0B1120] text-xs font-bold uppercase tracking-widest hover:bg-amber-50 transition">
                     Donate Now
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <NewsSection />
      <TeamSection />
      <Testimonials />
      <Gallery />
      <JoinUs />

      {/* Footer - Luxury Minimal */}
      <footer id="contact" className="bg-[#02040a] text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
             <div className="flex items-center gap-4 mb-6 md:mb-0">
                <FoundationLogo className="w-12 h-12" />
                <div>
                   <h4 className="text-white font-serif text-lg tracking-wide">GATLA FOUNDATION</h4>
                   <p className="text-[10px] uppercase tracking-widest text-slate-600">Established 2005</p>
                </div>
             </div>
             
             <div className="flex space-x-8">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map(social => (
                   <a key={social} href="#" className="text-xs uppercase tracking-widest hover:text-amber-400 transition-colors">{social}</a>
                ))}
             </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 border-t border-slate-900 pt-12">
             <div className="text-center md:text-left">
                <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Headquarters</h5>
                <div className="font-light leading-relaxed flex flex-col md:items-start items-center gap-2 text-slate-400">
                   <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500 shrink-0" /> 12-5-44/A, Royal Avenue</div>
                   <span className="pl-6">Tirupati, Andhra Pradesh<br/>India - 517501</span>
                </div>
             </div>
             <div className="text-center md:text-left">
                <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Contact</h5>
                <div className="font-light leading-relaxed space-y-3 flex flex-col items-center md:items-start">
                   <p className="flex items-center gap-2 text-white">
                      <Phone className="w-4 h-4 text-amber-500" /> +91 98765 43210
                   </p>
                   <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-500" /> contact@gatlafoundation.org
                   </p>
                </div>
             </div>
             <div className="text-center md:text-left">
                <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h5>
                <div className="flex border-b border-slate-700 pb-2">
                   <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none text-white w-full placeholder-slate-600 font-light" />
                   <button className="text-amber-500 uppercase text-xs font-bold tracking-widest hover:text-white transition">Join</button>
                </div>
             </div>
          </div>

          <div className="mt-16 text-center text-xs text-slate-700 uppercase tracking-widest">
             &copy; {new Date().getFullYear()} Gatla Foundation. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;