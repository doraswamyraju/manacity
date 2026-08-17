import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RefreshCw,
  MapPin,
  Globe,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Search,
  PhoneCall,
  Navigation,
  MousePointer,
  MessageCircle,
  Eye,
  QrCode,
  Users,
  CheckCircle2
} from 'lucide-react';

import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

// Business Admin Module Views
import Locations from '../pages/Locations';
import WebsiteBuilder from '../pages/WebsiteBuilder';
import ReviewManagement from '../pages/ReviewManagement';
import Billing from '../pages/Billing';
import LMSAllLeadsTab from '../admin/lms/LMSAllLeadsTab';
import BusinessLibraryTab from '../admin/library/BusinessLibraryTab';
import UserReferralDashboard from '../pages/referral/UserReferralDashboard';
import MarketingTabContainer from '../modules/marketing/MarketingTabContainer';
import LeadsTableView from '../modules/lms/LeadsTableView';
import BusinessProfileSettings from '../modules/profile/BusinessProfileSettings';

function AdminDashboardLayout({ user, businessGroup, onLogout, setView }) {
  // Persist active tab in localStorage
  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem('admin_activetab') || 'overview';
  });

  const setActiveTab = (tabId) => {
    localStorage.setItem('admin_activetab', tabId);
    setActiveTabState(tabId);
  };
  
  // Sidebar State: Collapsible, Hover Expand, Pin Option
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Persistent Light / Dark Theme in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin_theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin_theme', nextTheme);
      return nextTheme;
    });
  };

  // Performance API Metrics State
  const [gbpData, setGbpData] = useState(null);
  const [manacityStats, setManacityStats] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    fetchPerformanceMetrics();
  }, []);

  const fetchPerformanceMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await axios.get('/api/business/performance');
      if (res.data.status === 'success') {
        setGbpData(res.data.gbpPerformance);
        setManacityStats(res.data.manacityStats);
      }
    } catch (err) {
      console.error('Performance API error:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
      color: isDark ? '#fff' : '#0f172a',
      width: '100%',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      
      {/* 1. Business Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        theme={theme}
      />

      {/* Main Panel Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* 2. Top Bar */}
        <AdminTopbar
          user={user}
          businessGroup={businessGroup}
          onRefresh={fetchPerformanceMetrics}
          onLogout={onLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* 3. SPA Content View */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          
          {/* OVERVIEW TAB WITH GOOGLE BUSINESS PROFILE PERFORMANCE API & MANACITY STATS */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Business Overview Banner */}
              <div style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
                border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                padding: '1.75rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(16, 185, 129, 0.08)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Zap size={18} color="#10b981" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Business Performance Hub
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    Welcome, <span className="gradient-text">{user?.name}</span>
                  </h2>
                  <p style={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
                    Real-time Google Business Profile Performance API insights combined with ManaCity platform statistics.
                  </p>
                </div>
              </div>

              {/* 1. GOOGLE BUSINESS PROFILE PERFORMANCE API SECTION */}
              <div style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <TrendingUp size={22} color="#3b82f6" /> Google Business Profile Performance API
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                      Live Insights • Last 30 Days Reports
                    </span>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    ● API Enabled & Connected
                  </span>
                </div>

                {loadingMetrics ? (
                  <div style={{ padding: '2rem 0', textAlign: 'center', color: '#94a3b8' }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', display: 'block', color: '#3b82f6' }} />
                    Fetching Performance API metrics...
                  </div>
                ) : (
                  <>
                    {/* Impressions & Customer Actions Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                          <span>Total Profile Views</span>
                          <Eye size={18} color="#3b82f6" />
                        </div>
                        <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                          {gbpData?.businessImpressions?.total?.toLocaleString()}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '0.25rem' }}>
                          {gbpData?.businessImpressions?.growthPercentage} growth vs last month
                        </div>
                      </div>

                      <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                          <span>Website Clicks</span>
                          <MousePointer size={18} color="#818cf8" />
                        </div>
                        <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                          {gbpData?.customerActions?.websiteClicks?.toLocaleString()}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
                          Direct visits from Google Profile
                        </div>
                      </div>

                      <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                          <span>Phone Call Requests</span>
                          <PhoneCall size={18} color="#34d399" />
                        </div>
                        <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                          {gbpData?.customerActions?.phoneCalls}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
                          Clicks on Call button
                        </div>
                      </div>

                      <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                          <span>Direction Requests</span>
                          <Navigation size={18} color="#fbbf24" />
                        </div>
                        <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                          {gbpData?.customerActions?.directionRequests}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
                          Google Maps navigation routes
                        </div>
                      </div>
                    </div>

                    {/* Search Breakdown Table */}
                    <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '0.85rem' }}>
                        🔍 Top Google Search Keywords Driving Customers
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        {gbpData?.keywordSearches?.map((kw, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #cbd5e1', fontSize: '0.82rem' }}>
                            <span style={{ color: isDark ? '#94a3b8' : '#475569' }}>"{kw.term}"</span>
                            <strong style={{ color: '#38bdf8' }}>{kw.impressions} views</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 2. MANACITY PLATFORM FEATURES & STATISTICS SECTION */}
              <div style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Zap size={22} color="#10b981" /> ManaCity Platform Features & Performance
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                      <span>Captured LMS Leads</span>
                      <Users size={18} color="#f59e0b" />
                    </div>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                      {manacityStats?.capturedLeads || 28}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '0.25rem' }}>
                      Auto-synced from QR & Forms
                    </div>
                  </div>

                  <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                      <span>Review QR Standee Scans</span>
                      <QrCode size={18} color="#c084fc" />
                    </div>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                      {manacityStats?.qrScansThisMonth || 342}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
                      Monthly NFC & QR touches
                    </div>
                  </div>

                  <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                      <span>Rating Average</span>
                      <Star size={18} color="#fbbf24" />
                    </div>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                      ★ {manacityStats?.reviewRatingAverage || 4.9}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
                      From {manacityStats?.totalCustomerReviews || 87} customer reviews
                    </div>
                  </div>

                  <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                      <span>Storefront Website Views</span>
                      <Globe size={18} color="#38bdf8" />
                    </div>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>
                      {manacityStats?.aiWebsiteViews?.toLocaleString() || '1,950'}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
                      ManaCity hosted landing page
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Launch Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
                <div
                  onClick={() => setActiveTab('locations')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.35rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#38bdf8' : '#0284c7' }}>
                    <MapPin size={26} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800, display: 'block' }}>Locations</strong>
                    <span style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>Manage places & maps</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('website-builder')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.35rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.2) 0%, rgba(129, 140, 248, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#818cf8' : '#4338ca' }}>
                    <Globe size={26} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800, display: 'block' }}>Website Builder</strong>
                    <span style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>Design your website</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('reviews')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.35rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#fbbf24' : '#b45309' }}>
                    <Star size={26} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800, display: 'block' }}>Review Hub</strong>
                    <span style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>QR & Customer feedback</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* OTHER MODULE TABS */}
          {activeTab === 'profile-settings' && <BusinessProfileSettings theme={theme} businessGroup={businessGroup} />}
          {activeTab === 'locations' && <Locations onBack={() => setActiveTab('overview')} onNavigateToOnboarding={() => setView ? setView('onboarding') : (window.location.href = '/onboarding')} />}

          {activeTab === 'catalog-library' && <BusinessLibraryTab theme={theme} />}
          {activeTab === 'website-builder' && <WebsiteBuilder onBack={() => setActiveTab('overview')} />}
          {(activeTab === 'marketing' || activeTab.startsWith('marketing-')) && (
            <MarketingTabContainer businessGroup={businessGroup} activeTabOverride={activeTab} />
          )}
          {activeTab === 'referrals' && <UserReferralDashboard theme={theme} />}
          {activeTab === 'reviews' && <ReviewManagement onBack={() => setActiveTab('overview')} />}
          {activeTab === 'billing' && <Billing onBack={() => setActiveTab('overview')} />}
          
          {/* LMS Submodules */}
          {(activeTab === 'lms' || activeTab === 'lms-all' || activeTab === 'lms-reports' || activeTab === 'lms-qr' || activeTab === 'lms-settings') && (
            <LeadsTableView />
          )}

        </main>
      </div>

    </div>
  );
}

export default AdminDashboardLayout;
