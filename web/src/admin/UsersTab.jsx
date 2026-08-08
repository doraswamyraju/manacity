import React from 'react';
import { Search } from 'lucide-react';

function UsersTab({ users, searchQuery, setSearchQuery, handleToggleRole }) {
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={searchContainerStyle}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search user name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      <div className="glass-card" style={{ backgroundColor: '#1e293b', overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>User</th>
              <th style={{ padding: '0.85rem 1rem' }}>Provider</th>
              <th style={{ padding: '0.85rem 1rem' }}>Role</th>
              <th style={{ padding: '0.85rem 1rem' }}>Businesses</th>
              <th style={{ padding: '0.85rem 1rem' }}>Registered</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(userItem => (
              <tr key={userItem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong style={{ color: '#fff', display: 'block' }}>{userItem.name}</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{userItem.email}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{userItem.provider}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: userItem.role === 'SUPER_ADMIN' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: userItem.role === 'SUPER_ADMIN' ? '#c084fc' : '#60a5fa'
                  }}>
                    {userItem.role}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{userItem._count?.businessGroups || 0}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                  {new Date(userItem.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleRole(userItem.id, userItem.role)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    Toggle Role
                  </button>
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

export default UsersTab;
