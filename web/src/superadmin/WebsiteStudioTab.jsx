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
  HelpCircle
} from 'lucide-react';
import { default3999Blocks } from '../builder/masterRegistry.jsx';
import BlockRenderer from '../builder/BlockRenderer.jsx';
import FocusCustomizer from '../builder/FocusCustomizer.jsx';
import LivePreviewPane from '../builder/LivePreviewPane.jsx';

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
  const [activePreview, setActivePreview] = useState('desktop');

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
      if (res.data?.businessGroups) {
        setBusinesses(res.data.businessGroups);
      }
    } catch (err) {
      console.warn('Failed to fetch businesses for builder access:', err);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleToggleBusinessAccess = async (businessId, currentAccess) => {
    const nextAccess = !currentAccess;
    setBusinesses(prev =>
      prev.map(b => b.id === businessId ? { ...b, hasAdvancedBuilder: nextAccess } : b)
    );
    try {
      await axios.patch(`/api/admin/businesses/${businessId}/builder-access`, {
        hasAdvancedBuilder: nextAccess
      });
      setFeedback({
        type: 'success',
        message: `Updated Builder Access: ${nextAccess ? '⚡ PRO GRANTED' : 'FREE TIER RESTORED'}`
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to update builder access:', err);
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

    setFeedback({
      type: 'success',
      message: `Selected ${blockDef.name} for the ${activeSection} section!`
    });
    setTimeout(() => setFeedback(null), 3000);
  };

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

  const sectionCategories = [
    { key: 'HEADER', label: 'Headers', count: allBlocks.filter(b => b.category === 'HEADER').length },
    { key: 'HERO', label: 'Hero Banners', count: allBlocks.filter(b => b.category === 'HERO').length },
    { key: 'ABOUT', label: 'About Us', count: allBlocks.filter(b => b.category === 'ABOUT').length },
    { key: 'SERVICES', label: 'Services', count: allBlocks.filter(b => b.category === 'SERVICES').length }
  ];

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

  const sandboxCurrentBlock = useMemo(() => {
    return allBlocks.find(b => b.blockKey === sandboxBlockKey) || allBlocks[0];
  }, [allBlocks, sandboxBlockKey]);

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
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'composer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" /> 3-Column Studio
          </button>
          <button
            onClick={() => setActiveSubTab('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'library'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" /> Component Tiers ({allBlocks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sandbox')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4" /> Code & Props Sandbox
          </button>
          <button
            onClick={() => setActiveSubTab('businesses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Column 1: Left Navigation */}
          <div className="col-span-2 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col gap-6 overflow-y-auto">
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

            <div className="mt-auto p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Active Page Blueprint
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

          {/* Column 2: Center Workspace (Block Marketplace OR Focus Customizer) */}
          <div className="col-span-6 bg-slate-950 p-6 flex flex-col overflow-y-auto">
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
              <div className="space-y-6">
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

                <div className="space-y-6">
                  {currentCategoryBlocks.map(blockDef => {
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
                            <button
                              type="button"
                              onClick={() => handleTogglePremium(blockDef)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 border ${
                                blockDef.isPremium
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              }`}
                            >
                              {blockDef.isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              {blockDef.isPremium ? 'PRO (PAID)' : 'FREE TIER'}
                            </button>

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

                        <div className="relative h-64 overflow-y-auto bg-white text-slate-900 border-b border-slate-800">
                          <BlockRenderer
                            blockDef={blockDef}
                            content={blockDef.defaultData}
                            previewMode="desktop"
                            isPreview={true}
                          />
                        </div>

                        <div className="px-4 py-2.5 bg-slate-950/90 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-500">
                            Key: <code className="text-slate-400">{blockDef.blockKey}</code> | Variant: <code className="text-slate-400">{blockDef.variant}</code>
                          </span>

                          <button
                            onClick={() => setFocusingBlock(blockDef)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-all border border-slate-700"
                          >
                            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                            Customize (Focus Mode)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Right Persistent Live Preview Pane */}
          <div className="col-span-4 h-full overflow-hidden">
            <LivePreviewPane
              pageStructure={selectedBlocks}
              allBlocks={allBlocks}
              activePreview={activePreview}
              setActivePreview={setActivePreview}
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
                Free Tier: {allBlocks.filter(b => !b.isPremium).length}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                Pro Tier: {allBlocks.filter(b => b.isPremium).length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Block Name & Key</th>
                  <th className="p-3.5">Variant</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5 text-center">Platform Tier Gating</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {allBlocks.map(block => (
                  <tr key={block.blockKey} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {block.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{block.name}</div>
                      <code className="text-[11px] text-slate-500">{block.blockKey}</code>
                    </td>
                    <td className="p-3.5">
                      <code className="text-indigo-400 font-mono">{block.variant}</code>
                    </td>
                    <td className="p-3.5 text-slate-400 max-w-xs truncate">
                      {block.description}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePremium(block)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border inline-flex items-center gap-1.5 ${
                          block.isPremium
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        {block.isPremium ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        {block.isPremium ? 'PRO (PAID)' : 'FREE (COMMUNITY)'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setFocusingBlock(block);
                          setActiveSection(block.category);
                          setActiveSubTab('composer');
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-all"
                      >
                        Test in Studio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =======================================================================
          SUB-TAB 3: CUSTOM BLOCK CODE & PROPS SANDBOX
      ======================================================================= */}
      {activeSubTab === 'sandbox' && (
        <div className="flex-1 grid grid-cols-12 overflow-hidden p-6 gap-6">
          <div className="col-span-5 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" /> Block Props Playground
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select any component and supply raw JSON props to test live rendering edge cases without affecting live sites.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Block Component
              </label>
              <select
                value={sandboxBlockKey}
                onChange={(e) => {
                  setSandboxBlockKey(e.target.value);
                  const matched = allBlocks.find(b => b.blockKey === e.target.value);
                  if (matched) {
                    const str = JSON.stringify(matched.defaultData || {}, null, 2);
                    setSandboxPropsJson(str);
                    setSandboxParsedProps(matched.defaultData || {});
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {allBlocks.map(b => (
                  <option key={b.blockKey} value={b.blockKey}>
                    [{b.category}] {b.name} ({b.variant})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  JSON Props Payload
                </label>
                {sandboxError && <span className="text-[11px] text-red-400 font-mono">Invalid JSON</span>}
              </div>
              <textarea
                value={sandboxPropsJson}
                onChange={(e) => handleSandboxPropsChange(e.target.value)}
                className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="col-span-7 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" /> Sandbox Interactive Render
                </h3>
                <p className="text-xs text-slate-400">Rendering {sandboxCurrentBlock.name} with live injected JSON</p>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl overflow-y-auto border border-slate-700 shadow-inner">
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
          SUB-TAB 4: BUSINESS BUILDER PERMISSIONS (Grant Pro Builder)
      ======================================================================= */}
      {activeSubTab === 'businesses' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Business Website Builder Permissions</h2>
              <p className="text-xs text-slate-400">
                Grant full 3-column Visual Composer & custom domain capabilities to registered businesses
              </p>
            </div>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={businessSearch}
                onChange={(e) => setBusinessSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {loadingBusinesses ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading businesses...</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Business Name</th>
                    <th className="p-3.5">Owner Email</th>
                    <th className="p-3.5">City</th>
                    <th className="p-3.5">Current Builder Tier</th>
                    <th className="p-3.5 text-right">Access Control Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredBusinesses.map(bus => (
                    <tr key={bus.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white text-sm">
                        {bus.name}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {bus.owner?.email || 'N/A'}
                      </td>
                      <td className="p-3.5 capitalize text-slate-400">
                        {bus.city || 'Tirupati'}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                          bus.hasAdvancedBuilder
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {bus.hasAdvancedBuilder ? '⚡ Pro Builder Active' : 'Free Microsite Plan'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleBusinessAccess(bus.id, bus.hasAdvancedBuilder)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border inline-flex items-center gap-1.5 ${
                            bus.hasAdvancedBuilder
                              ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-md'
                          }`}
                        >
                          {bus.hasAdvancedBuilder ? 'Revoke Pro Builder' : '⚡ Grant Pro Access'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
