import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Sections from './WebsiteSections';
import { extractColorsFromLogo } from './OnboardingWizard';
import { default3999Blocks } from '../builder/masterRegistry.jsx';
import BlockRenderer from '../builder/BlockRenderer.jsx';
import FocusCustomizer from '../builder/FocusCustomizer.jsx';
import LivePreviewPane from '../builder/LivePreviewPane.jsx';
import SectionNavbar from '../builder/SectionNavbar.jsx';
import { Compass, Sliders, Check, Lock, Sparkles, Monitor, Smartphone, Search, RefreshCw, X, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function WebsiteBuilder({ onBack, theme: appTheme }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [extractingColors, setExtractingColors] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Determine whether current dashboard environment is in dark mode
  const isAppDark = appTheme ? appTheme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') !== 'light');

  // Core configurations
  const [website, setWebsite] = useState(null);
  const [businessGroup, setBusinessGroup] = useState(null);

  // Editor states
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [theme, setTheme] = useState('default');
  const [primaryColor, setPrimaryColor] = useState('#1976d2');
  const [secondaryColor, setSecondaryColor] = useState('#9c27b0');
  const [font, setFont] = useState('Outfit');
  const [logoUrl, setLogoUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Custom Domain BYOD States
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [connectingDomain, setConnectingDomain] = useState(false);
  const [domainModalTab, setDomainModalTab] = useState('BYOD');
  const [domainSearchQuery, setDomainSearchQuery] = useState('');
  const [searchingDomain, setSearchingDomain] = useState(false);
  const [domainSearchResults, setDomainSearchResults] = useState([]);
  const [orderingDomain, setOrderingDomain] = useState(null);
  const [dnsStatus, setDnsStatus] = useState(null);
  const [verifyingDns, setVerifyingDns] = useState(false);
  const [domainSuccess, setDomainSuccess] = useState('');
  const [domainError, setDomainError] = useState('');

  // Section States
  const [headerConfig, setHeaderConfig] = useState({ title: '', subtitle: '', ctaText: '', ctaLink: '', bgImage: '', alignment: 'center' });
  const [aboutConfig, setAboutConfig] = useState({ title: '', content: '', image: '', bulletPoints: [] });
  const [servicesConfig, setServicesConfig] = useState({ title: '', items: [] });
  const [galleryConfig, setGalleryConfig] = useState({ title: '', images: [] });
  const [contactConfig, setContactConfig] = useState({ email: '', phone: '', address: '', showMap: true });
  const [activeTab, setActiveTab] = useState('header');

  // --- PROJECT 3999 STUDIO STATES ---
  const [builderStudioMode, setBuilderStudioMode] = useState('project-3999-studio');
  const [studioActiveSection, setStudioActiveSection] = useState('HEADER');
  const [studioSearchQuery, setStudioSearchQuery] = useState('');
  const [studioFilterStyle, setStudioFilterStyle] = useState('ALL');
  const [studioFilterFeature, setStudioFilterFeature] = useState('ALL');

  const [selectedStudioBlocks, setSelectedStudioBlocks] = useState({
    header: default3999Blocks.find(b => b.blockKey === 'header-1'),
    hero: default3999Blocks.find(b => b.blockKey === 'hero-1'),
    aboutUs: default3999Blocks.find(b => b.blockKey === 'about-1'),
    services: default3999Blocks.find(b => b.blockKey === 'services-1')
  });

  const [studioFocusBlock, setStudioFocusBlock] = useState(null);

  // Business Permissions for Pro Builder
  const [hasAdvancedBuilder, setHasAdvancedBuilder] = useState(true);

  useEffect(() => {
    fetchWebsiteData();
  }, []);

  const fetchWebsiteData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/website');
      if (res.data) {
        setWebsite(res.data.website);
        setBusinessGroup(res.data.businessGroup);

        if (res.data.businessGroup?.hasAdvancedWebsiteBuilder !== undefined) {
          setHasAdvancedBuilder(Boolean(res.data.businessGroup.hasAdvancedWebsiteBuilder));
        }

        const wb = res.data.website;
        if (wb) {
          setSubdomain(wb.subdomain || '');
          setCustomDomain(wb.customDomain || '');
          setTheme(wb.theme || 'default');
          setPrimaryColor(wb.primaryColor || '#1976d2');
          setSecondaryColor(wb.secondaryColor || '#9c27b0');
          setFont(wb.font || 'Outfit');
          setLogoUrl(wb.logoUrl || res.data.businessGroup?.logoUrl || '');
          setIsPublished(wb.isPublished || false);

          if (wb.headerConfig) setHeaderConfig(wb.headerConfig);
          if (wb.aboutConfig) setAboutConfig(wb.aboutConfig);
          if (wb.servicesConfig) setServicesConfig(wb.servicesConfig);
          if (wb.galleryConfig) setGalleryConfig(wb.galleryConfig);
          if (wb.contactConfig) setContactConfig(wb.contactConfig);

          if (wb.themeConfig?.studioBlocks) {
            setSelectedStudioBlocks(prev => ({ ...prev, ...wb.themeConfig.studioBlocks }));
          }
        } else if (res.data.businessGroup) {
          const bg = res.data.businessGroup;
          setHeaderConfig(prev => ({
            ...prev,
            title: bg.name || '',
            subtitle: bg.description || '',
            ctaText: 'Contact Us',
            ctaLink: '#contact'
          }));
          setAboutConfig(prev => ({
            ...prev,
            title: `About ${bg.name || 'Us'}`,
            content: bg.description || ''
          }));
          setContactConfig(prev => ({
            ...prev,
            email: bg.email || '',
            phone: bg.mobileNumber || '',
            address: bg.address || ''
          }));
          setLogoUrl(bg.logoUrl || '');
          if (bg.name) {
            setSubdomain(bg.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load website configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWebsite = async (publishStatus = isPublished) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        subdomain,
        customDomain,
        theme,
        primaryColor,
        secondaryColor,
        font,
        logoUrl,
        isPublished: publishStatus,
        headerConfig,
        aboutConfig,
        servicesConfig,
        galleryConfig,
        contactConfig,
        themeConfig: {
          builderMode: builderStudioMode,
          studioBlocks: selectedStudioBlocks
        }
      };

      const res = await axios.post('/api/website', payload);
      setWebsite(res.data.website);
      setIsPublished(publishStatus);
      setSuccess(publishStatus ? 'Website published successfully!' : 'Changes saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save website');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoColorExtraction = async () => {
    if (!logoUrl) {
      setError('Please provide a logo URL or image first to extract colors.');
      return;
    }
    try {
      setExtractingColors(true);
      setError('');
      const colors = await extractColorsFromLogo(logoUrl);
      if (colors.primary) setPrimaryColor(colors.primary);
      if (colors.secondary) setSecondaryColor(colors.secondary);
      setSuccess(`Extracted Colors: Primary (${colors.primary}), Secondary (${colors.secondary})`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Could not extract colors from the provided logo.');
    } finally {
      setExtractingColors(false);
    }
  };

  // Skip section to next section
  const handleSkipSection = () => {
    if (studioActiveSection === 'HEADER') setStudioActiveSection('HERO');
    else if (studioActiveSection === 'HERO') setStudioActiveSection('ABOUT');
    else if (studioActiveSection === 'ABOUT') setStudioActiveSection('SERVICES');
    else if (studioActiveSection === 'SERVICES') setStudioActiveSection('HEADER');
  };

  const handleSelectBlockForSection = (block) => {
    const sec = studioActiveSection === 'HEADER' ? 'header' :
                studioActiveSection === 'HERO' ? 'hero' :
                studioActiveSection === 'ABOUT' ? 'aboutUs' : 'services';
    setSelectedStudioBlocks(prev => ({
      ...prev,
      [sec]: block
    }));
  };

  const handleAddAndProceed = (block) => {
    handleSelectBlockForSection(block);
    handleSkipSection();
  };

  const currentSectionKey = studioActiveSection === 'HEADER' ? 'header' :
                           studioActiveSection === 'HERO' ? 'hero' :
                           studioActiveSection === 'ABOUT' ? 'aboutUs' : 'services';

  const currentSelectedBlock = selectedStudioBlocks[currentSectionKey];

  const visibleBlocks = default3999Blocks.filter(b => {
    const matchCat = b.category === studioActiveSection;
    const matchSearch = !studioSearchQuery || b.name.toLowerCase().includes(studioSearchQuery.toLowerCase()) || b.title.toLowerCase().includes(studioSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const brandingPayload = {
    business_name: businessGroup?.name || 'My Business',
    companyName: businessGroup?.name || 'My Business',
    phone_number: businessGroup?.mobileNumber || '+91 87907 91101',
    email: businessGroup?.email || 'contact@manacity.in',
    logo_url: logoUrl || businessGroup?.logoUrl || 'https://placehold.co/140x48/1e3a8a/ffffff?text=My+Logo'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="website-builder-container" style={{ maxWidth: '1600px', margin: '0 auto', paddingBottom: '2rem' }}>
      {/* Top Banner / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '12px', backgroundColor: '#4f46e5', color: '#fff', display: 'flex' }}>
            <Compass size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Website Builder Studio</h1>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '999px', backgroundColor: '#e0e7ff', color: '#4338ca', fontWeight: 700 }}>
                Project 3999 Architecture
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              Create and preview your high-converting business website with live modular blocks
            </p>
          </div>
        </div>

        {/* Studio Mode Selector Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={() => setBuilderStudioMode('project-3999-studio')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: builderStudioMode === 'project-3999-studio' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
              backgroundColor: builderStudioMode === 'project-3999-studio' ? '#4f46e5' : '#ffffff',
              color: builderStudioMode === 'project-3999-studio' ? '#ffffff' : '#475569',
              boxShadow: builderStudioMode === 'project-3999-studio' ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : 'none'
            }}
          >
            ★ Visual Composer Studio (3999)
          </button>

          <button
            type="button"
            onClick={() => setBuilderStudioMode('single-page')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: builderStudioMode === 'single-page' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: builderStudioMode === 'single-page' ? '#0284c7' : '#ffffff',
              color: builderStudioMode === 'single-page' ? '#ffffff' : '#475569'
            }}
          >
            Single-Page Microsite Form
          </button>

          <button
            type="button"
            onClick={() => handleSaveWebsite(isPublished)}
            disabled={saving}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
            }}
          >
            {saving ? 'Saving...' : 'Save Website'}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1'
              }}
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {success && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', fontSize: '0.85rem', fontWeight: 600 }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* ===================================================================
          PROJECT 3999 EXACT USER PANEL STUDIO EXPERIENCE
      =================================================================== */}
      {builderStudioMode === 'project-3999-studio' ? (
        <div className="grid grid-cols-12 rounded-2xl overflow-hidden border border-gray-300 shadow-xl bg-gray-100 min-h-[750px]">
          {/* Main Workspace: 9 Columns on XL, 8 Columns on LG */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 p-6 overflow-y-auto">
            {studioFocusBlock ? (
              <FocusCustomizer
                blockDef={studioFocusBlock}
                currentData={studioFocusBlock.defaultData}
                isPremium={studioFocusBlock.isPremium}
                onTogglePremium={() => {}}
                onSave={(customData) => {
                  const sec = studioActiveSection === 'HEADER' ? 'header' :
                              studioActiveSection === 'HERO' ? 'hero' :
                              studioActiveSection === 'ABOUT' ? 'aboutUs' : 'services';
                  setSelectedStudioBlocks(prev => ({
                    ...prev,
                    [sec]: { ...studioFocusBlock, defaultData: customData }
                  }));
                  setStudioFocusBlock(null);
                }}
                onClose={() => setStudioFocusBlock(null)}
              />
            ) : (
              <div>
                {/* 1. Horizontal Section Navbar with Exact 3999 Icons & Active Indigo State */}
                <SectionNavbar
                  activeSection={studioActiveSection}
                  onSelectSection={(sec) => {
                    setStudioActiveSection(sec);
                    setStudioFocusBlock(null);
                  }}
                  onFinalize={() => handleSaveWebsite(true)}
                />

                {/* 2. Sticky Filter & Search Bar with Red Skip Section Button */}
                <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 mb-8 sticky top-0 z-10">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="relative md:col-span-4">
                      <input
                        type="text"
                        value={studioSearchQuery}
                        onChange={(e) => setStudioSearchQuery(e.target.value)}
                        placeholder="Search blocks..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-800 placeholder-gray-400 bg-white"
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="md:col-span-3">
                      <select
                        value={studioFilterStyle}
                        onChange={(e) => setStudioFilterStyle(e.target.value)}
                        className="w-full py-2 px-4 border rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
                      >
                        <option value="ALL">Filter by Style (All)</option>
                        <option value="MINIMAL">Minimalist</option>
                        <option value="MODERN">Modern Corporate</option>
                        <option value="BOLD">High Tech</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <select
                        value={studioFilterFeature}
                        onChange={(e) => setStudioFilterFeature(e.target.value)}
                        className="w-full py-2 px-4 border rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
                      >
                        <option value="ALL">Filter by Feature (All)</option>
                        <option value="DROPDOWN">Dropdown Nav</option>
                        <option value="METRICS">Metrics Bar</option>
                        <option value="STICKY">Sticky Nav</option>
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
                {currentSelectedBlock && (
                  <div className="mb-8 p-4 bg-white rounded-xl shadow-2xl border-4 border-indigo-400/80">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        Current Block: {currentSelectedBlock.name} (Live Edit)
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStudioFocusBlock(currentSelectedBlock)}
                        className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-4 h-4" />
                        Customize Current Block
                      </button>
                    </div>
                    <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <BlockRenderer
                        blockDef={currentSelectedBlock}
                        content={currentSelectedBlock.defaultData}
                        previewMode="desktop"
                        isPreview={true}
                        branding={brandingPayload}
                      />
                    </div>
                  </div>
                )}

                {/* 4. Block Selection Cards Grid */}
                <div className="space-y-8">
                  {visibleBlocks.map((blockDef) => {
                    const isSelected = currentSelectedBlock?.blockKey === blockDef.blockKey;

                    return (
                      <div
                        key={blockDef.blockKey}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-300 flex flex-col"
                      >
                        <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800 text-base">{blockDef.name}</h3>
                            <span className="text-xs text-gray-500">— {blockDef.title}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectBlockForSection(blockDef)}
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
                            branding={brandingPayload}
                          />
                        </div>

                        {/* Card Footer: Customize & Add to Page */}
                        <div className="p-3 bg-gray-50 flex justify-end items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setStudioFocusBlock(blockDef)}
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
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Exact 3999 Persistent Dark Preview Pane (Phone Chassis + Laptop Link Modal) */}
          <div className="hidden lg:block col-span-4 xl:col-span-3">
            <LivePreviewPane
              pageStructure={selectedStudioBlocks}
              branding={brandingPayload}
            />
          </div>
        </div>
      ) : (
        /* ===================================================================
           LEGACY SINGLE-PAGE MICROSITE FORM BUILDER
        =================================================================== */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 480px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Controls Panel */}
          <div style={{ backgroundColor: isAppDark ? '#1e293b' : '#ffffff', padding: '1.5rem', borderRadius: '12px', border: isAppDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Microsite General Settings</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem' }}>Subdomain</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="input-field"
                  placeholder="my-business"
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px 0 0 6px', border: '1px solid #cbd5e1' }}
                />
                <span style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderLeft: 'none', borderRadius: '0 6px 6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                  .manacity.in
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem' }}>Brand Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="input-field"
                placeholder="https://..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem' }}>Primary Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '38px', height: '38px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{primaryColor}</span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem' }}>Secondary Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} style={{ width: '38px', height: '38px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{secondaryColor}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoColorExtraction}
              disabled={extractingColors}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem' }}
            >
              {extractingColors ? 'Extracting...' : 'Auto-Extract Colors from Logo'}
            </button>
          </div>

          {/* Simple Preview Pane for Single-Page */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', minHeight: '500px' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Live Single-Page Preview</h4>
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: primaryColor, color: '#ffffff' }}>
                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>{headerConfig.title || businessGroup?.name || 'Your Business Title'}</h1>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>{headerConfig.subtitle || 'Your compelling headline or slogan goes here'}</p>
              </div>
              <div style={{ padding: '2rem', backgroundColor: '#f8fafc' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{aboutConfig.title || 'About Us'}</h2>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>{aboutConfig.content || 'Share your story, services, and why customers should choose you.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
