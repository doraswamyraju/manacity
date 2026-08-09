import React from 'react';
import { HardDrive, Image as ImageIcon } from 'lucide-react';

function MediaLibraryTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Media Library</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Media Library & Assets Manager
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Manage global product images, service icons, and customer logo proof assets.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>
            <HardDrive size={20} /> Library Media Storage
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: textMain, marginBottom: '0.5rem' }}>
            18.6 GB / 100 GB <span style={{ fontSize: '0.8rem', color: textMuted }}>(18.6% used)</span>
          </div>
          <div style={{ height: '8px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '18.6%', height: '100%', backgroundColor: '#6366f1' }}></div>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>
            <ImageIcon size={20} /> Documents Storage
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: textMain, marginBottom: '0.5rem' }}>
            2.4 GB / 50 GB <span style={{ fontSize: '0.8rem', color: textMuted }}>(4.8% used)</span>
          </div>
          <div style={{ height: '8px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '4.8%', height: '100%', backgroundColor: '#38bdf8' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaLibraryTab;
