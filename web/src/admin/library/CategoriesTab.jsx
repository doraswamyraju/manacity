import React, { useState } from 'react';
import { FolderTree, Plus, Search, Edit2, Trash2, X, ChevronRight, Layers } from 'lucide-react';

function CategoriesTab({ theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  const [categories, setCategories] = useState([
    { id: 'cat-1', name: 'Digital Marketing', slug: 'digital-marketing', count: 856, subcategories: ['Local SEO', 'Google Ads', 'Social Media', 'ORM'], status: 'Active' },
    { id: 'cat-2', name: 'Web Development', slug: 'web-development', count: 542, subcategories: ['React / Vite', 'WordPress', 'Shopify', 'Laravel'], status: 'Active' },
    { id: 'cat-3', name: 'Design & Branding', slug: 'design-branding', count: 321, subcategories: ['Logo Design', 'UI/UX', 'Print Banners'], status: 'Active' },
    { id: 'cat-4', name: 'IT Services', slug: 'it-services', count: 287, subcategories: ['Cloud Hosting', 'Cybersecurity', 'IT Support'], status: 'Active' },
    { id: 'cat-5', name: 'Photography & Media', slug: 'photography-media', count: 156, subcategories: ['Product Photography', 'Drone Shoot', 'Ad Video'], status: 'Active' },
    { id: 'cat-6', name: 'Video & Animation', slug: 'video-animation', count: 128, subcategories: ['2D Explainer', 'Reels Editing'], status: 'Active' },
    { id: 'cat-7', name: 'Business Services', slug: 'business-services', count: 95, subcategories: ['GST Filing', 'Trademark', 'Accounting'], status: 'Active' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoriesText, setSubcategoriesText] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setSubcategoriesText('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setSubcategoriesText(cat.subcategories ? cat.subcategories.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const subList = subcategoriesText.split(',').map(s => s.trim()).filter(Boolean);
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: categoryName, slug, subcategories: subList } : c));
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryName,
        slug,
        count: 0,
        subcategories: subList,
        status: 'Active'
      };
      setCategories([newCat, ...categories]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
            Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Categories</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
            Category Management ({categories.length} Categories)
          </h1>
          <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
            Organize master services and products into main categories and subcategories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <Plus size={16} /> Add New Category
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Search size={16} color={textMuted} />
        <input
          type="text"
          placeholder="Search categories by name, slug..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', border: 'none', background: 'transparent', color: textMain, fontSize: '0.85rem', outline: 'none' }}
        />
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredCategories.map(cat => (
          <div key={cat.id} style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontWeight: 800, fontSize: '1.05rem' }}>
                  <FolderTree size={20} /> {cat.name}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  {cat.count} items
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: textMuted, display: 'block', marginBottom: '0.75rem' }}>slug: {cat.slug}</span>

              {/* Subcategories list */}
              <div style={{ fontSize: '0.78rem', color: textMuted, marginBottom: '0.5rem', fontWeight: 700 }}>
                Subcategories ({cat.subcategories?.length || 0}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {cat.subcategories?.map((sub, idx) => (
                  <span key={idx} style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: inputBg, border: inputBorder, color: textMain }}>
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9' }}>
              <button onClick={() => openEditModal(cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: inputBorder, backgroundColor: inputBg, color: textMain, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                <Edit2 size={13} color="#818cf8" /> Edit
              </button>
              <button onClick={() => handleDelete(cat.id)} style={{ padding: '0.35rem', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '1.75rem', color: textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digital Marketing"
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Subcategories (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. SEO, Google Ads, Social Media, ORM"
                  value={subcategoriesText}
                  onChange={e => setSubcategoriesText(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.6rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default CategoriesTab;
