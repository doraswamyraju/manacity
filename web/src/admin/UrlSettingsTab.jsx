import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Globe,
  Link,
  MapPin,
  Search,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  Sliders,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';

export default function UrlSettingsTab({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Stacked Form Settings State
  const [listingPattern, setListingPattern] = useState('/biz/:slug');
  const [categoryPattern, setCategoryPattern] = useState('/:city/:category');
  const [citySlugMapping, setCitySlugMapping] = useState([
    { cityId: 'tirupati', name: 'Tirupati', slug: 'tirupati', active: true },
    { cityId: 'hyderabad', name: 'Hyderabad', slug: 'hyderabad', active: true },
    { cityId: 'vijayawada', name: 'Vijayawada', slug: 'vijayawada', active: true },
    { cityId: 'visakhapatnam', name: 'Visakhapatnam', slug: 'visakhapatnam', active: true },
    { cityId: 'chennai', name: 'Chennai', slug: 'chennai', active: true },
    { cityId: 'bangalore', name: 'Bangalore', slug: 'bangalore', active: true }
  ]);
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: 'ManaCity - Local Business & Services Aggregator',
    metaDescription: 'Discover verified local businesses, services, ratings, and instant quotes across cities.',
    canonicalDomain: 'https://manacity.in'
  });

  // Dynamic preview sample parameters
  const [sampleCity, setSampleCity] = useState('tirupati');
  const [sampleCategory, setSampleCategory] = useState('digital-marketing');
  const [sampleBusinessSlug, setSampleBusinessSlug] = useState('abc-digital');

  useEffect(() => {
    fetchUrlSettings();
  }, []);

  const fetchUrlSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/settings/url-structure');
      if (res.data && res.data.settings) {
        const s = res.data.settings;
        if (s.listingPattern) setListingPattern(s.listingPattern);
        if (s.categoryPattern) setCategoryPattern(s.categoryPattern);
        if (s.citySlugMapping) setCitySlugMapping(s.citySlugMapping);
        if (s.seoSettings) setSeoSettings(s.seoSettings);
      }
    } catch (err) {
      console.error('Error fetching URL settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        listingPattern,
        categoryPattern,
        citySlugMapping,
        seoSettings
      };
      const res = await axios.put('/api/admin/settings/url-structure', payload);
      setMessage({ type: 'success', text: res.data.message || 'URL & SEO Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save URL settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCityChange = (index, field, value) => {
    const updated = [...citySlugMapping];
    updated[index][field] = value;
    setCitySlugMapping(updated);
  };

  const handleAddCity = () => {
    setCitySlugMapping([
      ...citySlugMapping,
      { cityId: `city-${Date.now()}`, name: 'New City', slug: 'new-city', active: true }
    ]);
  };

  const handleRemoveCity = (index) => {
    const updated = citySlugMapping.filter((_, i) => i !== index);
    setCitySlugMapping(updated);
  };

  // Helper to build preview URL
  const formatUrl = (pattern, params) => {
    let result = pattern;
    result = result.replace(':city', params.city || 'city');
    result = result.replace(':category', params.category || 'category');
    result = result.replace(':slug', params.slug || 'business-slug');
    return `${seoSettings.canonicalDomain || 'https://manacity.in'}${result}`;
  };

  const cardStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #cbd5e1',
    backgroundColor: isDark ? '#1f2937' : '#f8fafc',
    color: isDark ? '#fff' : '#0f172a',
    fontSize: '0.9rem',
    outline: 'none'
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: isDark ? '#9ca3af' : '#64748b' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem auto' }} />
        <p>Loading URL & SEO Settings...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            Aggregator URL & SEO Structure Control
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: isDark ? '#9ca3af' : '#64748b' }}>
            Control permalink patterns, city slug mappings, and canonical domain configurations for <strong>manacity.in</strong>.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.35rem',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Save size={18} />
          {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </div>

      {/* Notification Toast */}
      {message.text && (
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: message.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
          border: message.type === 'success' ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(248, 113, 113, 0.4)',
          color: message.type === 'success' ? '#34d399' : '#f87171'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{message.text}</span>
        </div>
      )}

      {/* Stacked Control 1: Live URL Preview Sandbox */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Globe size={20} color="#818cf8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            1. Live Aggregator URL Preview
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0, marginBottom: '1rem' }}>
          Test how canonical search links and business profile permalinks render dynamically across manacity.in.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: isDark ? '#9ca3af' : '#475569', marginBottom: '0.35rem' }}>
              Sample City Slug
            </label>
            <input
              type="text"
              value={sampleCity}
              onChange={(e) => setSampleCity(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: isDark ? '#9ca3af' : '#475569', marginBottom: '0.35rem' }}>
              Sample Category Slug
            </label>
            <input
              type="text"
              value={sampleCategory}
              onChange={(e) => setSampleCategory(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: isDark ? '#9ca3af' : '#475569', marginBottom: '0.35rem' }}>
              Sample Business Listing Slug
            </label>
            <input
              type="text"
              value={sampleBusinessSlug}
              onChange={(e) => setSampleBusinessSlug(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Live Rendered Output */}
        <div style={{
          backgroundColor: isDark ? '#090d16' : '#f1f5f9',
          borderRadius: '8px',
          padding: '1rem',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #cbd5e1'
        }}>
          <div style={{ marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rendered Category URL:
            </span>
            <code style={{ fontSize: '0.9rem', color: isDark ? '#34d399' : '#059669', fontWeight: 600 }}>
              {formatUrl(categoryPattern, { city: sampleCity, category: sampleCategory })}
            </code>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rendered Business Profile URL:
            </span>
            <code style={{ fontSize: '0.9rem', color: isDark ? '#818cf8' : '#4f46e5', fontWeight: 600 }}>
              {formatUrl(listingPattern, { city: sampleCity, category: sampleCategory, slug: sampleBusinessSlug })}
            </code>
          </div>
        </div>
      </div>

      {/* Stacked Control 2: Category & Listing Permalink Patterns */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Link size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            2. Permalink Patterns & Structure
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Category Pattern */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: '0.5rem' }}>
              Category Search Permalinks
            </label>
            <select
              value={categoryPattern}
              onChange={(e) => setCategoryPattern(e.target.value)}
              style={inputStyle}
            >
              <option value="/:city/:category">manacity.in/:city/:category (Recommended e.g. /tirupati/digital-marketing)</option>
              <option value="/:city/c/:category">manacity.in/:city/c/:category (e.g. /tirupati/c/digital-marketing)</option>
              <option value="/c/:category">manacity.in/c/:category (Global e.g. /c/digital-marketing)</option>
            </select>
            <span style={{ display: 'block', fontSize: '0.76rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: '0.35rem' }}>
              Determines how city-wise category pages are indexed for SEO.
            </span>
          </div>

          {/* Listing Pattern */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: '0.5rem' }}>
              Business Profile Permalinks
            </label>
            <select
              value={listingPattern}
              onChange={(e) => setListingPattern(e.target.value)}
              style={inputStyle}
            >
              <option value="/biz/:slug">manacity.in/biz/:slug (Recommended e.g. /biz/abc-digital)</option>
              <option value="/:city/b/:slug">manacity.in/:city/b/:slug (e.g. /tirupati/b/abc-digital)</option>
              <option value="/:city/:category/:slug">manacity.in/:city/:category/:slug (e.g. /tirupati/digital-marketing/abc-digital)</option>
            </select>
            <span style={{ display: 'block', fontSize: '0.76rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: '0.35rem' }}>
              Defines canonical public URLs for business detail storefronts.
            </span>
          </div>
        </div>
      </div>

      {/* Stacked Control 3: City Slug Mappings */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={20} color="#34d399" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
              3. City Slug & Region Mappings
            </h3>
          </div>

          <button
            onClick={handleAddCity}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(52, 211, 153, 0.1)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '6px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            Add City Slug
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0, marginBottom: '1rem' }}>
          Manage URL slugs for cities where manacity.in aggregates local business listings.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {citySlugMapping.map((city, idx) => (
            <div
              key={city.cityId || idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.5fr 1fr 40px',
                gap: '0.85rem',
                alignItems: 'center',
                backgroundColor: isDark ? '#1f2937' : '#f8fafc',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0'
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="City Display Name"
                  value={city.name}
                  onChange={(e) => handleCityChange(idx, 'name', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="URL Slug (e.g. tirupati)"
                  value={city.slug}
                  onChange={(e) => handleCityChange(idx, 'slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id={`city-active-${idx}`}
                  checked={city.active}
                  onChange={(e) => handleCityChange(idx, 'active', e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor={`city-active-${idx}`} style={{ fontSize: '0.82rem', fontWeight: 600, color: isDark ? '#d1d5db' : '#334155', cursor: 'pointer' }}>
                  {city.active ? 'Active' : 'Disabled'}
                </label>
              </div>

              <button
                onClick={() => handleRemoveCity(idx)}
                title="Remove City"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked Control 4: SEO Metadata & Domain Canonical */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Search size={20} color="#fbbf24" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            4. Global SEO Metadata & Canonical Domain
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#9ca3af' : '#475569', marginBottom: '0.35rem' }}>
              Canonical Domain Base URL
            </label>
            <input
              type="text"
              value={seoSettings.canonicalDomain}
              onChange={(e) => setSeoSettings({ ...seoSettings, canonicalDomain: e.target.value })}
              placeholder="https://manacity.in"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#9ca3af' : '#475569', marginBottom: '0.35rem' }}>
              Aggregator Platform Meta Title
            </label>
            <input
              type="text"
              value={seoSettings.siteTitle}
              onChange={(e) => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#9ca3af' : '#475569', marginBottom: '0.35rem' }}>
              Aggregator Meta Description
            </label>
            <textarea
              rows={2}
              value={seoSettings.metaDescription}
              onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
