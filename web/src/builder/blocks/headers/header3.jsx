import React, { useState, useEffect, useRef } from 'react';

// --- INLINE SVG ICONS ---
// A generic Icon component for easily creating new SVG icons.
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Specific icons used in the header
const XIcon = (props) => <Icon path="M6 18L18 6M6 6l12 12" {...props} />;
const ChevronDownIcon = (props) => <Icon path="m19.5 8.25-7.5 7.5-7.5-7.5" {...props} />;
const PhoneIcon = (props) => <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.106l-1.412-.353a1.125 1.125 0 0 1-.823-.398l-1.686-1.686a1.125 1.125 0 0 0-.199-1.256l.843-.843c.438-.438.663-1.068.542-1.66a8.965 8.965 0 0 0-1.348-3.795 8.965 8.965 0 0 0-3.795-1.348c-.592-.121-1.222.104-1.66.542l-.843-.843a1.125 1.125 0 0 1-1.256-.199l-1.686-1.686a1.125 1.125 0 0 1-.398-.823L3 2.25A2.25 2.25 0 0 0 .75 4.5v2.25Z" {...props} />;
const MailIcon = (props) => <Icon path="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.907L12 11.25l-8.684-2.607a2.25 2.25 0 0 1-1.07-1.907V6.75" {...props} />;
const SmartphoneIcon = (props) => <Icon path="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" {...props} />;
const NfcIcon = (props) => <Icon path="M8.288 15.038a5.25 5.25 0 017.424 0M5.136 11.886a9 9 0 0113.728 0M1.984 8.734a12.75 12.75 0 0119.032 0M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" {...props} />;
const DesignIcon = (props) => <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" {...props} />;
const MenuIcon = (props) => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" {...props} />;


