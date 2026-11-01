import React, { useState, useEffect, useRef } from 'react';

// --- INLINE SVG ICONS ---
// (Icons remain unchanged)
const Icon = ({ path, className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d={path} /> </svg> );
const Menu = (props) => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" {...props} />;
const X = (props) => <Icon path="M6 18L18 6M6 6l12 12" {...props} />;
const ChevronDown = (props) => <Icon path="m19.5 8.25-7.5 7.5-7.5-7.5" {...props} />;
const Phone = (props) => <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.106l-1.412-.353a1.125 1.125 0 0 1-.823-.398l-1.686-1.686a1.125 1.125 0 0 0-.199-1.256l.843-.843c.438-.438.663-1.068.542-1.66a8.965 8.965 0 0 0-1.348-3.795 8.965 8.965 0 0 0-3.795-1.348c-.592-.121-1.222.104-1.66.542l-.843-.843a1.125 1.125 0 0 1-1.256-.199l-1.686-1.686a1.125 1.125 0 0 1-.398-.823L3 2.25A2.25 2.25 0 0 0 .75 4.5v2.25Z" {...props} />;
const Mail = (props) => <Icon path="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.907L12 11.25l-8.684-2.607a2.25 2.25 0 0 1-1.07-1.907V6.75" {...props} />;
const Code = (props) => <Icon path="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" {...props} />;
const Smartphone = (props) => <Icon path="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" {...props} />;
const Cloud = (props) => <Icon path="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-5.25-2.487 3.75 3.75 0 0 0-6.75 2.25A4.5 4.5 0 0 0 2.25 15Z" {...props} />;
const Facebook = (props) => <Icon path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Zm-2.25 9h-1.5v6h-3v-6h-1.5v-3h1.5V7.5c0-1.5 1.5-1.5 1.5-1.5h1.5v3h-1.5v1.5h1.5v3Z" {...props} />;
const Twitter = (props) => <Icon path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Z" {...props} />;
const Linkedin = (props) => <Icon path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Z" {...props} />;

const Header1 = ({ content, containerScrollTop = 0, previewMode = 'desktop', logo_url, business_name, email, phone_number }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const servicesTimeoutRef = useRef(null);
  
  const isMobile = previewMode === 'mobile';
  const isScrolled = containerScrollTop > 38;

  // FIX COMMENT: content?.logoUrl *must* contain the temporary, uploaded image base64 or URL 
  // passed from FocusCustomizer via the EditorContext's updateTempContent function.
  const finalLogoUrl = content?.logoUrl || logo_url || 'https://placehold.co/120x56/000000/FFFFFF?text=Logo';
  const finalCompanyName = content?.companyName || business_name || 'Company Name';
  const finalPhoneNumber = content?.phoneNumber || phone_number || '+1 (234) 567-890';
  const finalEmailAddress = content?.emailAddress || email || 'info@example.com';

  const navLinks = (content?.services || ['Home', 'About', 'Services', 'Contact']).map(item => ({
      name: item, href: '#', dropdown: item.toLowerCase() === 'services',
      subLinks: [
        { name: 'Web Development', href: '#', icon: <Code className="w-5 h-5 mr-3 text-blue-500" /> },
        { name: 'App Development', href: '#', icon: <Smartphone className="w-5 h-5 mr-3 text-blue-500" /> },
        { name: 'Software Solutions', href: '#', icon: <Cloud className="w-5 h-5 mr-3 text-blue-500" /> },
      ]
  }));

  const handleServicesEnter = () => { clearTimeout(servicesTimeoutRef.current); setServicesOpen(true); };
  const handleServicesLeave = () => { servicesTimeoutRef.current = setTimeout(() => { setServicesOpen(false); }, 200); };

  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  return (
    <div className="w-full sticky top-0 z-50">
        <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0' : 'h-[38px]'}`}>
           <div className="w-full mx-auto px-4 h-[38px] flex justify-between items-center bg-blue-600 text-white text-xs">
              <div className="flex items-center space-x-4">
                <a href={`tel:${finalPhoneNumber}`} className="flex items-center hover:text-red-300">
                    <Phone className="w-4 h-4 mr-1.5" />
                    {!isMobile && <span>{finalPhoneNumber}</span>}
                </a>
                <a href={`mailto:${finalEmailAddress}`} className="flex items-center hover:text-red-300">
                    <Mail className="w-4 h-4 mr-1.5" />
                    {!isMobile && <span>{finalEmailAddress}</span>}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <a href="#" aria-label="Facebook" className="hover:text-red-300"><Facebook className="w-4 h-4" /></a>
                <a href="#" aria-label="Twitter" className="hover:text-red-300"><Twitter className="w-4 h-4" /></a>
                <a href="#" aria-label="LinkedIn" className="hover:text-red-300"><Linkedin className="w-4 h-4" /></a>
              </div>
           </div>
        </div>
        
        <div className={`w-full mx-auto px-4 h-[76px] flex justify-between items-center transition-colors duration-300 ${isScrolled ? 'bg-blue-700' : 'bg-white'}`}>
          <a href="#" className="flex-shrink-0 flex items-center">
            {/* Logo is updated here using finalLogoUrl */}
            <img 
                src={finalLogoUrl} 
                alt={`${finalCompanyName} Logo`} 
                className="h-12 w-auto" 
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x56/000000/FFFFFF?text=Logo'; }} 
            />
          </a>

          {isMobile ? (
              <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className={`${isScrolled ? 'text-white' : 'text-gray-700'} focus:outline-none`}>
                  {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
          ) : (
              <div className="flex items-center justify-end flex-grow min-w-0">
                  <nav className="flex items-center space-x-4">
                      {navLinks.map((link) => (
                          <div key={link.name} className="relative group" onMouseEnter={link.dropdown ? handleServicesEnter : undefined} onMouseLeave={link.dropdown ? handleServicesLeave : undefined}>
                              <a href={link.href} className={`flex items-center py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${isScrolled ? 'text-white hover:text-red-300' : 'text-gray-800 hover:text-red-500'}`}>
                                  <span>{link.name}</span>
                                  {link.dropdown && <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />}
                              </a>
                              {!link.dropdown && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>}
                              {link.dropdown && isServicesOpen && (
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 animate-fade-in-down">
                                  {link.subLinks.map(subLink => ( <a key={subLink.name} href={subLink.href} className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-red-500 transition-colors"> {subLink.icon} {subLink.name} </a> ))}
                                  </div>
                              )}
                          </div>
                      ))}
                  </nav>
                  <a href="#" className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-xs duration-300 transform hover:scale-105 whitespace-nowrap"> Get a Quote </a>
              </div>
          )}
        </div>

        {isMobile && isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40">
              <div className="px-4 py-4">
                  <nav className="flex flex-col space-y-2">
                      {navLinks.map((link) => (
                      <div key={link.name}>
                          <a href={link.href} onClick={(e) => { if (link.dropdown) { e.preventDefault(); setServicesOpen(!isServicesOpen); } else { setMobileMenuOpen(false); } }} className={`flex justify-between items-center w-full py-3 font-medium text-gray-700 hover:text-red-500`}>
                          <span>{link.name}</span>
                          {link.dropdown && <ChevronDown className={`w-5 h-5 ml-1 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />}
                          </a>
                          {link.dropdown && isServicesOpen && (
                          <div className="pl-4 mt-1 border-l-2 border-red-500">
                              {link.subLinks.map(subLink => ( <a key={subLink.name} href={subLink.href} className={`flex items-center py-2 text-sm text-gray-600 hover:text-red-500`}> {subLink.icon} {subLink.name} </a> ))}
                          </div>
                          )}
                      </div>
                      ))}
                      <a href="#" className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white text-center font-bold py-3 px-6 rounded-lg shadow-lg"> Get a Quote </a>
                  </nav>
              </div>
          </div>
        )}
        <style jsx>{` @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; } `}</style>
    </div>
  );
};

export default Header1;
