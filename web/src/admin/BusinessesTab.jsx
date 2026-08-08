import React from 'react';
import { Search } from 'lucide-react';

function BusinessesTab({ businesses, searchQuery, setSearchQuery, theme }) {
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
              <th style={{ padding: '0.85rem 1rem' }}>Catalog Items</th>
              <th style={{ padding: '0.85rem 1rem' }}>Website Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map(bus => (
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
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  {(bus._count?.services || 0) + (bus._count?.products || 0)}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {bus.websiteConfig ? (
                    <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✓ {bus.websiteConfig.published ? 'Published' : 'Draft'}
                    </span>
                  ) : (
                    <span style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.8rem' }}>Not created</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusinessesTab;
