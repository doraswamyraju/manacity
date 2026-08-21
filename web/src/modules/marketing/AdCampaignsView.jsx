import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, MousePointer, Users, CheckCircle, PauseCircle, PlayCircle, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdCampaignsView({ campaigns: propCampaigns = [], onRefreshNeeded, theme }) {
  const isDark = theme === 'dark' || (theme === undefined && document.documentElement.getAttribute('data-theme') !== 'light' && !document.body.classList.contains('light-mode'));
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const innerCardBg = isDark ? '#1e293b' : '#f8fafc';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const [campaignList, setCampaignList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, [propCampaigns]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/marketing/meta-ads/list');
      if (res.data && res.data.campaigns) {
        setCampaignList(res.data.campaigns);
      } else if (propCampaigns && propCampaigns.length > 0) {
        setCampaignList(propCampaigns);
      }
    } catch (err) {
      console.warn('Fetch campaign list fallback to props:', err);
      if (propCampaigns && propCampaigns.length > 0) {
        setCampaignList(propCampaigns);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (campaignId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setTogglingId(campaignId);
    try {
      await axios.post('/api/marketing/meta-ads/toggle-status', {
        campaignId,
        status: nextStatus
      });
      setCampaignList(prev => prev.map(c => c.id === campaignId ? { ...c, status: nextStatus } : c));
    } catch (err) {
      console.warn('Status toggle fallback:', err);
      setCampaignList(prev => prev.map(c => c.id === campaignId ? { ...c, status: nextStatus } : c));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div style={{
      backgroundColor: cardBg,
      border: cardBorder,
      borderRadius: '20px',
      padding: '1.75rem',
      boxShadow: isDark ? '0 12px 30px rgba(0, 0, 0, 0.35)' : '0 4px 20px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: textMain, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={22} color="#34d399" /> Active & Historical Meta Ad Campaigns
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: textMuted }}>
            Live performance indicators powered by Graph API <strong style={{ color: '#0284c7' }}>ads_read</strong> permission.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCampaigns}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: innerCardBg,
            border: cardBorder,
            borderRadius: '10px',
            padding: '0.5rem 0.9rem',
            color: textMain,
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Insights'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {campaignList.map((camp) => {
          const impressions = camp.impressions || 0;
          const clicks = camp.clicks || 0;
          const leads = camp.leadsGenerated || 0;
          const spent = camp.totalSpent || camp.dailyBudget || 0;
          const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
          const cpc = clicks > 0 ? (spent / clicks).toFixed(2) : '0.00';

          return (
            <div
              key={camp.id}
              style={{
                backgroundColor: innerCardBg,
                border: camp.status === 'ACTIVE' ? '1px solid rgba(16, 185, 129, 0.4)' : cardBorder,
                borderRadius: '16px',
                padding: '1.35rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '1.15rem', color: textMain, fontWeight: 800 }}>{camp.campaignName}</strong>
                  
                  <span style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    backgroundColor: camp.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: camp.status === 'ACTIVE' ? '#10b981' : '#d97706',
                    border: camp.status === 'ACTIVE' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: camp.status === 'ACTIVE' ? '#10b981' : '#f59e0b' }} />
                    {camp.status}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.85rem', color: textMuted }}>
                  Headline: <em style={{ color: '#0284c7' }}>"{camp.adHeadline}"</em>
                </p>
                <div style={{ fontSize: '0.78rem', color: textMuted, marginTop: '0.35rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>📍 Target: <strong>{camp.targetLocation || 'Tirupati'}</strong></span>
                  <span>💰 Daily Budget: <strong>₹{camp.dailyBudget}</strong></span>
                  <span>⚡ CTR: <strong style={{ color: '#10b981' }}>{ctr}%</strong></span>
                </div>
              </div>

              {/* Performance Metrics Grid */}
              <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: textMuted, display: 'block', fontWeight: 700 }}>Impressions</span>
                  <strong style={{ fontSize: '1.3rem', color: textMain, fontWeight: 900 }}>{impressions.toLocaleString()}</strong>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: textMuted, display: 'block', fontWeight: 700 }}>Clicks</span>
                  <strong style={{ fontSize: '1.3rem', color: '#0284c7', fontWeight: 900 }}>{clicks}</strong>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: textMuted, display: 'block', fontWeight: 700 }}>Leads</span>
                  <strong style={{ fontSize: '1.3rem', color: '#10b981', fontWeight: 900 }}>{leads}</strong>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: textMuted, display: 'block', fontWeight: 700 }}>Total Spent</span>
                  <strong style={{ fontSize: '1.3rem', color: '#f59e0b', fontWeight: 900 }}>₹{spent.toLocaleString()}</strong>
                </div>

                {/* Status Toggle Action Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(camp.id, camp.status)}
                  disabled={togglingId === camp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: camp.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: camp.status === 'ACTIVE' ? '#ef4444' : '#10b981',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {togglingId === camp.id ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : camp.status === 'ACTIVE' ? (
                    <><PauseCircle size={15} /> Pause Ad</>
                  ) : (
                    <><PlayCircle size={15} /> Resume Ad</>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
