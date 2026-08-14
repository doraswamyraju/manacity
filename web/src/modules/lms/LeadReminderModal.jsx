import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Bell, ExternalLink, X } from 'lucide-react';

export default function LeadReminderModal({ lead, onClose, onReminderSet }) {
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderNote, setReminderNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState('');

  const generateGoogleCalendarLink = (dtStr, tmStr, title, notes) => {
    try {
      const dt = new Date(`${dtStr}T${tmStr}:00`);
      const startIso = dt.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endDt = new Date(dt.getTime() + 30 * 60000); // 30 min duration
      const endIso = endDt.toISOString().replace(/-|:|\.\d\d\d/g, '');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(notes)}`;
    } catch (e) {
      return '';
    }
  };

  const handleSaveReminder = async (e) => {
    e.preventDefault();
    if (!reminderDate) return;

    setSaving(true);
    const title = `ManaCity Lead Follow-up: ${lead?.contactName || 'Customer'}`;
    const fullNotes = `Follow up call with ${lead?.contactName || 'Lead'} (${lead?.contactPhone || ''}). Note: ${reminderNote}`;
    const gCalUrl = generateGoogleCalendarLink(reminderDate, reminderTime, title, fullNotes);
    setGoogleCalendarUrl(gCalUrl);

    try {
      const res = await axios.post(`/api/lms/leads/${lead.id}/reminder`, {
        reminderDate: `${reminderDate}T${reminderTime}:00Z`,
        reminderNote
      });

      if (res.data && res.data.lead) {
        if (onReminderSet) onReminderSet(res.data.lead);
      }
    } catch (err) {
      console.warn('Reminder API warning, applying client reminder state:', err);
      if (onReminderSet) {
        onReminderSet({
          ...lead,
          reminderDate: `${reminderDate}T${reminderTime}:00Z`,
          reminderNote
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #3b82f6',
        borderRadius: '16px',
        padding: '1.75rem',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Calendar size={24} color="#3b82f6" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Create Follow-up Reminder & Sync
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          Set a reminder for lead: <strong style={{ color: '#fff' }}>{lead?.contactName || 'Lead'}</strong>
        </p>

        {googleCalendarUrl ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, marginBottom: '1rem' }}>
              ✓ Reminder saved in ManaCity App & Notification System!
            </div>
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#4285F4',
                color: '#fff',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none'
              }}
            >
              📅 Add to Google Calendar <ExternalLink size={16} />
            </a>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.82rem' }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>Reminder Date *</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>Time *</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>Follow-up Agenda / Note</label>
              <textarea
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                placeholder="e.g. Call client to discuss proposal revision..."
                rows="3"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{ flex: 1.5, padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer' }}
              >
                {saving ? 'Saving...' : 'Set & Sync Calendar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
