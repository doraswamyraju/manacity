import React, { useState } from 'react';
import MetaAdsManager from './MetaAdsManager';
import AdCampaignsView from './AdCampaignsView';
import MarketingAnalytics from './MarketingAnalytics';
import { Megaphone, Layers, BarChart3 } from 'lucide-react';

export default function MarketingTabContainer({ businessGroup }) {
  const [subTab, setSubTab] = useState('meta-ads');
  const [campaigns, setCampaigns] = useState([]);

  const handleCampaignCreated = (newCamp) => {
    setCampaigns([newCamp, ...campaigns]);
    setSubTab('campaigns');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Subtab Navigation Pills */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setSubTab('meta-ads')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: subTab === 'meta-ads' ? '#1877f2' : 'rgba(255,255,255,0.05)',
            color: subTab === 'meta-ads' ? '#fff' : '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Megaphone size={16} /> Meta Ads Manager
        </button>

        <button
          onClick={() => setSubTab('campaigns')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: subTab === 'campaigns' ? '#1877f2' : 'rgba(255,255,255,0.05)',
            color: subTab === 'campaigns' ? '#fff' : '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Layers size={16} /> Ad Campaigns
        </button>

        <button
          onClick={() => setSubTab('analytics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: subTab === 'analytics' ? '#1877f2' : 'rgba(255,255,255,0.05)',
            color: subTab === 'analytics' ? '#fff' : '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <BarChart3 size={16} /> Marketing Analytics
        </button>
      </div>

      {/* Render selected subtab */}
      {subTab === 'meta-ads' && <MetaAdsManager businessGroup={businessGroup} onCampaignCreated={handleCampaignCreated} />}
      {subTab === 'campaigns' && <AdCampaignsView campaigns={campaigns} />}
      {subTab === 'analytics' && <MarketingAnalytics />}
    </div>
  );
}
