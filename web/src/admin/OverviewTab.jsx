import React from 'react';
import { Users, Building2, Globe, MessageSquare, CreditCard, CheckCircle, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

function OverviewTab({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Zap size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Overview
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Welcome to <span className="gradient-text">ManaCity Super Admin</span>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Real-time aggregator metrics, platform subscriptions, and automated system health status.
          </p>
        </div>
      </div>

      {/* Aggregator Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.4) 100%)', borderRadius: '12px', color: '#a5b4fc' }}>
            <Users size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Total Users</span>
            <strong style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>{metrics.totalUsers}</strong>
          </div>
        </div>

        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.4) 100%)', borderRadius: '12px', color: '#34d399' }}>
            <Building2 size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Active Businesses</span>
            <strong style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>{metrics.totalBusinessGroups || metrics.totalLocations}</strong>
          </div>
        </div>

        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.4) 100%)', borderRadius: '12px', color: '#fbbf24' }}>
            <Globe size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Generated Websites</span>
            <strong style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>{metrics.totalWebsites}</strong>
          </div>
        </div>

        <div className="glass-card" style={statCardStyle}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.4) 100%)', borderRadius: '12px', color: '#c084fc' }}>
            <MessageSquare size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Total Reviews</span>
            <strong style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>{metrics.totalReviews}</strong>
          </div>
        </div>
      </div>

      {/* Plans Breakdown & System Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        <div className="glass-card" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CreditCard size={20} color="#818cf8" /> Subscription Tier Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={planRowStyle}>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Starter / Free Tier</span>
              <strong style={{ color: '#fff', fontSize: '1.05rem' }}>{metrics.plansBreakdown?.FREE || 0} Businesses</strong>
            </div>
            <div style={planRowStyle}>
              <span style={{ color: '#818cf8', fontWeight: 600 }}>Growth Business Plan</span>
              <strong style={{ color: '#818cf8', fontSize: '1.05rem' }}>{metrics.plansBreakdown?.GROWTH || 0} Businesses</strong>
            </div>
            <div style={planRowStyle}>
              <span style={{ color: '#c084fc', fontWeight: 600 }}>Enterprise Custom Plan</span>
              <strong style={{ color: '#c084fc', fontSize: '1.05rem' }}>{metrics.plansBreakdown?.ENTERPRISE || 0} Businesses</strong>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#34d399" /> Operational Health Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Database Cluster (MongoDB)</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Google Business API Gateway</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>WhatsApp Notification Engine</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>SSL Subdomain Auto-Renew</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>● Active</span>
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
  gap: '1.25rem',
  backgroundColor: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '1.35rem'
};

const planRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.6rem 0.85rem',
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.04)',
  fontSize: '0.9rem'
};

export default OverviewTab;
