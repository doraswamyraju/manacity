import React from 'react';
import { Search, Shield } from 'lucide-react';

function UsersTab({ users, searchQuery, setSearchQuery, handleRoleChange, theme }) {
  const isDark = theme === 'dark';
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableRoles = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'REFERRAL_PARTNER', label: 'Referral Partner' },
    { value: 'AGENT', label: 'Agent' },
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'BUSINESS_OWNER', label: 'Business Owner' }
  ];

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
              <th style={{ padding: '0.85rem 1rem' }}>Assign Role</th>
              <th style={{ padding: '0.85rem 1rem' }}>Businesses</th>
              <th style={{ padding: '0.85rem 1rem' }}>Registered</th>
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
                
                {/* Role Dropdown Selector */}
                <td style={{ padding: '0.85rem 1rem' }}>
                  <select
                    value={userItem.role || 'BUSINESS_OWNER'}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1',
                      color: isDark ? '#fff' : '#0f172a',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {availableRoles.map(r => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>{userItem._count?.businessGroups || 0}</td>
                <td style={{ padding: '0.85rem 1rem', color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.8rem' }}>
                  {new Date(userItem.createdAt).toLocaleDateString()}
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
