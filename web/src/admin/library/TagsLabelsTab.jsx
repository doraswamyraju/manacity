import React from 'react';
import { Tag } from 'lucide-react';

function TagsLabelsTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const tags = ['seo', 'ranking', 'ads', 'ppc', 'smm', 'social', 'website', 'development', 'design', 'branding', 'content', 'writing', 'video', 'editing', 'ecommerce', 'online-store'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Tags & Labels</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Tags & Labels Index
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Manage search tags and promotional labels across all library items.
        </p>
      </div>

      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: textMain, marginBottom: '1rem' }}>Active Tags Index</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : '#e2e8f0', color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600, fontSize: '0.8rem' }}>
              <Tag size={12} /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TagsLabelsTab;
