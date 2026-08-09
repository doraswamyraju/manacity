import React, { useState } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, X } from 'lucide-react';

function TagsLabelsTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  const [tagsList, setTagsList] = useState([
    { id: 't-1', name: 'seo', slug: 'seo', color: '#818cf8', count: 420 },
    { id: 't-2', name: 'ranking', slug: 'ranking', color: '#38bdf8', count: 310 },
    { id: 't-3', name: 'ads', slug: 'ads', color: '#f59e0b', count: 540 },
    { id: 't-4', name: 'ppc', slug: 'ppc', color: '#ec4899', count: 290 },
    { id: 't-5', name: 'smm', slug: 'smm', color: '#34d399', count: 680 },
    { id: 't-6', name: 'social', slug: 'social', color: '#34d399', count: 720 },
    { id: 't-7', name: 'website', slug: 'website', color: '#38bdf8', count: 890 },
    { id: 't-8', name: 'development', slug: 'development', color: '#818cf8', count: 610 },
    { id: 't-9', name: 'design', slug: 'design', color: '#ec4899', count: 430 },
    { id: 't-10', name: 'branding', slug: 'branding', color: '#fbbf24', count: 390 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#818cf8');

  const filtered = tagsList.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const openCreateModal = () => {
    setEditingTag(null);
    setTagName('');
    setTagColor('#818cf8');
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTag(t);
    setTagName(t.name);
    setTagColor(t.color);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    const nameClean = tagName.toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (editingTag) {
      setTagsList(tagsList.map(t => t.id === editingTag.id ? { ...t, name: nameClean, slug: nameClean, color: tagColor } : t));
    } else {
      setTagsList([{ id: `t-${Date.now()}`, name: nameClean, slug: nameClean, color: tagColor, count: 0 }, ...tagsList]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete tag?')) {
      setTagsList(tagsList.filter(t => t.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
            Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Tags & Labels</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
            Tags & Labels Index
          </h1>
          <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
            Create and index search metadata tags & promotional badges for all catalog items.
          </p>
        </div>

        <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          <Plus size={16} /> Add Tag
        </button>
      </div>

      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: textMain, marginBottom: '1rem' }}>Active Tags List</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {filtered.map(tag => (
            <div key={tag.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: tag.color }}>
                <Tag size={14} /> #{tag.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <button onClick={() => openEditModal(tag)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(tag.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '450px', padding: '1.75rem', color: textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{editingTag ? 'Edit Tag' : 'Add New Tag'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Tag Name (without #) *</label>
                <input type="text" required placeholder="e.g. seo" value={tagName} onChange={e => setTagName(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Badge Color</label>
                <input type="color" value={tagColor} onChange={e => setTagColor(e.target.value)} style={{ width: '100%', height: '40px', padding: '0.2rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.6rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Tag</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default TagsLabelsTab;
