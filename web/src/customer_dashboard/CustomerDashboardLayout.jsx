import React, { useState } from 'react';
import { Compass, Heart, Star, Bell, Search, Tag, User, MapPin, Sparkles } from 'lucide-react';

import CustomerSidebar from './CustomerSidebar';
import CustomerTopbar from './CustomerTopbar';
import UserReferralDashboard from '../pages/referral/UserReferralDashboard';
import MyEnquiriesTab from './MyEnquiriesTab';
import SavedPlacesTab from './SavedPlacesTab';
import MyReviewsTab from './MyReviewsTab';

function CustomerDashboardLayout({ user, onLogout, isOwner, onSwitchPortal }) {
  // Persist active tab in localStorage
  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem('customer_activetab') || 'overview';
  });

  const setActiveTab = (tabId) => {
    localStorage.setItem('customer_activetab', tabId);
    setActiveTabState(tabId);
  };
  
  // Sidebar State: Collapsible, Hover Expand, Pin Option
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Persistent Light / Dark Theme in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('customer_theme') || 'dark';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('customer_theme', nextTheme);
      return nextTheme;
    });
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
      
      {/* 1. Customer Sidebar */}
      <CustomerSidebar
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
        <CustomerTopbar
          user={user}
          onRefresh={() => window.location.reload()}
          onLogout={onLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          isOwner={isOwner}
          onSwitchPortal={onSwitchPortal}
        />

        {/* Owner Preview Banner */}
        {isOwner && (
          <div style={{
            backgroundColor: isDark ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.1)',
            borderBottom: '1px solid rgba(236, 72, 153, 0.3)',
            padding: '0.65rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: isDark ? '#f472b6' : '#be185d'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Sparkles size={16} /> You are currently viewing ManaCity in <strong>Customer (User) Mode</strong>.
            </div>
            <button
              type="button"
              onClick={onSwitchPortal}
              style={{
                backgroundColor: isDark ? '#10b981' : '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              &larr; Return to Business Owner Console
            </button>
          </div>
        )}

        {/* 3. SPA Content View */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          
          {/* OVERVIEW / HUB TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Customer Hero Banner */}
              <div style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                border: isDark ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid rgba(236, 72, 153, 0.2)',
                borderRadius: '16px',
                padding: '1.75rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(236, 72, 153, 0.08)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Sparkles size={18} color="#ec4899" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Customer Member Portal
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    Welcome back, <span className="gradient-text">{user?.name}</span>
                  </h2>
                  <p style={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
                    Track your business quote enquiries, manage bookmarked places, and post ratings.
                  </p>
                </div>
              </div>

              {/* Quick Action Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
                <div
                  onClick={() => setActiveTab('my-enquiries')}
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
                    <Search size={26} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800, display: 'block' }}>My Enquiries</strong>
                    <span style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>Quotes & 24H SLA tracker</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('favorites')}
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
                  <div style={{ padding: '0.85rem', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.4) 100%)', borderRadius: '12px', color: isDark ? '#f472b6' : '#be185d' }}>
                    <Heart size={26} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800, display: 'block' }}>Saved Places</strong>
                    <span style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>View bookmarked spots</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('my-reviews')}
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
                    <strong style={{ fontSize: '1.1rem', color: isDark ? '#fff' : '#0f172a', fontWeight: 800, display: 'block' }}>My Reviews</strong>
                    <span style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b' }}>Your ratings & feedback</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* DEDICATED CUSTOMER MODULES */}
          {activeTab === 'my-enquiries' && <MyEnquiriesTab theme={theme} />}

          {activeTab === 'favorites' && <SavedPlacesTab theme={theme} />}

          {activeTab === 'my-reviews' && <MyReviewsTab theme={theme} />}

          {activeTab === 'referrals' && <UserReferralDashboard theme={theme} />}

          {activeTab === 'profile' && (
            <div style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', marginBottom: '1rem' }}>Account Profile</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div><strong style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Name:</strong> {user?.name}</div>
                <div><strong style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Email:</strong> {user?.email}</div>
                <div><strong style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Mobile Number:</strong> {user?.phone || 'Not set'}</div>
                <div><strong style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Account Role:</strong> CUSTOMER</div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

export default CustomerDashboardLayout;
