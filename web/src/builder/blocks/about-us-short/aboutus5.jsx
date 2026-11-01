// src/components/blocks/about-us-short/aboutus5.jsx (Verified)
import React, { useState, useEffect } from 'react';

/**
 * @brief About Us component variant 5: The Human-Centric Storytellers.
 */
const AboutUs5 = ({ content, containerScrollTop = 0 }) => {
  // --- FIX: SVG Icons are now defined BEFORE they are used. ---
  const IconShield = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056c4.52.342 8.618-2.056 9-6.944a12.02 12.02 0 00-1.382-5.968z" /></svg>;
  const IconBulb = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
  const IconGrowth = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
  const IconHandshake = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

  // Destructure content with default values to prevent errors if content is missing
  const {
    storyHeading = 'Our Story',
    mainHeading = "More Than a Service, We're Your Partner",
    paragraph1 = "At Rajugari Ventures, we believe the best digital experiences are born from collaboration and authentic connection. We're a team of passionate creators dedicated to understanding your story and translating it into a compelling digital presence.",
    paragraph2 = "Your goals become our goals. We're here to listen, to understand your audience, and to build a lasting partnership founded on transparency, trust, and shared success.",
    ctaText = "Let's Tell Your Story",
    ctaLink = '#',
    valueCards = [
      { title: "Transparency First", icon: <IconShield />, children: "Open communication is our foundation. You're always in the loop." },
      { title: "Authentic Creativity", icon: <IconBulb />, children: "We craft unique solutions that reflect your brand's true identity." },
      { title: "Shared Success", icon: <IconGrowth />, children: "We measure our success by the growth and achievements of our clients." },
      { title: "Lasting Relationships", icon: <IconHandshake />, children: "We're not just a one-time vendor; we're your long-term digital partner." },
    ],
  } = content || {};

  const [windowScrollY, setWindowScrollY] = useState(0);
  const effectiveScrollPosition = containerScrollTop !== undefined ? containerScrollTop : windowScrollY;

  useEffect(() => {
    if (containerScrollTop === undefined) {
      const handleWindowScroll = () => {
        setWindowScrollY(window.pageYOffset);
      };
      window.addEventListener('scroll', handleWindowScroll);
      return () => window.removeEventListener('scroll', handleWindowScroll);
    }
  }, [containerScrollTop]);


  // Sub-component for the interactive value cards
  const ValueCard = ({ icon, title, children }) => {
    return (
      <div className="group relative p-6 rounded-2xl bg-gray-800/50 border border-gray-700 overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-600/10">
        <div className="relative z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg mb-4 text-amber-400 transition-colors duration-300 group-hover:bg-amber-500/20 group-hover:text-amber-300">
            {icon}
          </div>
          <h4 className="font-bold text-xl text-white">{title}</h4>
          <p className="text-gray-400 mt-2">{children}</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-600/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      </div>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 px-4 text-white my-8 bg-gray-900 font-sans">
      {/* Parallax Background Elements */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"
        style={{ transform: `translateY(${effectiveScrollPosition * 0.2}px)` }}
      ></div>
      <div
        className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"
        style={{ transform: `translateY(${effectiveScrollPosition * 0.1}px)` }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Narrative */}
          <div className="text-center lg:text-left">
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">
              {storyHeading}
            </h2>
            <h3 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {mainHeading}
            </h3>
            <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
              {paragraph1}
            </p>
            <p className="mt-4 text-lg md:text-xl text-gray-300 leading-relaxed">
              {paragraph2}
            </p>
            <div className="mt-8">
              <a
                href={ctaLink}
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                {ctaText}
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {valueCards.map((card, index) => (
              <ValueCard key={index} title={card.title} icon={card.icon}>
                {card.children}
              </ValueCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs5;
