import React, { useState } from 'react';
import {
  Activity,
  Users,
  Building2,
  Database,
  CreditCard,
  List,
  ChevronDown,
  ChevronRight,
  Pin,
  PinOff,
  FileText,
  Settings,
  Zap,
  FolderTree
} from 'lucide-react';

function SuperAdminSidebar({
  activeTab,
  setActiveTab,
  metrics,
  isPinned,
  setIsPinned,
  isHovered,
  setIsHovered,
  theme
}) {
  // 1. Inner options show only when explicitly clicked on parent menu item
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const isExpanded = isPinned || isHovered;
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'overview', label: 'Platform Overview', icon: Activity, badge: null, color: '#818cf8' },
    { id: 'users', label: 'User Directory', icon: Users, badge: metrics?.totalUsers, color: '#38bdf8' },
    { id: 'businesses', label: 'Business Directory', icon: Building2, badge: metrics?.totalBusinessGroups || metrics?.totalLocations, color: '#34d399' },
    {
      id: 'lms',
      label: 'LMS (Lead System)',
      icon: FolderTree,
      color: '#f59e0b',
      badge: 'PRO',
      subItems: [
        { id: 'lms-all', label: 'All Leads', icon: Zap },
        { id: 'lms-reports', label: 'Leads Report', icon: FileText },
        { id: 'lms-settings', label: 'Lead Settings', icon: Settings },
        { id: 'lms-subscriptions', label: 'Lead Subscriptions', icon: CreditCard }
      ]
    },
    { id: 'catalog', label: 'Master Catalog', icon: Database, badge: null, color: '#c084fc' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: null, color: '#fbbf24' },
    { id: 'logs', label: 'Audit Logs', icon: List, badge: null, color: '#f472b6' }
  ];

  const handleParentClick = (item) => {
    if (item.subItems) {
      // Toggle submenu only on click
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
    } else {
      setActiveTab(item.id);
    }
  };

  // 4. Sidebar background color distinct from main dashboard background
  const sidebarBg = isDark ? '#090d16' : '#f1f5f9';

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...sidebarStyle,
        width: isExpanded ? '270px' : '76px',
        backgroundColor: sidebarBg,
        borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #cbd5e1',
        color: isDark ? '#fff' : '#0f172a',
        boxShadow: isExpanded
          ? (isDark ? '4px 0 25px rgba(0, 0, 0, 0.5)' : '4px 0 20px rgba(0, 0, 0, 0.06)')
          : 'none'
      }}
    >
      {/* 5. ManaCity Logo in Header */}
      <div style={{
        padding: '1.25rem 1rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'space-between' : 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src="/logo.png"
            alt="ManaCity Logo"
            style={{
              height: '32px',
              maxWidth: '36px',
              objectFit: 'contain',
              flexShrink: 0
            }}
          />
          {isExpanded && (
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                ManaCity <span className="gradient-text">Admin</span>
              </h1>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#a5b4fc' : '#4338ca', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                Super Admin SPA
              </span>
            </div>
          )}
        </div>

        {/* Pin Sidebar Toggle */}
        {isExpanded && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Unpin sidebar (Auto-collapse on exit)" : "Pin sidebar (Always open)"}
            style={{
              backgroundColor: isPinned ? (isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)') : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem',
              cursor: 'pointer',
              color: isPinned ? (isDark ? '#818cf8' : '#4338ca') : (isDark ? '#64748b' : '#94a3b8')
            }}
          >
            {isPinned ? <Pin size={16} /> : <PinOff size={16} />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {isExpanded && (
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem 0.35rem 0.5rem' }}>
            Navigation Modules
          </div>
        )}

        {menuItems.map(item => {
          const Icon = item.icon;
          const isSubOpen = openSubmenu === item.id;
          
          // 3. Exact active state check so inactive items never stay highlighted white/outlined
          const isItemActive = activeTab === item.id || (item.subItems && item.subItems.some(sub => activeTab === sub.id));

          return (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => handleParentClick(item)}
                style={isItemActive ? (isDark ? activeDarkStyle : activeLightStyle) : (isDark ? navDarkStyle : navLightStyle)}
                title={!isExpanded ? item.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    padding: '0.4rem',
                    borderRadius: '8px',
                    backgroundColor: isItemActive
                      ? (isDark ? 'rgba(99, 102, 241, 0.3)' : '#4338ca')
                      : (isDark ? 'rgba(255, 255, 255, 0.04)' : '#e2e8f0'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color={isItemActive ? '#fff' : (isDark ? item.color : '#334155')} />
                  </div>
                  {isExpanded && <span style={{ fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{item.label}</span>}
                </div>

                {isExpanded && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {item.badge && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '10px',
                        backgroundColor: isItemActive ? (isDark ? '#6366f1' : '#4338ca') : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'),
                        color: isItemActive ? '#fff' : (isDark ? '#94a3b8' : '#475569')
                      }}>
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && (
                      isSubOpen ? <ChevronDown size={15} color={isDark ? '#94a3b8' : '#64748b'} /> : <ChevronRight size={15} color={isDark ? '#94a3b8' : '#64748b'} />
                    )}
                  </div>
                )}
              </button>

              {/* 1. Inner options shown ONLY when clicked */}
              {isExpanded && item.subItems && isSubOpen && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  paddingLeft: '1.75rem',
                  marginTop: '0.25rem',
                  marginBottom: '0.25rem',
                  borderLeft: isDark ? '2px solid rgba(99, 102, 241, 0.3)' : '2px solid #cbd5e1'
                }}>
                  {item.subItems.map(sub => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === sub.id;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveTab(sub.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '6px',
                          backgroundColor: isSubActive ? (isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.12)') : 'transparent',
                          border: 'none',
                          color: isSubActive ? (isDark ? '#818cf8' : '#4338ca') : (isDark ? '#94a3b8' : '#64748b'),
                          fontWeight: isSubActive ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <SubIcon size={14} />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Pin Status */}
      {isExpanded && (
        <div style={{
          padding: '0.85rem 1rem',
          borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Pin size={12} color={isPinned ? '#818cf8' : '#94a3b8'} />
            {isPinned ? 'Sidebar Locked' : 'Hover Auto-Expand'}
          </span>
        </div>
      )}
    </aside>
  );
}

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  position: 'sticky',
  top: 0,
  zIndex: 50,
  transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s ease'
};

const navDarkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.65rem 0.75rem',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  textAlign: 'left'
};

const activeDarkStyle = {
  ...navDarkStyle,
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
  border: '1px solid rgba(99, 102, 241, 0.4)',
  color: '#fff',
  fontWeight: 700
};

const navLightStyle = {
  ...navDarkStyle,
  color: '#475569'
};

const activeLightStyle = {
  ...navLightStyle,
  backgroundColor: 'rgba(99, 102, 241, 0.12)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  color: '#4338ca',
  fontWeight: 700
};

export default SuperAdminSidebar;
