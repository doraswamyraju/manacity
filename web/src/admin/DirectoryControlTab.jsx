import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Star,
  Sparkles,
  Zap,
  Layers,
  RefreshCw
} from 'lucide-react';

import AggregatorOverviewModule from './aggregator/AggregatorOverviewModule';
import ListingsModerationModule from './aggregator/ListingsModerationModule';
import SponsoredListingsModule from './aggregator/SponsoredListingsModule';
import CategoryBannerModule from './aggregator/CategoryBannerModule';
import PublicLeadsModule from './aggregator/PublicLeadsModule';

export default function DirectoryControlTab({ activeTab = 'aggregator-control', setActiveTab, theme = 'dark' }) {
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [listings, setListings] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchAggregatorData();
  }, []);

  const fetchAggregatorData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/aggregator/metrics');
      if (res.data) {
        setMetrics(res.data.metrics);
        setListings(res.data.recentListings || []);
      }
      const leadsRes = await axios.get('/api/admin/aggregator/leads');
      if (leadsRes.data) {
        setLeads(leadsRes.data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching directory control metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const subNavItems = [
    { id: 'aggregator-all', label: 'All Directory Modules', icon: Layers },
    { id: 'aggregator-overview', label: 'Directory Overview', icon: TrendingUp },
    { id: 'aggregator-listings', label: 'Listings & Verified', icon: ShieldCheck },
    { id: 'aggregator-sponsored', label: 'Sponsored & Promoted', icon: Star },
    { id: 'aggregator-categories', label: 'Categories & Banners', icon: Sparkles },
    { id: 'aggregator-leads', label: 'Get Quote Inquiries', icon: Zap }
  ];

  const currentTab = activeTab === 'aggregator-control' ? 'aggregator-all' : activeTab;

  const handleSubTabChange = (tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId === 'aggregator-all' ? 'aggregator-control' : tabId);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: isDark ? '#9ca3af' : '#64748b' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem auto' }} />
        <p>Loading Aggregator Directory Controls...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            Directory Aggregator Control Hub
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: isDark ? '#9ca3af' : '#64748b' }}>
            Manage listings, verified badges, sponsored placements, and incoming consumer inquiries for <strong>manacity.in</strong>.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Pill Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.35rem'
      }}>
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'aggregator-all' && currentTab === 'aggregator-control');
          return (
            <button
              key={item.id}
              onClick={() => handleSubTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: isActive
                  ? '1px solid #6366f1'
                  : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
                backgroundColor: isActive
                  ? (isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.12)')
                  : (isDark ? '#1f2937' : '#ffffff'),
                color: isActive
                  ? (isDark ? '#a5b4fc' : '#4f46e5')
                  : (isDark ? '#9ca3af' : '#64748b'),
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease-in-out'
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Module Rendering */}
      {(currentTab === 'aggregator-all' || currentTab === 'aggregator-control' || currentTab === 'aggregator-overview') && (
        <AggregatorOverviewModule isDark={isDark} metrics={metrics} />
      )}

      {(currentTab === 'aggregator-all' || currentTab === 'aggregator-control' || currentTab === 'aggregator-listings') && (
        <ListingsModerationModule isDark={isDark} listings={listings} />
      )}

      {(currentTab === 'aggregator-all' || currentTab === 'aggregator-control' || currentTab === 'aggregator-sponsored') && (
        <SponsoredListingsModule isDark={isDark} />
      )}

      {(currentTab === 'aggregator-all' || currentTab === 'aggregator-control' || currentTab === 'aggregator-categories') && (
        <CategoryBannerModule isDark={isDark} />
      )}

      {(currentTab === 'aggregator-all' || currentTab === 'aggregator-control' || currentTab === 'aggregator-leads') && (
        <PublicLeadsModule isDark={isDark} leads={leads} />
      )}
    </div>
  );
}
