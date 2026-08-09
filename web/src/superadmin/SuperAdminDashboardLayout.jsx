import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';

import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminTopbar from './SuperAdminTopbar';

// Modular Admin Tab Components
import OverviewTab from '../admin/OverviewTab';
import UsersTab from '../admin/UsersTab';
import BusinessesTab from '../admin/BusinessesTab';
import CatalogTab from '../admin/CatalogTab';
import SubscriptionsTab from '../admin/SubscriptionsTab';
import AuditLogsTab from '../admin/AuditLogsTab';

// LMS Module Tabs
import LMSAllLeadsTab from '../admin/lms/LMSAllLeadsTab';

// Library Management Submodules
import LibraryOverviewTab from '../admin/library/LibraryOverviewTab';
import ServicesLibraryTab from '../admin/library/ServicesLibraryTab';
import ProductsLibraryTab from '../admin/library/ProductsLibraryTab';
import CategoriesTab from '../admin/library/CategoriesTab';
import AttributesTab from '../admin/library/AttributesTab';
import TagsLabelsTab from '../admin/library/TagsLabelsTab';
import UnitsPricingTab from '../admin/library/UnitsPricingTab';
import MediaLibraryTab from '../admin/library/MediaLibraryTab';
import UrlSettingsTab from '../admin/UrlSettingsTab';



function SuperAdminDashboardLayout({ user, onLogout }) {
  // Persist active tab in localStorage so browser refresh stays on the current tab
  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem('superadmin_activetab') || 'overview';
  });

  const setActiveTab = (tabId) => {
    localStorage.setItem('superadmin_activetab', tabId);
    setActiveTabState(tabId);
  };
  
  // Sidebar State: Collapsible, Hover Expand, Pin Option
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 2. Persistent Light / Dark Theme in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('superadmin_theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('superadmin_theme', nextTheme);
      return nextTheme;
    });
  };

  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
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

  // Initial fast load for platform metrics
  useEffect(() => {
    fetchAdminOverview();
  }, []);

  // SPA Data fetch on demand - does not reload entire dashboard layout
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
    setTabLoading(true);
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const fetchBusinesses = async () => {
    setTabLoading(true);
    try {
      const response = await axios.get('/api/admin/businesses');
      setBusinesses(response.data.businesses || []);
    } catch (err) {
      console.error('Fetch businesses error:', err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleBusinessStatusChange = async (businessId, newStatus) => {
    try {
      await axios.patch(`/api/admin/businesses/${businessId}/status`, { status: newStatus });
      setBusinesses(businesses.map(b => b.id === businessId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert('Failed to update business status');
    }
  };

  const handleDeleteBusiness = async (businessId, name) => {
    try {
      await axios.delete(`/api/admin/businesses/${businessId}`);
      setBusinesses(prev => prev.filter(b => b.id !== businessId));
    } catch (err) {
      alert('Failed to delete business');
    }
  };

  const fetchCatalog = async () => {
    setTabLoading(true);
    try {
      const response = await axios.get('/api/admin/catalog');
      setCatalog(response.data.catalog || []);
    } catch (err) {
      console.error('Fetch catalog error:', err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleCreateCatalogItem = async (itemData) => {
    const response = await axios.post('/api/admin/catalog', itemData);
    if (response.data.status === 'success') {
      setCatalog(prev => [response.data.item, ...prev]);
    }
  };

  const handleUpdateCatalogItem = async (id, itemData) => {
    const response = await axios.put(`/api/admin/catalog/${id}`, itemData);
    if (response.data.status === 'success') {
      setCatalog(prev => prev.map(item => item.id === id ? response.data.item : item));
    }
  };

  const handleUpdateCatalogStatus = async (id, newStatus, rejectionReason) => {
    const response = await axios.patch(`/api/admin/catalog/${id}/status`, { status: newStatus, rejectionReason });
    if (response.data.status === 'success') {
      setCatalog(prev => prev.map(item => item.id === id ? response.data.item : item));
    }
  };

  const handleDeleteCatalogItem = async (id) => {
    try {
      await axios.delete(`/api/admin/catalog/${id}`);
      setCatalog(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete catalog item');
    }
  };

  const fetchSubscriptions = async () => {
    setTabLoading(true);
    try {
      const response = await axios.get('/api/admin/subscriptions');
      setSubscriptions(response.data.subscriptions || []);
    } catch (err) {
      console.error('Fetch subscriptions error:', err);
    } finally {
      setTabLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
      color: isDark ? '#fff' : '#0f172a',
      width: '100%',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      
      {/* 1. Collapsible Auto-Hover Sidebar with Pin Lock & Inner Pages */}
      <SuperAdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        theme={theme}
      />

      {/* Main Panel Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* 2. Top Navigation Header with Persistent Light/Dark Mode Switch */}
        <SuperAdminTopbar
          user={user}
          onRefresh={fetchAdminOverview}
          onLogout={onLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* 3. SPA Content View */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8' }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', display: 'block', color: '#818cf8' }} />
              Initializing Super Admin Console...
            </div>
          ) : (
            <>
              {tabLoading && (
                <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={14} className="animate-spin" /> Loading module data...
                </div>
              )}

              {activeTab === 'overview' && <OverviewTab metrics={metrics} theme={theme} />}
              {activeTab === 'users' && (
                <UsersTab
                  users={users}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleRoleChange={handleRoleChange}
                  theme={theme}
                />
              )}
              {activeTab === 'businesses' && (
                <BusinessesTab
                  businesses={businesses}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleStatusChange={handleBusinessStatusChange}
                  handleDeleteBusiness={handleDeleteBusiness}
                  theme={theme}
                />
              )}

              {/* Library Management Submodules */}
              {activeTab === 'library-overview' && <LibraryOverviewTab catalog={catalog} theme={theme} />}
              {(activeTab === 'library-services' || activeTab === 'library' || activeTab === 'catalog') && (
                <ServicesLibraryTab
                  catalog={catalog}
                  theme={theme}
                  handleCreateCatalogItem={handleCreateCatalogItem}
                  handleUpdateCatalogItem={handleUpdateCatalogItem}
                  handleDeleteCatalogItem={handleDeleteCatalogItem}
                />
              )}
              {activeTab === 'library-products' && <ProductsLibraryTab catalog={catalog} theme={theme} />}
              {activeTab === 'library-categories' && <CategoriesTab theme={theme} />}
              {activeTab === 'library-attributes' && <AttributesTab theme={theme} />}
              {activeTab === 'library-tags' && <TagsLabelsTab theme={theme} />}
              {activeTab === 'library-units' && <UnitsPricingTab theme={theme} />}
              {activeTab === 'library-media' && <MediaLibraryTab theme={theme} />}

              {/* LMS Submodules */}
              {(activeTab === 'lms' || activeTab === 'lms-all') && <LMSAllLeadsTab theme={theme} />}
              {activeTab === 'lms-reports' && <LMSAllLeadsTab theme={theme} />}
              {activeTab === 'lms-settings' && <LMSAllLeadsTab theme={theme} />}
              {activeTab === 'lms-subscriptions' && <SubscriptionsTab subscriptions={subscriptions} theme={theme} />}

              {activeTab === 'subscriptions' && <SubscriptionsTab subscriptions={subscriptions} theme={theme} />}
              {(activeTab === 'url-settings' || activeTab.startsWith('url-')) && <UrlSettingsTab activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />}

              {activeTab === 'logs' && <AuditLogsTab logs={logs} theme={theme} />}

            </>
          )}

        </main>
      </div>

    </div>
  );
}

export default SuperAdminDashboardLayout;
