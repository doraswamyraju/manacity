import React, { useState } from 'react';
import BlockRenderer from './BlockRenderer.jsx';
import { Monitor, Smartphone, ExternalLink, Layers, Sparkles } from 'lucide-react';

export default function LivePreviewPane({
  pageStructure,
  allBlocks,
  activePreview = 'desktop',
  setActivePreview,
  branding
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const sectionKeys = ['header', 'hero', 'aboutUs', 'services'];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      {/* Top Preview Controls Bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live Preview
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setActivePreview('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activePreview === 'desktop'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setActivePreview('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activePreview === 'mobile'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div className="flex-1 overflow-y-auto p-4 flex items-start justify-center bg-slate-950/40">
        {activePreview === 'desktop' ? (
          <div className="w-full bg-white rounded-xl shadow-2xl border border-slate-800 overflow-hidden min-h-[500px]">
            {sectionKeys.map((secKey) => {
              const selectedBlock = pageStructure[secKey];
              if (!selectedBlock) {
                return (
                  <div
                    key={secKey}
                    className="p-6 border-b border-dashed border-gray-200 text-center bg-gray-50/50"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {secKey.toUpperCase()} SECTION
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Click "Select" on any {secKey} card to place here</p>
                  </div>
                );
              }

              return (
                <div key={secKey} className="relative group border-b border-gray-100 last:border-b-0">
                  <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {selectedBlock.name}
                  </div>
                  <BlockRenderer
                    blockDef={selectedBlock}
                    content={selectedBlock.customData || selectedBlock.defaultData}
                    previewMode="desktop"
                    branding={branding}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Mobile Device Frame */
          <div className="relative mx-auto border-gray-800 bg-gray-900 border-[8px] rounded-[2rem] h-[640px] w-[320px] shadow-2xl overflow-hidden flex flex-col">
            {/* Speaker & camera notch */}
            <div className="h-4 bg-gray-900 w-full flex items-center justify-center">
              <div className="w-12 h-1 bg-gray-700 rounded-full" />
            </div>

            {/* Inner Mobile Scrollable Canvas */}
            <div className="flex-1 overflow-y-auto bg-white text-gray-900">
              {sectionKeys.map((secKey) => {
                const selectedBlock = pageStructure[secKey];
                if (!selectedBlock) {
                  return (
                    <div
                      key={secKey}
                      className="p-4 border-b border-dashed border-gray-200 text-center bg-gray-50 text-[10px] text-gray-400"
                    >
                      {secKey.toUpperCase()} (EMPTY)
                    </div>
                  );
                }

                return (
                  <div key={secKey} className="border-b border-gray-100 last:border-b-0">
                    <BlockRenderer
                      blockDef={selectedBlock}
                      content={selectedBlock.customData || selectedBlock.defaultData}
                      previewMode="mobile"
                      branding={branding}
                    />
                  </div>
                );
              })}
            </div>

            {/* Home indicator bar */}
            <div className="h-3 bg-gray-900 w-full flex items-center justify-center">
              <div className="w-20 h-0.5 bg-gray-600 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

