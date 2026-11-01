import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  Layers,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Eye,
  Sliders,
  Check,
  Plus,
  Monitor,
  Smartphone,
  Save,
  RotateCcw,
  Search,
  Filter,
  Lock,
  Unlock,
  ShieldCheck,
  HelpCircle,
  Compass
} from 'lucide-react';
import { default3999Blocks } from '../builder/masterRegistry.jsx';
import BlockRenderer from '../builder/BlockRenderer.jsx';
import FocusCustomizer from '../builder/FocusCustomizer.jsx';
import LivePreviewPane from '../builder/LivePreviewPane.jsx';

export default function WebsiteBlocksTab({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  // Navigation & Sections
  const [activeSection, setActiveSection] = useState('HEADER');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('ALL'); // ALL, FREE, PRO

  // Active Building State
  const [allBlocks, setAllBlocks] = useState(default3999Blocks);
  const [selectedBlocks, setSelectedBlocks] = useState({
    header: default3999Blocks.find(b => b.blockKey === 'header-1'),
    hero: default3999Blocks.find(b => b.blockKey === 'hero-1'),
    aboutUs: default3999Blocks.find(b => b.blockKey === 'about-1'),
    services: default3999Blocks.find(b => b.blockKey === 'services-1')
  });

  // Focus Mode
  const [focusingBlock, setFocusingBlock] = useState(null);

  // Live Preview Device
  const [activePreview, setActivePreview] = useState('desktop');

  // Status & Notification
  const [feedback, setFeedback] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Fetch persisted DB overrides (isPremium status, default props) on mount
  useEffect(() => {
    fetchDbBlocks();
  }, []);

  const fetchDbBlocks = async () => {
    try {
      const res = await axios.get('/api/admin/website-blocks');
      if (res.data?.blocks && res.data.blocks.length > 0) {
        const dbBlocks = res.data.blocks;
        // Merge DB premium status and defaults into baseline definitions
        setAllBlocks(prev =>
          prev.map(b => {
            const match = dbBlocks.find(db => db.blockKey === b.blockKey);
            if (match) {
              return {
                ...b,
                isPremium: match.isPremium,
                defaultData: { ...(b.defaultData || {}), ...(match.defaultProps || {}) }
              };
            }
            return b;
          })
        );
      }
    } catch (err) {
      console.warn('Block library fetch error, using built-in registries:', err);
    }
  };

  // Section categories
  const sectionCategories = [
    { key: 'HEADER', label: 'Headers', count: allBlocks.filter(b => b.category === 'HEADER').length },
    { key: 'HERO', label: 'Hero Banners', count: allBlocks.filter(b => b.category === 'HERO').length },
    { key: 'ABOUT', label: 'About Us', count: allBlocks.filter(b => b.category === 'ABOUT').length },
    { key: 'SERVICES', label: 'Services', count: allBlocks.filter(b => b.category === 'SERVICES').length }
  ];

  // Filtered blocks for current center column view
  const currentCategoryBlocks = useMemo(() => {
    return allBlocks.filter(b => {
      const matchCat = b.category === activeSection;
      const matchSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = filterTier === 'ALL' || (filterTier === 'PRO' && b.isPremium) || (filterTier === 'FREE' && !b.isPremium);
      return matchCat && matchSearch && matchTier;
    });
  }, [allBlocks, activeSection, searchQuery, filterTier]);

  // Handle selecting a block to put on live canvas
  const handleSelectBlock = (blockDef) => {
    const secKey = activeSection === 'HEADER' ? 'header' :
                   activeSection === 'HERO' ? 'hero' :
                   activeSection === 'ABOUT' ? 'aboutUs' : 'services';

    setSelectedBlocks(prev => ({
      ...prev,
      [secKey]: blockDef
    }));

    setFeedback({
      type: 'success',
      message: `Selected ${blockDef.name} for the ${activeSection} section!`
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Toggle Super Admin Free vs Pro Tier Gate
  const handleTogglePremium = async (blockDef) => {
    const nextPremium = !blockDef.isPremium;
    setAllBlocks(prev =>
      prev.map(b => b.blockKey === blockDef.blockKey ? { ...b, isPremium: nextPremium } : b)
    );

    if (focusingBlock?.blockKey === blockDef.blockKey) {
      setFocusingBlock(prev => ({ ...prev, isPremium: nextPremium }));
    }

    try {
      await axios.post('/api/admin/website-blocks', {
        category: blockDef.category,
        name: blockDef.name,
        blockKey: blockDef.blockKey,
        description: blockDef.description,
        isPremium: nextPremium,
        defaultProps: blockDef.defaultData || {}
      });

      setFeedback({
        type: 'success',
        message: `${blockDef.name} updated to ${nextPremium ? 'PRO (PAID)' : 'FREE TIER'} in database!`
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to sync tier toggle:', err);
    }
  };

  // Save Focus Customizer adjustments
  const handleSaveFocusData = async (updatedData) => {
    if (!focusingBlock) return;

    setAllBlocks(prev =>
      prev.map(b => b.blockKey === focusingBlock.blockKey ? { ...b, defaultData: updatedData } : b)
    );

    // Also update selectedBlocks if currently active
    const secKey = focusingBlock.category === 'HEADER' ? 'header' :
                   focusingBlock.category === 'HERO' ? 'hero' :
                   focusingBlock.category === 'ABOUT' ? 'aboutUs' : 'services';

    if (selectedBlocks[secKey]?.blockKey === focusingBlock.blockKey) {
      setSelectedBlocks(prev => ({
        ...prev,
        [secKey]: { ...prev[secKey], defaultData: updatedData }
      }));
    }

    try {
      await axios.post('/api/admin/website-blocks', {
        category: focusingBlock.category,
        name: focusingBlock.name,
        blockKey: focusingBlock.blockKey,
        description: focusingBlock.description,
        isPremium: focusingBlock.isPremium,
        defaultProps: updatedData
      });

      setFeedback({
        type: 'success',
        message: `Saved default props for ${focusingBlock.name} to database!`
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to save block properties:', err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Composer Control Banner */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Project 3999 Visual Composer Studio
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SUPER ADMIN CONTROLLER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live React Component Marketplace, Focus Customizer & Dynamic Preview Pane
            </p>
          </div>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {feedback.message}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ManaCity Engine Connected</span>
          </div>
        </div>
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* =========================================================================
            COLUMN 1: LEFT NAVIGATION (Sections & Page Context)
        ========================================================================= */}
        <div className="col-span-2 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col gap-6 overflow-y-auto">
          {/* Section Selector */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              Building Sections
            </h3>
            <div className="space-y-1.5">
              {sectionCategories.map(cat => {
                const isActive = activeSection === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setActiveSection(cat.key);
                      setFocusingBlock(null);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page Structure Summary */}
          <div className="mt-auto p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Active Page Layout
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Header:</span>
                <span className="font-semibold text-indigo-400 truncate max-w-[100px]">
                  {selectedBlocks.header?.name || 'Empty'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Hero:</span>
                <span className="font-semibold text-indigo-400 truncate max-w-[100px]">
                  {selectedBlocks.hero?.name || 'Empty'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">About:</span>
                <span className="font-semibold text-indigo-400 truncate max-w-[100px]">
                  {selectedBlocks.aboutUs?.name || 'Empty'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Services:</span>
                <span className="font-semibold text-indigo-400 truncate max-w-[100px]">
                  {selectedBlocks.services?.name || 'Empty'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2: CENTER WORKSPACE (Block Marketplace OR Focus Customizer)
        ========================================================================= */}
        <div className="col-span-6 bg-slate-950 p-6 flex flex-col overflow-y-auto">
          {focusingBlock ? (
            /* Focus Customizer Mode */
            <FocusCustomizer
              blockDef={focusingBlock}
              currentData={focusingBlock.defaultData}
              isPremium={focusingBlock.isPremium}
              onTogglePremium={() => handleTogglePremium(focusingBlock)}
              onSave={handleSaveFocusData}
              onClose={() => setFocusingBlock(null)}
            />
          ) : (
            /* Block Marketplace with Live Component Cards */
            <div className="space-y-6">
              {/* Sticky Filter & Search Bar */}
              <div className="sticky top-0 z-10 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-md flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeSection} blocks...`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Tiers</option>
                    <option value="FREE">Free Tier Only</option>
                    <option value="PRO">Pro (Paid) Only</option>
                  </select>
                </div>
              </div>

              {/* Live Block Cards List */}
              <div className="space-y-6">
                {currentCategoryBlocks.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-sm">No blocks found matching your query.</p>
                  </div>
                ) : (
                  currentCategoryBlocks.map(blockDef => {
                    const secKey = activeSection === 'HEADER' ? 'header' :
                                   activeSection === 'HERO' ? 'hero' :
                                   activeSection === 'ABOUT' ? 'aboutUs' : 'services';
                    const isCurrentSelected = selectedBlocks[secKey]?.blockKey === blockDef.blockKey;

                    return (
                      <div
                        key={blockDef.blockKey}
                        className={`rounded-2xl border transition-all duration-300 bg-slate-900 overflow-hidden shadow-xl flex flex-col ${
                          isCurrentSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="font-bold text-white text-sm">
                                {blockDef.name}
                              </h3>
                              <span className="text-xs text-slate-400">
                                — {blockDef.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {blockDef.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Super Admin Free vs Pro Gate Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleTogglePremium(blockDef)}
                              title="Click to toggle Free vs Pro gating"
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 border ${
                                blockDef.isPremium
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              }`}
                            >
                              {blockDef.isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              {blockDef.isPremium ? 'PRO (PAID)' : 'FREE TIER'}
                            </button>

                            {/* Select / Active Button */}
                            <button
                              onClick={() => handleSelectBlock(blockDef)}
                              className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
                                isCurrentSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              {isCurrentSelected ? 'Active on Page' : 'Select'}
                            </button>
                          </div>
                        </div>

                        {/* Card Body: Real Interactive Live React Preview */}
                        <div className="relative h-64 overflow-y-auto bg-white text-slate-900 border-b border-slate-800">
                          <BlockRenderer
                            blockDef={blockDef}
                            content={blockDef.defaultData}
                            previewMode="desktop"
                            isPreview={true}
                          />
                        </div>

                        {/* Card Footer Actions */}
                        <div className="px-4 py-2.5 bg-slate-950/90 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-500">
                            Key: <code className="text-slate-400">{blockDef.blockKey}</code> | Variant: <code className="text-slate-400">{blockDef.variant}</code>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setFocusingBlock(blockDef)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-all border border-slate-700"
                            >
                              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                              Customize (Focus Mode)
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            COLUMN 3: RIGHT PERSISTENT LIVE PREVIEW PANE (Desktop & Mobile)
        ========================================================================= */}
        <div className="col-span-4 h-full overflow-hidden">
          <LivePreviewPane
            pageStructure={selectedBlocks}
            allBlocks={allBlocks}
            activePreview={activePreview}
            setActivePreview={setActivePreview}
          />
        </div>
      </div>
    </div>
  );
}
