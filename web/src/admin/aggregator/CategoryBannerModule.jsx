import React from 'react';
import { Sparkles, Image, Tag } from 'lucide-react';

export default function CategoryBannerModule({ isDark }) {
  const cardStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)'
  };

  const categories = [
    'Digital Marketing', 'Rice Mill', 'Clinics & Health', 'Hotels & Lodging', 'Restaurants', 'Plumbers & Electricians'
  ];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <Sparkles size={20} color="#c084fc" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
          4. Homepage Categories, Hero Banners & Trending Tags
        </h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0, marginBottom: '1.25rem' }}>
        Manage interactive category tiles and trending search keywords displayed on manacity.in.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              padding: '0.5rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: isDark ? '#e2e8f0' : '#1e293b'
            }}
          >
            <Tag size={14} color="#c084fc" />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
