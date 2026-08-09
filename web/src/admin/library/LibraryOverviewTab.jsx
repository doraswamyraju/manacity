import React from 'react';
import { Database, Layers, Wrench, Package, FolderTree, Star, Activity, CheckCircle } from 'lucide-react';

function LibraryOverviewTab({ catalog = [], theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Overview</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Library Management Overview
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Centralized master catalog health, category distributions, and website usage telemetry.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Total Services</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: textMain, marginTop: '0.2rem' }}>2,468</div>
        </div>
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Categories</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: textMain, marginTop: '0.2rem' }}>58</div>
        </div>
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Active Items</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '0.2rem' }}>2,321</div>
        </div>
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Website Implementations</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>18,742</div>
        </div>
      </div>
    </div>
  );
}

export default LibraryOverviewTab;
