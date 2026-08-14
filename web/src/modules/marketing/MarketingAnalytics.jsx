import React from 'react';
import { TrendingUp, DollarSign, Target, Users } from 'lucide-react';

export default function MarketingAnalytics() {
  return (
    <div style={{ backgroundColor: 'var(--card-bg, #0f172a)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.75rem' }}>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#fff' }}>
        Marketing ROI & Lead Acquisition Analytics
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Total Marketing Spend</span>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fbbf24' }}>₹1,750.00</strong>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Total Meta Leads</span>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>25 Leads</strong>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Cost Per Lead (CPL)</span>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#60a5fa' }}>₹70.00 / lead</strong>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Target Location Coverage</span>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#c084fc' }}>Tirupati 25km</strong>
        </div>
      </div>
    </div>
  );
}
