import React, { useState } from 'react';

// --- SVG Icon Components (Unchanged) ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto mb-3 text-indigo-500">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const MegaphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto mb-3 text-indigo-500">
        <path d="m3 11 18-5v12L3 14v-3z"></path>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto mb-3 text-indigo-500">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto mb-3 text-indigo-500">
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
);

const CodeIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto mb-3 text-indigo-500">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto mb-3 text-indigo-500">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);


const ServiceCard = ({ icon, title, description }) => {
    return (
        // Card component with reduced padding and improved readability
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-4 text-center border border-gray-100 dark:border-gray-700/50">
            {icon}
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            {/* Removed fixed height (h-12) to ensure text flows naturally and isn't clipped */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{description}</p>
            <a href="#" className="inline-block bg-indigo-500 text-white font-semibold py-1.5 px-4 rounded-md text-xs hover:bg-indigo-600 transition-colors duration-300">
                Learn More
            </a>
        </div>
    );
};

export const Services1 = () => {
    const services = [
        {
            icon: <SearchIcon />,
            title: 'SEO Optimization',
            description: 'Get to the top of search results and drive organic traffic.',
        },
        {
            icon: <MegaphoneIcon />,
            title: 'PPC Campaigns',
            description: 'Maximize your ROI with targeted pay-per-click campaigns.',
        },
        {
            icon: <UsersIcon />,
            title: 'Social Media',
            description: 'Engage your audience and build a strong brand presence.',
        },
        {
            icon: <BarChartIcon />,
            title: 'Content Marketing',
            description: 'Create valuable content that attracts, informs, and converts.',
        },
        {
            icon: <MailIcon />,
            title: 'Email Marketing',
            description: 'Nurture leads and build customer loyalty with personalized campaigns.',
        },
        {
            icon: <CodeIcon />,
            title: 'Web Development',
            description: 'We build beautiful, high-performance websites for a great user experience.',
        },
    ];

    return (
        // Main section: Minimal padding (p-4) on small screens, ensuring max-w-full adherence
        <section className="bg-gray-50 dark:bg-gray-900 py-8 px-2 sm:py-16 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center px-2">
                    <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Our Services</h2>
                    {/* Reduced font size for mobile title to prevent text wrapping on a single word */}
                    <p className="mt-2 text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        Everything You Need to Grow Online
                    </p>
                    {/* Responsive paragraph text size */}
                    <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-lg text-gray-500 dark:text-gray-400">
                        We offer a complete suite of digital marketing services to help your business succeed.
                    </p>
                </div>

                {/* FIX: grid-cols-1 by default (mobile preview), then scales up */}
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
