import React from 'react';
import { Eye, MousePointer, Users, CheckCircle, PauseCircle } from 'lucide-react';

export default function AdCampaignsView({ campaigns = [] }) {
  const defaultCampaigns = [
    {
      id: 'camp_demo_1',
      campaignName: 'Tirupati Digital Marketing Blitz',
      adHeadline: 'Top Digital Marketing Agency in Tirupati!',
      dailyBudget: 500,
      status: 'ACTIVE',
      impressions: 4820,
      clicks: 142,
      leadsGenerated: 18,
      totalSpent: 1250.00
    },
    {
      id: 'camp_demo_2',
      campaignName: 'Local Business Growth Meta Campaign',
      adHeadline: 'Boost Your Tirupati Store Sales Online',
      dailyBudget: 250,
      status: 'PAUSED',
      impressions: 2150,
      clicks: 64,
      leadsGenerated: 7,
      totalSpent: 500.00
    }
  ];

  const activeCampaigns = campaigns.length > 0 ? campaigns : defaultCampaigns;

  return (
    <div style={{ backgroundColor: 'var(--card-bg, #0f172a)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.75rem' }}>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#fff' }}>
        Active & Past Meta Ad Campaigns
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activeCampaigns.map((camp) => (
          <div
            key={camp.id}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{camp.campaignName}</strong>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: camp.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: camp.status === 'ACTIVE' ? '#34d399' : '#fbbf24',
                  border: camp.status === 'ACTIVE' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                }}>
                  ● {camp.status}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Headline: <em>"{camp.adHeadline}"</em> • Daily Budget: ₹{camp.dailyBudget}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Impressions</span>
                <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{camp.impressions?.toLocaleString()}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Clicks</span>
                <strong style={{ fontSize: '1.2rem', color: '#60a5fa' }}>{camp.clicks}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Leads</span>
                <strong style={{ fontSize: '1.2rem', color: '#34d399' }}>{camp.leadsGenerated}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Spent</span>
                <strong style={{ fontSize: '1.2rem', color: '#fbbf24' }}>₹{camp.totalSpent?.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
