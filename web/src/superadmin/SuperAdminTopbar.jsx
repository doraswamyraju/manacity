import React from 'react';
import { Shield, Bell, RefreshCw, LogOut, Sparkles, ChevronDown } from 'lucide-react';

function SuperAdminTopbar({ user, onRefresh, onLogout }) {
  return (
    <header style={topbarStyle}>
      {/* Brand chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          padding: '0.45rem 0.85rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
          borderRadius: '10px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.15)'
        }}>
          <Sparkles size={16} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em' }}>
            MANACITY <span style={{ color: '#818cf8', fontWeight: 600 }}>CONTROL HUB</span>
          </span>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Live sync pulse button */}
        <button
          onClick={onRefresh}
          title="Refresh Platform Metrics"
          style={actionIconBtnStyle}
          className="hover-glow"
        >
          <RefreshCw size={15} color="#a5b4fc" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c7d2fe' }}>Sync Live</span>
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.08)' }} />

        {/* User Profile Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.4rem 0.85rem',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#fff',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{user?.name || 'Super Admin'}</span>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 800, color: '#34d399', padding: '0.05rem 0.3rem' }}>ROOT</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{user?.email}</span>
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
            color: '#f87171'
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
  backgroundColor: 'rgba(15, 23, 42, 0.85)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 40
};

const actionIconBtnStyle = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '10px',
  padding: '0.45rem 0.85rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
};

export default SuperAdminTopbar;
