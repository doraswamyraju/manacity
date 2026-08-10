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
  Trash2,
  Image as ImageIcon,
  Users,
  Copy
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

  const categoriesList = [
    'Digital Marketing',
    'Web Development',
    'Design & Branding',
    'IT Services',
    'Photography & Media',
    'Video & Animation',
    'Business Services',
    'Hardware/Print',
    'Software Add-on',
    'Clinics & Health',
    'Rice Mill',
    'General'
  ];

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
  const allProductsList = productCatalogList.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sku: `SKU-${c.id.substring(0, 6).toUpperCase()}`,
    tags: c.tags && c.tags.length ? c.tags : ['product'],
    category: c.category || 'Hardware/Print',
    categoryColor: '#34d399',
    priceRange: c.defaultPrice ? `₹${c.defaultPrice}` : 'Custom Quote',
    usedIn: 0,
    status: c.status === 'APPROVED' ? 'Active' : (c.status === 'PENDING' ? 'Pending Review' : 'Inactive'),
    iconUrl: c.photos?.[0] || 'https://images.unsplash.com/photo-1556742049-0a67daf4007a?w=400&auto=format&fit=crop'
  }));


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
                        <button
                          onClick={() => {
                            const copyPayload = {
                              name: `${prd.name} (Copy)`,
                              slug: `${prd.slug || prd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-copy-${Date.now().toString().slice(-4)}`,
                              category: prd.category || 'General',
                              type: 'PRODUCT',
                              defaultPrice: prd.defaultPrice || '',
                              description: prd.description || '',
                              photos: prd.photos || [],
                              customerLogos: prd.customerLogos || []
                            };
                            handleCreateCatalogItem && handleCreateCatalogItem(copyPayload);
                          }}
                          style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: '0.2rem' }}
                          title="Duplicate Product"
                        >
                          <Copy size={15} />
                        </button>

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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '620px', maxHeight: '88vh', overflowY: 'auto', padding: '1.75rem', color: textMain, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img src={viewingProduct.iconUrl} alt={viewingProduct.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: inputBorder }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>{viewingProduct.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '0.15rem' }}>
                    🔗 manacity.in/library/products/{viewingProduct.slug}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingProduct(null)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.88rem' }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.7rem', borderRadius: '6px', backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                  {viewingProduct.category}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.7rem', borderRadius: '6px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                  {viewingProduct.status}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: '6px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', color: textMuted }}>
                  SKU: {viewingProduct.sku}
                </span>
              </div>

              {/* Price */}
              <div style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.08)' : '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <strong style={{ color: textMuted, fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Master Base Price</strong>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10b981' }}>{viewingProduct.priceRange}</div>
              </div>

              {/* Description */}
              <div>
                <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Detailed Product Description</strong>
                <div style={{ backgroundColor: inputBg, border: inputBorder, padding: '0.85rem 1rem', borderRadius: '10px', color: textMain, lineHeight: 1.6, fontSize: '0.88rem' }}>
                  {viewingProduct.description || viewingProduct.rawItem?.description || 'Verified Super Admin catalog product available for business subscriber catalogs.'}
                </div>
              </div>

              {/* Photos Gallery */}
              {(() => {
                const productPhotos = (viewingProduct.photos || viewingProduct.rawItem?.photos || []).filter(p => p && typeof p === 'string' && p.trim() !== '');
                return productPhotos.length > 0 ? (
                  <div>
                    <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Product Photos & Images ({productPhotos.length})</strong>
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      {productPhotos.map((imgUrl, idx) => (
                        <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={imgUrl}
                            alt={`Photo ${idx + 1}`}
                            style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', border: inputBorder, backgroundColor: inputBg }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Product Photos & Images</strong>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                      <img
                        src={viewingProduct.iconUrl || 'https://images.unsplash.com/photo-1556742049-0a67daf4007a?w=400&auto=format&fit=crop'}
                        alt={viewingProduct.name}
                        style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', border: inputBorder, backgroundColor: inputBg }}
                      />
                      <span style={{ fontSize: '0.8rem', color: textMuted }}>Default catalog product image preview</span>
                    </div>
                  </div>
                );
              })()}

              {/* Implementation Telemetry */}
              <div>
                <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Implementation Telemetry</strong>
                <div style={{ color: textMain, fontSize: '0.85rem' }}>Used in <strong>{viewingProduct.usedIn?.toLocaleString('en-IN') || '0'}</strong> active business stores & listings across ManaCity.</div>
              </div>

              {/* Tags & Metadata */}
              <div>
                <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Tags & Metadata</strong>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {viewingProduct.tags?.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', color: textMain, fontWeight: 600 }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.85rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                <button onClick={() => setViewingProduct(null)} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', color: textMain, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{editingItem ? 'Edit Product' : 'Add New Product'}</h3>
                <p style={{ fontSize: '0.78rem', color: textMuted, margin: '0.2rem 0 0 0' }}>Configure product details, pricing, images, and SEO controls for Super Admin library.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Product Name */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Sona Masoori Rice (25kg Bag)"
                  value={formData.name}
                  onChange={e => {
                    const newName = e.target.value;
                    const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setFormData({ ...formData, name: newName, slug: autoSlug });
                  }}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.88rem', fontWeight: 600 }}
                />
              </div>

              {/* SEO Slug Control */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>SEO Slug (URL Control)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="e.g. premium-sona-masoori-rice-25kg"
                    value={formData.slug || ''}
                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.25rem', fontWeight: 600 }}>
                  🔗 Public URL: manacity.in/library/products/{(formData.slug || formData.name || 'product-name').toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                </div>
              </div>

              {/* Category & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1450"
                    value={formData.defaultPrice}
                    onChange={e => setFormData({ ...formData, defaultPrice: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the product offered..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Photos & Image Upload */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Product Photos & Images</label>
                {formData.photos.map((photoUrl, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...)"
                      value={photoUrl}
                      onChange={e => {
                        const updated = [...formData.photos];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, photos: updated });
                      }}
                      style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
                    />
                    <label style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', border: inputBorder, color: textMain, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      📁 Upload File
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const img = new Image();
                              img.src = reader.result;
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 800;
                                const scaleSize = MAX_WIDTH / img.width;
                                if (img.width > MAX_WIDTH) {
                                  canvas.width = MAX_WIDTH;
                                  canvas.height = img.height * scaleSize;
                                } else {
                                  canvas.width = img.width;
                                  canvas.height = img.height;
                                }
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
                                const updated = [...formData.photos];
                                updated[idx] = compressedBase64;
                                setFormData({ ...formData, photos: updated });
                              };
                            };
                            reader.readAsDataURL(file);
                          }
                        }}

                      />
                    </label>
                    {formData.photos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.photos.filter((_, i) => i !== idx);
                          setFormData({ ...formData, photos: updated });
                        }}
                        style={{ padding: '0.55rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, photos: [...formData.photos, ''] })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: '#10b981', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', marginTop: '0.2rem' }}
                >
                  <Plus size={14} /> Add Another Photo URL / File
                </button>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

export default ProductsLibraryTab;
