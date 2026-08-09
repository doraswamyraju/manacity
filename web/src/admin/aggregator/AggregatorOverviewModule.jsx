import React from 'react';
import { Search, MapPin, Building2, Zap, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AggregatorOverviewModule({ isDark, metrics }) {
  const cardStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)'
  };

  const statBoxes = [
    { label: 'Total Aggregator Listings', value: metrics?.totalListings || 3, icon: Building2, color: '#38bdf8' },
    { label: 'Active Registered Businesses', value: metrics?.totalBusinesses || 1, icon: CheckCircle2, color: '#34d399' },
    { label: 'Directory Inquiries Captured', value: metrics?.totalLeads || 0, icon: Zap, color: '#fbbf24' },
    { label: 'Active Aggregated Cities', value: metrics?.activeCities || 6, icon: MapPin, color: '#c084fc' }
  ];

  return (
    <div>
      {/* Stat Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {statBoxes.map((box, idx) => {
          const Icon = box.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{
                backgroundColor: `${box.color}20`,
                color: box.color,
                borderRadius: '10px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: isDark ? '#9ca3af' : '#64748b', fontWeight: 600, display: 'block' }}>
                  {box.label}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a' }}>
                  {box.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Directory Health & Performance Overview Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <TrendingUp size={20} color="#34d399" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            Aggregator Directory Status
          </h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0 }}>
          manacity.in is actively aggregating listings across Tirupati, Hyderabad, Vijayawada, Visakhapatnam, Chennai, and Bangalore.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            backgroundColor: isDark ? '#090d16' : '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>Top City Searches</span>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>
              1. Tirupati (Digital Marketing, Rice Mills)<br />
              2. Hyderabad (Clinics, IT Services)<br />
              3. Vijayawada (Wholesale Stores)
            </div>
          </div>

          <div style={{
            backgroundColor: isDark ? '#090d16' : '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>Lead Conversion Index</span>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>
              Average response time: <strong>&lt; 15 mins</strong><br />
              Top lead channels: <strong>Get Quote Popup (72%)</strong>, WhatsApp (28%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
