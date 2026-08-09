import React from 'react';
import { Zap, Phone, Mail, MessageSquare, Clock } from 'lucide-react';

export default function PublicLeadsModule({ isDark, leads = [] }) {
  const cardStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)'
  };

  const mockLeads = [
    {
      id: '1',
      contactName: 'Rajesh Kumar',
      contactPhone: '+91 98765 11223',
      contactEmail: 'rajesh@gmail.com',
      message: 'Looking for SEO & Digital Marketing services in Tirupati.',
      businessName: 'ABC Digital Marketing Solutions',
      city: 'Tirupati',
      createdAt: '10 mins ago'
    },
    {
      id: '2',
      contactName: 'Suresh Babu',
      contactPhone: '+91 91234 44556',
      contactEmail: 'suresh@yahoo.com',
      message: 'Need bulk Sona Masuri Rice quotes for catering business.',
      businessName: 'Sri Venkateswara Premium Rice Mill',
      city: 'Tirupati',
      createdAt: '1 hour ago'
    }
  ];

  const displayLeads = leads.length > 0 ? leads : mockLeads;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <Zap size={20} color="#f59e0b" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
          5. Aggregator "Get Quote" Consumer Inquiries Hub
        </h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0, marginBottom: '1.25rem' }}>
        Monitor real-time quote requests and lead inquiries submitted by visitors on manacity.in.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {displayLeads.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem 1.15rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a' }}>
                  {item.contactName || 'Lead Inquiry'}
                </span>
                <span style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  Target: {item.businessName || item.businessGroup?.name || 'Directory Lead'}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: isDark ? '#9ca3af' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} /> {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : 'Recent'}
              </span>
            </div>

            <div style={{ fontSize: '0.86rem', color: isDark ? '#d1d5db' : '#334155', marginBottom: '0.5rem' }}>
              <MessageSquare size={14} style={{ inlineSize: '14px', verticalAlign: 'middle', marginRight: '0.35rem', color: '#818cf8' }} />
              {item.message}
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: isDark ? '#9ca3af' : '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={14} color="#34d399" /> {item.contactPhone}
              </span>
              {item.contactEmail && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} color="#38bdf8" /> {item.contactEmail}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
