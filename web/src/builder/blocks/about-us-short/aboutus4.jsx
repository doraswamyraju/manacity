// src/components/blocks/aboutus4.jsx (Updated to include backgroundImage in destructuring)
import React, { useState, useEffect, useRef } from 'react';

/**
 * @brief About Us component variant 4, now with a prop-driven, responsive structure.
 * This component maintains its unique glowing effects and magnetic UI elements
 * while being optimized for mobile and desktop.
 *
 * @param {object} props - The component props.
 * @param {object} props.content - Content data for the About Us section.
 * @param {string} props.previewMode - The view mode, 'mobile' or 'desktop'.
 * @returns {JSX.Element} The rendered About Us 4 component.
 */
const AboutUs4 = ({ content, previewMode = 'desktop' }) => {
  // Destructure content with default values
  const {
    visionHeading = 'Our Vision',
    mainHeading = "Engineering Tomorrow's Digital Frontier",
    description = "At Rajugari Ventures, we don't just adapt to the future; we build it. We are pioneers of innovation, leveraging next-gen tech to create digital experiences that are not just current, but ahead of the curve.",
    features = [
      { title: 'AI-Powered Strategy', description: 'Using artificial intelligence to uncover market insights and drive hyper-effective marketing campaigns.' },
      { title: 'Immersive Web Tech', description: 'Developing with WebGL, AR, and VR to create truly engaging and interactive user experiences.' },
      { title: 'Data-Centric Design', description: 'Every design choice is backed by data to ensure optimal performance and user satisfaction.' },
    ],
    ctaText = 'Step into the Future',
    ctaLink = '#',
    backgroundImage = null, // Added for consistency with FocusCustomizer, though not visibly used in the block itself
  } = content || {};

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Responsive Styling ---
  const isMobile = previewMode === 'mobile';
  
  const containerPadding = isMobile ? 'px-4 py-16' : 'px-4 py-20';
  const headingSize = isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl';
  const descriptionSize = isMobile ? 'text-base' : 'text-lg md:text-xl';
  const featureGridClasses = isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-3 gap-8';

  // Magnetic Button Component - only enable magnetism on non-touch devices
  const MagneticButton = ({ children, href }) => {
    const btnRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isMagnetic = !isMobile && window.matchMedia('(pointer: fine)').matches;

    const handleMouseMove = (e) => {
      if (!btnRef.current || !isMagnetic) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = btnRef.current.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.2;
      const y = (clientY - (top + height / 2)) * 0.2;
      setPosition({ x, y });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <div
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.1s linear',
        }}
        className="inline-block"
      >
        <a
          href={href}
          className="group relative inline-block text-base font-semibold text-black py-3 px-8 rounded-full bg-cyan-300 transition-all duration-300 shadow-lg hover:shadow-cyan-300/50 transform hover:scale-105"
        >
          {children}
        </a>
      </div>
    );
  };

  return (
    <section className={`relative flex flex-col justify-center items-center overflow-hidden text-white bg-black font-sans ${containerPadding}`}>
      {/* Background Gradient Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"
        ></div>
        <div
          className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_800px_at_50%_200px,#00d9ff33,#000)]"
        ></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Main Title - with parallax effect */}
        <div style={{ transform: `translateY(-${scrollY * 0.1}px)` }}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
            {visionHeading}
          </h2>
          <h3 className={`mt-4 font-extrabold tracking-tight text-white ${headingSize}`}>
            {mainHeading}
          </h3>
          <p className={`mt-6 max-w-3xl mx-auto text-gray-300 ${descriptionSize}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Interactive Grid */}
      <div className={`relative z-10 max-w-6xl mx-auto mt-16 w-full grid ${featureGridClasses}`}>
        {features.map((feature, index) => (
          <div key={index} className="group relative p-6 bg-gray-900/50 rounded-xl border border-gray-800 transition-all duration-300 hover:border-cyan-500/50">
            <div className="absolute -inset-px rounded-xl opacity-0 transition-all duration-300 group-hover:opacity-100"
                 style={{
                   background: 'radial-gradient(600px circle at 50% 50%, rgba(0, 217, 255, 0.15), transparent 80%)'
                 }}></div>
            <h4 className="font-bold text-xl text-white">{feature.title}</h4>
            <p className="text-gray-400 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-16">
        <MagneticButton href={ctaLink}>{ctaText}</MagneticButton>
      </div>
    </section>
  );
};

export default AboutUs4;
