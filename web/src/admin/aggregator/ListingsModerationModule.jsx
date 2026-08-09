import React, { useState } from 'react';
import { Building2, ShieldCheck, CheckCircle2, XCircle, Search, ExternalLink } from 'lucide-react';

export default function ListingsModerationModule({ isDark, listings = [], onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('All');

  const cardStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #cbd5e1',
    backgroundColor: isDark ? '#1f2937' : '#f8fafc',
    color: isDark ? '#fff' : '#0f172a',
    fontSize: '0.9rem',
    outline: 'none'
  };

  const mockListings = [
    {
      id: '1',
      businessName: 'ABC Digital Marketing Solutions',
      city: 'tirupati',
      category: 'Digital Marketing',
      status: 'LIVE',
      verified: true,
      phone: '+91 98765 43210',
      slug: 'abc-digital'
    },
    {
      id: '2',
      businessName: 'Sri Venkateswara Premium Rice Mill',
      city: 'tirupati',
      category: 'Rice Mill',
      status: 'LIVE',
      verified: true,
      phone: '+91 91234 56789',
      slug: 'sv-rice-mill'
    },
    {
      id: '3',
      businessName: 'Apex Multispeciality Clinic',
      city: 'hyderabad',
      category: 'Clinics & Health',
      status: 'LIVE',
      verified: true,
      phone: '+91 99887 76655',
      slug: 'apex-clinic'
    }
  ];

  const displayListings = listings.length > 0 ? listings : mockListings;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Building2 size={20} color="#34d399" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            2. Business Listing Moderation & Verified Badges
          </h3>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0, marginBottom: '1rem' }}>
        Approve, verify, or suspend directory listings across manacity.in.
      </p>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search business name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              color: isDark ? '#9ca3af' : '#64748b'
            }}>
              <th style={{ padding: '0.75rem 1rem' }}>Business Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>City</th>
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem' }}>Verified Badge</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayListings.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9'
                }}
              >
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a' }}>
                  {item.businessName || item.businessGroup?.name || 'Business Listing'}
                  <span style={{ display: 'block', fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#64748b', fontWeight: 400 }}>
                    {item.phone || item.businessGroup?.mobileNumber}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize', color: isDark ? '#cbd5e1' : '#334155' }}>
                  {item.city}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  {item.category}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    <ShieldCheck size={14} /> Verified
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    color: '#34d399',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    LIVE
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <a
                    href={`/biz/${item.slug || 'abc-digital'}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#818cf8',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    View <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
