import React from 'react';
import { Settings } from 'lucide-react';

function AttributesTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Attributes</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Attributes & Specifications
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Define custom attributes, specifications, and parameters for products & services.
        </p>
      </div>

      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.5rem', color: textMuted }}>
        <Settings size={32} color="#818cf8" style={{ marginBottom: '0.5rem' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: textMain, margin: '0 0 0.5rem 0' }}>Master Attribute Configurator</h3>
        <p style={{ fontSize: '0.85rem' }}>Configure global fields like Turnaround Time, Deliverables Count, Warranty Period, and Support SLA.</p>
      </div>
    </div>
  );
}

export default AttributesTab;
