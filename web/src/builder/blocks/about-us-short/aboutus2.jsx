// src/components/blocks/aboutus2.jsx (Verified)
import React, { useState, useEffect } from 'react';

/**
 * @brief About Us component variant 2: The Results-Driven Architects.
 * This final version is optimized for maximum stability in highly constrained
 * preview panels by ensuring all elements use w-full and strict responsive sizing.
 *
 * @param {object} props - The component props.
 * @param {object} props.content - Content data for the About Us section.
 * @returns {JSX.Element} The rendered About Us 2 component.
 */
const AboutUs2 = ({ content }) => {
  // Destructure content with default values
  const {
    approachHeading = 'Our Approach',
    mainHeading = 'Digital Architects of Tangible Results',
    description = "At Rajugari Ventures, we don't just build websites; we engineer digital solutions. Our team thrives on data and creativity, designing marketing strategies and web experiences that are not only visually stunning but are precision-tuned to drive conversions, engagement, and growth.",
    features = [
      { title: 'Designs that Convert', description: 'User-centric designs focused on turning visitors into customers.' },
      { title: 'Strategies that Scale', description: 'Data-driven marketing plans that grow with your business.' },
      { title: 'Partnerships that Last', description: 'We succeed when you do, building relationships on trust and results.' },
    ],
    ctaText = 'See the Proof',
    ctaLink = '#',
    backgroundImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
  } = content || {};
  
  // NOTE: Removed parallax state/effects for stability.

  return (
    <section className="relative w-full font-sans bg-gray-900 overflow-hidden">
      {/* Background Image with a dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Architectural background"
          className="h-full w-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1920x1080/111827/4A5568?text=Background' }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content Container: Removed max-w-5xl here. The container must be w-full 
        to fill the preview panel completely. The max-width is applied to the 
        inner card instead. 
      */}
      <div className="relative z-10 w-full text-center text-white py-12 px-4 sm:py-20 sm:px-8">
        
        {/* Inner Card: Applied max-w-5xl and centered it with mx-auto */}
        <div className="bg-gray-800 bg-opacity-80 text-white rounded-2xl shadow-2xl backdrop-filter backdrop-blur-lg border border-gray-700 overflow-hidden mx-auto max-w-5xl">
          
          {/* Responsive Padding on Content Block */}
          <div className="p-6 sm:p-12 lg:p-16">
            <div className="text-center">
              
              {/* Responsive Approach Heading */}
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-teal-400">
                {approachHeading}
              </h2>
              
              {/* Responsive Main Heading: text-3xl for mobile, scaling up */}
              <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                {mainHeading}
              </h3>
              
              {/* Responsive Description: text-base for mobile, scaling up */}
              <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Feature Icons Section: grid-cols-1 for mobile, sm:grid-cols-3 for desktop */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 text-center">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl transition-all duration-300 bg-white/5 hover:bg-white/10 shadow-lg"
                >
                  {/* Responsive Feature Title */}
                  <h4 className="font-semibold text-lg sm:text-xl text-teal-300">{feature.title}</h4>
                  {/* Responsive Feature Description */}
                  <p className="text-gray-400 mt-2 text-sm sm:text-base">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-12 text-center">
              <a
                href={ctaLink}
                // Responsive Button Size
                className="group relative inline-block text-base sm:text-lg font-semibold text-white py-3 px-6 sm:py-4 sm:px-8 rounded-lg bg-teal-600 hover:bg-teal-700 transition-transform duration-300 shadow-lg hover:shadow-teal-500/50 hover:scale-[1.05]"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs2;
