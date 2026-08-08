import React from 'react';
import { Search } from 'lucide-react';

function UsersTab({ users, searchQuery, setSearchQuery, handleToggleRole, theme }) {
  const isDark = theme === 'dark';
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder="Search user name or email..."
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
              <tr key={userItem.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong style={{ color: isDark ? '#fff' : '#0f172a', display: 'block' }}>{userItem.name}</strong>
                  <span style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.8rem' }}>{userItem.email}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>{userItem.provider}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: userItem.role === 'SUPER_ADMIN' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                    color: userItem.role === 'SUPER_ADMIN' ? '#c084fc' : '#2563eb'
                  }}>
                    {userItem.role}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>{userItem._count?.businessGroups || 0}</td>
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.8rem' }}>
                  {new Date(userItem.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleRole(userItem.id, userItem.role)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                      color: isDark ? '#fff' : '#334155',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600
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

export default UsersTab;
