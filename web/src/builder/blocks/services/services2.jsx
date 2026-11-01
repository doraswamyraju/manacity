import React, { useState } from 'react';

// --- SVG Icon Components ---
const SearchIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const MegaphoneIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 11 18-5v12L3 14v-3z"></path>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const BarChartIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
);

const CodeIcon = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const MailIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const ChevronDownIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);


// --- Main Component ---
export const Services2 = () => {
    const services = [
        {
            icon: SearchIcon,
            title: 'SEO Optimization',
            description: 'Our comprehensive SEO strategies are designed to elevate your website’s ranking on search engines like Google. We focus on keyword research, on-page and off-page optimization, and technical SEO to drive sustainable organic traffic and generate valuable leads.',
            image: 'https://placehold.co/600x400/7c3aed/ffffff?text=SEO',
        },
        {
            icon: MegaphoneIcon,
            title: 'PPC Campaigns',
            description: 'Achieve immediate visibility and targeted traffic with our data-driven Pay-Per-Click campaigns. We manage your budget effectively across platforms like Google Ads and social media to maximize conversions and deliver a high return on investment.',
            image: 'https://placehold.co/600x400/db2777/ffffff?text=PPC',
        },
        {
            icon: UsersIcon,
            title: 'Social Media Marketing',
            description: 'Build a vibrant online community and a powerful brand presence. We create and execute tailored social media strategies for platforms like Instagram, Facebook, and LinkedIn, focusing on engaging content, audience growth, and customer interaction.',
            image: 'https://placehold.co/600x400/1d4ed8/ffffff?text=Social',
        },
        {
            icon: BarChartIcon,
            title: 'Content Marketing',
            description: 'Content is king, and we help you rule your domain. From insightful blog posts and articles to compelling videos and infographics, we produce high-quality content that attracts your target audience, establishes authority, and drives conversions.',
            image: 'https://placehold.co/600x400/16a34a/ffffff?text=Content',
        },
        {
            icon: MailIcon,
            title: 'Email Marketing',
            description: 'Nurture leads and foster customer loyalty through strategic email marketing. We design, write, and manage effective email campaigns, from automated sequences to newsletters, ensuring your message resonates with your audience and drives action.',
            image: 'https://placehold.co/600x400/ea580c/ffffff?text=Email',
        },
        {
            icon: CodeIcon,
            title: 'Web Development',
            description: 'Your website is your digital storefront. We design and develop beautiful, responsive, and high-performance websites that provide an exceptional user experience, load quickly, and are optimized to convert visitors into customers.',
            image: 'https://placehold.co/600x400/57534e/ffffff?text=Web+Dev',
        },
    ];

    const [activeService, setActiveService] = useState(services[0]);

    // This handler now also works for the accordion on mobile
    const handleServiceClick = (service) => {
        // If the clicked service is already active, close it. Otherwise, open the new one.
        setActiveService(prev => prev?.title === service.title ? null : service);
    };

    const ActiveIcon = activeService?.icon;

    return (
        <section className="bg-white dark:bg-gray-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Our Services</h2>
                    <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        A Partnership for Growth
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                        We provide a full spectrum of digital marketing services. Select a service to learn more.
                    </p>
                </div>

                {/* --- DESKTOP VIEW --- */}
                {/* This layout is hidden on mobile and shown on large screens. `lg:items-stretch` makes columns equal height. */}
                <div className="hidden lg:flex flex-row gap-10 lg:gap-16 lg:items-stretch">
                    {/* Left Column: Service List */}
                    <div className="lg:w-1/3 space-y-2">
                        {services.map((service) => {
                            const Icon = service.icon;
                            const isActive = activeService?.title === service.title;
                            return (
                                <button
                                    key={service.title}
                                    onClick={() => setActiveService(service)} // Desktop click always sets a service
                                    className={`w-full text-left flex items-center p-4 rounded-lg transition-all duration-300 ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className={`w-6 h-6 mr-4 transition-colors ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                                    <span className="font-semibold text-lg">{service.title}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Service Details */}
                    <div className="lg:w-2/3">
                        {activeService && (
                            // `h-full` and `flex-col` ensure this card stretches to the full height of the row.
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xl p-8 overflow-hidden h-full flex flex-col">
                                <div className="flex items-center mb-4 flex-shrink-0">
                                    <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4">
                                        <ActiveIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeService.title}</h3>
                                </div>
                                {/* `flex-grow` allows the text to take up space, and `overflow-y-auto` adds a scrollbar if needed. */}
                                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow overflow-y-auto">{activeService.description}</p>
                                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden flex-shrink-0">
                                    <img 
                                        src={activeService.image} 
                                        alt={`${activeService.title} illustration`} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image'; }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- MOBILE ACCORDION VIEW --- */}
                {/* This layout is shown on mobile and hidden on large screens */}
                <div className="lg:hidden space-y-3">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const isActive = activeService?.title === service.title;
                        return (
                            <div key={service.title} className={`rounded-lg overflow-hidden transition-all duration-300 ${isActive ? 'bg-indigo-50 dark:bg-gray-800 shadow-md' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                <button
                                    onClick={() => handleServiceClick(service)}
                                    className="w-full text-left flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center">
                                        <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-indigo-500'}`} />
                                        <span className={`font-semibold transition-colors ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-white'}`}>{service.title}</span>
                                    </div>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isActive ? 'rotate-180 text-indigo-500' : ''}`} />
                                </button>
                                {isActive && (
                                    <div className="p-4 pt-0">
                                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                                            <img
                                                src={service.image}
                                                alt={`${service.title} illustration`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image'; }}
                                            />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{service.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
