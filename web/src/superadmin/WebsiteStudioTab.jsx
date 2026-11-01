import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Compass,
  Layers,
  Code2,
  Users,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Eye,
  Sliders,
  Check,
  Search,
  Filter,
  Save,
  RotateCcw,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { default3999Blocks } from '../builder/masterRegistry.jsx';
import BlockRenderer from '../builder/BlockRenderer.jsx';
import FocusCustomizer from '../builder/FocusCustomizer.jsx';
import LivePreviewPane from '../builder/LivePreviewPane.jsx';
import SectionNavbar from '../builder/SectionNavbar.jsx';

export default function WebsiteStudioTab({ theme = 'dark', initialSubTab = 'composer' }) {
  const isDark = theme === 'dark';

  // Top Sub-Tabs: 'composer' | 'library' | 'sandbox' | 'businesses'
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  // Studio Composer State
  const [activeSection, setActiveSection] = useState('HEADER');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');

  // Blocks Catalog State
  const [allBlocks, setAllBlocks] = useState(default3999Blocks);
  const [selectedBlocks, setSelectedBlocks] = useState({
    header: default3999Blocks.find(b => b.blockKey === 'header-1'),
    hero: default3999Blocks.find(b => b.blockKey === 'hero-1'),
    aboutUs: default3999Blocks.find(b => b.blockKey === 'about-1'),
    services: default3999Blocks.find(b => b.blockKey === 'services-1')
  });

  const [focusingBlock, setFocusingBlock] = useState(null);

  // Sandbox State
  const [sandboxBlockKey, setSandboxBlockKey] = useState('header-1');
  const [sandboxPropsJson, setSandboxPropsJson] = useState('{\n  "companyName": "Custom ManaCity Preview",\n  "phoneNumber": "+91 87907 91101"\n}');
  const [sandboxParsedProps, setSandboxParsedProps] = useState({ companyName: "Custom ManaCity Preview", phoneNumber: "+91 87907 91101" });
  const [sandboxError, setSandboxError] = useState('');

  // Business Permissions State
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');

  // Global Notification
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchDbBlocks();
    fetchBusinesses();
  }, []);

  const fetchDbBlocks = async () => {
    try {
      const res = await axios.get('/api/admin/website-blocks');
      if (res.data?.blocks && res.data.blocks.length > 0) {
        const dbBlocks = res.data.blocks;
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
      console.warn('Block library fetch error:', err);
    }
  };

  const fetchBusinesses = async () => {
    setLoadingBusinesses(true);
    try {
      const res = await axios.get('/api/admin/businesses');
      if (res.data?.businesses) {
        setBusinesses(res.data.businesses);
      }
    } catch (err) {
      console.warn('Businesses fetch error:', err);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleTogglePremium = async (blockDef) => {
    const updatedStatus = !blockDef.isPremium;
    setAllBlocks(prev =>
      prev.map(b => b.blockKey === blockDef.blockKey ? { ...b, isPremium: updatedStatus } : b)
    );

    try {
      await axios.patch(`/api/admin/website-blocks/${blockDef.blockKey}/tier`, {
        isPremium: updatedStatus
      });
      setFeedback({
        type: 'success',
        message: `${blockDef.name} marked as ${updatedStatus ? 'PRO (PAID)' : 'FREE TIER'}`
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to update tier in DB:', err);
    }
  };

  const handleToggleBusinessPermission = async (businessId, currentStatus) => {
    const newStatus = !currentStatus;
    setBusinesses(prev =>
      prev.map(b => b.id === businessId ? { ...b, hasAdvancedWebsiteBuilder: newStatus } : b)
    );

    try {
      await axios.patch(`/api/admin/businesses/${businessId}/website-builder-permission`, {
        hasAdvancedWebsiteBuilder: newStatus
      });
      setFeedback({
        type: 'success',
        message: `Updated Website Studio permission to ${newStatus ? 'ENABLED (PRO)' : 'STANDARD'}`
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to update business permission:', err);
    }
  };

  const handleSelectBlock = (blockDef) => {
    const secKey = activeSection === 'HEADER' ? 'header' :
                   activeSection === 'HERO' ? 'hero' :
                   activeSection === 'ABOUT' ? 'aboutUs' : 'services';

    setSelectedBlocks(prev => ({
      ...prev,
      [secKey]: blockDef
    }));
  };

  const handleSkipSection = () => {
    if (activeSection === 'HEADER') setActiveSection('HERO');
    else if (activeSection === 'HERO') setActiveSection('ABOUT');
    else if (activeSection === 'ABOUT') setActiveSection('SERVICES');
    else if (activeSection === 'SERVICES') setActiveSection('HEADER');
    setFocusingBlock(null);
  };

  const handleAddAndProceed = (blockDef) => {
    handleSelectBlock(blockDef);
    handleSkipSection();
  };

  const handleSaveFocusData = async (updatedData) => {
    if (!focusingBlock) return;

    setAllBlocks(prev =>
      prev.map(b => b.blockKey === focusingBlock.blockKey ? { ...b, defaultData: updatedData } : b)
    );

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

  const handleSandboxPropsChange = (val) => {
    setSandboxPropsJson(val);
    try {
      const parsed = JSON.parse(val);
      setSandboxParsedProps(parsed);
      setSandboxError('');
    } catch (e) {
      setSandboxError(e.message);
    }
  };

  const currentCategoryBlocks = useMemo(() => {
    return allBlocks.filter(b => {
      const matchCat = b.category === activeSection;
      const matchSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = filterTier === 'ALL' || (filterTier === 'PRO' && b.isPremium) || (filterTier === 'FREE' && !b.isPremium);
      return matchCat && matchSearch && matchTier;
    });
  }, [allBlocks, activeSection, searchQuery, filterTier]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const q = businessSearch.toLowerCase();
      return !q || (b.name && b.name.toLowerCase().includes(q)) || (b.owner?.email && b.owner.email.toLowerCase().includes(q));
    });
  }, [businesses, businessSearch]);

  const currentSecKey = activeSection === 'HEADER' ? 'header' :
                        activeSection === 'HERO' ? 'hero' :
                        activeSection === 'ABOUT' ? 'aboutUs' : 'services';

  const currentActiveBlock = selectedBlocks[currentSecKey];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Studio Header & Sub-Tab Bar */}
      <div className="px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/25">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Website Builder Studio Control Hub
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PROJECT 3999 ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage live JSX components, Free vs Pro tiers, custom block sandboxes, and business builder access
            </p>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {feedback.message}
          </div>
        )}

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('composer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'composer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" /> 3-Column Studio
          </button>
          <button
            onClick={() => setActiveSubTab('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'library'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" /> Component Tiers ({allBlocks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sandbox')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4" /> Code & Props Sandbox
          </button>
          <button
            onClick={() => setActiveSubTab('businesses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'businesses'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" /> Builder Permissions
          </button>
        </div>
      </div>

      {/* =======================================================================
          SUB-TAB 1: 3-COLUMN VISUAL COMPOSER (Project 3999 Exact Experience)
      ======================================================================= */}
      {activeSubTab === 'composer' && (
        <div className="flex-1 grid grid-cols-12 overflow-hidden bg-gray-100 text-slate-800">
          {/* Main BlockSelector Column: 8 to 9 cols */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 p-8 overflow-y-auto">
            {focusingBlock ? (
              <FocusCustomizer
                blockDef={focusingBlock}
                currentData={focusingBlock.defaultData}
                isPremium={focusingBlock.isPremium}
                onTogglePremium={() => handleTogglePremium(focusingBlock)}
                onSave={handleSaveFocusData}
                onClose={() => setFocusingBlock(null)}
              />
            ) : (
              <div>
                {/* 1. Horizontal Section Navbar with Exact 3999 Icons & Active Indigo State */}
                <SectionNavbar
                  activeSection={activeSection}
                  onSelectSection={(sec) => {
                    setActiveSection(sec);
                    setFocusingBlock(null);
                  }}
                  onFinalize={() => {
                    setFeedback({ type: 'success', message: 'Page configuration finalized in studio!' });
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                />

                {/* 2. Sticky Filter & Search Bar with Red Skip Section Button */}
                <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 mb-8 sticky top-0 z-10">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="relative md:col-span-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${activeSection} blocks...`}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-800 placeholder-gray-400 bg-white"
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="md:col-span-3">
                      <select
                        value={filterTier}
                        onChange={(e) => setFilterTier(e.target.value)}
                        className="w-full py-2 px-4 border rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
                      >
                        <option value="ALL">Filter by Tier (All)</option>
                        <option value="FREE">Free Tier Only</option>
                        <option value="PRO">Pro (Paid) Only</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <select
                        className="w-full py-2 px-4 border rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
                      >
                        <option>Filter by Style (All)</option>
                        <option>Modern</option>
                        <option>Minimalist</option>
                        <option>High Tech</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSkipSection}
                        className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm cursor-pointer text-sm"
                      >
                        Skip Section
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Top Active Live Edit Card with Indigo Highlight Border */}
                {currentActiveBlock && (
                  <div className="mb-8 p-4 bg-white rounded-xl shadow-2xl border-4 border-indigo-400/80">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        Current Block: {currentActiveBlock.name} (Live Edit)
                      </h3>
                      <button
                        type="button"
                        onClick={() => setFocusingBlock(currentActiveBlock)}
                        className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-4 h-4" />
                        Customize Current Block
                      </button>
                    </div>
                    <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <BlockRenderer
                        blockDef={currentActiveBlock}
                        content={currentActiveBlock.defaultData}
                        previewMode="desktop"
                        isPreview={true}
                      />
                    </div>
                  </div>
                )}

                {/* 4. Block Selection Cards Grid */}
                <div className="space-y-8">
                  {currentCategoryBlocks.map((blockDef) => {
                    const isSelected = currentActiveBlock?.blockKey === blockDef.blockKey;

                    return (
                      <div
                        key={blockDef.blockKey}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-300 flex flex-col"
                      >
                        <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-800 text-base">{blockDef.name}</h3>
                              <span className="text-xs text-gray-500">— {blockDef.title}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{blockDef.description}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Super Admin Free vs Pro Gate Toggle */}
                            <button
                              type="button"
                              onClick={() => handleTogglePremium(blockDef)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 border cursor-pointer ${
                                blockDef.isPremium
                                  ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              }`}
                            >
                              {blockDef.isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              {blockDef.isPremium ? 'PRO (PAID)' : 'FREE TIER'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSelectBlock(blockDef)}
                              className={`flex items-center text-xs px-3.5 py-1.5 rounded-full transition-colors shadow-sm font-semibold cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                              title="Select this block to preview it on the right"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              {isSelected ? 'Active on Page' : 'Select'}
                            </button>
                          </div>
                        </div>

                        {/* Block Preview Canvas (384px height matching 3999 h-96) */}
                        <div className="relative h-96 border-b border-gray-200 bg-gray-50 overflow-y-auto">
                          <BlockRenderer
                            blockDef={blockDef}
                            content={blockDef.defaultData}
                            previewMode="desktop"
                            isPreview={true}
                          />
                        </div>

                        {/* Card Footer: Customize & Add to Page */}
                        <div className="p-3 bg-gray-50 flex justify-between items-center">
                          <span className="text-[11px] text-gray-400 font-mono">
                            Key: {blockDef.blockKey} | Variant: {blockDef.variant}
                          </span>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setFocusingBlock(blockDef)}
                              className="flex items-center text-xs px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm font-semibold cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                              Customize
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddAndProceed(blockDef)}
                              className="flex items-center text-xs px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5 mr-1" />
                              Add & Proceed
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Persistent Right Preview Column (3999 Exact Dark Chassis + Laptop Graphic Modal) */}
          <div className="hidden lg:block col-span-4 xl:col-span-3 h-full overflow-hidden">
            <LivePreviewPane
              pageStructure={selectedBlocks}
            />
          </div>
        </div>
      )}

      {/* =======================================================================
          SUB-TAB 2: COMPONENT LIBRARY & TIERS TABLE
      ======================================================================= */}
      {activeSubTab === 'library' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Full Registry Catalog & Access Gating</h2>
              <p className="text-xs text-slate-400">Total {allBlocks.length} verified React components mapped into ManaCity's engine</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {allBlocks.filter(b => !b.isPremium).length} Free
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                {allBlocks.filter(b => b.isPremium).length} Pro
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBlocks.map(block => (
              <div key={block.blockKey} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {block.category}
                    </span>
                    <button
                      onClick={() => handleTogglePremium(block)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                        block.isPremium
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {block.isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {block.isPremium ? 'PRO' : 'FREE'}
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-white">{block.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{block.title}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-mono">{block.blockKey}</span>
                  <button
                    onClick={() => {
                      setActiveSection(block.category);
                      setFocusingBlock(block);
                      setActiveSubTab('composer');
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Edit Props →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =======================================================================
          SUB-TAB 3: CODE & PROPS SANDBOX
      ======================================================================= */}
      {activeSubTab === 'sandbox' && (
        <div className="flex-1 grid grid-cols-12 overflow-hidden p-6 gap-6">
          <div className="col-span-5 flex flex-col gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Block Component
              </label>
              <select
                value={sandboxBlockKey}
                onChange={(e) => setSandboxBlockKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                {allBlocks.map(b => (
                  <option key={b.blockKey} value={b.blockKey}>
                    [{b.category}] {b.name} ({b.blockKey})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                JSON Properties & Blueprint Injection
              </label>
              <textarea
                value={sandboxPropsJson}
                onChange={(e) => handleSandboxPropsChange(e.target.value)}
                className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
              {sandboxError && (
                <p className="text-xs text-red-400 mt-2">Error: {sandboxError}</p>
              )}
            </div>
          </div>

          <div className="col-span-7 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Sandbox Preview
            </div>
            <div className="flex-1 overflow-y-auto bg-white text-slate-900">
              <BlockRenderer
                blockDef={sandboxCurrentBlock}
                content={sandboxParsedProps}
                previewMode="desktop"
                isPreview={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          SUB-TAB 4: BUSINESS PERMISSIONS
      ======================================================================= */}
      {activeSubTab === 'businesses' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Business Website Builder Tiers</h2>
              <p className="text-xs text-slate-400">Grant business owners access to the Pro 3-Column Studio</p>
            </div>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={businessSearch}
                onChange={(e) => setBusinessSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Business Name</th>
                  <th className="p-3 font-semibold">Owner</th>
                  <th className="p-3 font-semibold">Current Builder Mode</th>
                  <th className="p-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBusinesses.map(bus => (
                  <tr key={bus.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{bus.name}</td>
                    <td className="p-3 text-slate-400">{bus.owner?.email || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bus.hasAdvancedWebsiteBuilder ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bus.hasAdvancedWebsiteBuilder ? 'Pro Studio Enabled' : 'Single-Page Standard'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleBusinessPermission(bus.id, bus.hasAdvancedWebsiteBuilder)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          bus.hasAdvancedWebsiteBuilder
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        {bus.hasAdvancedWebsiteBuilder ? 'Revoke Pro' : 'Grant Pro Studio'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
