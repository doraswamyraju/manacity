import React from 'react';

// A simple icon component for the button
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 ml-2 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

// The Hero5 component now functions like the others, with a background image and responsive layout.
export default function Hero5({ content, previewMode = 'desktop' }) {
  // Set default values for the content to prevent errors if some fields are missing.
  const {
    heading = "Design, Collaborate, and Create.",
    subheading = "Our platform provides all the tools you need to bring your creative ideas to life. Start your free trial today and join a community of innovators.",
    ctaText = "Start Free Trial",
    secondaryCtaText = "Learn More",
    backgroundImage = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop",
    ctaLink = "#",
    secondaryCtaLink = "#"
  } = content || {};

  // --- Mobile-Specific Styling ---
  const isMobile = previewMode === 'mobile';

  const containerPadding = isMobile ? 'px-4 py-16' : 'px-4 py-20 md:py-32 lg:py-40';
  const headingSize = isMobile ? 'text-2xl' : 'text-3xl md:text-4xl lg:text-5xl';
  const subheadingSize = isMobile ? 'text-sm' : 'text-base lg:text-lg';
  const buttonGroupClasses = isMobile ? 'flex-col gap-3' : 'sm:flex-row gap-3 sm:gap-5';
  const buttonClasses = isMobile ? 'px-5 py-2 text-sm' : 'px-6 py-2.5 text-sm md:text-base';

  return (
    <div className="relative w-full h-full bg-gray-900 font-sans flex items-center justify-center">
      {/* Background Image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
          // Add an onError handler for the background image
          onError={(e) => { e.target.style.backgroundImage = `url('https://placehold.co/1920x1080/111827/4A5568?text=Background+Image+Not+Found')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-80"></div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Foreground Content */}
      <div className={`relative z-10 flex flex-col justify-center items-center text-white text-center w-full ${containerPadding}`}>
        <h1 className={`font-extrabold leading-tight mb-3 max-w-3xl animate-fade-in-down ${headingSize}`}>
          {heading}
        </h1>

        <p className={`text-gray-200 mb-6 max-w-2xl animate-fade-in-up ${subheadingSize}`}>
          {subheading}
        </p>

        <div className={`flex items-center justify-center ${buttonGroupClasses}`}>
          {/* Primary CTA Button */}
          <a
            href={ctaLink}
            className={`bg-white text-indigo-600 rounded-md font-semibold flex items-center justify-center transition-transform transform hover:scale-105 ${buttonClasses}`}
          >
            {ctaText}
            {!isMobile && <ArrowRightIcon />}
          </a>
          {/* Secondary CTA Button */}
          <a
            href={secondaryCtaLink}
            className={`border border-white hover:bg-white hover:text-gray-900 text-white rounded-md font-semibold transition-transform transform hover:scale-105 ${buttonClasses}`}
          >
            {secondaryCtaText}
          </a>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
