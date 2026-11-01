import React from 'react';

// Reusable SVG Icon
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const HeaderIcon = (props) => <Icon path="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5-13.5h16.5" {...props} />;
const HeroIcon = (props) => <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" {...props} />;
const AboutUsIcon = (props) => <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" {...props} />;
const ServicesIcon = (props) => <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" {...props} />;
const FinalizeIcon = (props) => <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" {...props} />;

const sectionConfigs = [
  { key: 'HEADER', label: 'Header', Icon: HeaderIcon },
  { key: 'HERO', label: 'Hero', Icon: HeroIcon },
  { key: 'ABOUT', label: 'About Us', Icon: AboutUsIcon },
  { key: 'SERVICES', label: 'Services', Icon: ServicesIcon }
];

export default function SectionNavbar({ activeSection, onSelectSection, onFinalize }) {
  return (
    <div className="mb-6 p-2 bg-gray-100 rounded-xl shadow-inner border border-gray-200">
      <div className="flex items-center justify-center flex-wrap gap-1">
        {sectionConfigs.map(({ key, label, Icon: SectionIcon }) => {
          const isActive = activeSection === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectSection(key)}
              title={label}
              className={`flex flex-col items-center justify-center text-center p-2 rounded-xl transition-all duration-200 w-20 h-20 sm:w-24 sm:h-20 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-indigo-600'
              }`}
            >
              <SectionIcon className="w-7 h-7 mb-1" />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          );
        })}
        {onFinalize && (
          <button
            type="button"
            onClick={onFinalize}
            title="Finalize Page"
            className="flex flex-col items-center justify-center text-center p-2 rounded-xl transition-all duration-200 w-20 h-20 sm:w-24 sm:h-20 bg-green-600 text-white hover:bg-green-700 shadow-md cursor-pointer"
          >
            <FinalizeIcon className="w-7 h-7 mb-1" />
            <span className="text-xs font-semibold">Finalize</span>
          </button>
        )}
      </div>
    </div>
  );
}
