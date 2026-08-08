import React from 'react';
import { Users, Building2, Globe, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';

function OverviewTab({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Aggregator Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', color: '#818cf8' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Registered Users</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalUsers}</strong>
          </div>
        </div>

        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: '#10b981' }}>
            <Building2 size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Business Groups</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalBusinessGroups || metrics.totalLocations}</strong>
          </div>
        </div>

        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: '#f59e0b' }}>
            <Globe size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Generated Websites</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalWebsites}</strong>
          </div>
        </div>

        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(168, 85, 247, 0.15)', borderRadius: '8px', color: '#a855f7' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>Total Customer Reviews</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{metrics.totalReviews}</strong>
          </div>
        </div>
      </div>

      {/* Plans Breakdown & System Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="#6366f1" /> Active Tier Subscriptions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={planRowStyle}>
              <span style={{ color: '#94a3b8' }}>Starter / Free Tier</span>
              <strong style={{ color: '#fff' }}>{metrics.plansBreakdown?.FREE || 0} Businesses</strong>
            </div>
            <div style={planRowStyle}>
              <span style={{ color: '#818cf8' }}>Growth Business Plan</span>
              <strong style={{ color: '#fff' }}>{metrics.plansBreakdown?.GROWTH || 0} Businesses</strong>
            </div>
            <div style={planRowStyle}>
              <span style={{ color: '#a855f7' }}>Enterprise Custom Plan</span>
              <strong style={{ color: '#fff' }}>{metrics.plansBreakdown?.ENTERPRISE || 0} Businesses</strong>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} color="#10b981" /> System Health Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Database Cluster (MongoDB)</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Google Business Profile API Sync</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>WhatsApp Notification Gateway</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>SSL Subdomain SSL Auto-Renew</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const statCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.08)'
};

const planRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem 0',
  borderBottom: '1px solid rgba(255,255,255,0.03)',
  fontSize: '0.9rem'
};

export default OverviewTab;
