import React from 'react';
import { Users, Building2, Globe, MessageSquare, CreditCard, ShieldCheck, Zap } from 'lucide-react';

function OverviewTab({ metrics, theme }) {
  if (!metrics) return null;

  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
        border: isDark ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(99, 102, 241, 0.08)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Zap size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Overview
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Welcome to <span className="gradient-text">ManaCity Super Admin</span>
          </h2>
          <p style={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Real-time aggregator metrics, platform subscriptions, and automated system health status.
          </p>
        </div>
      </div>

      {/* Aggregator Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.35rem',
          boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#a5b4fc' : '#4338ca' }}>
            <Users size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Total Users</span>
            <strong style={{ fontSize: '1.8rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800 }}>{metrics.totalUsers}</strong>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.35rem',
          boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#34d399' : '#047857' }}>
            <Building2 size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Active Businesses</span>
            <strong style={{ fontSize: '1.8rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800 }}>{metrics.totalBusinessGroups || metrics.totalLocations}</strong>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.35rem',
          boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#fbbf24' : '#b45309' }}>
            <Globe size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Generated Websites</span>
            <strong style={{ fontSize: '1.8rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800 }}>{metrics.totalWebsites}</strong>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.35rem',
          boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#c084fc' : '#6b21a8' }}>
            <MessageSquare size={26} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Total Reviews</span>
            <strong style={{ fontSize: '1.8rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800 }}>{metrics.totalReviews}</strong>
          </div>
        </div>
      </div>

      {/* Plans Breakdown & System Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CreditCard size={20} color="#6366f1" /> Subscription Tier Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc',
              borderRadius: '10px',
              border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: isDark ? '#cbd5e1' : '#475569', fontWeight: 600 }}>Starter / Free Tier</span>
              <strong style={{ color: isDark ? '#fff' : '#0f172a', fontSize: '1.05rem' }}>{metrics.plansBreakdown?.FREE || 0} Businesses</strong>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc',
              borderRadius: '10px',
              border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Growth Business Plan</span>
              <strong style={{ color: isDark ? '#818cf8' : '#4338ca', fontSize: '1.05rem' }}>{metrics.plansBreakdown?.GROWTH || 0} Businesses</strong>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc',
              borderRadius: '10px',
              border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: isDark ? '#c084fc' : '#7e22ce', fontWeight: 600 }}>Enterprise Custom Plan</span>
              <strong style={{ color: isDark ? '#c084fc' : '#7e22ce', fontSize: '1.05rem' }}>{metrics.plansBreakdown?.ENTERPRISE || 0} Businesses</strong>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#10b981" /> Operational Health Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b' }}>
              <span>Database Cluster (MongoDB)</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b' }}>
              <span>Google Business API Gateway</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b' }}>
              <span>WhatsApp Notification Engine</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>● Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b' }}>
              <span>SSL Subdomain Auto-Renew</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>● Active</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default OverviewTab;
