import React from 'react';
import { List } from 'lucide-react';

function AuditLogsTab({ logs }) {
  return (
    <div className="glass-card" style={{ backgroundColor: '#1e293b' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <List size={18} color="#a855f7" /> Security & System Audit Trail
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {logs.map(log => (
          <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem' }}>
            <div>
              <span style={{
                padding: '0.2rem 0.5rem',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginRight: '0.75rem',
                color: '#818cf8'
              }}>{log.action}</span>
              <span style={{ color: '#cbd5e1' }}>{log.details}</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditLogsTab;
