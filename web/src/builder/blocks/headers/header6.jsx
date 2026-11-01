import React, { useState, useEffect, useRef } from 'react';

// --- INLINE SVG ICONS ---
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);
const CodeIcon = (props) => <Icon path="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" {...props} />;
const SmartphoneIcon = (props) => <Icon path="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" {...props} />;
const CloudIcon = (props) => <Icon path="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-5.25-2.487 3.75 3.75 0 0 0-6.75 2.25A4.5 4.5 0 0 0 2.25 15Z" {...props} />;
const PhoneIcon = (props) => <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.106l-1.412-.353a1.125 1.125 0 0 1-.823-.398l-1.686-1.686a1.125 1.125 0 0 0-.199-1.256l.843-.843c.438-.438.663-1.068.542-1.66a8.965 8.965 0 0 0-1.348-3.795 8.965 8.965 0 0 0-3.795-1.348c-.592-.121-1.222.104-1.66.542l-.843.843a1.125 1.125 0 0 1-1.256-.199l-1.686-1.686a1.125 1.125 0 0 1-.398-.823L3 2.25A2.25 2.25 0 0 0 .75 4.5v2.25Z" {...props} />;
const MailIcon = (props) => <Icon path="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.907L12 11.25l-8.684-2.607a2.25 2.25 0 0 1-1.07-1.907V6.75" {...props} />;
const FacebookIcon = (props) => <Icon path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Zm-2.25 9h-1.5v6h-3v-6h-1.5v-3h1.5V7.5c0-1.5 1.5-1.5 1.5-1.5h1.5v3h-1.5v1.5h1.5v3Z" {...props} />;
const TwitterIcon = (props) => <Icon path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Z" {...props} />;
const LinkedinIcon = (props) => <Icon path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Z" {...props} />;
const MenuIcon = (props) => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" {...props} />;
const XIcon = (props) => <Icon path="M6 18L18 6M6 6l12 12" {...props} />;
const ChevronDownIcon = (props) => <Icon path="m19.5 8.25-7.5 7.5-7.5-7.5" {...props} />;
const SearchIcon = (props) => <Icon path="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" {...props} />;


