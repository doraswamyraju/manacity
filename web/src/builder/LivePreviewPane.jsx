import React, { useState } from 'react';
import BlockRenderer from './BlockRenderer.jsx';
import { X, Smartphone, Monitor } from 'lucide-react';

const DesktopViewLink = ({ onClick }) => (
  <div className="text-center pt-2">
    <button
      onClick={onClick}
      className="group flex flex-col items-center text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
      aria-label="Open Desktop Preview"
    >
      <div className="relative w-48 h-28 border-8 border-gray-500 group-hover:border-indigo-400 rounded-t-lg bg-gray-100 transition-colors flex items-center justify-center shadow-lg">
        <div className="w-full h-full bg-white rounded-sm flex items-center justify-center p-2">
          <span className="text-xs font-bold text-center text-gray-700 group-hover:text-indigo-600 leading-tight">
            Desktop view<br />click here
          </span>
        </div>
      </div>
      <div className="w-56 h-4 bg-gray-400 group-hover:bg-indigo-400 rounded-b-md transition-colors shadow-md"></div>
    </button>
  </div>
);

const DesktopPreviewModal = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="relative w-full max-w-6xl h-[88vh]" onClick={(e) => e.stopPropagation()} style={{ filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.6))' }}>
      <div className="relative mx-auto border-gray-400 bg-gray-300 border-[16px] rounded-t-2xl h-[94%] w-full shadow-2xl flex flex-col overflow-hidden">
        <div className="rounded-lg overflow-y-auto h-full bg-white">
          {children}
        </div>
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 h-4 w-4 bg-gray-500 rounded-full border-2 border-gray-400"></div>
      </div>
      <div className="relative mx-auto bg-gray-200 rounded-b-xl h-[6%] w-[110%] -translate-x-[5%] flex items-center justify-center shadow-lg">
        <div className="w-32 h-2 rounded-lg bg-gray-400"></div>
      </div>
      <button
        onClick={onClose}
        className="absolute -top-4 -right-4 text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl border-2 border-white shadow-xl cursor-pointer"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default function LivePreviewPane({
  pageStructure = {},
  allBlocks = [],
  activePreview = 'mobile',
  setActivePreview,
  branding = null
}) {
  const [isDesktopModalOpen, setDesktopModalOpen] = useState(false);
  const sectionKeys = ['header', 'hero', 'aboutUs', 'services'];

  const renderSections = (mode = 'mobile') => {
    return (
      <div className="w-full bg-white text-slate-900">
        {sectionKeys.map((secKey) => {
          const selectedBlock = pageStructure[secKey];
          if (!selectedBlock) {
            return (
              <div
                key={secKey}
                className="w-full h-24 flex items-center justify-center bg-gray-50 border-b border-dashed border-gray-300"
              >
                <div className="text-center text-gray-400 text-xs">
                  <p className="font-semibold capitalize text-gray-500">{secKey.replace(/([A-Z])/g, ' $1').trim()} Section</p>
                  <p className="text-[11px]">Select a block to place it here</p>
                </div>
              </div>
            );
          }

          const isStickyHeader = secKey === 'header';

          return (
            <div key={secKey} className={`relative group ${isStickyHeader ? 'sticky top-0 z-20 shadow-sm' : ''}`}>
              <BlockRenderer
                blockDef={selectedBlock}
                content={selectedBlock.customData || selectedBlock.defaultData}
                previewMode={mode}
                branding={branding}
              />
            </div>
          );
        })}
        <div className="h-32 bg-gray-50 flex items-center justify-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">End of Page Preview</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-slate-900 p-4 flex flex-col justify-start items-center overflow-y-auto pt-6 border-l-2 border-slate-700">
      <div className="mx-auto w-full flex flex-col items-center space-y-6">
        <div className="w-full flex-shrink-0 flex flex-col items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 text-center">
            Mobile Preview
          </h2>

          {/* 3999 Exact Mobile Chassis */}
          <div className="w-full max-w-[260px] mx-auto">
            <div className="relative mx-auto border-gray-400 bg-gray-300 border-[8px] rounded-[1.5rem] h-[520px] w-full shadow-2xl">
              <div className="h-[24px] w-[2px] bg-gray-300 absolute -left-[10px] top-[60px] rounded-l-lg"></div>
              <div className="h-[24px] w-[2px] bg-gray-300 absolute -left-[10px] top-[100px] rounded-l-lg"></div>
              <div className="h-[40px] w-[2px] bg-gray-300 absolute -right-[10px] top-[120px] rounded-r-lg"></div>
              <div className="rounded-[1.2rem] overflow-hidden w-full h-full bg-white overflow-y-auto">
                {renderSections('mobile')}
              </div>
            </div>
          </div>
        </div>

        {/* 3999 Exact Laptop Graphic Link */}
        <div className="w-full flex justify-center flex-shrink-0">
          <DesktopViewLink onClick={() => setDesktopModalOpen(true)} />
        </div>
      </div>

      {isDesktopModalOpen && (
        <DesktopPreviewModal onClose={() => setDesktopModalOpen(false)}>
          {renderSections('desktop')}
        </DesktopPreviewModal>
      )}
    </div>
  );
}
