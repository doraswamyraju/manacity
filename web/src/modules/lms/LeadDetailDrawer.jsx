import React, { useState } from 'react';
import axios from 'axios';
import { X, MessageSquare, PhoneCall, CheckCircle, Edit, Trash2, Calendar, Tag } from 'lucide-react';

export default function LeadDetailDrawer({ lead, onClose, onLeadUpdated, onConvertClick, onReminderClick }) {
  const [status, setStatus] = useState(lead?.status || 'NEW');
  const [priority, setPriority] = useState(lead?.priority || 'MEDIUM');
  const [notes, setNotes] = useState(lead?.notes || '');
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    try {
      await axios.patch(`/api/lms/leads/${lead.id}`, { status: newStatus });
      if (onLeadUpdated) onLeadUpdated({ ...lead, status: newStatus });
    } catch (e) {
      if (onLeadUpdated) onLeadUpdated({ ...lead, status: newStatus });
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await axios.patch(`/api/lms/leads/${lead.id}`, { priority, notes });
      if (onLeadUpdated) onLeadUpdated({ ...lead, priority, notes });
    } catch (e) {
      if (onLeadUpdated) onLeadUpdated({ ...lead, priority, notes });
    } finally {
      setSaving(false);
    }
  };

  const handleWhatsAppPitch = () => {
    const text = `Hi ${lead?.contactName || 'there'}, thank you for contacting us on ManaCity. How can we assist you today?`;
    window.open(`https://wa.me/${lead?.contactPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0,
      width: '450px',
      maxWidth: '100vw',
      backgroundColor: '#0f172a',
      borderLeft: '1px solid rgba(255,255,255,0.1)',
      zIndex: 9999,
      padding: '1.75rem',
      boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Lead Details & Workflow
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <strong style={{ fontSize: '1.2rem', color: '#fff', display: 'block' }}>{lead?.contactName || 'Anonymous Visitor'}</strong>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>
          Phone: {lead?.contactPhone || 'N/A'} • Email: {lead?.contactEmail || 'N/A'}
        </span>
        <span style={{ fontSize: '0.78rem', color: '#60a5fa', display: 'block', marginTop: '0.2rem' }}>
          Source Channel: <strong>{lead?.channel}</strong> • Location: {lead?.visitorLocation || 'Tirupati'}
        </span>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button
          onClick={handleWhatsAppPitch}
          style={{ padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#25D366', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <MessageSquare size={16} /> WhatsApp Pitch
        </button>

        <button
          onClick={() => window.open(`tel:${lead?.contactPhone}`, '_self')}
          style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <PhoneCall size={16} /> Direct Call
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button
          onClick={() => onConvertClick(lead)}
          style={{ padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <CheckCircle size={16} /> Convert to Sale
        </button>

        <button
          onClick={() => onReminderClick(lead)}
          style={{ padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <Calendar size={16} /> Set Reminder
        </button>
      </div>

      {/* Status Selector */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>Lead Status</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem' }}
        >
          <option value="NEW">🟢 NEW</option>
          <option value="CONTACTED">🔵 CONTACTED</option>
          <option value="PROPOSAL_SENT">🟡 PROPOSAL SENT</option>
          <option value="CONVERTED">✅ CONVERTED TO SALE</option>
          <option value="LOST">🔴 LOST / CANCELLED</option>
        </select>
      </div>

      {/* Lead Priority & Internal Notes */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>Priority Tag</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem', marginBottom: '1rem' }}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH 🔥</option>
        </select>

        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>Internal CRM Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          placeholder="Add discussion notes, requirements, or follow-up details..."
          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', resize: 'vertical' }}
        />
        <button
          onClick={handleSaveNotes}
          disabled={saving}
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          {saving ? 'Saving Notes...' : 'Save Notes & Priority'}
        </button>
      </div>
    </div>
  );
}