// Header Component 6: With Integrated Search Bar
const Header6 = ({ content, containerScrollTop = 0, previewMode = 'desktop', logo_url, business_name, email, phone_number }) => { // Accept all props
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isServicesAccordionOpen, setServicesAccordionOpen] = useState(null);
  const servicesTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const isMobile = previewMode === 'mobile';

  const TOP_BAR_HEIGHT = 40;
  const MAIN_HEADER_HEIGHT = 80;

  useEffect(() => {
    setIsScrolled(containerScrollTop > 50);
  }, [containerScrollTop]);
  
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen, isMobile]);

  const finalLogoUrl = content?.logoUrl || logo_url || 'https://placehold.co/120x56/000000/FFFFFF?text=Logo';
  const finalCompanyName = content?.companyName || business_name || 'Company Name';
  const finalPhoneNumber = content?.phoneNumber || phone_number || '+1 (234) 567-890';
  const finalEmailAddress = content?.emailAddress || email || 'info@example.com';

  const navLinks = (content?.services || ['Home', 'About', 'Services', 'Contact']).map(item => ({
    name: item,
    href: '#',
    dropdown: item.toLowerCase() === 'services', 
    subLinks: [
      { name: 'Web Development', href: '#', icon: <CodeIcon className="w-5 h-5 mr-3 text-blue-500" /> },
      { name: 'App Development', href: '#', icon: <SmartphoneIcon className="w-5 h-5 mr-3 text-blue-500" /> },
      { name: 'Software Solutions', href: '#', icon: <CloudIcon className="w-5 h-5 mr-3 text-blue-500" /> },
    ] 
  }));

  const handleServicesEnter = () => {
    clearTimeout(servicesTimeoutRef.current);
    setServicesOpen(true);
  };
  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setServicesOpen(false), 200);
  };

  const NavLink = ({ link, isScrolled, onMouseEnter, onMouseLeave }) => (
    <div className="relative group" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <a href={link.href} className={`flex items-center px-3 py-2 font-medium text-lg transition-all duration-200 rounded-md ${isScrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} group-hover:translate-y-[-2px]`}>
        {link.name}
        {link.dropdown && <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />}
      </a>
      <div className={`absolute bottom-0 left-0 w-full h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center ${isScrolled ? 'bg-red-400' : 'bg-red-500'}`}></div>
      {link.dropdown && isServicesOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 animate-fade-in-down z-20 border-t-2 border-red-500">
          {link.subLinks.map(subLink => (
            <a key={subLink.name} href={subLink.href} className="flex items-center px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-red-500 transition-colors" onClick={() => setServicesOpen(false)}>
              {subLink.icon} {subLink.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Fixed height container for the header to contain the animation */}
      <div className="relative w-full overflow-hidden" style={{ height: `${TOP_BAR_HEIGHT + MAIN_HEADER_HEIGHT}px` }}>
        {/* Top Utility Bar */}
        <div className="absolute top-0 left-0 w-full bg-slate-800 text-slate-300 text-sm transition-transform duration-300 ease-in-out z-20" style={{ transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)' }}>
          <div className="container mx-auto px-6 h-[40px] flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href={`tel:${finalPhoneNumber}`} className="flex items-center hover:text-white transition-colors">
                <PhoneIcon className="w-4 h-4 mr-1.5" />
                {!isMobile && <span>{finalPhoneNumber}</span>}
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 hidden sm:block">Welcome to {finalCompanyName}!</span>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors"><FacebookIcon className="w-4 h-4" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><TwitterIcon className="w-4 h-4" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><LinkedinIcon className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className={`absolute top-0 left-0 w-full transition-all duration-300 ease-in-out z-30 ${isScrolled ? 'bg-blue-800 shadow-lg' : 'bg-white dark:bg-gray-800'}`} style={{ top: `${isScrolled ? 0 : TOP_BAR_HEIGHT}px` }}>
          <div className="container mx-auto px-6 h-[80px] flex justify-between items-center relative">
            <a href="#">
              <img 
                src={finalLogoUrl} 
                alt={`${finalCompanyName} Logo`} 
                className="h-14 w-auto" 
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x56/000000/FFFFFF?text=Logo'; }}
              />
            </a>
            
            <div className={`hidden lg:flex items-center justify-end flex-grow transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <nav className="flex items-center space-x-2">
                    {navLinks.map(link => <NavLink key={link.name} link={link} isScrolled={isScrolled} onMouseEnter={link.dropdown ? handleServicesEnter : undefined} onMouseLeave={link.dropdown ? handleServicesLeave : undefined} />)}
                </nav>
            </div>

            <div className="flex items-center">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2 rounded-full transition-colors duration-300 mx-4 z-10 ${isScrolled ? 'text-white hover:bg-white/10' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {isSearchOpen ? <XIcon /> : <SearchIcon />}
              </button>
              <a href="#" className={`hidden lg:block font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>Get a Quote</a>
              <div className="lg:hidden ml-2">
                <button onClick={() => setMobileMenuOpen(true)} className={`${isScrolled ? 'text-white' : 'text-gray-700 dark:text-gray-200'} focus:outline-none`}><MenuIcon className="w-8 h-8" /></button>
              </div>
            </div>

            <div className={`absolute left-0 w-full h-full flex items-center justify-center transition-all duration-300 ease-in-out ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} style={{ background: isScrolled ? 'rgba(30, 64, 175, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
              <div className="container mx-auto px-6 flex items-center">
                <input ref={searchInputRef} type="text" placeholder="Search our services, blog, and more..." className={`w-full bg-transparent text-2xl py-2 border-b-2 focus:outline-none ${isScrolled ? 'text-white border-white/50 focus:border-white' : 'text-gray-800 dark:text-white border-gray-300 focus:border-red-500'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - Fixed to viewport */}
      {isMobile && isMobileMenuOpen && (
        <div className={`fixed top-0 left-0 w-full h-screen lg:hidden z-50 ${isScrolled ? 'bg-blue-800' : 'bg-white dark:bg-gray-900'}`}>
           <div className="container mx-auto px-6 py-5 h-full overflow-y-auto" style={{ paddingTop: `${MAIN_HEADER_HEIGHT}px` }}>
                {/* Mobile menu header with logo and close button */}
                <div className="flex justify-between items-center fixed top-0 left-0 w-full px-6" style={{height: `${MAIN_HEADER_HEIGHT}px`, backgroundColor: isScrolled ? '#1D4ED8' : '#ffffff'}}>
                    <a href="#"><img src={finalLogoUrl} alt={`${finalCompanyName} Logo`} className="h-12 w-auto" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x56/FFFFFF/000000?text=Logo'; }}/></a>
                    <button onClick={() => setMobileMenuOpen(false)} className={`${isScrolled ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}><XIcon className="w-8 h-8" /></button>
                </div>
                <nav className="mt-4 flex flex-col space-y-4">
                    {navLinks.map(link => (
                      <div key={link.name} className="border-b border-gray-200 dark:border-gray-700">
                        <a href={link.href} onClick={(e) => { 
                             if (link.dropdown) { e.preventDefault(); setServicesAccordionOpen(prev => (prev === link.name ? null : link.name)); } 
                             else { setMobileMenuOpen(false); } 
                        }} 
                        className={`flex justify-between items-center text-xl font-medium py-4 transition-colors ${isScrolled ? 'text-white' : 'text-gray-800 dark:text-gray-100 hover:text-red-500'}`}>
                          <span>{link.name}</span>
                          {link.dropdown && <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isServicesAccordionOpen === link.name ? 'rotate-180' : ''}`} />}
                        </a>
                        {link.dropdown && isServicesAccordionOpen === link.name && (
                          <div className="pl-4 pb-4 mt-2 space-y-3">
                            {link.subLinks.map(subLink => (
                              <a key={subLink.name} href={subLink.href} className={`flex items-center text-lg py-1 transition-colors ${isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'}`} onClick={() => setMobileMenuOpen(false)}>
                                {React.cloneElement(subLink.icon, {className: `w-5 h-5 mr-3 ${isScrolled ? 'text-blue-400' : 'text-blue-500'}`})} {subLink.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <a href="#" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 px-6 rounded-lg shadow-lg text-xl" onClick={() => setMobileMenuOpen(false)}>Get a Quote</a>
                </nav>
            </div>
        </div>
      )}
    </div>
  );
};

export default Header6;
