import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Sections from './WebsiteSections';

export default function WebsiteBuilder({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Core configurations
  const [website, setWebsite] = useState(null);
  const [businessGroup, setBusinessGroup] = useState(null);

  // Editor states
  const [subdomain, setSubdomain] = useState('');
  const [theme, setTheme] = useState('default');
  const [primaryColor, setPrimaryColor] = useState('#1976d2');
  const [secondaryColor, setSecondaryColor] = useState('#9c27b0');
  const [font, setFont] = useState('Outfit');
  const [isPublished, setIsPublished] = useState(false);

  // SEO & Analytics
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [searchConsoleId, setSearchConsoleId] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [clarityId, setClarityId] = useState('');

  // Section configs state
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // 1. Fetch onboarding state for content
    axios.get('/api/business/onboarding-state')
      .then(res => {
        setBusinessGroup(res.data.businessGroup);
      })
      .catch(err => console.error('Failed to load business profile:', err));

    // 2. Fetch website configurations
    axios.get('/api/website')
      .then(res => {
        const web = res.data.website;
        setWebsite(web);
        setSubdomain(web.subdomain || '');
        setTheme(web.theme || 'default');
        setPrimaryColor(web.primaryColor || '#1976d2');
        setSecondaryColor(web.secondaryColor || '#9c27b0');
        setFont(web.font || 'Outfit');
        setIsPublished(web.isPublished || false);
        setMetaTitle(web.metaTitle || '');
        setMetaDescription(web.metaDescription || '');
        setKeywords(web.keywords || '');
        setGoogleAnalyticsId(web.googleAnalyticsId || '');
        setSearchConsoleId(web.searchConsoleId || '');
        setMetaPixelId(web.metaPixelId || '');
        setClarityId(web.clarityId || '');

        // Sort sections by displayOrder
        const sortedSec = (web.sections || []).sort((a, b) => a.displayOrder - b.displayOrder);
        setSections(sortedSec);
      })
      .catch(err => console.error('Failed to load website config:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/website/save', {
        theme,
        primaryColor,
        secondaryColor,
        font,
        subdomain,
        metaTitle,
        metaDescription,
        keywords,
        googleAnalyticsId,
        searchConsoleId,
        metaPixelId,
        clarityId,
        isPublished
      });
      setWebsite(response.data.website);
      setSuccess('Core settings saved successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update website configurations.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSections = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/website/sections/save', {
        sections
      });
      const web = response.data.website;
      setWebsite(web);
      const sortedSec = (web.sections || []).sort((a, b) => a.displayOrder - b.displayOrder);
      setSections(sortedSec);
      setSuccess('Section orders and layouts updated successfully.');
    } catch (err) {
      setError('Failed to update page layout.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    setPublishing(true);
    try {
      const response = await axios.post('/api/website/save', {
        isPublished: !isPublished
      });
      setIsPublished(response.data.website.isPublished);
      setSuccess(response.data.website.isPublished ? 'Website published live!' : 'Website unpublished.');
    } catch (err) {
      setError('Failed to toggle publication status.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSectionToggle = (type) => {
    setSections(sections.map(sec => sec.type === type ? { ...sec, enabled: !sec.enabled } : sec));
  };

  const handleMoveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
    } else if (direction === 'down' && index < newSections.length - 1) {
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
    }

    // Re-assign displayOrder numbers
    const updated = newSections.map((sec, idx) => ({ ...sec, displayOrder: idx + 1 }));
    setSections(updated);
  };

  if (loading || !businessGroup) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        <h3>Loading Web Builder Console...</h3>
      </div>
    );
  }

  // Active theme engine variables
  const themeVars = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--font-primary': font,
    fontFamily: font
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '1400px', boxSizing: 'border-box' }}>
      
      {/* Editor Panel (Left) */}
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Smart Website Builder</h2>
          <button className="btn btn-secondary" onClick={onBack}>Exit</button>
        </div>

        {error && <div style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>{error}</div>}
        {success && <div style={{ color: '#4caf50', fontSize: '0.9rem' }}>{success}</div>}

        {/* Domain Config */}
        <div style={editorSectionStyle}>
          <h3 style={editorHeaderStyle}>Domain & Subdomain</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="text" 
              value={subdomain} 
              onChange={(e) => setSubdomain(e.target.value)} 
              placeholder="subdomain"
              style={inputStyle}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>.manacity.in</span>
          </div>
        </div>

        {/* Theme Engine Settings */}
        <div style={editorSectionStyle}>
          <h3 style={editorHeaderStyle}>Theme & Colors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Theme Template</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} style={inputStyle}>
                <option value="default">Default Card Grid</option>
                <option value="elegant">Elegant Bordered</option>
                <option value="modern">Modern Dynamic</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Primary Font</label>
              <select value={font} onChange={(e) => setFont(e.target.value)} style={inputStyle}>
                <option value="Outfit">Outfit</option>
                <option value="sans-serif">Sans-Serif</option>
                <option value="Georgia">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Primary Color</label>
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ ...inputStyle, padding: '0.2rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Secondary Color</label>
              <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} style={{ ...inputStyle, padding: '0.2rem' }} />
            </div>
          </div>
        </div>

        {/* SEO Management */}
        <div style={editorSectionStyle}>
          <h3 style={editorHeaderStyle}>SEO Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Meta Title" style={inputStyle} />
            <input type="text" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Meta Description" style={inputStyle} />
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords (comma separated)" style={inputStyle} />
          </div>
        </div>

        {/* Analytics Configurations (Configuration Placeholders) */}
        <div style={editorSectionStyle}>
          <h3 style={editorHeaderStyle}>Analytics Integrations (Optional)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="text" value={googleAnalyticsId} onChange={(e) => setGoogleAnalyticsId(e.target.value)} placeholder="Google Analytics Tag (e.g. G-XXXXX)" style={inputStyle} />
            <input type="text" value={searchConsoleId} onChange={(e) => setSearchConsoleId(e.target.value)} placeholder="Google Search Console verification ID" style={inputStyle} />
            <input type="text" value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} placeholder="Meta Pixel ID" style={inputStyle} />
            <input type="text" value={clarityId} onChange={(e) => setClarityId(e.target.value)} placeholder="Microsoft Clarity ID" style={inputStyle} />
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleSaveSettings} disabled={saving} style={{ flex: 1 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handlePublishToggle} 
            disabled={publishing}
            style={{ 
              flex: 1, 
              backgroundColor: isPublished ? 'rgba(239, 68, 68, 0.1)' : 'rgba(76, 175, 80, 0.1)', 
              borderColor: isPublished ? 'var(--accent-error)' : '#4caf50',
              color: isPublished ? 'var(--accent-error)' : '#4caf50' 
            }}
          >
            {publishing ? 'Toggling...' : isPublished ? 'Unpublish Site' : 'Publish Live'}
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

        {/* Page Builder Components Section */}
        <div style={editorSectionStyle}>
          <h3 style={editorHeaderStyle}>Website Sections Layout</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sections.map((sec, idx) => (
              <div 
                key={sec.type} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.65rem 1rem', 
                  backgroundColor: sec.enabled ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  opacity: sec.enabled ? 1 : 0.5
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={sec.enabled} 
                    onChange={() => handleSectionToggle(sec.type)} 
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{sec.type}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button type="button" onClick={() => handleMoveSection(idx, 'up')} disabled={idx === 0} style={iconBtnStyle}>▲</button>
                  <button type="button" onClick={() => handleMoveSection(idx, 'down')} disabled={idx === sections.length - 1} style={iconBtnStyle}>▼</button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleSaveSections} disabled={saving} style={{ width: '100%', marginTop: '1rem' }}>
            {saving ? 'Saving Layout...' : 'Save Layout Order'}
          </button>
        </div>
      </div>

      {/* Live Preview Panel (Right) - Rendering SAME React engine components */}
      <div 
        style={{ 
          backgroundColor: '#0f172a', 
          border: '3px solid var(--border-color)', 
          borderRadius: 'var(--radius-sm)',
          maxHeight: '85vh', 
          overflowY: 'auto',
          color: '#fff',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Live Site Preview (Subdomain: {subdomain || 'unset'}.manacity.in)</span>
          <span style={{ color: isPublished ? '#4caf50' : 'var(--accent-error)' }}>{isPublished ? '● Published' : '● Draft'}</span>
        </div>

        {/* Inline Theme Engine Style Injection */}
        <div style={themeVars}>
          {sections
            .filter(sec => sec.enabled)
            .map(sec => {
              // Dynamically map section types to imported components
              if (sec.type === 'HERO') return <Sections.HeroSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'ABOUT') return <Sections.AboutSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'SERVICES') return <Sections.ServicesSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'PRODUCTS') return <Sections.ProductsSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'GALLERY') return <Sections.GallerySection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'REVIEWS') return <Sections.ReviewsSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'CONTACT') return <Sections.ContactSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'FAQ') return <Sections.FaqSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'CTA') return <Sections.CtaSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              if (sec.type === 'FOOTER') return <Sections.FooterSection key={sec.type} businessGroup={businessGroup} settings={sec.settings} theme={theme} />;
              return null;
            })}
        </div>
      </div>
    </div>
  );
}

const editorSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const editorHeaderStyle = {
  fontSize: '1.05rem',
  fontWeight: 600,
  color: 'var(--accent-secondary)',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.25rem',
  marginBottom: '0.5rem'
};

const inputStyle = {
  padding: '0.65rem 0.85rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  width: '100%',
  boxSizing: 'border-box'
};

const iconBtnStyle = {
  padding: '0.2rem 0.4rem',
  fontSize: '0.75rem',
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border-color)',
  color: '#fff',
  borderRadius: '4px',
  cursor: 'pointer'
};
