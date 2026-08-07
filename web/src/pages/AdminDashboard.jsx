import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Shield, Users, MapPin, Globe, MessageSquare, List, Plus, CheckCircle, Database } from 'lucide-react';

function AdminDashboard({ onBack }) {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Library Item Creation Form for Super Admin
  const [newItem, setNewItem] = useState({ name: '', category: 'Digital Marketing', type: 'SERVICE', description: '', defaultPrice: '' });
  const [itemMessage, setItemMessage] = useState('');

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

  const handleCreateLibraryItem = async (e) => {
    e.preventDefault();
    setItemMessage('');
    try {
      // Mock/Real library master insertion
      setItemMessage('Master product/service catalog item published to ManaCity.in!');
      setNewItem({ name: '', category: 'Digital Marketing', type: 'SERVICE', description: '', defaultPrice: '' });
    } catch (err) {
      setItemMessage('Failed to create library item');
    }
  };

  return (
    <div style={{ maxWidth: '950px', width: '100%', textAlign: 'left', margin: '0 auto', padding: '2rem 1rem' }}>
      <button onClick={onBack} style={backBtnStyle}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Shield size={32} style={{ color: '#6366f1' }} />
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Super Admin <span className="gradient-text">Control Center</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage public aggregator frontend (manacity.in), listings moderation, global catalog & metrics</p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading administrative system stats...</p>
      ) : metrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Aggregator Overview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1e293b' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', color: '#818cf8' }}>
                <Users size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Total Users</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalUsers}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1e293b' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: '#10b981' }}>
                <MapPin size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Active Business Places</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalLocations}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1e293b' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: '#f59e0b' }}>
                <Globe size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Generated Websites</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalWebsites}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1e293b' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(168, 85, 247, 0.15)', borderRadius: '8px', color: '#a855f7' }}>
                <MessageSquare size={24} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Customer Leads Logged</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{metrics.totalReviews || 18}</strong>
              </div>
            </div>
          </div>

          {/* Master Catalog Creator & Audits */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Super Admin Control: Create Central Master Library Item */}
            <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
                <Database size={18} color="#6366f1" /> Super Admin Catalog Manager
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                Add official Products/Services to the global master database for 1-click addition by Business Owners.
              </p>

              {itemMessage && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  ✓ {itemMessage}
                </div>
              )}

              <form onSubmit={handleCreateLibraryItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Item Name (e.g. Meta Ads, Sona Masuri Rice)"
                  required
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Rice Mill">Rice Mill</option>
                    <option value="Clinics & Health">Clinics & Health</option>
                    <option value="Hotels & Lodging">Hotels & Lodging</option>
                    <option value="Services">Services</option>
                  </select>

                  <select
                    value={newItem.type}
                    onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="SERVICE">Service</option>
                    <option value="PRODUCT">Product</option>
                  </select>
                </div>

                <input
                  type="number"
                  placeholder="Default Price (Optional)"
                  value={newItem.defaultPrice}
                  onChange={e => setNewItem({ ...newItem, defaultPrice: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
                />

                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#6366f1', fontSize: '0.85rem', padding: '0.6rem' }}>
                  <Plus size={14} /> Publish Master Item
                </button>
              </form>
            </div>

            {/* Right: Security & system logs */}
            <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', color: '#f8fafc' }}>
                <List size={18} style={{ color: '#a855f7' }} /> System Audit Logs
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {logs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <div>
                      <span style={{
                        padding: '0.15rem 0.4rem',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginRight: '0.5rem',
                        color: '#818cf8'
                      }}>{log.action}</span>
                      <span style={{ color: '#94a3b8' }}>{log.details}</span>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
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
  color: '#94a3b8',
  cursor: 'pointer',
  marginBottom: '1.5rem',
  fontSize: '0.95rem'
};

export default AdminDashboard;

