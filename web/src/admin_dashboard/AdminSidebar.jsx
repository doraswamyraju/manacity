import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Globe,
  Star,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Pin,
  PinOff,
  Zap,
  FileText,
  FolderTree,
  QrCode,
  Sliders,
  Package,
  Megaphone,
  Share2,
  Instagram,
  Facebook,
  Search,
  Image as ImageIcon
} from 'lucide-react';

function AdminSidebar({
  activeTab,
  setActiveTab,
  isPinned,
  setIsPinned,
  isHovered,
  setIsHovered,
  theme
}) {
  // Accordion submenu state
  const [openSubmenu, setOpenSubmenu] = useState(() => {
    return activeTab && activeTab.startsWith('lms') ? 'lms' : null;
  });

  const isExpanded = isPinned || isHovered;
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'overview', label: 'Business Overview', icon: LayoutDashboard, badge: null, color: '#34d399' },
    { id: 'profile-settings', label: 'Profile Settings', icon: Settings, badge: null, color: '#a855f7' },
    { id: 'locations', label: 'Business Locations', icon: MapPin, badge: null, color: '#38bdf8' },
    { id: 'catalog-library', label: 'Products & Services', icon: Package, badge: null, color: '#f43f5e' },
    { id: 'website-builder', label: 'Website Builder', icon: Globe, badge: 'PRO', color: '#818cf8' },
    {
      id: 'marketing',
      label: 'Marketing Hub',
      icon: Megaphone,
      badge: 'META',
      color: '#1877f2',
      subItems: [
        { id: 'marketing-instagram', label: 'Instagram Hub', icon: Instagram },
        { id: 'marketing-facebook', label: 'Facebook & DMs', icon: Facebook },
        { id: 'marketing-google', label: 'Google SEO & Maps', icon: Search },
        { id: 'marketing-library', label: 'Asset Library', icon: ImageIcon },
        { id: 'marketing-meta-ads', label: 'Meta Ads Manager', icon: Megaphone }
      ]
    },
    { id: 'referrals', label: 'Refer & Earn', icon: Share2, badge: 'EARN', color: '#34d399' },

    { id: 'reviews', label: 'Review Management', icon: Star, badge: null, color: '#fbbf24' },
    {
      id: 'lms',
      label: 'Lead System (LMS)',
      icon: FolderTree,
      color: '#f59e0b',
      badge: 'PRO',
      subItems: [
        { id: 'lms-all', label: 'My Leads', icon: Zap },
        { id: 'lms-reports', label: 'Lead Analytics', icon: FileText },
        { id: 'lms-qr', label: 'Review QR Codes', icon: QrCode },
        { id: 'lms-settings', label: 'Lead Settings', icon: Sliders }
      ]
    },
    { id: 'billing', label: 'Billing & Tiers', icon: CreditCard, badge: null, color: '#c084fc' }
  ];

  const handleParentClick = (item) => {
    if (item.subItems) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
    } else {
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
                ManaCity <span className="gradient-text">Business</span>
              </h1>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#34d399' : '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                Owner Portal
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
              backgroundColor: isPinned ? (isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)') : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem',
              cursor: 'pointer',
              color: isPinned ? (isDark ? '#34d399' : '#059669') : (isDark ? '#64748b' : '#94a3b8')
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
            Business Management
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
                    ? (isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)')
                    : '1px solid transparent',
                  backgroundColor: isParentActive
                    ? (isDark ? 'rgba(16, 185, 129, 0.18)' : 'rgba(16, 185, 129, 0.1)')
                    : 'transparent',
                  color: isParentActive
                    ? (isDark ? '#ffffff' : '#047857')
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
                      ? (isDark ? 'rgba(16, 185, 129, 0.35)' : '#059669')
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
                        backgroundColor: isParentActive ? (isDark ? '#10b981' : '#059669') : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'),
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

              {/* Submenu Inner Options */}
              {isExpanded && item.subItems && isSubOpen && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  paddingLeft: '1.75rem',
                  marginTop: '0.25rem',
                  marginBottom: '0.25rem',
                  borderLeft: isDark ? '2px solid rgba(16, 185, 129, 0.3)' : '2px solid #cbd5e1'
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
                            ? (isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.12)')
                            : 'transparent',
                          color: isSubActive
                            ? (isDark ? '#34d399' : '#047857')
                            : (isDark ? '#94a3b8' : '#64748b'),
                          fontWeight: isSubActive ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <SubIcon size={14} color={isSubActive ? (isDark ? '#34d399' : '#047857') : (isDark ? '#94a3b8' : '#64748b')} />
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
            <Pin size={12} color={isPinned ? '#34d399' : '#94a3b8'} />
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

export default AdminSidebar;
