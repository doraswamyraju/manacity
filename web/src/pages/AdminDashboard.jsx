import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  Shield,
  Users,
  MapPin,
  Globe,
  MessageSquare,
  List,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  Database,
  CreditCard,
  Activity,
  Layers,
  UserCheck,
  Building2,
  RefreshCw
} from 'lucide-react';

function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, businesses, catalog, subscriptions, logs
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Master Catalog Form State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Digital Marketing',
    type: 'SERVICE',
    description: '',
    defaultPrice: ''
  });
  const [itemMessage, setItemMessage] = useState('');

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) fetchUsers();
    if (activeTab === 'businesses' && businesses.length === 0) fetchBusinesses();
    if (activeTab === 'catalog' && catalog.length === 0) fetchCatalog();
    if (activeTab === 'subscriptions' && subscriptions.length === 0) fetchSubscriptions();
  }, [activeTab]);

  const fetchAdminOverview = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/admin/metrics');
      setMetrics(response.data.metrics);
      setLogs(response.data.auditLogs || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to retrieve administrative overview metrics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'SUPER_ADMIN' ? 'BUSINESS_OWNER' : 'SUPER_ADMIN';
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get('/api/admin/businesses');
      setBusinesses(response.data.businesses || []);
    } catch (err) {
      console.error('Fetch businesses error:', err);
    }
  };

  const fetchCatalog = async () => {
    try {
      const response = await axios.get('/api/admin/catalog');
      setCatalog(response.data.catalog || []);
    } catch (err) {
      console.error('Fetch catalog error:', err);
    }
  };

  const handleCreateCatalogItem = async (e) => {
    e.preventDefault();
    setItemMessage('');
    try {
      const response = await axios.post('/api/admin/catalog', newItem);
      if (response.data.status === 'success') {
        setCatalog([response.data.item, ...catalog]);
        setItemMessage('Master product/service catalog item published to ManaCity!');
        setNewItem({ name: '', category: 'Digital Marketing', type: 'SERVICE', description: '', defaultPrice: '' });
      }
    } catch (err) {
      setItemMessage('Failed to publish catalog item.');
    }
  };

  const handleDeleteCatalogItem = async (id) => {
    try {
      await axios.delete(`/api/admin/catalog/${id}`);
      setCatalog(catalog.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete catalog item');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/admin/subscriptions');
      setSubscriptions(response.data.subscriptions || []);
    } catch (err) {
      console.error('Fetch subscriptions error:', err);
    }
  };

  // Filter helpers
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBusinesses = businesses.filter(b =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', width: '100%', textAlign: 'left', margin: '0 auto', padding: '2rem 1rem' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={backBtnStyle}>
          <ArrowLeft size={16} /> Back to App
        </button>
        <button onClick={fetchAdminOverview} style={{ ...backBtnStyle, marginBottom: 0, color: '#6366f1' }}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <Shield size={32} style={{ color: '#818cf8' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Super Admin <span className="gradient-text">Control Center</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            System-wide platform overview, listings moderation, user roles, catalog library & metrics
          </p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div style={tabContainerStyle}>
        <button style={activeTab === 'overview' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('overview')}>
          <Activity size={16} /> Overview
        </button>
        <button style={activeTab === 'users' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('users')}>
          <Users size={16} /> User Directory
        </button>
        <button style={activeTab === 'businesses' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('businesses')}>
          <Building2 size={16} /> Business Directory
        </button>
        <button style={activeTab === 'catalog' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('catalog')}>
          <Database size={16} /> Master Catalog
        </button>
        <button style={activeTab === 'subscriptions' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('subscriptions')}>
          <CreditCard size={16} /> Subscriptions
        </button>
        <button style={activeTab === 'logs' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('logs')}>
          <List size={16} /> Audit Logs
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
          Loading administrative platform metrics...
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && metrics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Aggregator Overview Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div className="glass-card" style={statCardStyle}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', color: '#818cf8' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Registered Users</span>
                    <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalUsers}</strong>
                  </div>
                </div>

                <div className="glass-card" style={statCardStyle}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: '#10b981' }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Business Groups</span>
                    <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalBusinessGroups || metrics.totalLocations}</strong>
                  </div>
                </div>

                <div className="glass-card" style={statCardStyle}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: '#f59e0b' }}>
                    <Globe size={24} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Generated Websites</span>
                    <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalWebsites}</strong>
                  </div>
                </div>

                <div className="glass-card" style={statCardStyle}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(168, 85, 247, 0.15)', borderRadius: '8px', color: '#a855f7' }}>
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Total Customer Reviews</span>
                    <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalReviews}</strong>
                  </div>
                </div>
              </div>

              {/* Plans Breakdown & System Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CreditCard size={18} color="#6366f1" /> Active Tier Subscriptions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={planRowStyle}>
                      <span style={{ color: '#94a3b8' }}>Starter / Free Tier</span>
                      <strong style={{ color: '#fff' }}>{metrics.plansBreakdown?.FREE || 0} Businesses</strong>
                    </div>
                    <div style={planRowStyle}>
                      <span style={{ color: '#818cf8' }}>Growth Business Plan</span>
                      <strong style={{ color: '#fff' }}>{metrics.plansBreakdown?.GROWTH || 0} Businesses</strong>
                    </div>
                    <div style={planRowStyle}>
                      <span style={{ color: '#a855f7' }}>Enterprise Custom Plan</span>
                      <strong style={{ color: '#fff' }}>{metrics.plansBreakdown?.ENTERPRISE || 0} Businesses</strong>
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} color="#10b981" /> System Health Status
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Database Cluster (MongoDB)</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>● Operational</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Google Business Profile API Sync</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>● Operational</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>WhatsApp Notification Gateway</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>● Operational</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>SSL Subdomain SSL Auto-Renew</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>● Active</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: USER DIRECTORY */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={searchContainerStyle}>
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={searchInputStyle}
                />
              </div>

              <div className="glass-card" style={{ backgroundColor: '#1e293b', overflowX: 'auto', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>User</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Provider</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Businesses</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Registered</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(userItem => (
                      <tr key={userItem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <strong style={{ color: '#fff', display: 'block' }}>{userItem.name}</strong>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{userItem.email}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{userItem.provider}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: userItem.role === 'SUPER_ADMIN' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: userItem.role === 'SUPER_ADMIN' ? '#c084fc' : '#60a5fa'
                          }}>
                            {userItem.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{userItem._count?.businessGroups || 0}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleRole(userItem.id, userItem.role)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#fff',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            Toggle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BUSINESS DIRECTORY */}
          {activeTab === 'businesses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={searchContainerStyle}>
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search business name or owner email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={searchInputStyle}
                />
              </div>

              <div className="glass-card" style={{ backgroundColor: '#1e293b', overflowX: 'auto', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Business Name</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Owner</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Locations</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Catalog Items</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Website Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBusinesses.map(bus => (
                      <tr key={bus.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <strong style={{ color: '#fff', display: 'block' }}>{bus.name}</strong>
                          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>ID: {bus.id}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ color: '#cbd5e1', display: 'block' }}>{bus.owner?.name}</span>
                          <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{bus.owner?.email}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{bus._count?.locations || 0}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>
                          {(bus._count?.services || 0) + (bus._count?.products || 0)}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {bus.websiteConfig ? (
                            <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                              ✓ {bus.websiteConfig.published ? 'Published' : 'Draft'}
                            </span>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Not created</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MASTER CATALOG */}
          {activeTab === 'catalog' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Creator Form */}
              <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} color="#6366f1" /> Create Master Item
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Add products or services to the global catalog library so businesses can import them with 1-click.
                </p>

                {itemMessage && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    ✓ {itemMessage}
                  </div>
                )}

                <form onSubmit={handleCreateCatalogItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Item Title (e.g. Google Local SEO Package)"
                    required
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    style={formInputStyle}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <select
                      value={newItem.category}
                      onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                      style={formInputStyle}
                    >
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Hardware/Print">Hardware/Print</option>
                      <option value="Creative & Design">Creative & Design</option>
                      <option value="Software Add-on">Software Add-on</option>
                      <option value="Rice Mill">Rice Mill</option>
                      <option value="Clinics & Health">Clinics & Health</option>
                    </select>

                    <select
                      value={newItem.type}
                      onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                      style={formInputStyle}
                    >
                      <option value="SERVICE">Service</option>
                      <option value="PRODUCT">Product</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Default Price (e.g. ₹1,499)"
                    value={newItem.defaultPrice}
                    onChange={e => setNewItem({ ...newItem, defaultPrice: e.target.value })}
                    style={formInputStyle}
                  />

                  <textarea
                    placeholder="Short description..."
                    rows={3}
                    value={newItem.description}
                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    style={formInputStyle}
                  />

                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#6366f1', padding: '0.6rem' }}>
                    Publish Master Item
                  </button>
                </form>
              </div>

              {/* Master Items List */}
              <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={18} color="#a855f7" /> Master Catalog Library
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {catalog.map(catItem => (
                    <div key={catItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{catItem.name}</strong>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                          <span style={{ color: '#818cf8', backgroundColor: 'rgba(99,102,241,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{catItem.category}</span>
                          <span style={{ color: '#cbd5e1' }}>₹{catItem.defaultPrice || '0'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCatalogItem(catItem.id)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="glass-card" style={{ backgroundColor: '#1e293b' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
                Platform Subscription Log
              </h3>
              {subscriptions.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No subscriptions recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {subscriptions.map(sub => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                      <div>
                        <strong style={{ color: '#fff' }}>{sub.businessGroup?.name}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block' }}>{sub.businessGroup?.email}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{sub.tier}</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>{sub.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="glass-card" style={{ backgroundColor: '#1e293b' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <List size={18} color="#a855f7" /> Security & System Audit Trail
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {logs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem' }}>
                    <div>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        marginRight: '0.75rem',
                        color: '#818cf8'
                      }}>{log.action}</span>
                      <span style={{ color: '#cbd5e1' }}>{log.details}</span>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

const backBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  fontSize: '0.95rem'
};

const tabContainerStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '1.5rem',
  overflowX: 'auto',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  paddingBottom: '0.5rem'
};

const tabStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  fontSize: '0.88rem',
  fontWeight: 500
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: 'rgba(99, 102, 241, 0.15)',
  color: '#818cf8',
  fontWeight: 700,
  border: '1px solid rgba(99, 102, 241, 0.3)'
};

const statCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.08)'
};

const planRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 0',
  borderBottom: '1px solid rgba(255,255,255,0.03)',
  fontSize: '0.9rem'
};

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  backgroundColor: '#1e293b',
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.08)'
};

const searchInputStyle = {
  width: '100%',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#fff',
  outline: 'none',
  fontSize: '0.9rem'
};

const formInputStyle = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: '6px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '0.85rem'
};

export default AdminDashboard;
