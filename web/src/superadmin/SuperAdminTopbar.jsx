import React from 'react';
import { Shield, Bell, RefreshCw, LogOut, User } from 'lucide-react';

function SuperAdminTopbar({ user, onRefresh, onLogout }) {
  return (
    <header style={topbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ padding: '0.4rem 0.6rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} style={{ color: '#818cf8' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>ManaCity Admin Platform</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onRefresh}
          title="Refresh Platform Metrics"
          style={actionIconBtnStyle}
        >
          <RefreshCw size={16} color="#818cf8" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.75rem', backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>{user?.name || 'Super Admin'}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user?.email}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sign Out"
          style={{ ...actionIconBtnStyle, color: '#ef4444' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

const topbarStyle = {
  height: '64px',
  backgroundColor: '#1e293b',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1.5rem',
  position: 'sticky',
  top: 0,
  zIndex: 40
};

const actionIconBtnStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

export default SuperAdminTopbar;
