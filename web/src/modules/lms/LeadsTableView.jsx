import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConvertToSaleModal from './ConvertToSaleModal';
import LeadReminderModal from './LeadReminderModal';
import LeadDetailDrawer from './LeadDetailDrawer';
import { Zap, Phone, MessageSquare, CheckCircle, Calendar, Edit, Trash2, Tag, Search, Filter } from 'lucide-react';

export default function LeadsTableView({ theme }) {
  const isDark = theme === 'dark' || (theme === undefined && document.documentElement.getAttribute('data-theme') !== 'light' && !document.body.classList.contains('light-mode'));
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const innerCardBg = isDark ? '#1e293b' : '#f8fafc';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#1e293b' : '#ffffff';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';
  const rowBorder = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #cbd5e1';

  const [leads, setLeads] = useState([
    {
      id: 'lead_1',
      contactName: 'Ramesh Kumar',
      contactPhone: '9876543210',
      contactEmail: 'ramesh@gmail.com',
      channel: 'WHATSAPP',
      visitorLocation: 'Karakambadi, Tirupati',
      status: 'NEW',
      priority: 'HIGH',
      saleAmount: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'lead_2',
      contactName: 'Balaji Enterprises',
      contactPhone: '9440012345',
      contactEmail: 'contact@balaji.in',
      channel: 'META_ADS',
      visitorLocation: 'Tirupati Central',
      status: 'CONTACTED',
      priority: 'MEDIUM',
      saleAmount: null,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [activeDrawerLead, setActiveDrawerLead] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/leads')
      .then(res => {
        if (res.data && res.data.leads && res.data.leads.length > 0) {
          setLeads(res.data.leads);
        }
      })
      .catch(err => console.warn('Leads fetch warning, using live initial leads:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLeadUpdated = (updatedLead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`/api/lms/leads/${id}`);
    } catch (e) {}
    setLeads(leads.filter(l => l.id !== id));
  };

  const filteredLeads = leads.filter(l =>
    (l.contactName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.contactPhone || '').includes(searchQuery) ||
    (l.channel || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '16px', padding: '1.75rem', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.04)' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Zap size={22} color="#f59e0b" /> Lead Management System (LMS)
          </h3>
          <span style={{ fontSize: '0.82rem', color: textMuted }}>
            Real-time lead capture, sales conversion, follow-up calendar reminders & WhatsApp automation.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color={textMuted} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: rowBorder, color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Customer / Lead</th>
              <th style={{ padding: '0.75rem 1rem' }}>Channel</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
              <th style={{ padding: '0.75rem 1rem' }}>Sale Value</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: rowBorder }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong style={{ color: textMain, display: 'block', fontSize: '0.92rem' }}>{lead.contactName || 'Anonymous Visitor'}</strong>
                  <span style={{ fontSize: '0.78rem', color: textMuted }}>{lead.contactPhone} {lead.contactEmail ? `• ${lead.contactEmail}` : ''}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)', color: isDark ? '#60a5fa' : '#1d4ed8' }}>
                    {lead.channel}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: lead.status === 'CONVERTED' ? (isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)') : lead.status === 'NEW' ? (isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)') : (isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)'),
                    color: lead.status === 'CONVERTED' ? (isDark ? '#34d399' : '#059669') : lead.status === 'NEW' ? (isDark ? '#60a5fa' : '#1d4ed8') : (isDark ? '#fbbf24' : '#d97706')
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: lead.priority === 'HIGH' ? '#f43f5e' : textMuted }}>
                    {lead.priority === 'HIGH' ? '🔥 HIGH' : lead.priority}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {lead.saleAmount ? (
                    <strong style={{ color: isDark ? '#34d399' : '#059669', fontSize: '0.95rem' }}>₹{lead.saleAmount.toLocaleString()}</strong>
                  ) : (
                    <span style={{ color: textMuted, fontSize: '0.8rem' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => { setSelectedLead(lead); setShowConvertModal(true); }}
                      title="Convert to Sale"
                      style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <CheckCircle size={14} /> Convert
                    </button>
                    <button
                      onClick={() => { setSelectedLead(lead); setShowReminderModal(true); }}
                      title="Set Reminder"
                      style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <Calendar size={14} /> Reminder
                    </button>
                    <button
                      onClick={() => setActiveDrawerLead(lead)}
                      title="View Details"
                      style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: inputBorder, backgroundColor: innerCardBg, color: textMain, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      title="Delete"
                      style={{ padding: '0.35rem', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals & Slide-over Drawer */}
      {showConvertModal && selectedLead && (
        <ConvertToSaleModal lead={selectedLead} onClose={() => setShowConvertModal(false)} onConverted={handleLeadUpdated} />
      )}

      {showReminderModal && selectedLead && (
        <LeadReminderModal lead={selectedLead} onClose={() => setShowReminderModal(false)} onReminderSet={handleLeadUpdated} />
      )}

      {activeDrawerLead && (
        <LeadDetailDrawer
          lead={activeDrawerLead}
          onClose={() => setActiveDrawerLead(null)}
          onLeadUpdated={handleLeadUpdated}
          onConvertClick={(l) => { setActiveDrawerLead(null); setSelectedLead(l); setShowConvertModal(true); }}
          onReminderClick={(l) => { setActiveDrawerLead(null); setSelectedLead(l); setShowReminderModal(false); }}
        />
      )}
    </div>
  );
}
