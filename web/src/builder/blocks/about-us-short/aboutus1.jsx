// src/components/blocks/aboutus1.jsx (Verified)
import React, { useState, useEffect, useRef } from 'react';

// --- Components ---

const CounterCard = ({ label, value, sub }) => (
  <div className="bg-white/4 rounded-lg p-3 text-center flex flex-col items-center justify-center shadow-sm border border-white/10">
    <div className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-200">
      {/* Use + sign for maxed counters for visual impact */}
      {value.toLocaleString()}{value >= 95 ? '+' : ''}
    </div>
    <div className="mt-1 text-xs sm:text-sm text-gray-200/80 font-medium">{label}</div>
    {sub && <div className="text-[10px] text-gray-300/70 mt-1">{sub}</div>}
  </div>
);

// --- Main Block Component ---

// FIX: Accept 'content' prop
const AboutUsSection = ({ content }) => {
  
  // FIX: Use content props for targets and services list
  const leadsTarget = Number(content?.leadsTarget) || 5000;
  const trafficTarget = Number(content?.trafficTarget) || 150000;
  const rankingsTarget = Number(content?.rankingsTarget) || 95;
  const mainHeading = content?.mainHeading || 'Let the numbers talk about us'; // Corrected from content?.heading
  const subheading = content?.subheading || 'Tangible results, visible growth. We focus on measurable outcomes — not empty promises.';
  
  const defaultServices = ['Digital Marketing', 'Social Media', 'SEO', 'Local SEO', 'GMB', 'Graphic Designing', 'Performance Marketing', 'Content'];
  const services = Array.isArray(content?.servicesList) && content.servicesList.length > 0 
    ? content.servicesList 
    : defaultServices;

  // Counter states
  const [leadsCount, setLeadsCount] = useState(0);
  const [trafficCount, setTrafficCount] = useState(0);
  const [rankingsCount, setRankingsCount] = useState(0);

  // Counter animation logic (now using editable target props)
  useEffect(() => {
    let leadsInterval, trafficInterval, rankingsInterval;
    const duration = 1400;
    const stepTime = 12;
    const animateCounter = (target, setter) => {
      const steps = Math.max(1, Math.floor(duration / stepTime));
      const step = Math.max(1, Math.floor(target / steps));
      return setInterval(() => {
        setter(prev => {
          const next = prev + step;
          return next >= target ? target : next;
        });
      }, stepTime);
    };

    leadsInterval = animateCounter(leadsTarget, setLeadsCount);
    trafficInterval = animateCounter(trafficTarget, setTrafficCount);
    rankingsInterval = animateCounter(rankingsTarget, setRankingsCount);

    return () => {
      clearInterval(leadsInterval);
      clearInterval(trafficInterval);
      clearInterval(rankingsInterval);
    };
  }, [leadsTarget, trafficTarget, rankingsTarget]); // Dependencies updated

  // Decorative capsules (Hidden on mobile)
  const fixedPositions = [
    { key: 't-l',  classes: 'top-2 left-2' },      
    { key: 'b-r', classes: 'bottom-2 right-2' },   
    { key: 't-r', classes: 'top-1/4 right-2' },    
    { key: 'b-l', classes: 'bottom-1/4 left-2' },  
    { key: 'c-t', classes: 'top-4 left-1/2 transform -translate-x-1/2' }, 
  ];

  return (
    <section className="relative w-full mx-auto max-w-full overflow-x-hidden
                        bg-gradient-to-br from-gray-900 via-gray-800 to-black 
                        text-white rounded-3xl p-4 sm:p-8 shadow-3xl overflow-hidden">
      
      {/* subtle decorative blurred shapes for depth */}
      <div className="absolute -right-8 -top-6 w-36 h-36 rounded-full bg-purple-600/18 blur-3xl mix-blend-screen opacity-60 pointer-events-none" />
      <div className="absolute -left-12 -bottom-8 w-44 h-44 rounded-full bg-blue-600/12 blur-3xl mix-blend-screen opacity-50 pointer-events-none" />
      
      {/* Main Content Card (Glassy Effect) - Centered for large viewports */}
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-2xl border border-white/10">

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-300">
            {mainHeading}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-200/90 max-w-prose mx-auto">
            {subheading}
          </p>
        </div>

        {/* Counters: stack on mobile, grid on sm up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <CounterCard label="Organic Leads" value={leadsCount} sub="generated" />
          <CounterCard label="Traffic" value={trafficCount} sub="sessions" />
          <CounterCard label="Rankings" value={rankingsCount} sub="% top results" />
        </div>

        {/* Services list card (Compact and centered) */}
        <div className="mx-auto max-w-md">
          <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-3 shadow-inner">
            <h3 className="text-sm font-semibold text-gray-100 mb-2">Our Key Services:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {/* FIX: Use the 'services' list derived from 'servicesList' prop */}
              {services.map(s => (
                <span key={s} className="px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] sm:text-xs font-medium select-none shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed-position capsules (Decorative) */}
      <div className="pointer-events-none absolute inset-0">
        {fixedPositions.map((pos, i) => (
          // Hide all decorative capsules on mobile
          <div
            key={pos.key}
            className={
              `hidden sm:flex absolute ${pos.classes} z-20 ` + 
              `px-3 py-1 rounded-full text-sm whitespace-nowrap select-none ` +
              `bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg/60 backdrop-blur-sm`
            }
            aria-hidden
            style={{ 
                // Small random offset for visual interest on large screens
                transform: pos.classes.includes('translate-x-1/2') ? 'translate(-50%, 0)' : `translate(${i % 2 === 0 ? '-5px' : '5px'}, ${i % 3 === 0 ? '-5px' : '5px'})` 
            }}
          >
            {services[i] ?? services[i % services.length]}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUsSection;