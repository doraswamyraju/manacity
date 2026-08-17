import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Sections from './WebsiteSections';
import { extractColorsFromLogo } from './OnboardingWizard';

export default function WebsiteBuilder({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [extractingColors, setExtractingColors] = useState(false);
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
  const [logoUrl, setLogoUrl] = useState('');
  const [previewDevice, setPreviewDevice] = useState('desktop');

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
    // 1. Fetch onboarding state for content fallback
    axios.get('/api/business/onboarding-state')
      .then(res => {
        if (res.data.businessGroup) {
          setBusinessGroup(prev => prev || res.data.businessGroup);
          setLogoUrl(res.data.businessGroup.logoUrl || '');
        }
      })
      .catch(err => console.error('Failed to load business profile:', err));

    // 2. Fetch website configurations
    axios.get('/api/website')
      .then(res => {
        const web = res.data.website;
        setWebsite(web);
        if (web.businessGroup) {
          setBusinessGroup(web.businessGroup);
          if (web.businessGroup.logoUrl) setLogoUrl(web.businessGroup.logoUrl);
        }
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

        // Sort sections by displayOrder, or fallback to default 12-section layout if empty
        let sortedSec = (web.sections || []).sort((a, b) => a.displayOrder - b.displayOrder);
        if (sortedSec.length === 0) {
          sortedSec = [
            { type: 'HEADER', enabled: true, displayOrder: 1, settings: {} },
            { type: 'HERO', enabled: true, displayOrder: 2, settings: {} },
            { type: 'FEATURES', enabled: true, displayOrder: 3, settings: {} },
            { type: 'ABOUT', enabled: true, displayOrder: 4, settings: {} },
            { type: 'SERVICES', enabled: true, displayOrder: 5, settings: {} },
            { type: 'PRODUCTS', enabled: true, displayOrder: 6, settings: {} },
            { type: 'GALLERY', enabled: true, displayOrder: 7, settings: {} },
            { type: 'REVIEWS', enabled: true, displayOrder: 8, settings: {} },
            { type: 'CONTACT', enabled: true, displayOrder: 9, settings: {} },
            { type: 'FAQ', enabled: true, displayOrder: 10, settings: {} },
            { type: 'CTA', enabled: true, displayOrder: 11, settings: {} },
            { type: 'FOOTER', enabled: true, displayOrder: 12, settings: {} }
          ];
        }
        setSections(sortedSec);
      })
      .catch(err => console.error('Failed to load website config:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoExtractColors = async (targetLogoUrl) => {
    const urlToUse = targetLogoUrl || logoUrl;
    if (!urlToUse) {
      setError('Please upload or enter a logo URL first to extract color palette.');
      return;
    }
    setExtractingColors(true);
    setError('');
    try {
      const palette = await extractColorsFromLogo(urlToUse);
      setPrimaryColor(palette.primaryColor);
      setSecondaryColor(palette.secondaryColor);
      setSuccess(`Extracted logo color palette: Primary ${palette.primaryColor}, Secondary ${palette.secondaryColor}`);
    } catch (e) {
      setError('Failed to extract colors from logo.');
    } finally {
      setExtractingColors(false);
    }
  };

  const handleLogoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const previewUrl = URL.createObjectURL(file);
      setLogoUrl(previewUrl);
      setBusinessGroup(prev => prev ? { ...prev, logoUrl: previewUrl } : { logoUrl: previewUrl });

      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const response = await axios.post('/api/business/media', { base64Data });
      if (response.data && response.data.url) {
        const newUrl = response.data.url;
        setLogoUrl(newUrl);
        setBusinessGroup(prev => prev ? { ...prev, logoUrl: newUrl } : { logoUrl: newUrl });
        await handleLogoExtractColors(newUrl);
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      setError('Logo upload failed.');
    }
  };

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
        isPublished,
        logoUrl
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
      setError(err.response?.data?.error || 'Failed to update page layout.');
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>Select Website Template</label>
              <select value={theme} onChange={async (e) => {
                const newTheme = e.target.value;
                setTheme(newTheme);
                const colors = {
                  'ca-corporate-elite': '#0f2b48',
                  'ca-modern-trust': '#059669',
                  'modern-corporate': '#6366f1',
                  'light-minimal': '#0ea5e9'
                };
                const pColor = colors[newTheme] || primaryColor;
                if (colors[newTheme]) setPrimaryColor(colors[newTheme]);
                // Immediate auto-save so live iframe updates theme instantly
                try {
                  await axios.post('/api/website/save', { theme: newTheme, primaryColor: pColor });
                } catch (err) {}
              }} style={{ ...inputStyle, fontWeight: 700, backgroundColor: '#0f172a' }}>
                <option value="ca-corporate-elite">🏛️ 1. CA Template A: Elite Corporate CA & Audit Firm (Navy & Gold)</option>
                <option value="ca-modern-trust">⚡ 2. CA Template B: Modern Digital CA & Tax Advisory (Emerald Tech)</option>
                <option value="modern-corporate">3. Dark Mode Template (Sleek Dark & Glass)</option>
                <option value="light-minimal">4. Light Mode Template (Clean White & Vibrant)</option>
              </select>

              {/* Visual Template Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
                {[
                  { id: 'ca-corporate-elite', name: 'Elite Corporate CA', color: '#d97706', desc: 'Navy & Gold Audit Firm' },
                  { id: 'ca-modern-trust', name: 'Modern Digital CA', color: '#10b981', desc: 'Emerald Tax Advisory' },
                  { id: 'modern-corporate', name: 'Dark Mode Template', color: '#6366f1', desc: 'Glass Dark' },
                  { id: 'light-minimal', name: 'Light Mode Template', color: '#0ea5e9', desc: 'Clean Light' }
                ].map(tmpl => (
                  <div
                    key={tmpl.id}
                    onClick={async () => {
                      setTheme(tmpl.id);
                      const colors = {
                        'ca-corporate-elite': '#0f2b48',
                        'ca-modern-trust': '#059669',
                        'modern-corporate': '#6366f1',
                        'light-minimal': '#0ea5e9'
                      };
                      const targetColor = colors[tmpl.id] || tmpl.color;
                      setPrimaryColor(targetColor);
                      // Immediate auto-save so live iframe updates theme instantly
                      try {
                        await axios.post('/api/website/save', { theme: tmpl.id, primaryColor: targetColor });
                      } catch (err) {}
                    }}
                    style={{
                      border: theme === tmpl.id ? `2px solid ${tmpl.color}` : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: theme === tmpl.id ? `${tmpl.color}20` : '#0f172a',
                      borderRadius: '8px',
                      padding: '0.65rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: theme === tmpl.id ? '#fff' : '#94a3b8'
                    }}
                  >
                    <div style={{ width: '100%', height: '4px', backgroundColor: tmpl.color, borderRadius: '2px', marginBottom: '0.35rem' }} />
                    <div>{tmpl.name}</div>
                    <div style={{ fontSize: '0.68rem', color: tmpl.color, opacity: 0.9, marginTop: '0.15rem' }}>{tmpl.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Primary Font</label>
              <select value={font} onChange={(e) => setFont(e.target.value)} style={inputStyle}>
                <option value="Outfit">Outfit</option>
                <option value="sans-serif">Sans-Serif</option>
                <option value="Georgia">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

          </div>

          {/* Logo & Brand Color Palette Auto-Extractor Box */}
          <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>Logo & Auto Color Palette</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {logoUrl ? (
                <img src={logoUrl} alt="Business Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid var(--primary-color)' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px border-dashed #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>No Logo</div>
              )}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <input type="file" onChange={handleLogoFileUpload} accept="image/*" style={{ fontSize: '0.8rem', color: '#cbd5e1' }} />
                <button
                  type="button"
                  onClick={() => handleLogoExtractColors()}
                  disabled={extractingColors}
                  style={{
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  {extractingColors ? 'Extracting Palette...' : '⚡ Extract Colors from Logo'}
                </button>
              </div>
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

      {/* Live Preview Panel (Right) - Rendering 100% Live Website via iframe */}
      <div 
        style={{ 
          backgroundColor: theme === 'light-minimal' ? '#ffffff' : '#0f172a', 
          border: '3px solid var(--border-color)', 
          borderRadius: 'var(--radius-sm)',
          height: '82vh',
          color: theme === 'light-minimal' ? '#0f172a' : '#fff',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '0.55rem 1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>Preview Viewport:</span>
            <button type="button" onClick={() => setPreviewDevice('desktop')} style={{ ...deviceBtnStyle, backgroundColor: previewDevice === 'desktop' ? '#38bdf8' : 'transparent', color: previewDevice === 'desktop' ? '#0f172a' : '#cbd5e1' }}>💻 Desktop</button>
            <button type="button" onClick={() => setPreviewDevice('tablet')} style={{ ...deviceBtnStyle, backgroundColor: previewDevice === 'tablet' ? '#38bdf8' : 'transparent', color: previewDevice === 'tablet' ? '#0f172a' : '#cbd5e1' }}>📱 Tablet</button>
            <button type="button" onClick={() => setPreviewDevice('mobile')} style={{ ...deviceBtnStyle, backgroundColor: previewDevice === 'mobile' ? '#38bdf8' : 'transparent', color: previewDevice === 'mobile' ? '#0f172a' : '#cbd5e1' }}>📲 Mobile</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>
              Live URL:{' '}
              <a
                href={subdomain ? `https://${subdomain}.manacity.in` : 'https://manacity.in'}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'underline' }}
              >
                {subdomain ? `${subdomain}.manacity.in` : 'manacity.in'}
              </a>
            </span>
            <span style={{ color: isPublished ? '#4caf50' : 'var(--accent-error)', fontWeight: 700 }}>{isPublished ? '● Published' : '● Draft'}</span>
          </div>
        </div>

        {/* Dynamic Responsive Viewport Frame */}
        <div style={{
          flex: 1,
          width: '100%',
          overflowY: 'auto',
          backgroundColor: '#020617',
          display: 'flex',
          justifyContent: 'center',
          padding: previewDevice === 'desktop' ? '0' : '1rem 0'
        }}>
          <iframe
            key={`${subdomain}-${previewDevice}-${theme}`}
            src={subdomain ? `https://${subdomain}.manacity.in?t=${theme}` : `https://manacity.in?t=${theme}`}
            title="Live Website Preview"
            style={{
              width: previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%',
              height: '100%',
              minHeight: '650px',
              border: previewDevice === 'desktop' ? 'none' : '2px solid rgba(255,255,255,0.2)',
              borderRadius: previewDevice === 'desktop' ? '0' : '12px',
              backgroundColor: theme === 'light-minimal' ? '#ffffff' : '#0f172a',
              boxShadow: previewDevice === 'desktop' ? 'none' : '0 20px 40px rgba(0,0,0,0.8)',
              transition: 'width 0.3s ease'
            }}
          />
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

const deviceBtnStyle = {
  padding: '0.3rem 0.65rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};
