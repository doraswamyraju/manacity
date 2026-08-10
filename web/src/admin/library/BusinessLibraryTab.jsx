import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  Wrench,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Layers,
  Tag,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export default function BusinessLibraryTab({ theme }) {
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const [filterType, setFilterType] = useState('ALL'); // ALL, SERVICE, PRODUCT
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'SERVICE',
    price: '',
    description: '',
    photo: ''
  });

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/business/catalog');
      if (res.data && res.data.catalog) {
        setCatalog(res.data.catalog);
      }
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      type: 'SERVICE',
      price: '',
      description: '',
      photo: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      type: item.type || 'SERVICE',
      price: item.price ? String(item.price) : '',
      description: item.description || '',
      photo: (item.photos && item.photos[0]) || ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Item name is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description,
        photos: formData.photo ? [formData.photo] : []
      };

      if (editingItem) {
        await axios.put(`/api/business/catalog/${editingItem.id}`, payload);
      } else {
        await axios.post('/api/business/catalog/create', payload);
      }

      setIsModalOpen(false);
      fetchCatalog();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save catalog item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to remove "${item.name}"?`)) return;

    try {
      await axios.delete(`/api/business/catalog/${item.id}?type=${item.type}`);
      fetchCatalog();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  // Filtered Catalog Items
  const filteredItems = catalog.filter(item => {
    if (filterType === 'SERVICE' && item.type !== 'SERVICE') return false;
    if (filterType === 'PRODUCT' && item.type !== 'PRODUCT') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    }

    return true;
  });

  const servicesCount = catalog.filter(i => i.type === 'SERVICE').length;
  const productsCount = catalog.filter(i => i.type === 'PRODUCT').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      
      {/* Top Banner Header */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)'
          : 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: isDark ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(244, 63, 94, 0.2)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Layers size={18} color="#f43f5e" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Business Catalog Hub
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            Products & Services Library
          </h2>
          <p style={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Manage offerings published on your custom website storefront and the ManaCity main directory (`manacity.in`).
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          style={{
            backgroundColor: '#f43f5e',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.75rem 1.5rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)'
          }}
        >
          <Plus size={18} /> Add Product / Service
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '1.25rem', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Total Published Offerings</span>
            <Layers size={18} color="#38bdf8" />
          </div>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
            {catalog.length}
          </strong>
          <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginTop: '0.25rem' }}>
            Live on Storefront & ManaCity.in
          </div>
        </div>

        <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '1.25rem', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Active Services</span>
            <Wrench size={18} color="#6366f1" />
          </div>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
            {servicesCount}
          </strong>
          <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
            Bookable service packages
          </div>
        </div>

        <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '1.25rem', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Active Products</span>
            <Package size={18} color="#10b981" />
          </div>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
            {productsCount}
          </strong>
          <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
            Physical & digital products
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'ALL', label: `All Items (${catalog.length})` },
            { id: 'SERVICE', label: `Services (${servicesCount})` },
            { id: 'PRODUCT', label: `Products (${productsCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: filterType === tab.id ? '1px solid #f43f5e' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
                backgroundColor: filterType === tab.id ? 'rgba(244, 63, 94, 0.15)' : (isDark ? '#1e293b' : '#ffffff'),
                color: filterType === tab.id ? '#f43f5e' : (isDark ? '#94a3b8' : '#64748b'),
                fontWeight: filterType === tab.id ? 800 : 500,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search offerings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem 0.55rem 2.4rem',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#fff' : '#0f172a',
              fontSize: '0.85rem',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', display: 'block', color: '#f43f5e' }} />
          Loading catalog items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderRadius: '14px',
          padding: '3rem',
          textAlign: 'center',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
        }}>
          <Package size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>No Offerings Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.35rem 0 1.25rem 0' }}>Add your first product or service to display it on your website and directory.</p>
          <button onClick={handleOpenCreateModal} className="btn" style={{ backgroundColor: '#f43f5e', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
            + Add Product / Service
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderRadius: '14px',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    backgroundColor: item.type === 'PRODUCT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: item.type === 'PRODUCT' ? '#10b981' : '#818cf8',
                    border: item.type === 'PRODUCT' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    {item.type}
                  </span>

                  {item.price && (
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669' }}>
                      ₹{item.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: '0.35rem 0' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {item.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', pt: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                <button
                  onClick={() => handleOpenEditModal(item)}
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.75rem',
                    color: isDark ? '#cbd5e1' : '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.75rem',
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '520px',
            width: '100%',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
                {editingItem ? 'Edit Item' : 'Add New Product / Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Offering Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'SERVICE' })}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: formData.type === 'SERVICE' ? '2px solid #6366f1' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
                      backgroundColor: formData.type === 'SERVICE' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: formData.type === 'SERVICE' ? '#818cf8' : (isDark ? '#94a3b8' : '#64748b'),
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'PRODUCT' })}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: formData.type === 'PRODUCT' ? '2px solid #10b981' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
                      backgroundColor: formData.type === 'PRODUCT' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: formData.type === 'PRODUCT' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Product
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Item Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SEO Audit Report or Consultation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={modalInputStyle(isDark)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={modalInputStyle(isDark)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief details about what is included..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={modalInputStyle(isDark)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                    backgroundColor: 'transparent',
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#f43f5e',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalInputStyle = (isDark) => ({
  padding: '0.7rem 0.85rem',
  borderRadius: '8px',
  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
  backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  color: isDark ? '#fff' : '#0f172a',
  fontSize: '0.88rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
});
