import React from 'react';
import {
  Activity,
  Users,
  Building2,
  Database,
  CreditCard,
  List,
  LogOut,
  ChevronRight
} from 'lucide-react';

function SuperAdminSidebar({ activeTab, setActiveTab, metrics }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity, badge: null },
    { id: 'users', label: 'User Directory', icon: Users, badge: metrics?.totalUsers },
    { id: 'businesses', label: 'Business Directory', icon: Building2, badge: metrics?.totalBusinessGroups || metrics?.totalLocations },
    { id: 'catalog', label: 'Master Catalog', icon: Database, badge: null },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: null },
    { id: 'logs', label: 'Audit Logs', icon: List, badge: null },
  ];

  return (
    <aside style={sidebarStyle}>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ManaCity <span className="gradient-text">Admin</span>
        </h1>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          Super Control Center
        </span>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={isActive ? activeNavItemStyle : navItemStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? '#818cf8' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
              
              {item.badge !== undefined && item.badge !== null && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#a5b4fc' : '#94a3b8'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
        ManaCity SuperAdmin v1.2
      </div>
    </aside>
  );
}

const sidebarStyle = {
  width: '240px',
  backgroundColor: '#0f172a',
  borderRight: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  position: 'sticky',
  top: 0
};

const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem 0.85rem',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  fontSize: '0.88rem',
  fontWeight: 500,
  transition: 'all 0.15s ease',
  textAlign: 'left'
};

const activeNavItemStyle = {
  ...navItemStyle,
  backgroundColor: 'rgba(99, 102, 241, 0.15)',
  color: '#fff',
  fontWeight: 700,
  border: '1px solid rgba(99, 102, 241, 0.3)'
};

export default SuperAdminSidebar;
