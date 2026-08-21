import React from 'react';
import { RefreshCw, LogOut, Sparkles, Sun, Moon, Building, User, ArrowRightLeft } from 'lucide-react';

function AdminTopbar({ user, businessGroup, onRefresh, onLogout, theme, toggleTheme, onSwitchPortal }) {
  const isDark = theme === 'dark';

  return (
    <header style={{
      ...topbarStyle,
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #e2e8f0'
    }}>
      {/* Business Brand Chip & Segmented Dashboard Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          padding: '0.45rem 0.85rem',
          background: isDark
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderRadius: '10px',
          border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: isDark ? '0 4px 15px rgba(16, 185, 129, 0.15)' : '0 2px 8px rgba(16, 185, 129, 0.1)'
        }}>
          <Building size={16} style={{ color: isDark ? '#34d399' : '#059669' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '0.02em' }}>
            {businessGroup?.name || 'My Business'} <span style={{ color: isDark ? '#34d399' : '#059669', fontWeight: 700 }}>PORTAL</span>
          </span>
        </div>

        {/* Dashboard Role Toggle Segmented Control */}
        {onSwitchPortal && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0',
            borderRadius: '20px',
            padding: '3px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1'
          }}>
            <button
              type="button"
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: isDark ? '#10b981' : '#059669',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Building size={13} /> Business (Admin)
            </button>
            <button
              type="button"
              onClick={onSwitchPortal}
              title="Switch to Customer/User View"
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: 'transparent',
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={13} /> Customer View &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Right Controls & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            ...actionIconBtnStyle,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1'
          }}
        >
          {isDark ? (
            <>
              <Sun size={15} color="#fbbf24" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fcd34d' }}>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={15} color="#6366f1" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4338ca' }}>Dark Mode</span>
            </>
          )}
        </button>

        {/* Live sync pulse button */}
        <button
          onClick={onRefresh}
          title="Refresh Business Portal"
          style={{
            ...actionIconBtnStyle,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.09)' : '#cbd5e1'
          }}
        >
          <RefreshCw size={15} color={isDark ? '#34d399' : '#059669'} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isDark ? '#6ee7b7' : '#047857' }}>Sync Portal</span>
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }} />

        {/* User Profile Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.4rem 0.85rem',
          background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc',
          borderRadius: '30px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#fff',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'B'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', lineHeight: 1.1 }}>{user?.name || 'Business Owner'}</span>
              <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 800, color: '#60a5fa', padding: '0.05rem 0.3rem' }}>OWNER</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : '#64748b' }}>{user?.email}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          title="Sign Out"
          style={{
            ...actionIconBtnStyle,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.25)',
            color: '#ef4444'
          }}
        >
          <LogOut size={16} />
        </button>

      </div>
    </header>
  );
}

const topbarStyle = {
  height: '70px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 40,
  transition: 'background-color 0.25s ease, border-color 0.25s ease'
};

const actionIconBtnStyle = {
  borderRadius: '10px',
  padding: '0.45rem 0.85rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

export default AdminTopbar;
