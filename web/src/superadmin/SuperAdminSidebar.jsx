import React from 'react';
import {
  Activity,
  Users,
  Building2,
  Database,
  CreditCard,
  List,
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

function SuperAdminSidebar({ activeTab, setActiveTab, metrics }) {
  const menuItems = [
    { id: 'overview', label: 'Platform Overview', icon: Activity, badge: null, color: '#818cf8' },
    { id: 'users', label: 'User Directory', icon: Users, badge: metrics?.totalUsers, color: '#38bdf8' },
    { id: 'businesses', label: 'Business Directory', icon: Building2, badge: metrics?.totalBusinessGroups || metrics?.totalLocations, color: '#34d399' },
    { id: 'catalog', label: 'Master Catalog', icon: Database, badge: null, color: '#c084fc' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: null, color: '#fbbf24' },
    { id: 'logs', label: 'Audit Logs', icon: List, badge: null, color: '#f472b6' },
  ];

  return (
    <aside style={sidebarStyle}>
      {/* Brand Header */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
              ManaCity
            </h1>
            <span style={{ fontSize: '0.7rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Super Admin SPA
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
          Navigation
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={isActive ? activeNavItemStyle : navItemStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  padding: '0.4rem',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} color={isActive ? '#fff' : item.color} />
                </div>
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              </div>
              
              {item.badge !== undefined && item.badge !== null && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '12px',
                  backgroundColor: isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.07)',
                  color: isActive ? '#fff' : '#94a3b8'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System info footer */}
      <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>Production Node Live</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Connected to MongoDB Cluster</span>
      </div>
    </aside>
  );
}

const sidebarStyle = {
  width: '260px',
  backgroundColor: '#0f172a',
  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  position: 'sticky',
  top: 0,
  zIndex: 50,
  boxShadow: '4px 0 25px rgba(0, 0, 0, 0.3)'
};

const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.7rem 0.85rem',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  color: '#94a3b8',
  cursor: 'pointer',
  fontWeight: 500,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  textAlign: 'left'
};

const activeNavItemStyle = {
  ...navItemStyle,
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
  borderColor: 'rgba(99, 102, 241, 0.4)',
  color: '#fff',
  fontWeight: 700,
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.15)'
};

export default SuperAdminSidebar;
