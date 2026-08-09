import React from 'react';
import { FolderTree, Plus } from 'lucide-react';

function CategoriesTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const categories = [
    { name: 'Digital Marketing', count: 856, subcategories: 12 },
    { name: 'Web Development', count: 542, subcategories: 8 },
    { name: 'Design & Branding', count: 321, subcategories: 6 },
    { name: 'IT Services', count: 287, subcategories: 9 },
    { name: 'Photography', count: 156, subcategories: 4 },
    { name: 'Video & Animation', count: 128, subcategories: 5 },
    { name: 'Business Services', count: 95, subcategories: 7 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Categories</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Category Management (58 Categories)
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Organize master services and products into main categories and subcategories.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {categories.map(cat => (
          <div key={cat.name} style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontWeight: 800 }}>
                <FolderTree size={18} /> {cat.name}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                {cat.count} items
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: textMuted }}>
              {cat.subcategories} subcategories configured
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesTab;
