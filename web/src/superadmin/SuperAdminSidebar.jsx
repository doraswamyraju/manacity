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
  FolderTree,
  Wrench,
  Package
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
  // Submenu accordion toggle state (auto-expand parent on load if activeTab is a sub-item)
  // Submenu accordion toggle state (auto-expand parent on load if activeTab is a sub-item)
  const [openSubmenu, setOpenSubmenu] = useState(() => {
    if (activeTab && activeTab.startsWith('lms')) return 'lms';
    if (activeTab && (activeTab.startsWith('library') || activeTab === 'catalog')) return 'library';
    return 'library';
  });

  const isExpanded = isPinned || isHovered;
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'overview', label: 'Platform Overview', icon: Activity, badge: null, color: '#818cf8' },
    { id: 'users', label: 'User Directory', icon: Users, badge: metrics?.totalUsers, color: '#38bdf8' },
    { id: 'businesses', label: 'Business Directory', icon: Building2, badge: metrics?.totalBusinessGroups || metrics?.totalLocations, color: '#34d399' },
    {
      id: 'library',
      label: 'Library Management',
      icon: Database,
      color: '#c084fc',
      badge: null,
      subItems: [
        { id: 'library-overview', label: 'Overview', icon: Zap },
        { id: 'library-services', label: 'Services Library', icon: Wrench },
        { id: 'library-products', label: 'Products Library', icon: Package },
        { id: 'library-categories', label: 'Categories', icon: FolderTree },
        { id: 'library-attributes', label: 'Attributes', icon: Settings },
        { id: 'library-tags', label: 'Tags & Labels', icon: FileText },
        { id: 'library-units', label: 'Units & Pricing', icon: CreditCard },
        { id: 'library-media', label: 'Media Library', icon: List }
      ]
    },
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
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: null, color: '#fbbf24' },
    { id: 'logs', label: 'Audit Logs', icon: List, badge: null, color: '#f472b6' }
  ];

  const handleParentClick = (item) => {
    if (item.subItems) {
      // Toggle inner submenu expansion for this parent
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
    } else {
      // When navigating to any non-submenu module (e.g., User Directory, Catalog), close any open submenus
      setOpenSubmenu(null);
      setActiveTab(item.id);
    }
  };

  const handleSubItemClick = (subId) => {
    setActiveTab(subId);
  };

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
      {/* ManaCity Brand & Logo Header */}
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
          
          const isDirectActive = activeTab === item.id;
          const isChildActive = item.subItems && item.subItems.some(sub => activeTab === sub.id);
          const isParentActive = isDirectActive || isChildActive;

          return (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => handleParentClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  border: isParentActive
                    ? (isDark ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(99, 102, 241, 0.3)')
                    : '1px solid transparent',
                  backgroundColor: isParentActive
                    ? (isDark ? 'rgba(99, 102, 241, 0.18)' : 'rgba(99, 102, 241, 0.1)')
                    : 'transparent',
                  color: isParentActive
                    ? (isDark ? '#ffffff' : '#4338ca')
                    : (isDark ? '#94a3b8' : '#475569'),
                  fontWeight: isParentActive ? 700 : 500
                }}
                title={!isExpanded ? item.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    padding: '0.4rem',
                    borderRadius: '8px',
                    backgroundColor: isParentActive
                      ? (isDark ? 'rgba(99, 102, 241, 0.35)' : '#4338ca')
                      : (isDark ? 'rgba(255, 255, 255, 0.04)' : '#e2e8f0'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color={isParentActive ? '#fff' : (isDark ? item.color : '#475569')} />
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
                        backgroundColor: isParentActive ? (isDark ? '#6366f1' : '#4338ca') : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'),
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

              {/* Submenu Inner Options: Expanded ONLY when openSubmenu matches this parent AND sidebar is expanded */}
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
                        onClick={() => handleSubItemClick(sub.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isSubActive
                            ? (isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.12)')
                            : 'transparent',
                          color: isSubActive
                            ? (isDark ? '#818cf8' : '#4338ca')
                            : (isDark ? '#94a3b8' : '#64748b'),
                          fontWeight: isSubActive ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <SubIcon size={14} color={isSubActive ? (isDark ? '#818cf8' : '#4338ca') : (isDark ? '#94a3b8' : '#64748b')} />
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

      {/* Library Health Widget (as shown in design screenshot) */}
      {isExpanded && (
        <div style={{
          margin: '0.5rem 0.65rem 1rem 0.65rem',
          padding: '0.85rem',
          borderRadius: '12px',
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Library Health</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Excellent</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.78rem',
              color: isDark ? '#fff' : '#0f172a'
            }}>
              92%
            </div>
            <div style={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : '#64748b' }}>
              Overall data quality & completeness rate.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.72rem', color: isDark ? '#cbd5e1' : '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Missing Images</span>
              <strong style={{ color: '#f59e0b' }}>23</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Uncategorized Items</span>
              <strong style={{ color: '#f59e0b' }}>8</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Duplicate Items</span>
              <strong style={{ color: '#ef4444' }}>5</strong>
            </div>
          </div>
        </div>
      )}

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

export default SuperAdminSidebar;
