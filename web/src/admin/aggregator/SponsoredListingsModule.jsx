import React from 'react';
import { Star, Pin, Zap, CheckCircle2 } from 'lucide-react';

export default function SponsoredListingsModule({ isDark }) {
  const cardStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)'
  };

  const sponsoredListings = [
    { id: 1, name: 'ABC Digital Marketing Solutions', city: 'Tirupati', category: 'Digital Marketing', rank: 1, badge: 'TOP SPONSORED' },
    { id: 2, name: 'Sri Venkateswara Premium Rice Mill', city: 'Tirupati', category: 'Rice Mill', rank: 2, badge: 'FEATURED' }
  ];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <Star size={20} color="#fbbf24" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
          3. Promoted & Sponsored Position Pins (Monetization)
        </h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0, marginBottom: '1.25rem' }}>
        Pin paid businesses to top search positions across city directory listings on manacity.in.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {sponsoredListings.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.85rem 1.1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                color: '#fbbf24',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}>
                #{item.rank}
              </div>
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', display: 'block' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '0.78rem', color: isDark ? '#9ca3af' : '#64748b' }}>
                  {item.city} • {item.category}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                padding: '0.35rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Pin size={14} /> {item.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
