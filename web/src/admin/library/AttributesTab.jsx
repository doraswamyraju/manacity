import React, { useState } from 'react';
import { Settings, Plus, Search, Edit2, Trash2, X, CheckSquare, ListFilter } from 'lucide-react';

function AttributesTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  const [attributes, setAttributes] = useState([
    { id: 'attr-1', name: 'Turnaround Time', type: 'Dropdown', category: 'Digital Marketing', options: '24 Hours, 3 Days, 7 Days, 1 Month', isRequired: true },
    { id: 'attr-2', name: 'Deliverables Count', type: 'Number', category: 'Creative & Design', options: '1, 5, 10, Unlimited', isRequired: true },
    { id: 'attr-3', name: 'Support SLA', type: 'Dropdown', category: 'IT Services', options: '24/7 Priority, Business Hours, Email Only', isRequired: false },
    { id: 'attr-4', name: 'Warranty Period', type: 'Text', category: 'Hardware/Print', options: '6 Months, 1 Year', isRequired: false },
    { id: 'attr-5', name: 'Includes Source Code', type: 'Checkbox', category: 'Web Development', options: 'Yes / No', isRequired: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);
  const [attrName, setAttrName] = useState('');
  const [attrType, setAttrType] = useState('Dropdown');
  const [attrCategory, setAttrCategory] = useState('Digital Marketing');
  const [attrOptions, setAttrOptions] = useState('');

  const filtered = attributes.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const openCreateModal = () => {
    setEditingAttr(null);
    setAttrName('');
    setAttrType('Dropdown');
    setAttrCategory('Digital Marketing');
    setAttrOptions('');
    setIsModalOpen(true);
  };

  const openEditModal = (attr) => {
    setEditingAttr(attr);
    setAttrName(attr.name);
    setAttrType(attr.type);
    setAttrCategory(attr.category);
    setAttrOptions(attr.options || '');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!attrName.trim()) return;

    if (editingAttr) {
      setAttributes(attributes.map(a => a.id === editingAttr.id ? { ...a, name: attrName, type: attrType, category: attrCategory, options: attrOptions } : a));
    } else {
      setAttributes([{ id: `attr-${Date.now()}`, name: attrName, type: attrType, category: attrCategory, options: attrOptions, isRequired: false }, ...attributes]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this attribute?')) {
      setAttributes(attributes.filter(a => a.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
            Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Attributes</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
            Attributes & Specifications
          </h1>
          <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
            Define custom parameters, specifications, and options for master products & services.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <Plus size={16} /> Add Attribute
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderBottom: cardBorder, color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Attribute Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Type</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Available Options / Format</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(attr => (
              <tr key={attr.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: textMain }}>{attr.name}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{attr.type}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: textMuted }}>{attr.category}</td>
                <td style={{ padding: '0.85rem 1rem', color: textMuted }}>{attr.options || 'N/A'}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => openEditModal(attr)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(attr.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '1.75rem', color: textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{editingAttr ? 'Edit Attribute' : 'Add New Attribute'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Attribute Name *</label>
                <input type="text" required placeholder="e.g. Turnaround Time" value={attrName} onChange={e => setAttrName(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Input Type</label>
                  <select value={attrType} onChange={e => setAttrType(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Checkbox">Checkbox</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Category</label>
                  <input type="text" value={attrCategory} onChange={e => setAttrCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Options (Comma separated)</label>
                <input type="text" placeholder="e.g. 24 Hours, 3 Days, 7 Days" value={attrOptions} onChange={e => setAttrOptions(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.6rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Attribute</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AttributesTab;
