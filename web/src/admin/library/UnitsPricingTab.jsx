import React, { useState } from 'react';
import { CreditCard, Plus, Search, Edit2, Trash2, X } from 'lucide-react';

function UnitsPricingTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  const [unitsList, setUnitsList] = useState([
    { id: 'u-1', name: 'Per Month', symbol: '/mo', description: 'Recurring monthly subscription pricing model' },
    { id: 'u-2', name: 'Per Project', symbol: '/proj', description: 'Fixed price one-time project fee' },
    { id: 'u-3', name: 'Per Hour', symbol: '/hr', description: 'Hourly consultation or service charge' },
    { id: 'u-4', name: 'Per Piece / Unit', symbol: '/pc', description: 'Physical merchandise hardware unit price' },
    { id: 'u-5', name: 'Per Square Feet', symbol: '/sq.ft', description: 'Architectural or interior design pricing unit' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitName, setUnitName] = useState('');
  const [unitSymbol, setUnitSymbol] = useState('');
  const [unitDesc, setUnitDesc] = useState('');

  const openCreateModal = () => {
    setEditingUnit(null);
    setUnitName('');
    setUnitSymbol('');
    setUnitDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (u) => {
    setEditingUnit(u);
    setUnitName(u.name);
    setUnitSymbol(u.symbol);
    setUnitDesc(u.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!unitName.trim()) return;

    if (editingUnit) {
      setUnitsList(unitsList.map(u => u.id === editingUnit.id ? { ...u, name: unitName, symbol: unitSymbol, description: unitDesc } : u));
    } else {
      setUnitsList([{ id: `u-${Date.now()}`, name: unitName, symbol: unitSymbol, description: unitDesc }, ...unitsList]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete pricing unit?')) {
      setUnitsList(unitsList.filter(u => u.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
            Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Units & Pricing</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
            Units & Pricing Models
          </h1>
          <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
            Define billing units (per month, per project, per hour) and standard price ranges.
          </p>
        </div>

        <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          <Plus size={16} /> Add Pricing Unit
        </button>
      </div>

      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderBottom: cardBorder, color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Unit Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Symbol / Abbr</th>
              <th style={{ padding: '0.85rem 1rem' }}>Description</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unitsList.map(u => (
              <tr key={u.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: textMain }}>{u.name}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px', backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>{u.symbol}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: textMuted }}>{u.description}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => openEditModal(u)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '1.75rem', color: textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Unit Name *</label>
                <input type="text" required placeholder="e.g. Per Month" value={unitName} onChange={e => setUnitName(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Symbol / Abbreviation</label>
                <input type="text" placeholder="e.g. /mo" value={unitSymbol} onChange={e => setUnitSymbol(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Description</label>
                <textarea rows={2} placeholder="Description..." value={unitDesc} onChange={e => setUnitDesc(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.6rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default UnitsPricingTab;
