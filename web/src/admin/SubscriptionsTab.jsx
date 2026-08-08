import React from 'react';

function SubscriptionsTab({ subscriptions }) {
  return (
    <div className="glass-card" style={{ backgroundColor: '#1e293b' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
        Platform Subscription Log
      </h3>
      {subscriptions.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No subscriptions recorded yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {subscriptions.map(sub => (
            <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px' }}>
              <div>
                <strong style={{ color: '#fff' }}>{sub.businessGroup?.name}</strong>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block' }}>{sub.businessGroup?.email}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{sub.tier}</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>{sub.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubscriptionsTab;
