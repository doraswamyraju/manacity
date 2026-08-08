import React, { useState } from 'react';
import {
  Activity,
  Users,
  Building2,
  Database,
  CreditCard,
  List,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Pin,
  PinOff,
  Filter,
  FileText,
  Settings,
  ShieldCheck,
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
  // Nested inner submenus state (e.g. LMS Lead Management, Directory Management, etc.)
  const [openSubmenu, setOpenSubmenu] = useState('lms'); // default expand LMS menu

  // Expanded width when pinned OR hovered; Collapsed icon width when not pinned and not hovered
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
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...sidebarStyle,
        width: isExpanded ? '270px' : '76px',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
        color: isDark ? '#fff' : '#0f172a',
        boxShadow: isExpanded
          ? (isDark ? '4px 0 25px rgba(0, 0, 0, 0.4)' : '4px 0 20px rgba(0, 0, 0, 0.08)')
          : 'none'
      }}
    >
      {/* Brand Header & Pin Toggle */}
      <div style={{
        padding: '1.25rem 1rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'space-between' : 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            flexShrink: 0
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          {isExpanded && (
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                ManaCity <span className="gradient-text">Admin</span>
              </h1>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#a5b4fc' : '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Super Admin SPA
              </span>
            </div>
          )}
        </div>

        {/* User Option: Pin Sidebar (Keep Open Always) */}
        {isExpanded && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Unpin sidebar (Auto-collapse on mouse exit)" : "Pin sidebar (Always open)"}
            style={{
              backgroundColor: isPinned ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem',
              cursor: 'pointer',
              color: isPinned ? '#818cf8' : (isDark ? '#64748b' : '#94a3b8')
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
          const isParentActive = activeTab === item.id || (item.subItems && item.subItems.some(sub => activeTab === sub.id));

          return (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => handleParentClick(item)}
                style={isParentActive ? (isDark ? activeDarkStyle : activeLightStyle) : (isDark ? navDarkStyle : navLightStyle)}
                title={!isExpanded ? item.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    padding: '0.4rem',
                    borderRadius: '8px',
                    backgroundColor: isParentActive
                      ? (isDark ? 'rgba(255, 255, 255, 0.15)' : '#6366f1')
                      : (isDark ? 'rgba(255, 255, 255, 0.03)' : '#f1f5f9'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color={isParentActive ? '#fff' : item.color} />
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
                        backgroundColor: isParentActive ? '#6366f1' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'),
                        color: isParentActive ? '#fff' : (isDark ? '#94a3b8' : '#475569')
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

              {/* Inner Nested Pages inside Sidebar (e.g. LMS All Leads, Reports, Settings) */}
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
                          backgroundColor: isSubActive ? (isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.1)') : 'transparent',
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

      {/* Footer Pin status badge */}
      {isExpanded && (
        <div style={{
          padding: '0.85rem 1rem',
          borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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
  justify: 'space-between',
  padding: '0.65rem 0.75rem',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  color: '#94a3b8',
  cursor: 'pointer',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  textAlign: 'left'
};

const activeDarkStyle = {
  ...navDarkStyle,
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
  borderColor: 'rgba(99, 102, 241, 0.4)',
  color: '#fff',
  fontWeight: 700
};

const navLightStyle = {
  ...navDarkStyle,
  color: '#475569'
};

const activeLightStyle = {
  ...navLightStyle,
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  borderColor: 'rgba(99, 102, 241, 0.3)',
  color: '#4338ca',
  fontWeight: 700
};

export default SuperAdminSidebar;
