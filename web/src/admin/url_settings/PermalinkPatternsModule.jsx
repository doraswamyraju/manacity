import React from 'react';
import { Link } from 'lucide-react';

export default function PermalinkPatternsModule({
  isDark,
  categoryPattern,
  setCategoryPattern,
  listingPattern,
  setListingPattern
}) {
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

  return (
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
  );
}
