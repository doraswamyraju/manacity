import React from 'react';
import { Search } from 'lucide-react';

export default function SeoMetadataModule({
  isDark,
  seoSettings,
  setSeoSettings
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
  );
}
