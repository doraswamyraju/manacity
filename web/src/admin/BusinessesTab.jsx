import React from 'react';
import { Search } from 'lucide-react';

function BusinessesTab({ businesses, searchQuery, setSearchQuery }) {
  const filteredBusinesses = businesses.filter(b =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={searchContainerStyle}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search business name or owner email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      <div className="glass-card" style={{ backgroundColor: '#1e293b', overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Business Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Owner</th>
              <th style={{ padding: '0.85rem 1rem' }}>Locations</th>
              <th style={{ padding: '0.85rem 1rem' }}>Catalog Items</th>
              <th style={{ padding: '0.85rem 1rem' }}>Website Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map(bus => (
              <tr key={bus.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong style={{ color: '#fff', display: 'block' }}>{bus.name}</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>ID: {bus.id}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ color: '#cbd5e1', display: 'block' }}>{bus.owner?.name}</span>
                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{bus.owner?.email}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{bus._count?.locations || 0}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>
                  {(bus._count?.services || 0) + (bus._count?.products || 0)}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {bus.websiteConfig ? (
                    <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✓ {bus.websiteConfig.published ? 'Published' : 'Draft'}
                    </span>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Not created</span>
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

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  backgroundColor: '#1e293b',
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.08)'
};

const searchInputStyle = {
  width: '100%',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#fff',
  outline: 'none',
  fontSize: '0.9rem'
};

export default BusinessesTab;
