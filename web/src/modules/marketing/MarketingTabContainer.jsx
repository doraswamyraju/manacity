import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Instagram,
  Facebook,
  Search,
  Image as ImageIcon,
  Send,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Heart,
  Plus,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  Globe,
  Share2,
  Megaphone,
  Upload,
  Zap,
  Tag,
  AlertCircle
} from 'lucide-react';
import MetaAdsManager from './MetaAdsManager';
import AdCampaignsView from './AdCampaignsView';
import MarketingAnalytics from './MarketingAnalytics';

export default function MarketingTabContainer({ businessGroup, activeTabOverride, theme }) {
  const isDark = theme === 'dark' || (theme === undefined && document.documentElement.getAttribute('data-theme') !== 'light' && !document.body.classList.contains('light-mode'));
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const innerCardBg = isDark ? '#1e293b' : '#f8fafc';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#1e293b' : '#ffffff';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';
  const navBtnBg = isDark ? '#0f172a' : '#ffffff';
  const navBtnBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1';

  const mapOverrideToTab = (override) => {
    if (!override) return 'INSTAGRAM';
    if (override === 'marketing-facebook') return 'FACEBOOK';
    if (override === 'marketing-google') return 'GOOGLE';
    if (override === 'marketing-library') return 'LIBRARY';
    if (override === 'marketing-meta-ads') return 'META_ADS';
    return 'INSTAGRAM';
  };

  const [activeTab, setActiveTab] = useState(() => mapOverrideToTab(activeTabOverride));

  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(mapOverrideToTab(activeTabOverride));
    }
  }, [activeTabOverride]);

  // Category Top-Bar Sub-Tab States
  const [igSubTab, setIgSubTab] = useState('overview'); // overview, posts, scheduler, ads
  const [fbSubTab, setFbSubTab] = useState('page-stats'); // page-stats, feed, messenger
  const [googleSubTab, setGoogleSubTab] = useState('gbp-insights'); // gbp-insights, qr-booster, keywords

  // Instagram Tab State
  const [loadingIg, setLoadingIg] = useState(false);
  const [igData, setIgData] = useState(null);
  const [newCaption, setNewCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  // Ad Campaigns State
  const [campaigns, setCampaigns] = useState([]);

  // Facebook Tab State
  const [loadingFb, setLoadingFb] = useState(false);
  const [fbData, setFbData] = useState(null);

  // Comments & Reply State
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [replyingId, setReplyingId] = useState(null);

  useEffect(() => {
    if (activeTab === 'INSTAGRAM') {
      fetchInstagramStats();
      fetchMetaComments();
    } else if (activeTab === 'FACEBOOK') {
      fetchFacebookStats();
      fetchMetaComments();
    }
  }, [activeTab]);

  const fetchMetaComments = async () => {
    setLoadingComments(true);
    try {
      const res = await axios.get('/api/marketing/meta/comments/list');
      setComments(res.data.comments || []);
    } catch (err) {
      console.warn('Fetch comments warning:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReplyComment = async (commentId) => {
    const text = replyTextMap[commentId];
    if (!text || !text.trim()) return;
    setReplyingId(commentId);
    try {
      await axios.post('/api/marketing/meta/comments/reply', {
        commentId,
        replyMessage: text
      });
      alert('✓ Reply posted successfully to comment!');
      setReplyTextMap(prev => ({ ...prev, [commentId]: '' }));
      fetchMetaComments();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send reply to comment.');
    } finally {
      setReplyingId(null);
    }
  };


  const fetchInstagramStats = async () => {
    setLoadingIg(true);
    try {
      const res = await axios.get('/api/marketing/instagram/stats');
      setIgData(res.data);
    } catch (err) {
      console.error('Failed to load Instagram stats:', err);
    } finally {
      setLoadingIg(false);
    }
  };

  const fetchFacebookStats = async () => {
    setLoadingFb(true);
    try {
      const res = await axios.get('/api/marketing/facebook/stats');
      setFbData(res.data);
    } catch (err) {
      console.error('Failed to load Facebook stats:', err);
    } finally {
      setLoadingFb(false);
    }
  };

  const handlePublishPost = async (e) => {
    e.preventDefault();
    if (!newCaption.trim()) return;
    setPublishing(true);
    setPublishMessage('');

    try {
      const res = await axios.post('/api/marketing/social/publish', {
        caption: newCaption,
        imageUrl: mediaUrl,
        scheduledTime: scheduledDate ? new Date(scheduledDate).toISOString() : null,
        targetPlatforms: ['INSTAGRAM', 'FACEBOOK']
      });

      setPublishMessage(res.data?.message || 'Post published successfully!');
      setNewCaption('');
      setMediaUrl('');
      setScheduledDate('');
      fetchInstagramStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  const handleCampaignCreated = (newCamp) => {
    setCampaigns([newCamp, ...campaigns]);
    setActiveTab('META_ADS');
  };

  const [subscribingWebhook, setSubscribingWebhook] = useState(false);
  const [webhookSuccessMsg, setWebhookSuccessMsg] = useState('');

  const handleSubscribeWebhook = async () => {
    setSubscribingWebhook(true);
    setWebhookSuccessMsg('');
    try {
      const res = await axios.post('/api/marketing/meta/subscribe-webhooks');
      setWebhookSuccessMsg(res.data?.message || '✓ Webhooks subscribed! Live Instagram DMs & Messenger are now active.');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to subscribe page webhooks.');
    } finally {
      setSubscribingWebhook(false);
    }
  const handleAiGenerateCaption = () => {
    const businessName = businessGroup?.name || 'our business';
    const city = businessGroup?.city || 'Tirupati';
    const sampleCaptions = [
      `🚀 Elevate your experience with ${businessName} in ${city}! ✨ We deliver top-quality service, trusted by local customers. Contact us today or visit our profile to learn more! 📲 #${city.replace(/\s+/g, '')} #${businessName.replace(/[^a-zA-Z0-9]/g, '')} #ManaCity #LocalBusiness`,
      `🌟 Discover why ${businessName} is ${city}'s top choice! High ratings, verified reviews & dedicated customer support. Drop a comment below or tap the link in bio to connect! ⚡ #${city}Services #BusinessGrowth #InstaDaily`,
      `🔥 Special Update from ${businessName}! We are bringing you exclusive solutions tailored for ${city}. DM us today for instant quotes & details! 📩 #${city}Business #LocalServices #CustomerFirst`
    ];
    const randomCap = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)];
    setNewCaption(randomCap);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Bar Category Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.65rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
        paddingBottom: '0.85rem',
        flexWrap: 'wrap'
      }}>
        {activeTab === 'INSTAGRAM' && [
          { id: 'overview', label: 'Statistics & Insights', icon: TrendingUp, color: '#e1306c' },
          { id: 'posts', label: 'Posts & Feed Activity', icon: ImageIcon, color: '#818cf8' },
          { id: 'scheduler', label: 'Schedule New Post', icon: Calendar, color: '#38bdf8' },
          { id: 'ads', label: 'Instagram Ads', icon: Megaphone, color: '#f59e0b' }
        ].map(sub => {
          const Icon = sub.icon;
          const isActive = igSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setIgSubTab(sub.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                border: isActive ? `1.5px solid ${sub.color}` : navBtnBorder,
                backgroundColor: isActive ? (isDark ? `${sub.color}25` : `${sub.color}15`) : navBtnBg,
                color: isActive ? (isDark ? '#ffffff' : sub.color) : textMuted,
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 4px 12px ${sub.color}20` : 'none'
              }}
            >
              <Icon size={18} color={sub.color} />
              {sub.label}
            </button>
          );
        })}

        {activeTab === 'FACEBOOK' && [
          { id: 'page-stats', label: 'Page Stats & Likes', icon: Facebook, color: '#1877f2' },
          { id: 'feed', label: 'Feed Publisher', icon: Send, color: '#38bdf8' },
          { id: 'messenger', label: 'Messenger DMs (LetsTrack Sync)', icon: MessageSquare, color: '#34d399' }
        ].map(sub => {
          const Icon = sub.icon;
          const isActive = fbSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setFbSubTab(sub.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                border: isActive ? `1.5px solid ${sub.color}` : navBtnBorder,
                backgroundColor: isActive ? (isDark ? `${sub.color}25` : `${sub.color}15`) : navBtnBg,
                color: isActive ? (isDark ? '#ffffff' : sub.color) : textMuted,
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={sub.color} />
              {sub.label}
            </button>
          );
        })}

        {activeTab === 'GOOGLE' && [
          { id: 'gbp-insights', label: 'GBP Map Rankings & Views', icon: Search, color: '#ea4335' },
          { id: 'qr-booster', label: 'Review QR Standees', icon: Sparkles, color: '#fbbf24' },
          { id: 'keywords', label: 'City Search Volume', icon: Globe, color: '#38bdf8' }
        ].map(sub => {
          const Icon = sub.icon;
          const isActive = googleSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setGoogleSubTab(sub.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                border: isActive ? `1.5px solid ${sub.color}` : navBtnBorder,
                backgroundColor: isActive ? (isDark ? `${sub.color}25` : `${sub.color}15`) : navBtnBg,
                color: isActive ? (isDark ? '#ffffff' : sub.color) : textMuted,
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={sub.color} />
              {sub.label}
            </button>
          );
        })}

        {activeTab === 'LIBRARY' && (
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: textMain, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} color="#a855f7" /> Central Marketing Asset Library & Brand Flyers
          </div>
        )}

        {activeTab === 'META_ADS' && (
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: textMain, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={20} color="#38bdf8" /> Meta Ad Campaign Builder & Target Insights
          </div>
        )}
      </div>

      {/* 1. INSTAGRAM TAB */}
      {activeTab === 'INSTAGRAM' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Banner & Live Sync Status */}
          <div style={{
            backgroundColor: cardBg,
            borderRadius: '16px',
            padding: '1.5rem',
            border: `1px solid ${isDark ? 'rgba(225, 48, 108, 0.3)' : '#cbd5e1'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 6px 18px rgba(225, 48, 108, 0.3)' }}>
                <Instagram size={30} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Instagram Business Hub 
                  {igData?.account?.username && (
                    <span style={{ backgroundColor: 'rgba(225, 48, 108, 0.1)', color: '#e1306c', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>
                      @{igData.account.username}
                    </span>
                  )}
                </h3>
                <p style={{ fontSize: '0.85rem', color: textMuted, margin: '0.25rem 0 0 0' }}>
                  Manage posts, view live Graph API insights & auto-sync DMs directly to LetsTrack live chat.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Sync Status Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: igData?.syncStatus === 'LIVE' ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5') : (igData?.syncStatus === 'PARTIAL' ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb') : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2')),
                border: `1px solid ${igData?.syncStatus === 'LIVE' ? '#10b981' : (igData?.syncStatus === 'PARTIAL' ? '#f59e0b' : '#ef4444')}`,
                color: igData?.syncStatus === 'LIVE' ? (isDark ? '#34d399' : '#047857') : (igData?.syncStatus === 'PARTIAL' ? (isDark ? '#fbbf24' : '#b45309') : (isDark ? '#f87171' : '#b91c1c')),
                padding: '0.45rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 800
              }}>
                ● Sync: {igData?.syncStatus || 'UNKNOWN'}
              </div>

              {/* Refresh Button - Clean Contrast Fix for Light Mode */}
              <button
                onClick={fetchInstagramStats}
                disabled={loadingIg}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0.55rem 0.95rem',
                  color: textMain,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <RefreshCw size={14} color={isDark ? '#38bdf8' : '#0284c7'} className={loadingIg ? 'animate-spin' : ''} />
                {loadingIg ? 'Syncing...' : 'Refresh Meta Stats'}
              </button>

              <button
                onClick={handleSubscribeWebhook}
                disabled={subscribingWebhook}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#10b981',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Zap size={14} color="#ffffff" />
                {subscribingWebhook ? 'Subscribing...' : 'Subscribe DMs to LetsTrack'}
              </button>
            </div>
          </div>

          {webhookSuccessMsg && (
            <div style={{ backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', border: '1px solid #10b981', color: isDark ? '#34d399' : '#047857', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {webhookSuccessMsg}
            </div>
          )}

          {/* Meta API Diagnostics Section */}
          <details style={{ backgroundColor: cardBg, borderRadius: '12px', border: cardBorder, padding: '0.75rem 1.25rem' }}>
            <summary style={{ color: textMuted, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} color="#e1306c" /> Meta API Diagnostics & Connection Details (Developer Mode)
            </summary>
            <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.8rem', color: textMuted }}>
              <div><strong>Graph API Version:</strong> {igData?.diagnostics?.apiVersion || 'v24.0'}</div>
              <div><strong>Page ID (Masked):</strong> {igData?.diagnostics?.pageIdMasked || 'N/A'}</div>
              <div><strong>Instagram Account ID (Masked):</strong> {igData?.diagnostics?.instagramIdMasked || 'N/A'}</div>
              <div><strong>Sync Status:</strong> <span style={{ color: igData?.syncStatus === 'LIVE' ? '#10b981' : '#f59e0b' }}>{igData?.syncStatus || 'N/A'}</span></div>
              <div><strong>Last Sync:</strong> {igData?.lastUpdated ? new Date(igData.lastUpdated).toLocaleTimeString() : 'N/A'}</div>
              <div><strong>Error Details:</strong> <span style={{ color: '#ef4444' }}>{igData?.diagnostics?.lastError ? `${igData.diagnostics.lastError} (Code: ${igData.diagnostics.errorCode || 'N/A'}, Type: ${igData.diagnostics.errorType || 'N/A'}, Trace: ${igData.diagnostics.fbtraceId || 'N/A'})` : 'None'}</span></div>
            </div>
          </details>

          {/* Real Account Statistics Cards */}
          {(igSubTab === 'overview' || igSubTab === 'posts') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              
              {/* Followers */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Followers Count</span>
                  <Users size={18} color="#e1306c" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: textMain }}>
                  {igData?.metrics?.followers?.available && igData.metrics.followers.value !== null 
                    ? igData.metrics.followers.value.toLocaleString() 
                    : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>
                  {igData?.metrics?.followers?.reason || 'Instagram followers'}
                </div>
              </div>

              {/* Impressions */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Account Impressions</span>
                  <Eye size={18} color="#818cf8" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: textMain }}>
                  {igData?.metrics?.views?.available && igData.metrics.views.value !== null 
                    ? igData.metrics.views.value.toLocaleString() 
                    : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>
                  {igData?.metrics?.views?.reason || 'Account daily impressions'}
                </div>
              </div>

              {/* Account Reach */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Account Reach</span>
                  <TrendingUp size={18} color="#38bdf8" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: textMain }}>
                  {igData?.metrics?.reach?.available && igData.metrics.reach.value !== null 
                    ? igData.metrics.reach.value.toLocaleString() 
                    : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>
                  {igData?.metrics?.reach?.reason || 'Unique accounts reached'}
                </div>
              </div>

              {/* Profile Visits */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Profile Visits</span>
                  <Globe size={18} color="#f59e0b" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: textMain }}>
                  {igData?.metrics?.profileViews?.available && igData.metrics.profileViews.value !== null 
                    ? igData.metrics.profileViews.value.toLocaleString() 
                    : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>
                  {igData?.metrics?.profileViews?.reason || 'Profile visits'}
                </div>
              </div>

            </div>
          )}

          {/* Content Studio & Live Instagram Mobile Feed Mockup Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
            
            {/* Create / Schedule Post Form */}
            <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '1.5rem', border: cardBorder }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={18} color="#e1306c" /> Create & Schedule Instagram Post
                </h4>
                <button
                  type="button"
                  onClick={handleAiGenerateCaption}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: isDark ? 'rgba(168, 85, 247, 0.15)' : '#f3e8ff',
                    border: '1px solid #a855f7',
                    borderRadius: '8px',
                    padding: '0.4rem 0.75rem',
                    color: isDark ? '#c084fc' : '#7e22ce',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={14} color="#a855f7" /> AI Caption Assistant
                </button>
              </div>

              {publishMessage && (
                <div style={{ backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', border: '1px solid #10b981', color: isDark ? '#34d399' : '#047857', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} /> {publishMessage}
                </div>
              )}

              <form onSubmit={handlePublishPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: textMuted }}>Post Caption</label>
                    <span style={{ fontSize: '0.75rem', color: textMuted }}>{newCaption.length}/2200</span>
                  </div>
                  <textarea
                    rows={4}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Write an engaging caption for your Instagram followers..."
                    style={{ width: '100%', backgroundColor: inputBg, border: inputBorder, borderRadius: '10px', padding: '0.75rem', color: textMain, fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Image / Video Media URL</label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    style={{ width: '100%', backgroundColor: inputBg, border: inputBorder, borderRadius: '10px', padding: '0.65rem', color: textMain, fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Schedule Post (Optional - Leave blank for instant publish)</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    style={{ width: '100%', backgroundColor: inputBg, border: inputBorder, borderRadius: '10px', padding: '0.65rem', color: textMain, fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishing}
                  style={{
                    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    boxShadow: '0 4px 15px rgba(225, 48, 108, 0.3)'
                  }}
                >
                  {publishing ? <RefreshCw size={18} className="animate-spin" /> : <><Send size={18} /> {scheduledDate ? 'Schedule Post' : 'Publish Live Now'}</>}
                </button>
              </form>
            </div>

            {/* Real-time Instagram Phone Feed Mockup */}
            <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '1.25rem', border: cardBorder, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: textMuted, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                <Eye size={16} color="#e1306c" /> Instagram Feed Live Mockup
              </div>
              
              <div style={{ width: '100%', maxWidth: '290px', backgroundColor: isDark ? '#020617' : '#ffffff', borderRadius: '20px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1', overflow: 'hidden', boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.08)' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366)', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={businessGroup?.logoUrl || '/logo.png'} onError={(e)=>{e.target.src='/logo.png'}} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: textMain }}>{igData?.account?.username || 'your_business'}</div>
                    <div style={{ fontSize: '0.68rem', color: textMuted }}>{businessGroup?.city || 'Tirupati'} • Official</div>
                  </div>
                </div>
                {/* Media Image */}
                <div style={{ width: '100%', height: '210px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {mediaUrl ? (
                    <img src={mediaUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{e.target.style.display='none'}} />
                  ) : (
                    <div style={{ textAlign: 'center', color: textMuted, padding: '1rem' }}>
                      <ImageIcon size={36} color="#e1306c" style={{ opacity: 0.5, marginBottom: '0.3rem' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Media Image Preview</div>
                    </div>
                  )}
                </div>
                {/* Action Icons */}
                <div style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0.85rem', color: textMain }}>
                  <Heart size={18} color="#f43f5e" />
                  <MessageCircle size={18} />
                  <Share2 size={18} />
                </div>
                {/* Caption Text */}
                <div style={{ padding: '0 0.85rem 0.85rem 0.85rem', fontSize: '0.75rem', color: textMain, lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  <strong style={{ marginRight: '0.4rem' }}>{igData?.account?.username || 'your_business'}</strong>
                  {newCaption || 'Your engaging Instagram post caption will appear here... #Tirupati #ManaCity'}
                </div>
              </div>
            </div>

          </div>

          {/* Existing Posts Feed Grid */}
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '1.5rem', border: cardBorder }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Instagram size={18} color="#e1306c" /> Recent Published Media & Activity
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[...(igData?.content?.posts || []), ...(igData?.content?.reels || [])].map(post => (
                <div key={post.id} style={{ display: 'flex', gap: '1rem', backgroundColor: innerCardBg, borderRadius: '12px', padding: '0.85rem', border: inputBorder }}>
                  <img src={post.mediaUrl} alt="IG Post" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.85rem', color: textMain, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                      {post.caption}
                    </p>

                    <div style={{ display: 'flex', gap: '1.25rem', color: textMuted, fontSize: '0.78rem', fontWeight: 700, marginTop: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f43f5e' }}>
                        <Heart size={14} /> {post.metrics?.likes?.value !== undefined && post.metrics?.likes?.value !== null ? post.metrics.likes.value : 0} Likes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8' }}>
                        <MessageCircle size={14} /> {post.metrics?.comments?.value !== undefined && post.metrics?.comments?.value !== null ? post.metrics.comments.value : 0} Comments
                      </span>
                      <span>{post.timestamp ? new Date(post.timestamp).toLocaleDateString('en-IN') : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Comments & Response Manager Card */}
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '1.5rem', border: cardBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} color="#10b981" /> Real-time Meta Post Comments & Response Console
              </h4>
              <button
                onClick={fetchMetaComments}
                disabled={loadingComments}
                style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: inputBorder, backgroundColor: innerCardBg, color: textMain, fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
              >
                {loadingComments ? 'Refreshing...' : 'Refresh Comments'}
              </button>
            </div>

            {comments.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: textMuted, margin: 0 }}>
                No active post comments found. Connect your Facebook Page & Instagram account to view and reply to live user comments here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.map(c => (
                  <div key={c.commentId} style={{ backgroundColor: innerCardBg, borderRadius: '12px', padding: '1rem', border: inputBorder }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ color: '#0284c7', fontSize: '0.88rem' }}>{c.senderName}</strong>
                      <span style={{ fontSize: '0.75rem', color: textMuted }}>{c.createdTime ? new Date(c.createdTime).toLocaleString() : ''}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: textMain, margin: '0 0 0.75rem 0' }}>"{c.text}"</p>

                    {/* Quick Reply Chips */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                      {[
                        "Thanks for reaching out! DM us for pricing details. 📲",
                        "Thank you! Visit our website for full catalog & details. ✨",
                        "We appreciate your feedback! Have a great day. 😊"
                      ].map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setReplyTextMap(prev => ({ ...prev, [c.commentId]: tpl }))}
                          style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                            border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: textMuted,
                            cursor: 'pointer'
                          }}
                        >
                          + {tpl.substring(0, 24)}...
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={replyTextMap[c.commentId] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [c.commentId]: e.target.value })}
                        placeholder="Write a public reply..."
                        style={{ flex: 1, backgroundColor: inputBg, border: inputBorder, borderRadius: '8px', padding: '0.5rem 0.75rem', color: textMain, fontSize: '0.82rem', outline: 'none' }}
                      />
                      <button
                        onClick={() => handleReplyComment(c.commentId)}
                        disabled={replyingId === c.commentId}
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        {replyingId === c.commentId ? 'Sending...' : 'Reply'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      )}

      {/* 2. FACEBOOK TAB */}
      {activeTab === 'FACEBOOK' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${isDark ? 'rgba(24, 119, 242, 0.3)' : '#cbd5e1'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Facebook size={36} color="#1877f2" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: textMain, margin: 0 }}>
                  Facebook Business Page & Messenger {fbData?.page?.name && <span style={{ color: '#1877f2', fontSize: '0.95rem' }}>({fbData.page.name})</span>}
                </h3>
                <p style={{ fontSize: '0.85rem', color: textMuted, margin: '0.2rem 0 0 0' }}>
                  Auto-post to Facebook Page feed & receive customer Messenger DMs directly in LetsTrack console.
                  {fbData?.lastUpdated && <span style={{ marginLeft: '0.75rem', color: textMuted }}>Last synced: {new Date(fbData.lastUpdated).toLocaleTimeString()}</span>}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Sync Status Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: fbData?.syncStatus === 'LIVE' ? 'rgba(16, 185, 129, 0.15)' : (fbData?.syncStatus === 'PARTIAL' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                border: `1px solid ${fbData?.syncStatus === 'LIVE' ? 'rgba(16, 185, 129, 0.3)' : (fbData?.syncStatus === 'PARTIAL' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)')}`,
                color: fbData?.syncStatus === 'LIVE' ? '#34d399' : (fbData?.syncStatus === 'PARTIAL' ? '#fbbf24' : '#f87171'),
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 800
              }}>
                ● Sync: {fbData?.syncStatus || 'UNKNOWN'}
              </div>

              <button
                onClick={fetchFacebookStats}
                disabled={loadingFb}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: inputBorder,
                  borderRadius: '10px',
                  padding: '0.5rem 0.85rem',
                  color: textMain,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} className={loadingFb ? 'animate-spin' : ''} />
                {loadingFb ? 'Syncing...' : 'Refresh Meta Stats'}
              </button>

              <div style={{ backgroundColor: 'rgba(24, 119, 242, 0.15)', border: '1px solid rgba(24, 119, 242, 0.3)', color: '#38bdf8', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800 }}>
                {fbData?.connected ? `Linked Page: ${fbData.page?.name || 'Connected'}` : 'Not Connected'}
              </div>
            </div>
          </div>

          {/* Meta API Diagnostics Section */}
          <details style={{ backgroundColor: cardBg, borderRadius: '12px', border: cardBorder, padding: '0.75rem 1.25rem' }}>
            <summary style={{ color: textMuted, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} color="#1877f2" /> Meta API Diagnostics & Connection Details (Developer Mode)
            </summary>
            <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.8rem', color: textMuted }}>
              <div><strong>Graph API Version:</strong> {fbData?.diagnostics?.apiVersion || 'v24.0'}</div>
              <div><strong>Page ID (Masked):</strong> {fbData?.diagnostics?.pageIdMasked || 'N/A'}</div>
              <div><strong>Sync Status:</strong> <span style={{ color: fbData?.syncStatus === 'LIVE' ? '#34d399' : '#fbbf24' }}>{fbData?.syncStatus || 'N/A'}</span></div>
              <div><strong>Last Sync:</strong> {fbData?.lastUpdated ? new Date(fbData.lastUpdated).toLocaleTimeString() : 'N/A'}</div>
              <div><strong>Error Details:</strong> <span style={{ color: '#f87171' }}>{fbData?.diagnostics?.lastError ? `${fbData.diagnostics.lastError} (Code: ${fbData.diagnostics.errorCode || 'N/A'}, Type: ${fbData.diagnostics.errorType || 'N/A'}, Trace: ${fbData.diagnostics.fbtraceId || 'N/A'})` : 'None'}</span></div>
            </div>
          </details>

          {!fbData?.connected ? (
            <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '2.5rem', textAlign: 'center', border: cardBorder }}>
              <AlertCircle size={40} color="#1877f2" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: textMain, margin: 0 }}>Facebook Business Page Not Linked</h4>
              <p style={{ fontSize: '0.85rem', color: textMuted, maxWidth: '480px', margin: '0.5rem auto 1.25rem auto' }}>
                Connect your Facebook Business Page in Profile Settings to view real Graph API analytics, post directly to your Page feed, and auto-sync Messenger DMs to LetsTrack.
              </p>
            </div>
          ) : (
            /* Facebook Real Graph API Metrics Grid */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {/* Followers */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <span style={{ fontSize: '0.82rem', color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Page Followers</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: textMain }}>
                  {fbData.metrics?.followers?.available && fbData.metrics.followers.value !== null ? fbData.metrics.followers.value.toLocaleString() : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>Verified Page Followers</div>
              </div>

              {/* Page Likes */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <span style={{ fontSize: '0.82rem', color: textMuted, display: 'block', marginBottom: '0.35rem' }}>Page Likes</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: textMain }}>
                  {fbData.metrics?.likes?.available && fbData.metrics.likes.value !== null ? fbData.metrics.likes.value.toLocaleString() : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>Fan Count</div>
              </div>

              {/* People Talking About This */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <span style={{ fontSize: '0.82rem', color: textMuted, display: 'block', marginBottom: '0.35rem' }}>People Talking About This</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: textMain }}>
                  {fbData.metrics?.talkingAbout?.available && fbData.metrics.talkingAbout.value !== null ? fbData.metrics.talkingAbout.value.toLocaleString() : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>Page Story Engagements</div>
              </div>

              {/* Unique Page Reach */}
              <div style={{ backgroundColor: cardBg, padding: '1.25rem', borderRadius: '14px', border: cardBorder }}>
                <span style={{ fontSize: '0.82rem', color: textMuted, display: 'block', marginBottom: '0.35rem' }}>28-Day Unique Page Reach</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: textMain }}>
                  {fbData.metrics?.pageReach?.available && fbData.metrics.pageReach.value !== null ? fbData.metrics.pageReach.value.toLocaleString() : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>
                  {fbData.metrics?.pageReach?.reason || 'Page impressions unique'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. GOOGLE TAB */}
      {activeTab === 'GOOGLE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${isDark ? 'rgba(234, 67, 53, 0.3)' : '#cbd5e1'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Search size={36} color="#ea4335" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: textMain, margin: 0 }}>Google Business Profile (GBP) & Local SEO</h3>
                <p style={{ fontSize: '0.85rem', color: textMuted, margin: '0.2rem 0 0 0' }}>Track local search rankings, phone calls, and review booster QR standees.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MARKETING ASSET LIBRARY */}
      {activeTab === 'LIBRARY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${isDark ? 'rgba(168, 85, 247, 0.3)' : '#cbd5e1'}` }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={22} color="#a855f7" /> Central Marketing Asset Library
            </h3>
            <p style={{ fontSize: '0.85rem', color: textMuted, margin: '0.35rem 0 1rem 0' }}>Promotional banners, social media flyers, and verified brand graphics ready for 1-click posting.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                { name: 'Weekend Sale Flyer', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600' },
                { name: 'Corporate Branding Banner', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600' },
                { name: 'Digital Services Showcase', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600' }
              ].map((asset, aIdx) => (
                <div key={aIdx} style={{ backgroundColor: innerCardBg, borderRadius: '12px', overflow: 'hidden', border: inputBorder }}>
                  <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.85rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: textMain, display: 'block', marginBottom: '0.5rem' }}>{asset.name}</strong>
                    <button
                      onClick={() => {
                        setMediaUrl(asset.url);
                        setActiveTab('INSTAGRAM');
                      }}
                      style={{ width: '100%', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      Use in Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. META ADS MANAGER TAB */}
      {activeTab === 'META_ADS' && (
        <MetaAdsManager theme={theme} businessGroup={businessGroup} onCampaignCreated={(newCamp) => setCampaigns([newCamp, ...campaigns])} />
      )}

    </div>
  );
}
