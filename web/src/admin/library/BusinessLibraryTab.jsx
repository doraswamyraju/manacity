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
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Check,
  Globe,
  Tag,
  DollarSign,
  Lock,
  Eye,
  Settings,
  Upload,
  Image as ImageIcon,
  FileText,
  MessageSquarePlus,
  ExternalLink
} from 'lucide-react';

export default function BusinessLibraryTab({ theme }) {
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [masterLibrary, setMasterLibrary] = useState([]);
  const [myCatalog, setMyCatalog] = useState([]);

  const [activeTab, setActiveTab] = useState('EXPLORE'); // EXPLORE or MY_ITEMS
  const [filterType, setFilterType] = useState('ALL'); // ALL, SERVICE, PRODUCT
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal States
  const [viewingItem, setViewingItem] = useState(null);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Customize Form State (Title is LOCKED / READ-ONLY)
  const [customForm, setCustomForm] = useState({
    price: '',
    description: '',
    photos: [''],
    customerLogos: ['', '', '', '', '']
  });

  // Request Form State (Super Admin Format)
  const [requestForm, setRequestForm] = useState({
    name: '',
    slug: '',
    type: 'SERVICE',
    category: 'Digital Marketing',
    defaultPrice: '',
    description: '',
    photos: [''],
    customerLogos: ['', '', '', '', ''],
    tags: ''
  });

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/business/catalog');
      if (res.data) {
        setMasterLibrary(res.data.masterLibrary || []);
        setMyCatalog(res.data.myCatalog || []);
      }
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Add
  const handleQuickAdd = async (masterItem) => {
    setActionLoadingId(masterItem.id);
    try {
      await axios.post('/api/business/catalog/attach', {
        libraryItemId: masterItem.id,
        customPrice: masterItem.defaultPrice
      });
      fetchCatalog();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add item to business profile.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Customize Modal
  const openCustomizeModal = (item) => {
    setCustomizingItem(item);
    const existingLogos = item.myCustomerLogos || item.customerLogos || [];
    const paddedLogos = [...existingLogos];
    while (paddedLogos.length < 5) paddedLogos.push('');

    const photosList = (item.myPhotos && item.myPhotos.length) ? item.myPhotos : (item.photos && item.photos.length ? item.photos : ['']);

    setCustomForm({
      price: item.myPrice !== undefined && item.myPrice !== null ? item.myPrice : (item.defaultPrice || ''),
      description: item.myDescription || item.description || '',
      photos: photosList.length ? photosList : [''],
      customerLogos: paddedLogos.slice(0, 5)
    });
  };

  // Save Customization Submit
  const handleSaveCustomization = async (e) => {
    e.preventDefault();
    if (!customizingItem) return;

    setActionLoadingId(customizingItem.id);
    try {
      const payload = {
        price: customForm.price !== '' ? parseFloat(customForm.price) : null,
        description: customForm.description,
        photos: customForm.photos.filter(Boolean),
        customerLogos: customForm.customerLogos.filter(Boolean).slice(0, 5),
        type: customizingItem.type
      };

      if (customizingItem.myBusinessItemId) {
        // Update already added item
        await axios.put(`/api/business/catalog/price/${customizingItem.myBusinessItemId}`, payload);
      } else {
        // Attach with customization
        await axios.post('/api/business/catalog/attach', {
          libraryItemId: customizingItem.id,
          customPrice: payload.price,
          customDescription: payload.description,
          customPhotos: payload.photos,
          customerLogos: payload.customerLogos
        });
      }

      setCustomizingItem(null);
      fetchCatalog();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save item customization.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Submit Request for New Master Item
  const handleSaveRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.name.trim()) return;

    setActionLoadingId('request');
    try {
      const payload = {
        ...requestForm,
        tags: requestForm.tags ? requestForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        photos: requestForm.photos.filter(Boolean),
        customerLogos: requestForm.customerLogos.filter(Boolean).slice(0, 5)
      };

      const res = await axios.post('/api/business/catalog/request', payload);
      alert(res.data.message || 'Product/Service request submitted to Super Admin!');
      setIsRequestModalOpen(false);
      fetchCatalog();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Detach / Remove Item
  const handleDetachItem = async (myBusinessItemId, type) => {
    if (!window.confirm('Are you sure you want to remove this item from your business profile?')) return;

    setActionLoadingId(myBusinessItemId);
    try {
      await axios.delete(`/api/business/catalog/detach/${myBusinessItemId}?type=${type}`);
      fetchCatalog();
    } catch (err) {
      alert('Failed to remove item.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Categories list
  const categoriesList = Array.from(new Set(masterLibrary.map(i => i.category).filter(Boolean)));

  // Filtered Master Items
  const filteredMasterItems = masterLibrary.filter(item => {
    if (filterType === 'SERVICE' && item.type !== 'SERVICE') return false;
    if (filterType === 'PRODUCT' && item.type !== 'PRODUCT') return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    }

    return true;
  });

  // Filtered My Items
  const filteredMyItems = myCatalog.filter(item => {
    if (filterType === 'SERVICE' && item.type !== 'SERVICE') return false;
    if (filterType === 'PRODUCT' && item.type !== 'PRODUCT') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    }

    return true;
  });

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      
      {/* Header Banner */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(16, 185, 129, 0.18) 100%)'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: isDark ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={18} color="#818cf8" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Super Admin Master Library Selection
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
            Products & Services Catalog
          </h2>
          <p style={{ color: textMuted, fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Select verified offerings from the Central Master Library to display on your custom storefront & ManaCity directory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => {
              setRequestForm({
                name: '',
                slug: '',
                type: 'SERVICE',
                category: 'Digital Marketing',
                defaultPrice: '',
                description: '',
                photos: [''],
                customerLogos: ['', '', '', '', ''],
                tags: ''
              });
              setIsRequestModalOpen(true);
            }}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#818cf8',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(129, 140, 248, 0.35)'
            }}
          >
            <MessageSquarePlus size={16} /> Request Product/Service
          </button>

          <button
            onClick={() => setActiveTab('EXPLORE')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: activeTab === 'EXPLORE' ? '2px solid #6366f1' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
              backgroundColor: activeTab === 'EXPLORE' ? '#6366f1' : cardBg,
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Explore Library ({masterLibrary.length})
          </button>

          <button
            onClick={() => setActiveTab('MY_ITEMS')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: activeTab === 'MY_ITEMS' ? '2px solid #10b981' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
              backgroundColor: activeTab === 'MY_ITEMS' ? '#10b981' : cardBg,
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            My Active Items ({myCatalog.length})
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Available Master Items</span>
            <Layers size={18} color="#818cf8" />
          </div>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: textMain }}>
            {masterLibrary.length}
          </strong>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, marginTop: '0.25rem' }}>
            Super Admin Verified
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Added to My Business</span>
            <CheckCircle2 size={18} color="#34d399" />
          </div>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: textMain }}>
            {myCatalog.length}
          </strong>
          <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginTop: '0.25rem' }}>
            Live on Storefront & Directory
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Types' },
            { id: 'SERVICE', label: 'Services Only' },
            { id: 'PRODUCT', label: 'Products Only' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: filterType === tab.id ? '1px solid #6366f1' : inputBorder,
                backgroundColor: filterType === tab.id ? 'rgba(99, 102, 241, 0.15)' : cardBg,
                color: filterType === tab.id ? '#818cf8' : textMuted,
                fontWeight: filterType === tab.id ? 800 : 500,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}

          {activeTab === 'EXPLORE' && categoriesList.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: inputBorder,
                backgroundColor: cardBg,
                color: textMuted,
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="ALL">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
          <input
            type="text"
            placeholder="Search master library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem 0.5rem 2.2rem',
              borderRadius: '8px',
              border: inputBorder,
              backgroundColor: cardBg,
              color: textMain,
              fontSize: '0.85rem',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: textMuted }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', display: 'block', color: '#6366f1' }} />
          Loading master catalog items...
        </div>
      ) : activeTab === 'EXPLORE' ? (
        /* EXPLORE MASTER LIBRARY */
        filteredMasterItems.length === 0 ? (
          <div style={{
            backgroundColor: cardBg,
            borderRadius: '14px',
            padding: '3rem',
            textAlign: 'center',
            border: cardBorder
          }}>
            <Package size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain, margin: 0 }}>No Master Library Items Available</h3>
            <p style={{ fontSize: '0.85rem', color: textMuted, maxWidth: '500px', margin: '0.5rem auto 0 auto' }}>
              There are currently no approved products or services in the Super Admin Master Library matching your filter. Click "Request Product/Service" above to request custom offerings!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
            {filteredMasterItems.map(item => (
              <div key={item.id} style={{
                backgroundColor: cardBg,
                borderRadius: '14px',
                border: item.isAdded
                  ? '2px solid #10b981'
                  : cardBorder,
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
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
                      {item.type} • {item.category || 'General'}
                    </span>

                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669' }}>
                      ₹{item.myPrice ? Number(item.myPrice).toLocaleString('en-IN') : (item.defaultPrice ? Number(item.defaultPrice).toLocaleString('en-IN') : 'N/A')}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: textMain, margin: '0.35rem 0' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: textMuted, lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.myDescription || item.description || 'Verified Super Admin catalog offering.'}
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {item.isAdded && (
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Check size={16} /> Added to My Business Profile
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setViewingItem(item)}
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        border: inputBorder,
                        borderRadius: '8px',
                        padding: '0.5rem',
                        color: textMain,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Eye size={14} /> View
                    </button>

                    <button
                      onClick={() => openCustomizeModal(item)}
                      style={{
                        flex: 1.3,
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        color: '#818cf8',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Settings size={14} /> {item.isAdded ? 'Customize' : 'Add & Customize'}
                    </button>

                    {item.isAdded ? (
                      <button
                        onClick={() => handleDetachItem(item.myBusinessItemId, item.type)}
                        disabled={actionLoadingId === item.myBusinessItemId}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.65rem',
                          color: '#ef4444',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(item)}
                        disabled={actionLoadingId === item.id}
                        style={{
                          flex: 1.2,
                          backgroundColor: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {actionLoadingId === item.id ? 'Adding...' : <><Plus size={14} /> Quick Add</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* MY ACTIVE ITEMS TAB */
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain, marginBottom: '1rem' }}>
            Active Offerings on Your Business Profile ({filteredMyItems.length})
          </h3>

          {filteredMyItems.length === 0 ? (
            <div style={{
              backgroundColor: cardBg,
              borderRadius: '14px',
              padding: '3rem',
              textAlign: 'center',
              border: cardBorder
            }}>
              <CheckCircle2 size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain, margin: 0 }}>No Active Items Added Yet</h3>
              <p style={{ fontSize: '0.85rem', color: textMuted, margin: '0.35rem 0 0 0' }}>
                Switch to the "Explore Library" tab to browse Super Admin master products & services and add them to your business profile!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
              {filteredMyItems.map(item => (
                <div key={item.id} style={{
                  backgroundColor: cardBg,
                  borderRadius: '14px',
                  border: '1px solid #10b981',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
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
                        {item.type} • {item.category || 'General'}
                      </span>

                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>
                        ₹{item.price ? Number(item.price).toLocaleString('en-IN') : 'N/A'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: textMain, margin: '0.35rem 0' }}>
                      {item.name}
                    </h4>

                    <p style={{ fontSize: '0.85rem', color: textMuted, lineHeight: 1.5, margin: '0.2rem 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description || 'Verified offering on your business storefront.'}
                    </p>

                    {/* Customer Logos Badges (Up to 5) */}
                    {item.customerLogos && item.customerLogos.length > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.7rem', color: textMuted, fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                          Customer Badges ({item.customerLogos.filter(Boolean).length}/5)
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {item.customerLogos.filter(Boolean).map((logo, lIdx) => (
                            <img
                              key={lIdx}
                              src={logo}
                              alt="Logo"
                              style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'contain', backgroundColor: '#fff', border: inputBorder, padding: '2px' }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setViewingItem(item)}
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        border: inputBorder,
                        borderRadius: '8px',
                        padding: '0.5rem',
                        color: textMain,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Eye size={14} /> View
                    </button>

                    <button
                      onClick={() => openCustomizeModal(item)}
                      style={{
                        flex: 1.2,
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        color: '#818cf8',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Settings size={14} /> Customize
                    </button>

                    <button
                      onClick={() => handleDetachItem(item.id, item.type)}
                      disabled={actionLoadingId === item.id}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        color: '#ef4444',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW ITEM DETAILS MODAL */}
      {viewingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '88vh', overflowY: 'auto', padding: '1.75rem', color: textMain, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: viewingItem.type === 'PRODUCT' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: viewingItem.type === 'PRODUCT' ? '#10b981' : '#818cf8' }}>
                  {viewingItem.type === 'PRODUCT' ? <Package size={22} /> : <Wrench size={22} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>{viewingItem.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>
                    🔗 manacity.in/library/{(viewingItem.type || 'service').toLowerCase()}s/{(viewingItem.slug || viewingItem.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewingItem(null)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.7rem', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  {viewingItem.category || 'General'}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.7rem', borderRadius: '6px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                  Type: {viewingItem.type}
                </span>
              </div>

              <div style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.08)' : '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <strong style={{ color: textMuted, fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Pricing</strong>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10b981' }}>
                  ₹{(viewingItem.myPrice || viewingItem.price || viewingItem.defaultPrice || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Full Description</strong>
                <div style={{ backgroundColor: inputBg, border: inputBorder, padding: '0.85rem 1rem', borderRadius: '10px', color: textMain, lineHeight: 1.6 }}>
                  {viewingItem.myDescription || viewingItem.description || 'Verified offering available in Super Admin master catalog.'}
                </div>
              </div>

              {/* Photos Gallery */}
              {((viewingItem.myPhotos && viewingItem.myPhotos.length > 0) || (viewingItem.photos && viewingItem.photos.length > 0)) && (
                <div>
                  <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Photos & Images</strong>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {(viewingItem.myPhotos || viewingItem.photos || []).filter(Boolean).map((imgUrl, idx) => (
                      <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={imgUrl}
                          alt={`Photo ${idx + 1}`}
                          style={{ width: '75px', height: '75px', borderRadius: '8px', objectFit: 'cover', border: inputBorder, backgroundColor: inputBg }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Up to 5 Customer Logos */}
              {((viewingItem.myCustomerLogos && viewingItem.myCustomerLogos.length > 0) || (viewingItem.customerLogos && viewingItem.customerLogos.length > 0)) && (
                <div>
                  <strong style={{ color: textMuted, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Customer Trust Badges ({viewingItem.myCustomerLogos?.filter(Boolean).length || viewingItem.customerLogos?.filter(Boolean).length || 0}/5)</strong>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {(viewingItem.myCustomerLogos || viewingItem.customerLogos || []).filter(Boolean).slice(0, 5).map((logoUrl, idx) => (
                      <img
                        key={idx}
                        src={logoUrl}
                        alt={`Logo ${idx + 1}`}
                        style={{ width: '55px', height: '40px', borderRadius: '6px', objectFit: 'contain', border: inputBorder, backgroundColor: '#fff', padding: '4px' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.85rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                <button onClick={() => setViewingItem(null)} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD & CUSTOMIZE MODAL (Title is LOCKED / READ-ONLY) */}
      {customizingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', color: textMain, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Settings size={14} /> Customize Business Offering
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0.2rem 0 0 0' }}>
                  Customize {customizingItem.name}
                </h3>
              </div>
              <button onClick={() => setCustomizingItem(null)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>✕</button>
            </div>

            <form onSubmit={handleSaveCustomization} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* Product/Service Title (READ-ONLY LOCKED) */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: textMuted, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <Lock size={14} color="#f59e0b" /> Product / Service Title (Master Locked - Cannot be changed)
                </label>
                <input
                  type="text"
                  disabled
                  value={customizingItem.name}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#e2e8f0',
                    border: inputBorder,
                    color: isDark ? '#cbd5e1' : '#475569',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              {/* Price (₹) */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>
                  Custom Price (₹) for Your Business
                </label>
                <input
                  type="number"
                  placeholder={`Master Default Price: ₹${customizingItem.defaultPrice || 0}`}
                  value={customForm.price}
                  onChange={e => setCustomForm({ ...customForm, price: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.9rem', fontWeight: 800 }}
                />
              </div>

              {/* Custom Description */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>
                  Custom Description for Your Storefront
                </label>
                <textarea
                  rows={3}
                  placeholder="Tailor the description of this service/product for your customers..."
                  value={customForm.description}
                  onChange={e => setCustomForm({ ...customForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Custom Product/Service Images */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>
                  Custom Images & Photos
                </label>
                {customForm.photos.map((url, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...)"
                      value={url}
                      onChange={e => {
                        const updated = [...customForm.photos];
                        updated[idx] = e.target.value;
                        setCustomForm({ ...customForm, photos: updated });
                      }}
                      style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
                    />
                    <label style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', border: inputBorder, color: textMain, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Upload size={14} /> File
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const updated = [...customForm.photos];
                              updated[idx] = reader.result;
                              setCustomForm({ ...customForm, photos: updated });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {customForm.photos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = customForm.photos.filter((_, i) => i !== idx);
                          setCustomForm({ ...customForm, photos: updated });
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
                  onClick={() => setCustomForm({ ...customForm, photos: [...customForm.photos, ''] })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: '#10b981', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', marginTop: '0.2rem' }}
                >
                  <Plus size={14} /> Add Image Slot
                </button>
              </div>

              {/* Up to 5 Customer Logos */}
              <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: '1rem', borderRadius: '12px', border: inputBorder }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: textMain, display: 'block', marginBottom: '0.25rem' }}>
                  Upload Customer Logos & Trust Badges (Up to 5)
                </label>
                <span style={{ fontSize: '0.72rem', color: textMuted, display: 'block', marginBottom: '0.75rem' }}>
                  Add up to 5 client logos, certificates, or badges to build trust on your business website.
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {customForm.customerLogos.map((logoUrl, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, width: '55px' }}>Logo {idx + 1}:</span>
                      <input
                        type="text"
                        placeholder="Logo Image URL (https://...)"
                        value={logoUrl}
                        onChange={e => {
                          const updated = [...customForm.customerLogos];
                          updated[idx] = e.target.value;
                          setCustomForm({ ...customForm, customerLogos: updated });
                        }}
                        style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.8rem' }}
                      />
                      <label style={{ padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', border: inputBorder, color: textMain, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Upload size={12} />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const updated = [...customForm.customerLogos];
                                updated[idx] = reader.result;
                                setCustomForm({ ...customForm, customerLogos: updated });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setCustomizingItem(null)} style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={actionLoadingId === customizingItem.id} style={{ flex: 2, padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  {actionLoadingId === customizingItem.id ? 'Saving...' : 'Save & Attach Offering'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST NEW PRODUCT/SERVICE MODAL (Super Admin Format) */}
      {isRequestModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', color: textMain, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>Request New Product or Service</h3>
                <p style={{ fontSize: '0.78rem', color: textMuted, margin: '0.2rem 0 0 0' }}>Submit a new item request to Super Admin for central library approval.</p>
              </div>
              <button onClick={() => setIsRequestModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>✕</button>
            </div>

            <form onSubmit={handleSaveRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Name */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Product or Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Specialized Solar Panel Installation Service"
                  value={requestForm.name}
                  onChange={e => {
                    const newName = e.target.value;
                    const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setRequestForm({ ...requestForm, name: newName, slug: autoSlug });
                  }}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.88rem', fontWeight: 600 }}
                />
              </div>

              {/* Type & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Item Type</label>
                  <select
                    value={requestForm.type}
                    onChange={e => setRequestForm({ ...requestForm, type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  >
                    <option value="SERVICE">SERVICE</option>
                    <option value="PRODUCT">PRODUCT</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Category</label>
                  <select
                    value={requestForm.category}
                    onChange={e => setRequestForm({ ...requestForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem' }}
                  >
                    {['Digital Marketing', 'Web Development', 'Design & Branding', 'IT Services', 'Photography & Media', 'Video & Animation', 'Business Services', 'Hardware/Print', 'Software Add-on', 'Clinics & Health', 'Rice Mill', 'General'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Default Price */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Suggested Default Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 9999"
                  value={requestForm.defaultPrice}
                  onChange={e => setRequestForm({ ...requestForm, defaultPrice: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', fontWeight: 700 }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the requested service/product..."
                  value={requestForm.description}
                  onChange={e => setRequestForm({ ...requestForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Photos */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Photos & Images</label>
                {requestForm.photos.map((url, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Paste image URL (https://...)"
                      value={url}
                      onChange={e => {
                        const updated = [...requestForm.photos];
                        updated[idx] = e.target.value;
                        setRequestForm({ ...requestForm, photos: updated });
                      }}
                      style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: inputBg, border: inputBorder, color: textMain, fontSize: '0.82rem' }}
                    />
                    <label style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', border: inputBorder, color: textMain, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Upload size={14} /> File
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const updated = [...requestForm.photos];
                              updated[idx] = reader.result;
                              setRequestForm({ ...requestForm, photos: updated });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setIsRequestModalOpen(false)} style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: inputBorder, backgroundColor: 'transparent', color: textMain, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={actionLoadingId === 'request'} style={{ flex: 2, padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#818cf8', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  {actionLoadingId === 'request' ? 'Submitting...' : 'Submit Item Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
