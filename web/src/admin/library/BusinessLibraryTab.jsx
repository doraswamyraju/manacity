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
  DollarSign
} from 'lucide-react';

export default function BusinessLibraryTab({ theme }) {
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [masterLibrary, setMasterLibrary] = useState([]);
  const [myCatalog, setMyCatalog] = useState([]);

  const [activeTab, setActiveTab] = useState('EXPLORE'); // EXPLORE (Master Library) or MY_ITEMS
  const [filterType, setFilterType] = useState('ALL'); // ALL, SERVICE, PRODUCT
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline Price Editing State
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [customPriceVal, setCustomPriceVal] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

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

  const handleAttachItem = async (masterItem, customPrice = null) => {
    setActionLoadingId(masterItem.id);
    try {
      await axios.post('/api/business/catalog/attach', {
        libraryItemId: masterItem.id,
        customPrice: customPrice !== null ? customPrice : masterItem.defaultPrice
      });
      fetchCatalog();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add item to business profile.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdatePrice = async (itemId, type, newPrice) => {
    setActionLoadingId(itemId);
    try {
      await axios.put(`/api/business/catalog/price/${itemId}`, {
        price: newPrice,
        type
      });
      setEditingPriceId(null);
      fetchCatalog();
    } catch (err) {
      alert('Failed to update price.');
    } finally {
      setActionLoadingId(null);
    }
  };

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

  const addedCount = masterLibrary.filter(i => i.isAdded).length;

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
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={18} color="#818cf8" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Super Admin Master Library Selection
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            Products & Services Catalog
          </h2>
          <p style={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Select verified offerings from the Central Master Library to display on your custom storefront & ManaCity directory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('EXPLORE')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: activeTab === 'EXPLORE' ? '2px solid #6366f1' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
              backgroundColor: activeTab === 'EXPLORE' ? '#6366f1' : (isDark ? '#1e293b' : '#ffffff'),
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
              backgroundColor: activeTab === 'MY_ITEMS' ? '#10b981' : (isDark ? '#1e293b' : '#ffffff'),
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
        <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '1.25rem', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Available Master Items</span>
            <Layers size={18} color="#818cf8" />
          </div>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
            {masterLibrary.length}
          </strong>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, marginTop: '0.25rem' }}>
            Super Admin Verified
          </div>
        </div>

        <div style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', padding: '1.25rem', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Added to My Business</span>
            <CheckCircle2 size={18} color="#34d399" />
          </div>
          <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
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
                border: filterType === tab.id ? '1px solid #6366f1' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
                backgroundColor: filterType === tab.id ? 'rgba(99, 102, 241, 0.15)' : (isDark ? '#1e293b' : '#ffffff'),
                color: filterType === tab.id ? '#818cf8' : (isDark ? '#94a3b8' : '#64748b'),
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
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#fff' : '#0f172a',
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

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search master library..."
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

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', display: 'block', color: '#6366f1' }} />
          Loading master catalog items...
        </div>
      ) : activeTab === 'EXPLORE' ? (
        filteredMasterItems.length === 0 ? (
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '14px',
            padding: '3rem',
            textAlign: 'center',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
          }}>
            <Package size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>No Master Library Items Available</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto 0 auto' }}>
              There are currently no approved products or services in the Super Admin Master Library matching your filter. Once Super Admin creates items in the Central Control Hub, they will appear here for you to add to your business.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filteredMasterItems.map(item => (
              <div key={item.id} style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderRadius: '14px',
                border: item.isAdded
                  ? '2px solid #10b981'
                  : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1'),
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

                    <span style={{ fontSize: '1rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669' }}>
                      ₹{item.myPrice ? item.myPrice.toLocaleString() : (item.defaultPrice ? item.defaultPrice.toLocaleString() : 'N/A')}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: '0.35rem 0' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {item.description || 'Verified Super Admin catalog offering.'}
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', pt: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                  {item.isAdded ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Check size={16} /> Added to My Business
                      </span>

                      <button
                        onClick={() => handleDetachItem(item.myBusinessItemId, item.type)}
                        disabled={actionLoadingId === item.myBusinessItemId}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          padding: '0.35rem 0.65rem',
                          color: '#ef4444',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAttachItem(item)}
                      disabled={actionLoadingId === item.id}
                      style={{
                        width: '100%',
                        backgroundColor: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.6rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {actionLoadingId === item.id ? 'Adding...' : <><Plus size={16} /> Add to My Business</>}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* MY ACTIVE ITEMS TAB */
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', marginBottom: '1rem' }}>
            Active Offerings on Your Business Profile ({filteredMyItems.length})
          </h3>

          {filteredMyItems.length === 0 ? (
            <div style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderRadius: '14px',
              padding: '3rem',
              textAlign: 'center',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
            }}>
              <Package size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>No Active Items Added Yet</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.35rem 0 1.25rem 0' }}>Switch to the Explore Master Library tab to select and add services or products.</p>
              <button onClick={() => setActiveTab('EXPLORE')} className="btn" style={{ backgroundColor: '#6366f1', color: '#fff', padding: '0.55rem 1.25rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
                Browse Master Library
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filteredMyItems.map(item => (
                <div key={item.id} style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderRadius: '14px',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
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
                        color: item.type === 'PRODUCT' ? '#10b981' : '#818cf8'
                      }}>
                        {item.type}
                      </span>

                      {editingPriceId === item.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <input
                            type="number"
                            value={customPriceVal}
                            onChange={(e) => setCustomPriceVal(e.target.value)}
                            placeholder="Price"
                            style={{ width: '80px', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid #6366f1', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.82rem' }}
                          />
                          <button
                            onClick={() => handleUpdatePrice(item.id, item.type, customPriceVal)}
                            style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669' }}>
                            ₹{item.price ? item.price.toLocaleString() : 'N/A'}
                          </span>
                          <button
                            onClick={() => { setEditingPriceId(item.id); setCustomPriceVal(item.price || ''); }}
                            title="Custom Price"
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.1rem' }}
                          >
                            <Edit2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: '0.35rem 0' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {item.description || 'Verified offering.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', pt: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Globe size={12} /> Live on Storefront
                    </span>

                    <button
                      onClick={() => handleDetachItem(item.id, item.type)}
                      disabled={actionLoadingId === item.id}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        padding: '0.35rem 0.65rem',
                        color: '#ef4444',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {actionLoadingId === item.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
