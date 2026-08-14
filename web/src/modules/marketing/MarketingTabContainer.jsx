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

export default function MarketingTabContainer({ businessGroup, activeTabOverride }) {
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

  useEffect(() => {
    if (activeTab === 'INSTAGRAM') {
      fetchInstagramStats();
    } else if (activeTab === 'FACEBOOK') {
      fetchFacebookStats();
    }
  }, [activeTab]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Bar Category Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.65rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
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
                border: isActive ? `1px solid ${sub.color}` : '1px solid rgba(255,255,255,0.08)',
                backgroundColor: isActive ? `${sub.color}20` : '#0f172a',
                color: isActive ? '#fff' : '#94a3b8',
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
                border: isActive ? `1px solid ${sub.color}` : '1px solid rgba(255,255,255,0.08)',
                backgroundColor: isActive ? `${sub.color}20` : '#0f172a',
                color: isActive ? '#fff' : '#94a3b8',
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
                border: isActive ? `1px solid ${sub.color}` : '1px solid rgba(255,255,255,0.08)',
                backgroundColor: isActive ? `${sub.color}20` : '#0f172a',
                color: isActive ? '#fff' : '#94a3b8',
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
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} color="#a855f7" /> Central Marketing Asset Library & Brand Flyers
          </div>
        )}

        {activeTab === 'META_ADS' && (
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={20} color="#38bdf8" /> Meta Ad Campaign Builder & Target Insights
          </div>
        )}
      </div>

      {/* 1. INSTAGRAM TAB */}
      {activeTab === 'INSTAGRAM' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Banner & Live Sync Status */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(225, 48, 108, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Instagram size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Instagram Business Hub {igData?.handle && <span style={{ color: '#e1306c', fontSize: '0.95rem' }}>({igData.handle})</span>}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                  Manage posts, view live Graph API insights & auto-sync DMs directly to LetsTrack live chat.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1rem', borderRadius: '20px', color: '#34d399', fontSize: '0.82rem', fontWeight: 800 }}>
              <MessageSquare size={16} /> LetsTrack DM Sync: Active
            </div>
          </div>

          {/* Real Account Statistics Cards */}
          {(igSubTab === 'overview' || igSubTab === 'posts') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Followers Count</span>
                  <Users size={18} color="#e1306c" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff' }}>
                  {igData?.stats?.followersCount !== undefined ? igData.stats.followersCount.toLocaleString() : 0}
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Instagram followers
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Total Views / Impressions</span>
                  <Eye size={18} color="#818cf8" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff' }}>
                  {igData?.stats?.views !== undefined ? igData.stats.views.toLocaleString() : 0}
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Content impressions
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Account Reach</span>
                  <TrendingUp size={18} color="#38bdf8" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff' }}>
                  {igData?.stats?.reach !== undefined ? igData.stats.reach.toLocaleString() : 0}
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Unique accounts reached
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span>Interactions / Engagement</span>
                  <Heart size={18} color="#f59e0b" />
                </div>
                <strong style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff' }}>
                  {igData?.stats?.engagementRate || '0%'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Engagement rate
                </div>
              </div>
            </div>
          )}

          {/* Content Creation & Scheduled Post Form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
            
            {/* Create / Schedule Post Card */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={18} color="#e1306c" /> Create & Schedule Instagram Post
              </h4>

              {publishMessage && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} /> {publishMessage}
                </div>
              )}

              <form onSubmit={handlePublishPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Post Caption</label>
                  <textarea
                    rows={4}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Write an engaging caption for your Instagram followers..."
                    style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Image / Video URL</label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.65rem', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Schedule Post (Optional - Leave blank for instant publish)</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.65rem', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishing}
                  style={{
                    backgroundColor: '#e1306c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.8rem',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem'
                  }}
                >
                  {publishing ? <RefreshCw size={18} className="animate-spin" /> : <><Send size={18} /> {scheduledDate ? 'Schedule Post' : 'Publish Live Now'}</>}
                </button>
              </form>
            </div>

            {/* Existing Posts Feed Grid */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Instagram size={18} color="#e1306c" /> Recent Published Media & Activity
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(igData?.recentPosts || []).map(post => (
                  <div key={post.id} style={{ display: 'flex', gap: '1rem', backgroundColor: '#1e293b', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={post.mediaUrl} alt="IG Post" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.85rem', color: '#f8fafc', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                        {post.caption}
                      </p>

                      <div style={{ display: 'flex', gap: '1.25rem', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, marginTop: '0.5rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f43f5e' }}>
                          <Heart size={14} /> {post.likeCount} Likes
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8' }}>
                          <MessageCircle size={14} /> {post.commentsCount} Comments
                        </span>
                        <span>{new Date(post.timestamp).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. FACEBOOK TAB */}
      {activeTab === 'FACEBOOK' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(24, 119, 242, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Facebook size={36} color="#1877f2" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Facebook Business Page & Messenger {fbData?.pageName && <span style={{ color: '#1877f2', fontSize: '0.95rem' }}>({fbData.pageName})</span>}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>Auto-post to Facebook Page feed & receive customer Messenger DMs directly in LetsTrack console.</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(24, 119, 242, 0.15)', border: '1px solid rgba(24, 119, 242, 0.3)', color: '#38bdf8', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800 }}>
              {fbData?.connected ? `Linked Page: ${fbData.pageName || 'Connected'}` : 'Not Connected'}
            </div>
          </div>

          {!fbData?.connected ? (
            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
              <AlertCircle size={40} color="#1877f2" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Facebook Business Page Not Linked</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '480px', margin: '0.5rem auto 1.25rem auto' }}>
                Connect your Facebook Business Page in Profile Settings to view real Graph API analytics, post directly to your Page feed, and auto-sync Messenger DMs to LetsTrack.
              </p>
            </div>
          ) : (
            /* Facebook Stats Grid */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Page Likes & Followers</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                  {fbData.stats?.followersCount?.toLocaleString() || 0}
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '0.25rem' }}>Verified Page Audience</div>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Monthly Page Reach</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                  {fbData.stats?.monthlyReach?.toLocaleString() || 0}
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, marginTop: '0.25rem' }}>Organic Impressions</div>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Messenger Conversations</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>
                  {fbData.stats?.conversationsSynced || 0} Synced
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginTop: '0.25rem' }}>LetsTrack Console Sync Active</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. GOOGLE TAB */}
      {activeTab === 'GOOGLE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(234, 67, 53, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Search size={36} color="#ea4335" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>Google Business Profile (GBP) & Local SEO</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>Track local search rankings, phone calls, and review booster QR standees.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MARKETING ASSET LIBRARY */}
      {activeTab === 'LIBRARY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={22} color="#a855f7" /> Central Marketing Asset Library
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.35rem 0 1rem 0' }}>Promotional banners, social media flyers, and verified brand graphics ready for 1-click posting.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                { name: 'Weekend Sale Flyer', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600' },
                { name: 'Corporate Branding Banner', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600' },
                { name: 'Digital Services Showcase', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600' }
              ].map((asset, aIdx) => (
                <div key={aIdx} style={{ backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.85rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>{asset.name}</strong>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <MetaAdsManager businessGroup={businessGroup} onCampaignCreated={handleCampaignCreated} />
          <AdCampaignsView campaigns={campaigns} />
          <MarketingAnalytics />
        </div>
      )}

    </div>
  );
}
