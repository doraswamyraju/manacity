import React from 'react';
import { Globe } from 'lucide-react';

export default function UrlPreviewModule({
  isDark,
  categoryPattern,
  listingPattern,
  canonicalDomain,
  sampleCity,
  setSampleCity,
  sampleCategory,
  setSampleCategory,
  sampleBusinessSlug,
  setSampleBusinessSlug
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

  const formatUrl = (pattern, params) => {
    let result = pattern;
    result = result.replace(':city', params.city || 'city');
    result = result.replace(':category', params.category || 'category');
    result = result.replace(':slug', params.slug || 'business-slug');
    return `${canonicalDomain || 'https://manacity.in'}${result}`;
  };

  return (
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
  );
}
