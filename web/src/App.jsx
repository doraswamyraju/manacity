import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Locations from './pages/Locations';
import Billing from './pages/Billing';
import ReviewSubmit from './pages/ReviewSubmit';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DeleteAccount from './pages/DeleteAccount';
import OnboardingWizard from './pages/OnboardingWizard';
import WebsiteBuilder from './pages/WebsiteBuilder';
import ReviewManagement from './pages/ReviewManagement';

function App() {
  const [view, setView] = useState('landing'); // landing, login, register, dashboard, locations, billing, admin, onboarding
  const [user, setUser] = useState(null);
  const [businessGroup, setBusinessGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Path routing checks
  const isReviewPage = window.location.pathname.startsWith('/review/');
  const isPrivacyPage = window.location.pathname === '/privacy';
  const isTermsPage = window.location.pathname === '/terms';
  const isDeletePage = window.location.pathname === '/delete-account';

  const fetchOnboardingState = () => {
    axios.get('/api/business/onboarding-state')
      .then((res) => {
        setBusinessGroup(res.data.businessGroup);
      })
      .catch(() => {});
  };

  // Auto-authenticate with stored token
  useEffect(() => {
    if (isReviewPage || isPrivacyPage || isTermsPage || isDeletePage) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
      setView('dashboard');
      fetchOnboardingState();
      
      // Verify token freshness with backend
      axios.get('/api/auth/me')
        .then((res) => {
          if (res.data.status === 'success') {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          handleLogout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setView('landing');
      setLoading(false);
    }
  }, [isReviewPage, isPrivacyPage, isTermsPage, isDeletePage]);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setView('dashboard');
    fetchOnboardingState();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setBusinessGroup(null);
    setView('landing');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--text-secondary)'
      }}>
        <h2>Loading ManaCity...</h2>
      </div>
    );
  }

  // Render compliance/public routes directly based on URL paths
  if (isReviewPage) {
    return <ReviewSubmit />;
  }
  if (isPrivacyPage) {
    return <PrivacyPolicy />;
  }
  if (isTermsPage) {
    return <TermsOfService />;
  }
  if (isDeletePage) {
    return <DeleteAccount />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      {view === 'landing' && (
        <Home 
          onNavigateToLogin={() => setView('login')}
          onNavigateToRegister={() => setView('register')}
          onNavigateToPrivacy={() => window.location.href = '/privacy'}
          onNavigateToTerms={() => window.location.href = '/terms'}
          onNavigateToDelete={() => window.location.href = '/delete-account'}
        />
      )}

      {view === 'login' && (
        <Login 
          onAuthSuccess={handleAuthSuccess} 
          onNavigateToRegister={() => setView('register')} 
        />
      )}

      {view === 'register' && (
        <Register 
          onAuthSuccess={handleAuthSuccess} 
          onNavigateToLogin={() => setView('login')} 
        />
      )}

      {view === 'locations' && (
        <Locations onBack={() => setView('dashboard')} />
      )}

      {view === 'billing' && (
        <Billing onBack={() => setView('dashboard')} />
      )}

      {view === 'admin' && (
        <AdminDashboard onBack={() => setView('dashboard')} />
      )}

      {view === 'website-builder' && (
        <WebsiteBuilder onBack={() => setView('dashboard')} />
      )}

      {view === 'reviews' && (
        <ReviewManagement onBack={() => setView('dashboard')} />
      )}

      {view === 'onboarding' && (
        <OnboardingWizard 
          onCompleteOnboarding={(updatedBg) => {
            setBusinessGroup(updatedBg);
            setView('dashboard');
          }}
          onCancel={() => setView('dashboard')}
        />
      )}

      {view === 'dashboard' && user && (
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
          <img 
            src="/logo.svg" 
            alt="ManaCity Logo" 
            style={{ width: '90%', maxWidth: '280px', marginBottom: '2rem' }} 
          />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Welcome, <span className="gradient-text">{user.name}</span>!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Role: <strong>{user.role}</strong> | Email: <strong>{user.email}</strong>
          </p>

          {/* Onboarding Progress Card */}
          {(!businessGroup || !businessGroup.isSetupComplete) ? (
            <div style={{ 
              backgroundColor: 'rgba(255, 152, 0, 0.05)', 
              border: '1px solid rgba(255, 152, 0, 0.2)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#ff9800' }}>
                  Complete Business Profile ({businessGroup ? Math.min(Math.round(((businessGroup.setupStep - 1) / 5) * 100), 100) : 0}%)
                </span>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setView('onboarding')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', height: 'auto', borderColor: '#ff9800', color: '#ff9800' }}
                >
                  Continue
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Setup your business address, working hours, services, and logo to enable search visibility, dynamic website rendering, and local mapping features.
              </p>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: 'rgba(76, 175, 80, 0.05)', 
              border: '1px solid rgba(76, 175, 80, 0.2)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <p style={{ color: '#4caf50', fontWeight: 600, marginBottom: '0.25rem' }}>
                ✓ Business Profile Configured
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Your business details are synchronized. All system tools, mapping, and site builders are fully unlocked.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            {user.role === 'SUPER_ADMIN' && (
              <button className="btn btn-primary" onClick={() => setView('admin')} style={{ width: '100%', backgroundColor: 'var(--accent-secondary)', borderColor: 'var(--accent-secondary)' }}>
                Super Admin Console
              </button>
            )}
            
            <button 
              className="btn btn-primary" 
              onClick={() => setView('locations')} 
              disabled={!businessGroup || !businessGroup.isSetupComplete}
              style={{ 
                width: '100%', 
                opacity: (!businessGroup || !businessGroup.isSetupComplete) ? 0.5 : 1,
                cursor: (!businessGroup || !businessGroup.isSetupComplete) ? 'not-allowed' : 'pointer'
              }}
            >
              Setup Business Location {(!businessGroup || !businessGroup.isSetupComplete) && '🔒'}
            </button>

            <button 
              className="btn btn-primary" 
              onClick={() => setView('website-builder')} 
              disabled={!businessGroup || !businessGroup.isSetupComplete}
              style={{ 
                width: '100%', 
                backgroundColor: 'var(--accent-secondary)', 
                borderColor: 'var(--accent-secondary)',
                opacity: (!businessGroup || !businessGroup.isSetupComplete) ? 0.5 : 1,
                cursor: (!businessGroup || !businessGroup.isSetupComplete) ? 'not-allowed' : 'pointer'
              }}
            >
              Smart Website Builder {(!businessGroup || !businessGroup.isSetupComplete) && '🔒'}
            </button>

            <button 
              className="btn btn-primary" 
              onClick={() => setView('reviews')} 
              disabled={!businessGroup || !businessGroup.isSetupComplete}
              style={{ 
                width: '100%', 
                backgroundColor: 'var(--accent-secondary)', 
                borderColor: 'var(--accent-secondary)',
                opacity: (!businessGroup || !businessGroup.isSetupComplete) ? 0.5 : 1,
                cursor: (!businessGroup || !businessGroup.isSetupComplete) ? 'not-allowed' : 'pointer'
              }}
            >
              Review Management Console {(!businessGroup || !businessGroup.isSetupComplete) && '🔒'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setView('billing')} style={{ width: '100%' }}>
                Billing & Tiers
              </button>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
