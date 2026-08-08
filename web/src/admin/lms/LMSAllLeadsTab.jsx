import React, { useState } from 'react';
import { Zap, Search, Filter, Phone, Mail, MapPin, Calendar, CheckCircle2, Clock } from 'lucide-react';

function LMSAllLeadsTab({ theme }) {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');

  const mockLeads = [
    { id: 'LD-1001', name: 'Srinivas Rao', phone: '+91 9876543210', email: 'srinivas@gmail.com', business: 'Sri Lakshmi Rice Mill', city: 'Tirupati', status: 'NEW', date: '10 min ago', source: 'ManaCity Landing' },
    { id: 'LD-1002', name: 'Dr. Ramesh Kumar', phone: '+91 9988776655', email: 'ramesh.clinic@gmail.com', business: 'Apollo Dental Care', city: 'Chittoor', status: 'CONTACTED', date: '2 hours ago', source: 'Google Local Map' },
    { id: 'LD-1003', name: 'Anitha Reddy', phone: '+91 9123456789', email: 'anitha.reddy@yahoo.com', business: 'Grand Highway Hotel', city: 'Madanapalle', status: 'QUALIFIED', date: ' Yesterday', source: 'WhatsApp Bot' },
    { id: 'LD-1004', name: 'K. Venkatesh', phone: '+91 9440112233', email: 'venkatesh.textiles@gmail.com', business: 'Venkateswara Silks', city: 'Tirupati', status: 'CONVERTED', date: '2 days ago', source: 'Direct Search' }
  ];

  const filteredLeads = mockLeads.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.business.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '16px',
        background: isDark ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)' : '#fff',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Zap size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lead Management System (LMS)
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            All Active Platform Leads
          </h2>
        </div>
        <button style={{
          padding: '0.6rem 1.2rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
        }}>
          + Export CSV Report
        </button>
      </div>

      {/* Search & Filter bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 1rem',
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1'
      }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search leads by customer name or business title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: isDark ? '#fff' : '#0f172a',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {/* Leads Table */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRadius: '14px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              color: isDark ? '#94a3b8' : '#64748b',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc'
            }}>
              <th style={{ padding: '0.85rem 1rem' }}>Lead ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Business Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem' }}>Recency</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#f59e0b' }}>{lead.id}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong style={{ color: isDark ? '#fff' : '#0f172a', display: 'block' }}>{lead.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#64748b' }}>{lead.city}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>{lead.business}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ display: 'block', color: isDark ? '#cbd5e1' : '#334155', fontSize: '0.8rem' }}>{lead.phone}</span>
                  <span style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.75rem' }}>{lead.email}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: lead.status === 'CONVERTED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: lead.status === 'CONVERTED' ? '#34d399' : '#fbbf24'
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.8rem' }}>{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default LMSAllLeadsTab;