const Header3 = ({ content, containerScrollTop = 0, previewMode = 'desktop', logo_url, business_name, email, phone_number }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const [isServicesAccordionOpen, setServicesAccordionOpen] = useState(null); // Separate state for mobile dropdown

  // Removed pull-down logic for consistency with headers 1 & 2 standard mobile button toggle
  
  const isMobile = previewMode === 'mobile';
  const isScrolled = containerScrollTop > 38;

  const finalLogoUrl = content?.logoUrl || logo_url || 'https://placehold.co/140x60/1e40af/FFFFFF?text=Rajugari';
  const finalCompanyName = content?.companyName || business_name || 'Rajugari Ventures';
  const finalPhoneNumber = content?.phoneNumber || phone_number || '+91 12345 67890';
  const finalEmailAddress = content?.emailAddress || email || 'info@rajugariventures.com';

  // Modified navLinks to include an explicit 'id' for dropdowns for clean state management
  const navLinks = [
    { name: 'Home', href: '#' },
    { 
      name: 'Digital Marketing', 
      id: 'digital', 
      href: '#', 
      dropdown: true, 
      subLinks: [
        { name: 'Local SEO', href: '#' }, 
        { name: 'Google SEO', href: '#' }, 
        { name: 'Social Media Marketing', href: '#' }
      ] 
    },
    { 
      name: 'Web Designing', 
      id: 'web', 
      href: '#', 
      dropdown: true, 
      subLinks: [
        { name: 'Static Websites', href: '#' }, 
        { name: 'Dynamic Websites', href: '#' }, 
        { name: 'WordPress/Shopify/Wix', href: '#' }
      ] 
    },
    { name: 'Smart Solutions', href: '#', icon: <NfcIcon className="w-5 h-5 mr-3 text-blue-500" /> },
    { name: 'App Development', href: '#', icon: <SmartphoneIcon className="w-5 h-5 mr-3 text-blue-500" /> },
    { name: 'Graphic Designing', href: '#', icon: <DesignIcon className="w-5 h-5 mr-3 text-blue-500" /> },
  ];

  // Handlers for services dropdown hover (Desktop)
  const handleDropdownEnter = (dropdownId) => { clearTimeout(dropdownTimeoutRef.current); setOpenDropdown(dropdownId); };
  const handleDropdownLeave = () => { dropdownTimeoutRef.current = setTimeout(() => { setOpenDropdown(null); }, 200); };
  // Handler for mobile accordion click
  const handleMobileDropdownToggle = (dropdownId) => { setServicesAccordionOpen(prev => (prev === dropdownId ? null : dropdownId)); };

  // Close mobile menu if switching to desktop view
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  return (
    <div className="w-full sticky top-0 z-50 font-sans">
      {/* Top Bar for contact info and social media - Collapses on scroll */}
      <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0' : 'h-[38px]'}`}>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-[38px] flex justify-center sm:justify-between items-center bg-blue-800 text-white text-xs">
          <div className="flex items-center space-x-4">
            {/* Show only icon on mobile, show icon and text on desktop/scrolled-down mobile */}
            <a href={`tel:${finalPhoneNumber}`} className="flex items-center hover:text-blue-200 transition-colors">
                <PhoneIcon className="w-4 h-4" />
                {!isMobile && <span className="ml-1.5">{finalPhoneNumber}</span>}
            </a>
            <a href={`mailto:${finalEmailAddress}`} className="flex items-center hover:text-blue-200 transition-colors">
                <MailIcon className="w-4 h-4" />
                {!isMobile && <span className="ml-1.5">{finalEmailAddress}</span>}
            </a>
          </div>
          {/* Social media icons removed for brevity/simplicity in the top bar but can be re-added */}
        </div>
      </div>

      {/* Main Header navigation bar */}
      <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'}`}>
        <a href="#" className="flex-shrink-0 flex items-center">
          <img 
            src={finalLogoUrl} 
            alt={`${finalCompanyName} Logo`} 
            className="h-14 w-auto" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/140x60/1e40af/FFFFFF?text=Rajugari'; }} 
          />
        </a>

        {isMobile ? (
          // Mobile menu button
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className={`text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}>
            {isMobileMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
          </button>
        ) : (
          // Desktop navigation
          <div className="flex items-center">
            <nav className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative group" 
                  onMouseEnter={link.dropdown ? () => handleDropdownEnter(link.id) : undefined} 
                  onMouseLeave={link.dropdown ? handleDropdownLeave : undefined}
                >
                  <a 
                    href={link.href} 
                    className={`flex items-center py-2 text-sm font-semibold transition-colors duration-300 text-gray-800 hover:text-blue-600`}
                  >
                    <span>{link.name}</span>
                    {link.dropdown && <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-200 ${openDropdown === link.id ? 'rotate-180' : ''}`} />}
                  </a>
                  {/* Dropdown menu for services (Desktop) */}
                  {link.dropdown && openDropdown === link.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 animate-fade-in-down border border-gray-100">
                    {link.subLinks.map(subLink => (
                        <a 
                          key={subLink.name} 
                          href={subLink.href} 
                          className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {subLink.name}
                        </a>
                    ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            {/* Get a Quote button */}
            <a href="#" className="ml-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all text-sm duration-300 transform hover:scale-105 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Get a Quote
            </a>
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40 animate-fade-in-down-mobile">
          <div className="px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.dropdown) {
                        e.preventDefault();
                        handleMobileDropdownToggle(link.id);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`flex justify-between items-center w-full py-3 font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200`}
                  >
                    <span className="flex items-center">
                        {link.icon && React.cloneElement(link.icon, {className: "w-5 h-5 mr-3 text-blue-500"})}
                        {link.name}
                    </span>
                    {link.dropdown && <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform duration-200 ${isServicesAccordionOpen === link.id ? 'rotate-180' : ''}`} />}
                  </a>
                  {/* Dropdown/Accordion for Services (Mobile) */}
                  {link.dropdown && isServicesAccordionOpen === link.id && (
                    <div className="pl-4 mt-1 border-l-2 border-blue-500 space-y-2">
                      {link.subLinks.map(subLink => (
                        <a
                          key={subLink.name}
                          href={subLink.href}
                          className={`flex items-center py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200`}
                          onClick={() => setMobileMenuOpen(false)} // Close menu on sub-link click
                        >
                          {subLink.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="#" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                Get a Quote
              </a>
            </nav>
          </div>
        </div>
      )}
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }

        @keyframes fade-in-down-mobile {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down-mobile {
          animation: fade-in-down-mobile 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Header3;
