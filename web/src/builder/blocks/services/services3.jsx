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

// --- Data ---
const servicesData = {
    growth: [
        { icon: SearchIcon, title: 'SEO Optimization', description: 'Climb the search rankings and drive organic traffic.' },
        { icon: MegaphoneIcon, title: 'PPC Campaigns', description: 'Targeted ads that convert and maximize your ROI.' },
        { icon: UsersIcon, title: 'Social Media', description: 'Build a strong brand presence and engage your audience.' },
    ],
    creative: [
        { icon: BarChartIcon, title: 'Content Marketing', description: 'Valuable content that attracts, informs, and converts.' },
        { icon: MailIcon, title: 'Email Marketing', description: 'Nurture leads and build loyalty with personalized campaigns.' },
    ],
    technical: [
        { icon: CodeIcon, title: 'Web Development', description: 'High-performance websites for a great user experience.' },
    ],
};

const ServiceCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 h-12 w-12 rounded-full mb-4">
            <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);


// --- Main Component ---
export const Services3 = () => {
    const [activeTab, setActiveTab] = useState('growth');

    const tabs = [
        { id: 'growth', label: 'Growth' },
        { id: 'creative', label: 'Creative' },
        { id: 'technical', label: 'Technical' },
    ];

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Our Expertise</h2>
                    <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        Solutions Tailored for You
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                        We group our services into logical categories to better address your specific business needs.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8 flex justify-center">
                    {/* On mobile, this is a flex-col. On sm+, it's the pill shape. */}
                    <div className="flex flex-col sm:flex-row sm:relative sm:bg-gray-200 sm:dark:bg-gray-700 sm:p-1 sm:rounded-full gap-2 sm:gap-0 w-full max-w-md sm:w-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full sm:w-32 text-center py-2.5 px-4 rounded-lg sm:rounded-full transition-colors duration-300 text-sm sm:text-base font-semibold focus:outline-none
                                    sm:relative sm:z-10
                                    ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white' // Active style for mobile, and the text color for desktop
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 sm:bg-transparent sm:dark:bg-transparent' // Inactive styles
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                        {/* Slider for desktop only */}
                        <div
                            className="hidden sm:block absolute top-1 bottom-1 bg-indigo-600 rounded-full transition-all duration-300 ease-in-out"
                            style={{
                                width: 'calc((100% - 8px) / 3)',
                                transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`,
                            }}
                        />
                    </div>
                </div>

                {/* Services Grid */}
                <div className="relative min-h-[300px]">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ease-in-out ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full pointer-events-none'}`}
                        >
                            {servicesData[tab.id].map(service => (
                                <ServiceCard key={service.title} {...service} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
