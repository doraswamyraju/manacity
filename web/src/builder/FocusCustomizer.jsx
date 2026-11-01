import React, { useState } from 'react';
import BlockRenderer from './BlockRenderer.jsx';
import { ArrowLeft, Save, Sparkles, Check, Upload, RefreshCw } from 'lucide-react';

export default function FocusCustomizer({
  blockDef,
  currentData = {},
  onSave,
  onClose,
  isPremium = false,
  onTogglePremium
}) {
  const [formData, setFormData] = useState({
    ...(blockDef.defaultData || {}),
    ...currentData
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    if (onSave) onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Extract fields dynamically from formData
  const fields = Object.entries(formData).filter(([key]) => typeof formData[key] === 'string' || typeof formData[key] === 'number');

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            title="Back to Block Selector"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Focus Mode Customizer
              </span>
              <h2 className="text-lg font-bold text-white">{blockDef.name}: {blockDef.title}</h2>
            </div>
            <p className="text-xs text-slate-400">Tweak real-time default props, labels, and access tiers for this block</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Super Admin Free vs Pro Gate Toggle */}
          <button
            type="button"
            onClick={onTogglePremium}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isPremium
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isPremium ? 'PRO (PAID TIER)' : 'FREE TIER (COMMUNITY)'}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? 'Defaults Saved!' : 'Save Defaults'}
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Live Interactive Focus Preview */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Live Component Preview (Instant Feedback)
            </span>
            <span className="text-xs text-indigo-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Interactive Render
            </span>
          </div>
          <div className="bg-white rounded-lg overflow-hidden border border-slate-700 text-slate-900 max-h-[380px] overflow-y-auto">
            <BlockRenderer
              blockDef={blockDef}
              content={formData}
              previewMode="desktop"
              isPreview={true}
            />
          </div>
        </div>

        {/* Dynamic Property Form Inputs */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-5">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-slate-300">
            Block Properties & Default Content
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(([key, val]) => {
              const isLong = String(val).length > 60;
              const isImage = key.toLowerCase().includes('url') || key.toLowerCase().includes('image');

              return (
                <div key={key} className={isLong ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {isLong ? (
                    <textarea
                      rows={3}
                      value={val}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

