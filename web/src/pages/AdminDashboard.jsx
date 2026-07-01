import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Shield, Users, MapPin, Globe, MessageSquare, List } from 'lucide-react';

function AdminDashboard({ onBack }) {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/admin/metrics');
      setMetrics(response.data.metrics);
      setLogs(response.data.auditLogs || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to retrieve administrative data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', width: '100%', textAlign: 'left' }}>
      <button onClick={onBack} style={backBtnStyle}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Shield size={32} style={{ color: 'var(--accent-primary)' }} />
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Super Admin <span className="gradient-text">Console</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Monitor system health, usage counts, and security logs</p>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--accent-error)',
          color: 'var(--accent-error)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading system diagnostics...</p>
      ) : metrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(25, 118, 210, 0.1)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
                <Users size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Users</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalUsers}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 181, 115, 0.1)', borderRadius: '8px', color: 'var(--accent-success)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Locations</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalLocations}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px', color: 'var(--accent-warning)' }}>
                <Globe size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hosted Sites</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalWebsites}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(107, 114, 128, 0.1)', borderRadius: '8px', color: '#9ca3af' }}>
                <MessageSquare size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviews Logged</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalReviews}</strong>
              </div>
            </div>
          </div>

          {/* Plan Breakdown & Auditing Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
            
            {/* Left: Subscription shares */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>Subscription Tiers</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Enterprise Tier</span>
                    <strong>{metrics.plansBreakdown.ENTERPRISE} Users</strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(metrics.plansBreakdown.ENTERPRISE / (metrics.totalUsers || 1)) * 100}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Growth Tier</span>
                    <strong>{metrics.plansBreakdown.GROWTH} Users</strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(metrics.plansBreakdown.GROWTH / (metrics.totalUsers || 1)) * 100}%`, height: '100%', backgroundColor: 'var(--accent-success)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Free Tier</span>
                    <strong>{metrics.plansBreakdown.FREE} Users</strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(metrics.plansBreakdown.FREE / (metrics.totalUsers || 1)) * 100}%`, height: '100%', backgroundColor: 'var(--text-muted)' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Security & system logs */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                <List size={18} style={{ color: 'var(--accent-secondary)' }} /> Audit Logs
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {logs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <div>
                      <span style={{
                        padding: '0.15rem 0.4rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginRight: '0.5rem',
                        color: 'var(--text-secondary)'
                      }}>{log.action}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

const backBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  marginBottom: '1.5rem',
  fontSize: '0.95rem'
};

export default AdminDashboard;
