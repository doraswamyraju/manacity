import React from 'react';
import { Search, Trash2, Power, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

function BusinessesTab({ businesses, searchQuery, setSearchQuery, handleStatusChange, handleDeleteBusiness, theme }) {
  const isDark = theme === 'dark';

  const filteredBusinesses = businesses.filter(b =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        padding: '0.65rem 1rem',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <Search size={18} color={isDark ? '#94a3b8' : '#64748b'} />
        <input
          type="text"
          placeholder="Search business name or owner email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            color: isDark ? '#fff' : '#0f172a',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        borderRadius: '14px',
        overflowX: 'auto',
        padding: 0,
        boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              color: isDark ? '#94a3b8' : '#475569',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc'
            }}>
              <th style={{ padding: '0.85rem 1rem' }}>Business Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Owner</th>
              <th style={{ padding: '0.85rem 1rem' }}>Locations</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions (Live / Disable / Delete)</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map(bus => {
              const currentStatus = bus.status || 'LIVE';

              return (
                <tr key={bus.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ color: isDark ? '#fff' : '#0f172a', display: 'block' }}>{bus.name}</strong>
                    <span style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.78rem' }}>ID: {bus.id}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ color: isDark ? '#cbd5e1' : '#334155', display: 'block' }}>{bus.owner?.name}</span>
                    <span style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.78rem' }}>{bus.owner?.email}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>{bus._count?.locations || 0}</td>
                  
                  {/* Status Badge */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: currentStatus === 'LIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: currentStatus === 'LIVE' ? '#34d399' : '#ef4444'
                    }}>
                      ● {currentStatus}
                    </span>
                  </td>

                  {/* Actions Bar */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {currentStatus === 'DISABLED' ? (
                        <button
                          onClick={() => handleStatusChange(bus.id, 'LIVE')}
                          style={{
                            padding: '0.35rem 0.65rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#34d399',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Power size={13} /> Make Live
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(bus.id, 'DISABLED')}
                          style={{
                            padding: '0.35rem 0.65rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fbbf24',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Power size={13} /> Disable
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteBusiness(bus.id, bus.name)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusinessesTab;
