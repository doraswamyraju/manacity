import React, { useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Wrench,
  Layers,
  Image as ImageIcon,
  Users,
  X,
  ExternalLink
} from 'lucide-react';

function CatalogTab({
  catalog = [],
  onRefresh,
  handleCreateCatalogItem,
  handleUpdateCatalogItem,
  handleUpdateCatalogStatus,
  handleDeleteCatalogItem,
  theme
}) {
  const isDark = theme === 'dark';

  // Local Filter & Search state
  const [filterType, setFilterType] = useState('ALL'); // ALL, SERVICE, PRODUCT, PENDING
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = create mode, object = edit mode

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Digital Marketing',
    type: 'SERVICE',
    description: '',
    defaultPrice: '',
    photos: [''],
    customerLogos: ['']
  });

  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Categories list
  const categoriesList = [
    'Digital Marketing',
    'Web Development',
    'Creative & Design',
    'Software Add-on',
    'Hardware/Print',
    'IT Services',
    'Clinics & Health',
    'Rice Mill',
    'Business Services',
    'General'
  ];

  // Calculations for KPI Cards
  const totalItems = catalog.length;
  const servicesCount = catalog.filter(i => i.type === 'SERVICE').length;
  const productsCount = catalog.filter(i => i.type === 'PRODUCT').length;
  const pendingRequestsCount = catalog.filter(i => i.status === 'PENDING').length;

  // Filtered Catalog
  const filteredCatalog = catalog.filter(item => {
    // Filter by Tab Type
    if (filterType === 'SERVICE' && item.type !== 'SERVICE') return false;
    if (filterType === 'PRODUCT' && item.type !== 'PRODUCT') return false;
    if (filterType === 'PENDING' && item.status !== 'PENDING') return false;

    // Filter by Category
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      return matchName || matchCategory || matchDesc;
    }

    return true;
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Digital Marketing',
      type: 'SERVICE',
      description: '',
      defaultPrice: '',
      photos: [''],
      customerLogos: ['']
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'General',
      type: item.type || 'SERVICE',
      description: item.description || '',
      defaultPrice: item.defaultPrice !== undefined && item.defaultPrice !== null ? String(item.defaultPrice) : '',
      photos: item.photos && item.photos.length > 0 ? item.photos : [''],
      customerLogos: item.customerLogos && item.customerLogos.length > 0 ? item.customerLogos : ['']
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Item title is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        ...formData,
        photos: formData.photos.filter(url => url.trim() !== ''),
        customerLogos: formData.customerLogos.filter(url => url.trim() !== '')
      };

      if (editingItem) {
        await handleUpdateCatalogItem(editingItem.id, payload);
      } else {
        await handleCreateCatalogItem(payload);
      }

      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save library item.');
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Array Handlers for Photos & Logos
  const handlePhotoUrlChange = (index, value) => {
    const newPhotos = [...formData.photos];
    newPhotos[index] = value;
    setFormData({ ...formData, photos: newPhotos });
  };

  const addPhotoInput = () => {
    setFormData({ ...formData, photos: [...formData.photos, ''] });
  };

  const removePhotoInput = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos.length ? newPhotos : [''] });
  };

  const handleLogoUrlChange = (index, value) => {
    const newLogos = [...formData.customerLogos];
    newLogos[index] = value;
    setFormData({ ...formData, customerLogos: newLogos });
  };

  const addLogoInput = () => {
    setFormData({ ...formData, customerLogos: [...formData.customerLogos, ''] });
  };

  const removeLogoInput = (index) => {
    const newLogos = formData.customerLogos.filter((_, i) => i !== index);
    setFormData({ ...formData, customerLogos: newLogos.length ? newLogos : [''] });
  };

  // Theme Styles
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header & KPI Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(99,102,241,0.15)', padding: '0.75rem', borderRadius: '12px', color: '#818cf8' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase' }}>Total Library Items</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: textMain, marginTop: '0.2rem' }}>{totalItems}</div>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(56,189,248,0.15)', padding: '0.75rem', borderRadius: '12px', color: '#38bdf8' }}>
            <Wrench size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase' }}>Services Library</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: textMain, marginTop: '0.2rem' }}>{servicesCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(52,211,153,0.15)', padding: '0.75rem', borderRadius: '12px', color: '#34d399' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase' }}>Products Library</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: textMain, marginTop: '0.2rem' }}>{productsCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: pendingRequestsCount > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(148,163,184,0.15)', padding: '0.75rem', borderRadius: '12px', color: pendingRequestsCount > 0 ? '#f59e0b' : '#94a3b8' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase' }}>Pending Requests</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: pendingRequestsCount > 0 ? '#f59e0b' : textMain, marginTop: '0.2rem' }}>
              {pendingRequestsCount}
            </div>
          </div>
        </div>

      </div>

      {/* 2. Top Controls & Filter Bar */}
      <div style={{
        backgroundColor: cardBg,
        border: cardBorder,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        
        {/* Navigation Filter Tabs */}
        <div style={{ display: 'flex', backgroundColor: inputBg, padding: '0.25rem', borderRadius: '10px', gap: '0.25rem' }}>
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'SERVICE', label: 'Services' },
            { id: 'PRODUCT', label: 'Products' },
            { id: 'PENDING', label: `Pending Approval (${pendingRequestsCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                border: 'none',
                backgroundColor: filterType === tab.id ? '#6366f1' : 'transparent',
                color: filterType === tab.id ? '#ffffff' : textMuted,
                fontWeight: 600,
                fontSize: '0.82rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
            <input
              type="text"
              placeholder="Search title, category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                borderRadius: '8px',
                backgroundColor: inputBg,
                border: inputBorder,
                color: textMain,
                fontSize: '0.82rem'
              }}
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: inputBg,
              border: inputBorder,
              color: textMain,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Add Item Button */}
          <button
            onClick={openCreateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
            }}
          >
            <Plus size={16} /> Add Master Item
          </button>

        </div>

      </div>

      {/* 3. Master Catalog Items Grid / Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredCatalog.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            backgroundColor: cardBg,
            border: cardBorder,
            borderRadius: '16px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: textMuted
          }}>
            <Layers size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5, color: '#818cf8' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: textMain }}>No library items found</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try adjusting your search filters or click "Add Master Item" to create one.</p>
          </div>
        ) : (
          filteredCatalog.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: cardBg,
                border: cardBorder,
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {/* Header: Title & Badges */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: item.type === 'SERVICE' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
                      color: item.type === 'SERVICE' ? '#818cf8' : '#34d399'
                    }}>
                      {item.type}
                    </span>

                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                      color: textMuted
                    }}>
                      {item.category}
                    </span>

                    {item.status === 'PENDING' && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '6px', backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                        PENDING REQUEST
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', whiteSpace: 'nowrap' }}>
                    ₹{item.defaultPrice ? item.defaultPrice.toLocaleString('en-IN') : '0'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: textMain, margin: '0.35rem 0', lineHeight: 1.3 }}>
                  {item.name}
                </h3>

                <p style={{ fontSize: '0.83rem', color: textMuted, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description || 'No description provided.'}
                </p>
              </div>

              {/* Photos & Logos Previews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9' }}>
                
                {/* Photos Thumbnails */}
                {item.photos && item.photos.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ImageIcon size={12} /> Item Photos ({item.photos.length})
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
                      {item.photos.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={url}
                            alt={`Photo ${idx + 1}`}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: inputBorder }}
                            onError={e => { e.target.src = 'https://via.placeholder.com/48?text=Image'; }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Logos Thumbnails */}
                {item.customerLogos && item.customerLogos.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Users size={12} /> Customer Proof Logos ({item.customerLogos.length})
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
                      {item.customerLogos.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Logo ${idx + 1}`}
                          style={{ width: '36px', height: '36px', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '6px', padding: '2px', border: inputBorder }}
                          onError={e => { e.target.src = 'https://via.placeholder.com/36?text=Logo'; }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.requestedBy && (
                  <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>
                    Requested by: {item.requestedBy}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9' }}>
                
                {item.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button
                      onClick={() => handleUpdateCatalogStatus(item.id, 'APPROVED')}
                      style={{ flex: 1, backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateCatalogStatus(item.id, 'REJECTED')}
                      style={{ flex: 1, backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '0.4rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', border: 'none', color: textMain, padding: '0.4rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      <Edit2 size={14} color="#818cf8" /> Edit Item
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${item.name}" from the master library?`)) {
                          handleDeleteCatalogItem(item.id);
                        }
                      }}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.35rem', borderRadius: '6px' }}
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* 4. Modal Dialog for Create & Edit */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: cardBg,
            border: cardBorder,
            borderRadius: '20px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: textMain
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {editingItem ? 'Edit Master Library Item' : 'Add New Master Product / Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.65rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Type Switcher & Title */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Type *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  >
                    <option value="SERVICE">Service</option>
                    <option value="PRODUCT">Product</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Master Title * (Locked for businesses)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEO Optimization Package"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Category & Default Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Default Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2999"
                    value={formData.defaultPrice}
                    onChange={e => setFormData({ ...formData, defaultPrice: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed explanation of what this service/product includes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                />
              </div>

              {/* Photos URL List */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Product / Service Photos (URLs)</label>
                  <button type="button" onClick={addPhotoInput} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    + Add Photo URL
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.photos.map((photoUrl, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={photoUrl}
                        onChange={e => handlePhotoUrlChange(idx, e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
                      />
                      {photoUrl && (
                        <img src={photoUrl} alt="Preview" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      {formData.photos.length > 1 && (
                        <button type="button" onClick={() => removePhotoInput(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Logos URL List */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Customer Logos / Client Proof (URLs)</label>
                  <button type="button" onClick={addLogoInput} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    + Add Logo URL
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.customerLogos.map((logoUrl, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="url"
                        placeholder="https://example.com/client-logo.png"
                        value={logoUrl}
                        onChange={e => handleLogoUrlChange(idx, e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
                      />
                      {logoUrl && (
                        <img src={logoUrl} alt="Logo Preview" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', backgroundColor: '#fff', padding: '2px' }} onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      {formData.customerLogos.length > 1 && (
                        <button type="button" onClick={() => removeLogoInput(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{ flex: 2, padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#ffffff', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}
                >
                  {saving ? 'Saving...' : (editingItem ? 'Update Library Item' : 'Publish to Library')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default CatalogTab;
