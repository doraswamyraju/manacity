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
  Wrench,
  Globe,
  Clock,
  Star,
  FileSpreadsheet,
  Settings,
  TrendingUp,
  Activity,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Trash2,
  X
} from 'lucide-react';

function ServicesLibraryTab({ catalog = [], theme, handleCreateCatalogItem, handleUpdateCatalogItem, handleDeleteCatalogItem }) {
  const isDark = theme === 'dark';

  const [activeSubTab, setActiveSubTab] = useState('ALL'); // ALL, ACTIVE, INACTIVE, PENDING, ARCHIVED
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [viewingService, setViewingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Digital Marketing',
    type: 'SERVICE',
    description: '',
    defaultPrice: '',
    photos: [''],
    customerLogos: ['']
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
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Digital Marketing',
      type: 'SERVICE',
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
      type: 'SERVICE',
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

  // Sample seed rows matching the screenshot exactly
  const defaultServices = [
    {
      id: 'srv-1',
      name: 'SEO (Search Engine Optimization)',
      slug: 'seo-search-engine-optimization',
      tags: ['seo', 'ranking'],
      category: 'Digital Marketing',
      categoryColor: '#818cf8',
      priceRange: '₹5,000 - ₹25,000',
      usedIn: 4842,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png'
    },
    {
      id: 'srv-2',
      name: 'Google Ads Management',
      slug: 'google-ads-management',
      tags: ['ads', 'ppc'],
      category: 'Digital Marketing',
      categoryColor: '#818cf8',
      priceRange: '₹3,000 - ₹50,000',
      usedIn: 3214,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png'
    },
    {
      id: 'srv-3',
      name: 'Social Media Marketing',
      slug: 'social-media-marketing',
      tags: ['smm', 'social'],
      category: 'Digital Marketing',
      categoryColor: '#818cf8',
      priceRange: '₹4,000 - ₹20,000',
      usedIn: 6523,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'
    },
    {
      id: 'srv-4',
      name: 'Website Development',
      slug: 'website-development',
      tags: ['website', 'development'],
      category: 'Web Development',
      categoryColor: '#38bdf8',
      priceRange: '₹10,000 - ₹1,00,000',
      usedIn: 7821,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png'
    },
    {
      id: 'srv-5',
      name: 'Logo Design',
      slug: 'logo-design',
      tags: ['design', 'branding'],
      category: 'Design & Branding',
      categoryColor: '#ec4899',
      priceRange: '₹1,500 - ₹10,000',
      usedIn: 3456,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1260/1260204.png'
    },
    {
      id: 'srv-6',
      name: 'Content Writing',
      slug: 'content-writing',
      tags: ['content', 'writing'],
      category: 'IT Services',
      categoryColor: '#f97316',
      priceRange: '₹500 - ₹5,000',
      usedIn: 2934,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2541/2541988.png'
    },
    {
      id: 'srv-7',
      name: 'Email Marketing',
      slug: 'email-marketing',
      tags: ['email', 'marketing'],
      category: 'Digital Marketing',
      categoryColor: '#818cf8',
      priceRange: '₹2,000 - ₹15,000',
      usedIn: 1876,
      status: 'Pending Review',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/732/732200.png'
    },
    {
      id: 'srv-8',
      name: 'Video Editing',
      slug: 'video-editing',
      tags: ['video', 'editing'],
      category: 'Video & Animation',
      categoryColor: '#34d399',
      priceRange: '₹1,000 - ₹8,000',
      usedIn: 1245,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991195.png'
    },
    {
      id: 'srv-9',
      name: 'E-commerce Development',
      slug: 'ecommerce-development',
      tags: ['ecommerce', 'online-store'],
      category: 'Web Development',
      categoryColor: '#38bdf8',
      priceRange: '₹15,000 - ₹2,00,000',
      usedIn: 987,
      status: 'Inactive',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png'
    },
    {
      id: 'srv-10',
      name: 'PPC Campaign Setup',
      slug: 'ppc-campaign-setup',
      tags: ['ppc', 'ads'],
      category: 'Digital Marketing',
      categoryColor: '#818cf8',
      priceRange: '₹2,500 - ₹30,000',
      usedIn: 1643,
      status: 'Active',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png'
    }
  ];

  const serviceCatalogList = catalog.filter(c => c.type === 'SERVICE' || !c.type);
  const allServicesList = serviceCatalogList.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    tags: c.tags && c.tags.length ? c.tags : ['service'],
    category: c.category || 'Digital Marketing',
    categoryColor: c.category === 'Web Development' ? '#38bdf8' : (c.category === 'Design & Branding' ? '#ec4899' : '#818cf8'),
    priceRange: c.defaultPrice ? `₹${c.defaultPrice}` : 'Custom Quote',
    usedIn: 0,
    status: c.status === 'APPROVED' ? 'Active' : (c.status === 'PENDING' ? 'Pending Review' : 'Inactive'),
    iconUrl: c.photos?.[0] || 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png'
  }));


  // Filter Services
  const filteredServices = allServicesList.filter(item => {
    if (activeSubTab === 'ACTIVE' && item.status !== 'Active') return false;
    if (activeSubTab === 'INACTIVE' && item.status !== 'Inactive') return false;
    if (activeSubTab === 'PENDING' && item.status !== 'Pending Review') return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredServices.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredServices.map(s => s.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header & Breadcrumbs */}
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Services Library</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Services Library
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Manage all services available in ManaCity. Create once, use by thousands of businesses.
        </p>
      </div>

      {/* 2. Top 6 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        
        {/* Total Services */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(99,102,241,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#818cf8' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Total Services</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: textMain, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              2,468 <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑ 12.5%</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: textMuted }}>vs last month</div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(245,158,11,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#f59e0b' }}>
            <FolderTree size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Categories</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: textMain, marginTop: '0.15rem' }}>
              58
            </div>
            <div style={{ fontSize: '0.68rem', color: textMuted }}>No change</div>
          </div>
        </div>

        {/* Active Services */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#10b981' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Active Services</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: textMain, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              2,321 <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑ 95.03%</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: textMuted }}>of total services</div>
          </div>
        </div>

        {/* Used in Websites */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(56,189,248,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#38bdf8' }}>
            <Globe size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Used in Websites</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: textMain, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              18,742 <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑ 15.3%</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: textMuted }}>Total times used</div>
          </div>
        </div>

        {/* Pending Review */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(239,68,68,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#ef4444' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Pending Review</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              47 <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>↑ 8.5%</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: textMuted }}>Require attention</div>
          </div>
        </div>

        {/* Avg. Rating */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(251,191,36,0.15)', padding: '0.7rem', borderRadius: '12px', color: '#fbbf24' }}>
            <Star size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>Avg. Rating</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: textMain, marginTop: '0.15rem' }}>
              4.7 <span style={{ fontSize: '0.8rem', color: textMuted }}>/ 5</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700 }}>★★★★★ From businesses</div>
          </div>
        </div>

      </div>

      {/* 3. Main Content: Table View + Right Column Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        
        {/* Left Column: Services Table & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          
          {/* Sub-Tabs Toolbar */}
          <div style={{ display: 'flex', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', gap: '1.5rem', paddingBottom: '0.5rem' }}>
            {[
              { id: 'ALL', label: 'All Services' },
              { id: 'ACTIVE', label: 'Active' },
              { id: 'INACTIVE', label: 'Inactive' },
              { id: 'PENDING', label: 'Pending Review' },
              { id: 'ARCHIVED', label: 'Archived' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: activeSubTab === tab.id ? (isDark ? '#818cf8' : '#4338ca') : textMuted,
                  fontWeight: activeSubTab === tab.id ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  paddingBottom: '0.4rem',
                  borderBottom: activeSubTab === tab.id ? '2px solid #6366f1' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Filters Controls */}
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '12px', padding: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
                <input
                  type="text"
                  placeholder="Search services by name, keyword..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.75rem 0.45rem 2.2rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
              >
                <option value="ALL">All Categories</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Web Development">Web Development</option>
                <option value="Design & Branding">Design & Branding</option>
                <option value="IT Services">IT Services</option>
                <option value="Video & Animation">Video & Animation</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.75rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                <Filter size={14} /> More Filters
              </button>

              <button style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.75rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                <Download size={14} /> Export
              </button>

              <button
                onClick={openCreateModal}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add Service
              </button>

            </div>

          </div>

          {/* Services Data Table */}
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.85rem 1rem', width: '40px' }}>
                      <input type="checkbox" checked={selectedItems.length === filteredServices.length && filteredServices.length > 0} onChange={toggleSelectAll} />
                    </th>
                    <th style={{ padding: '0.85rem 1rem' }}>Service</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Pricing</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Used In</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map(srv => (
                    <tr key={srv.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <input type="checkbox" checked={selectedItems.includes(srv.id)} onChange={() => toggleSelectItem(srv.id)} />
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={srv.iconUrl}
                            alt={srv.name}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '2px' }}
                            onError={e => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png'; }}
                          />
                          <div>
                            <strong style={{ color: textMain, display: 'block', fontSize: '0.88rem' }}>{srv.name}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                              <span style={{ fontSize: '0.72rem', color: textMuted }}>{srv.slug}</span>
                              {srv.tags?.map((tag, idx) => (
                                <span key={idx} style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '4px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', color: textMuted }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)', color: srv.categoryColor }}>
                          {srv.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: textMain }}>
                        {srv.priceRange}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: textMuted }}>
                        {srv.usedIn.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          backgroundColor: srv.status === 'Active' ? 'rgba(16,185,129,0.15)' : (srv.status === 'Pending Review' ? 'rgba(245,158,11,0.15)' : 'rgba(148,163,184,0.15)'),
                          color: srv.status === 'Active' ? '#10b981' : (srv.status === 'Pending Review' ? '#f59e0b' : '#94a3b8')
                        }}>
                          {srv.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => setViewingService(srv)}
                            style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }}
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEditModal(srv)}
                            style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }}
                            title="Edit Service"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${srv.name}"?`)) {
                                handleDeleteCatalogItem && handleDeleteCatalogItem(srv.id);
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                            title="Delete Service"
                          >
                            <MoreVertical size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div style={{ padding: '0.85rem 1rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: textMuted, fontSize: '0.8rem' }}>
              <div>Showing 1 to 10 of 2,468 services</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: inputBorder, backgroundColor: inputBg, color: textMain, cursor: 'pointer' }}><ChevronLeft size={14} /></button>
                <button style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700 }}>1</button>
                <button style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', border: inputBorder, backgroundColor: inputBg, color: textMain }}>2</button>
                <button style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', border: inputBorder, backgroundColor: inputBg, color: textMain }}>3</button>
                <span>...</span>
                <button style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', border: inputBorder, backgroundColor: inputBg, color: textMain }}>247</button>
                <button style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: inputBorder, backgroundColor: inputBg, color: textMain, cursor: 'pointer' }}><ChevronRight size={14} /></button>
              </div>
              <select style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: inputBorder, backgroundColor: inputBg, color: textMain, fontSize: '0.8rem' }}>
                <option>10 / page</option>
                <option>25 / page</option>
                <option>50 / page</option>
              </select>
            </div>

          </div>

        </div>

        {/* Right Column: Side Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Quick Actions Widget */}
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: textMain, margin: '0 0 0.85rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: '0.35rem 0' }}>
                <Plus size={14} /> Add New Service
              </button>

              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: textMuted, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.35rem 0' }}>
                <Download size={14} /> Bulk Import Services
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: textMuted, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.35rem 0' }}>
                <FileSpreadsheet size={14} /> Import from CSV
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: textMuted, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.35rem 0' }}>
                <FolderTree size={14} /> Manage Categories
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: textMuted, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.35rem 0' }}>
                <Settings size={14} /> Manage Attributes
              </button>
            </div>
          </div>

          {/* Top Categories Widget */}
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: textMain, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Categories
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Digital Marketing', count: 856, color: '#818cf8' },
                { name: 'Web Development', count: 542, color: '#38bdf8' },
                { name: 'Design & Branding', count: 321, color: '#ec4899' },
                { name: 'IT Services', count: 287, color: '#f97316' },
                { name: 'Photography', count: 156, color: '#a855f7' },
                { name: 'Video & Animation', count: 128, color: '#34d399' },
                { name: 'Business Services', count: 95, color: '#fbbf24' }
              ].map(cat => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }}></span>
                    {cat.name}
                  </span>
                  <strong style={{ color: textMain }}>{cat.count}</strong>
                </div>
              ))}
              <button style={{ border: 'none', background: 'none', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center', marginTop: '0.4rem' }}>
                View All Categories →
              </button>
            </div>
          </div>

          {/* Recently Added Widget */}
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: textMain, margin: '0 0 0.85rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recently Added
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Influencer Marketing', time: '2 hours ago' },
                { name: 'Shopify Development', time: '5 hours ago' },
                { name: 'UI/UX Design', time: '1 day ago' },
                { name: 'WhatsApp Marketing', time: '2 days ago' },
                { name: 'ORM (Online Reputation)', time: '2 days ago' }
              ].map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: textMain, fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: textMuted, fontSize: '0.72rem' }}>{item.time}</span>
                </div>
              ))}
              <button style={{ border: 'none', background: 'none', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center', marginTop: '0.4rem' }}>
                View All →
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Analytics & Storage Usage Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '1.25rem' }}>
        
        {/* Library Analytics Line Graph Card */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: textMain, margin: 0 }}>Library Analytics</h4>
                <span style={{ fontSize: '0.72rem', color: textMuted }}>Last 30 days</span>
              </div>
              <Activity size={18} color="#818cf8" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: textMuted }}>New Services Added</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain }}>152 <span style={{ fontSize: '0.65rem', color: '#10b981' }}>↑ 18%</span></div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: textMuted }}>Services Used</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain }}>4,812 <span style={{ fontSize: '0.65rem', color: '#10b981' }}>↑ 25%</span></div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: textMuted }}>Searches</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain }}>12,643 <span style={{ fontSize: '0.65rem', color: '#10b981' }}>↑ 22%</span></div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: textMuted }}>Most Used Category</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: textMain }}>Digital Marketing <span style={{ fontSize: '0.65rem', color: textMuted }}>(38%)</span></div>
              </div>
            </div>
          </div>

          {/* Simple Visual Line Wave Representation */}
          <div style={{ height: '50px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            {[30, 45, 35, 60, 55, 75, 65, 80, 90, 85, 95, 100].map((val, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: '#818cf8', height: `${val}%`, borderRadius: '3px', opacity: 0.8 }} />
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: textMain, margin: '0 0 1rem 0' }}>Recent Activity</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Edit2 size={14} color="#818cf8" style={{ marginTop: '2px' }} />
                <div>
                  <strong style={{ color: textMain, display: 'block' }}>SEO (Search Engine Optimization) updated</strong>
                  <span style={{ fontSize: '0.72rem', color: textMuted }}>by Admin • 10 min ago</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <FileSpreadsheet size={14} color="#38bdf8" style={{ marginTop: '2px' }} />
                <div>
                  <strong style={{ color: textMain, display: 'block' }}>15 services imported from CSV</strong>
                  <span style={{ fontSize: '0.72rem', color: textMuted }}>by Admin • 1 hour ago</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle size={14} color="#10b981" style={{ marginTop: '2px' }} />
                <div>
                  <strong style={{ color: textMain, display: 'block' }}>Social Media Marketing status changed to Active</strong>
                  <span style={{ fontSize: '0.72rem', color: textMuted }}>by Admin • 3 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <button style={{ border: 'none', background: 'none', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem' }}>
            View All Activity →
          </button>
        </div>

        {/* Storage Usage Widget */}
        <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: textMain, margin: 0 }}>Storage Usage</h4>
              <HardDrive size={16} color="#38bdf8" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: textMuted }}>Library Media</span>
                  <strong style={{ color: textMain }}>18.6 GB / 100 GB</strong>
                </div>
                <div style={{ height: '6px', backgroundColor: inputBg, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '18.6%', height: '100%', backgroundColor: '#6366f1' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: textMuted }}>Documents</span>
                  <strong style={{ color: textMain }}>2.4 GB / 50 GB</strong>
                </div>
                <div style={{ height: '6px', backgroundColor: inputBg, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '4.8%', height: '100%', backgroundColor: '#38bdf8' }}></div>
                </div>
              </div>
            </div>
          </div>

          <button style={{ border: 'none', background: 'none', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem' }}>
            View Storage Details →
          </button>
        </div>

      </div>

      {/* View Service Detail Modal */}
      {viewingService && (
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
            maxWidth: '580px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: textMain
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={viewingService.iconUrl || 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png'}
                  alt={viewingService.name}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '4px' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{viewingService.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: textMuted }}>{viewingService.slug}</span>
                </div>
              </div>
              <button onClick={() => setViewingService(null)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  {viewingService.category}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: viewingService.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: viewingService.status === 'Active' ? '#10b981' : '#f59e0b' }}>
                  {viewingService.status}
                </span>
              </div>

              <div>
                <strong style={{ color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Pricing Range / Base Price</strong>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{viewingService.priceRange}</div>
              </div>

              <div>
                <strong style={{ color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Implementation Telemetry</strong>
                <div style={{ color: textMain }}>Used in {viewingService.usedIn?.toLocaleString('en-IN') || '0'} active websites & directories across ManaCity.</div>
              </div>

              <div>
                <strong style={{ color: textMuted, fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Tags & Metadata</strong>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {viewingService.tags?.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', color: textMain }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                <button onClick={() => setViewingService(null)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', color: textMain, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{editingItem ? 'Edit Service' : 'Add New Service'}</h3>
                <p style={{ fontSize: '0.78rem', color: textMuted, margin: '0.2rem 0 0 0' }}>Configure service details, pricing, images, and SEO controls for Super Admin library.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Service Name */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Local SEO & Google Maps Optimization"
                  value={formData.name}
                  onChange={e => {
                    const newName = e.target.value;
                    const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setFormData({ ...formData, name: newName, slug: formData.slug ? formData.slug : autoSlug });
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
                    placeholder="e.g. local-seo-optimization"
                    value={formData.slug || ''}
                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#818cf8', marginTop: '0.25rem', fontWeight: 600 }}>
                  🔗 Public URL: manacity.in/library/services/{(formData.slug || formData.name || 'service-name').toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                </div>
              </div>

              {/* Category & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Digital Marketing"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4999"
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
                  placeholder="Detailed description of the service offered..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Photos & Image Upload */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Service Photos & Images</label>
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
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', marginTop: '0.2rem' }}
                >
                  <Plus size={14} /> Add Another Photo URL / File
                </button>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

export default ServicesLibraryTab;
