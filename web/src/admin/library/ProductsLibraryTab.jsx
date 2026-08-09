import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  Layers,
  FolderTree,
  Package,
  Globe,
  Clock,
  Star,
  FileSpreadsheet,
  Settings,
  Activity,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  X,
  Image as ImageIcon,
  Users
} from 'lucide-react';

function ProductsLibraryTab({ catalog = [], theme, handleCreateCatalogItem, handleUpdateCatalogItem, handleDeleteCatalogItem }) {
  const isDark = theme === 'dark';

  const [activeSubTab, setActiveSubTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Hardware/Print',
    type: 'PRODUCT',
    description: '',
    defaultPrice: '',
    photos: [''],
    customerLogos: ['']
  });

  const defaultProducts = [
    {
      id: 'prd-1',
      name: 'NFC Tap & Review Standee',
      slug: 'nfc-tap-review-standee',
      sku: 'NFC-STD-01',
      tags: ['nfc', 'review', 'qr-code'],
      category: 'Hardware/Print',
      categoryColor: '#34d399',
      priceRange: '₹799 - ₹1,299',
      usedIn: 1420,
      status: 'Active',
      iconUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf4007a?w=400&auto=format&fit=crop'
    },
    {
      id: 'prd-2',
      name: 'Custom QR Window Sticker Pack',
      slug: 'custom-qr-window-sticker-pack',
      sku: 'QR-STK-05',
      tags: ['stickers', 'qr-code', 'print'],
      category: 'Hardware/Print',
      categoryColor: '#34d399',
      priceRange: '₹399 - ₹699',
      usedIn: 980,
      status: 'Active',
      iconUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400&auto=format&fit=crop'
    },
    {
      id: 'prd-3',
      name: 'Smart Live Review Counter Device',
      slug: 'smart-live-review-counter-device',
      sku: 'IOT-CNT-10',
      tags: ['iot', 'counter', 'hardware'],
      category: 'Hardware/Print',
      categoryColor: '#34d399',
      priceRange: '₹3,499 - ₹4,999',
      usedIn: 412,
      status: 'Active',
      iconUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop'
    },
    {
      id: 'prd-4',
      name: 'Acrylic Business Card Stand',
      slug: 'acrylic-business-card-stand',
      sku: 'ACR-CRD-02',
      tags: ['acrylic', 'card-stand'],
      category: 'Hardware/Print',
      categoryColor: '#34d399',
      priceRange: '₹299 - ₹499',
      usedIn: 850,
      status: 'Active',
      iconUrl: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&auto=format&fit=crop'
    }
  ];

  const productCatalogList = catalog.filter(c => c.type === 'PRODUCT');
  const allProductsList = productCatalogList.length > 0 ? productCatalogList.map((c, i) => ({
    id: c.id,
    name: c.name,
    slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sku: `SKU-${c.id.substring(0, 6).toUpperCase()}`,
    tags: c.tags && c.tags.length ? c.tags : ['product', 'hardware'],
    category: c.category || 'Hardware/Print',
    categoryColor: '#34d399',
    priceRange: c.defaultPrice ? `₹${c.defaultPrice}` : '₹799 - ₹1,499',
    usedIn: Math.floor(Math.random() * 1000) + 200,
    status: c.status === 'APPROVED' ? 'Active' : (c.status === 'PENDING' ? 'Pending Review' : 'Inactive'),
    iconUrl: c.photos?.[0] || defaultProducts[i % defaultProducts.length].iconUrl
  })) : defaultProducts;

  const filteredProducts = allProductsList.filter(item => {
    if (activeSubTab === 'ACTIVE' && item.status !== 'Active') return false;
    if (activeSubTab === 'INACTIVE' && item.status !== 'Inactive') return false;
    if (activeSubTab === 'PENDING' && item.status !== 'Pending Review') return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Hardware/Print',
      type: 'PRODUCT',
      description: '',
      defaultPrice: '',
      photos: [''],
      customerLogos: ['']
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Hardware/Print',
      type: 'PRODUCT',
      description: item.description || '',
      defaultPrice: item.defaultPrice ? String(item.defaultPrice) : (item.priceRange ? item.priceRange.replace(/[^0-9]/g, '') : ''),
      photos: item.photos && item.photos.length ? item.photos : [item.iconUrl || ''],
      customerLogos: item.customerLogos && item.customerLogos.length ? item.customerLogos : ['']
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      type: 'PRODUCT',
      photos: formData.photos.filter(Boolean),
      customerLogos: formData.customerLogos.filter(Boolean)
    };

    if (editingItem && handleUpdateCatalogItem) {
      await handleUpdateCatalogItem(editingItem.id, payload);
    } else if (handleCreateCatalogItem) {
      await handleCreateCatalogItem(payload);
    }
    setIsModalOpen(false);
  };

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Breadcrumbs */}
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#34d399' : '#059669', fontWeight: 600 }}>Products Library</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Products Library
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Physical & digital products available for business catalog attachment.
        </p>
      </div>

      {/* Top 6 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(52,211,153,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#34d399' }}>
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Total Products</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: textMain, marginTop: '0.15rem' }}>{allProductsList.length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(56,189,248,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#38bdf8' }}>
            <Globe size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Active Products</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981', marginTop: '0.15rem' }}>{allProductsList.filter(p => p.status === 'Active').length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(251,191,36,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#fbbf24' }}>
            <Star size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Avg Rating</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: textMain, marginTop: '0.15rem' }}>4.8 / 5</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls & Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          
          {/* Sub-Tabs Toolbar */}
          <div style={{ display: 'flex', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', gap: '1.5rem', paddingBottom: '0.5rem' }}>
            {['ALL', 'ACTIVE', 'INACTIVE', 'PENDING'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: activeSubTab === tab ? '#34d399' : textMuted,
                  fontWeight: activeSubTab === tab ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  paddingBottom: '0.4rem',
                  borderBottom: activeSubTab === tab ? '2px solid #34d399' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Actions Bar */}
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '12px', padding: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.75rem 0.45rem 2.2rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
              />
            </div>

            <button
              onClick={openCreateModal}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Products Table */}
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderBottom: cardBorder, color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Product Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>SKU</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Pricing</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Used In</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prd => (
                  <tr key={prd.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={prd.iconUrl} alt={prd.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: inputBorder }} />
                        <div>
                          <strong style={{ color: textMain, display: 'block' }}>{prd.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: textMuted }}>{prd.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: textMuted }}>{prd.sku}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px', backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399' }}>{prd.category}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#10b981' }}>{prd.priceRange}</td>
                    <td style={{ padding: '0.85rem 1rem', color: textMuted }}>{prd.usedIn}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{prd.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button onClick={() => setViewingProduct(prd)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }} title="View Details"><Eye size={15} /></button>
                        <button onClick={() => openEditModal(prd)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }} title="Edit Product"><Edit2 size={15} /></button>
                        <button onClick={() => handleDeleteCatalogItem && handleDeleteCatalogItem(prd.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }} title="Delete Product"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Side Panel Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: textMain, margin: '0 0 0.85rem 0', textTransform: 'uppercase' }}>Quick Actions</h4>
            <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: '0.35rem 0' }}>
              <Plus size={14} /> Add New Product
            </button>
          </div>
        </div>

      </div>

      {/* View Product Modal */}
      {viewingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '540px', padding: '1.75rem', color: textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{viewingProduct.name}</h3>
              <button onClick={() => setViewingProduct(null)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div><strong style={{ color: textMuted }}>SKU:</strong> {viewingProduct.sku}</div>
              <div><strong style={{ color: textMuted }}>Category:</strong> {viewingProduct.category}</div>
              <div><strong style={{ color: textMuted }}>Default Price:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{viewingProduct.priceRange}</span></div>
              <div><strong style={{ color: textMuted }}>Used In:</strong> {viewingProduct.usedIn} active stores</div>
              <button onClick={() => setViewingProduct(null)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '580px', padding: '1.75rem', color: textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{editingItem ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Product Name *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Price (₹)</label>
                  <input type="number" value={formData.defaultPrice} onChange={e => setFormData({ ...formData, defaultPrice: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted }}>Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.6rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductsLibraryTab;
