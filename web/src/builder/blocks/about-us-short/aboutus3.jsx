// src/components/blocks/aboutus3.jsx (Verified)
import React from 'react';

/**
 * @brief A redesigned About Us component that merges the content of variant 2
 * with the clean, single-block structure of variant 1. It is fully
 * responsive and optimized for both mobile and desktop.
 *
 * @param {object} props - The component props.
 * @param {object} props.content - Content data for the About Us section.
 * @param {string} props.previewMode - The view mode, 'mobile' or 'desktop'.
 * @returns {JSX.Element} The rendered component.
 */
const AboutUs2Redesigned = ({ content, previewMode = 'desktop' }) => {
  // Destructure content with default values to prevent errors
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

  // --- Responsive Styling ---
  const isMobile = previewMode === 'mobile';

  // FIX: Reduced desktop padding (px-8 py-10) for better fit in the small left-side preview.
  const containerPadding = isMobile ? 'px-4 py-12' : 'px-6 py-10'; 
  
  const headingSize = isMobile ? 'text-2xl' : 'text-3xl';
  const descriptionSize = isMobile ? 'text-base' : 'text-base'; // Kept modest for preview
  const featureTitleSize = isMobile ? 'text-base' : 'text-lg';
  const featureDescriptionSize = isMobile ? 'text-sm' : 'text-sm'; // Kept modest for preview
  const featureGridClasses = isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-4'; // Reduced gap

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

      {/* Content Container */}
      <div className={`relative z-10 mx-auto max-w-5xl text-center text-white ${containerPadding}`}>
        {/* Main Text Content */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400">
            {approachHeading}
          </h2>
          <h3 className={`mt-4 font-extrabold tracking-tight ${headingSize}`}>
            {mainHeading}
          </h3>
          <p className={`mx-auto mt-4 max-w-3xl leading-relaxed text-gray-300 ${descriptionSize}`}>
            {description}
          </p>
        </div>

        {/* Features Section */}
        <div className={`mt-8 grid ${featureGridClasses}`}>
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
              <h4 className={`font-semibold text-teal-300 ${featureTitleSize}`}>{feature.title}</h4>
              <p className={`mt-1 text-gray-400 ${featureDescriptionSize}`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <a
            href={ctaLink}
            className="inline-block rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-teal-700"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs2Redesigned;