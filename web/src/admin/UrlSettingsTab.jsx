import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Modular Subcomponent Imports stacked under URL & SEO Settings
import UrlPreviewModule from './url_settings/UrlPreviewModule';
import PermalinkPatternsModule from './url_settings/PermalinkPatternsModule';
import CitySlugMappingModule from './url_settings/CitySlugMappingModule';
import SeoMetadataModule from './url_settings/SeoMetadataModule';

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

      {/* Stacked Submodule 1: Live URL Preview Sandbox */}
      <UrlPreviewModule
        isDark={isDark}
        categoryPattern={categoryPattern}
        listingPattern={listingPattern}
        canonicalDomain={seoSettings.canonicalDomain}
        sampleCity={sampleCity}
        setSampleCity={setSampleCity}
        sampleCategory={sampleCategory}
        setSampleCategory={setSampleCategory}
        sampleBusinessSlug={sampleBusinessSlug}
        setSampleBusinessSlug={setSampleBusinessSlug}
      />

      {/* Stacked Submodule 2: Permalink Patterns & Structure */}
      <PermalinkPatternsModule
        isDark={isDark}
        categoryPattern={categoryPattern}
        setCategoryPattern={setCategoryPattern}
        listingPattern={listingPattern}
        setListingPattern={setListingPattern}
      />

      {/* Stacked Submodule 3: City Slug & Region Mappings */}
      <CitySlugMappingModule
        isDark={isDark}
        citySlugMapping={citySlugMapping}
        setCitySlugMapping={setCitySlugMapping}
      />

      {/* Stacked Submodule 4: Global SEO Metadata & Canonical Domain */}
      <SeoMetadataModule
        isDark={isDark}
        seoSettings={seoSettings}
        setSeoSettings={setSeoSettings}
      />
    </div>
  );
}
