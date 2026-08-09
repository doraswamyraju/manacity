import React from 'react';
import { CreditCard } from 'lucide-react';

function UnitsPricingTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Units & Pricing</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Units & Pricing Tiers
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Define billing units (per month, per project, per item) and default price ranges.
        </p>
      </div>

      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.5rem', color: textMuted }}>
        <CreditCard size={32} color="#fbbf24" style={{ marginBottom: '0.5rem' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: textMain, margin: '0 0 0.5rem 0' }}>Pricing Model Templates</h3>
        <p style={{ fontSize: '0.85rem' }}>Fixed Rate, Monthly Retainer, Range Pricing (e.g. ₹5,000 - ₹25,000), and Usage-based Billing templates.</p>
      </div>
    </div>
  );
}

export default UnitsPricingTab;
