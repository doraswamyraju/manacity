import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  Shield,
  Users,
  Building2,
  Database,
  CreditCard,
  List,
  Activity,
  RefreshCw
} from 'lucide-react';

// Modular Admin Tab Components
import OverviewTab from '../admin/OverviewTab';
import UsersTab from '../admin/UsersTab';
import BusinessesTab from '../admin/BusinessesTab';
import CatalogTab from '../admin/CatalogTab';
import SubscriptionsTab from '../admin/SubscriptionsTab';
import AuditLogsTab from '../admin/AuditLogsTab';

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

      {/* Modular Admin Navigation Tabs */}
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
          {activeTab === 'overview' && <OverviewTab metrics={metrics} />}
          {activeTab === 'users' && <UsersTab users={users} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleToggleRole={handleToggleRole} />}
          {activeTab === 'businesses' && <BusinessesTab businesses={businesses} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          {activeTab === 'catalog' && (
            <CatalogTab
              catalog={catalog}
              newItem={newItem}
              setNewItem={setNewItem}
              itemMessage={itemMessage}
              handleCreateCatalogItem={handleCreateCatalogItem}
              handleDeleteCatalogItem={handleDeleteCatalogItem}
            />
          )}
          {activeTab === 'subscriptions' && <SubscriptionsTab subscriptions={subscriptions} />}
          {activeTab === 'logs' && <AuditLogsTab logs={logs} />}
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

export default AdminDashboard;
