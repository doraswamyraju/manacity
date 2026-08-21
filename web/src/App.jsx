import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
import PublicReviewLanding from './pages/PublicReviewLanding';
import ReviewPosterPrint from './pages/ReviewPosterPrint';
import PublicBusinessWebsite from './pages/PublicBusinessWebsite';
import SuperAdminDashboardLayout from './superadmin/SuperAdminDashboardLayout';
import AdminDashboardLayout from './admin_dashboard/AdminDashboardLayout';
import CustomerDashboardLayout from './customer_dashboard/CustomerDashboardLayout';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [businessGroup, setBusinessGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [portalMode, setPortalMode] = useState(() => {
    return localStorage.getItem('portal_mode') || 'admin';
  });

  const handleTogglePortalMode = (mode) => {
    const nextMode = mode || (portalMode === 'admin' ? 'customer' : 'admin');
    setPortalMode(nextMode);
    localStorage.setItem('portal_mode', nextMode);
  };

  const fetchOnboardingState = () => {
    axios.get('/api/business/onboarding-state')
      .then((res) => {
        setBusinessGroup(res.data.businessGroup);
      })
      .catch(() => {});
  };

  // Capture ?ref= query param globally for referral tracking & attribution
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('referral_code', refCode);
      axios.post('/api/referrals/click', { refCode }).catch(() => {});
    }
  }, [location.search]);

  // Auto-authenticate with stored token
  useEffect(() => {
    const isPublicRoute = 
      location.pathname.startsWith('/review/') ||
      location.pathname.startsWith('/r/') ||
      location.pathname.startsWith('/site/') ||
      location.pathname.startsWith('/biz/') ||
      location.pathname === '/print-review-qr' ||
      location.pathname === '/privacy' ||
      location.pathname === '/terms' ||
      location.pathname === '/delete-account';

    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(parsedUser);

      // Verify token freshness with backend
      axios.get('/api/auth/me')
        .then((res) => {
          if (res.data.status === 'success') {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            handleLogout();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    if (authenticatedUser.role === 'SUPER_ADMIN') {
      navigate('/admin');
    } else {
      // Check if business profile is already created/setup to land directly on dashboard
      axios.get('/api/business/onboarding-state')
        .then((res) => {
          const bg = res.data.businessGroup;
          if (bg && (bg.isSetupComplete || (bg.setupStep && bg.setupStep >= 5) || (bg.locations && bg.locations.length > 0))) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        })
        .catch(() => {
          navigate('/dashboard');
        });
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setBusinessGroup(null);
    navigate('/login');
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

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isSubdomain = hostname.endsWith('.manacity.in') && hostname !== 'manacity.in' && hostname !== 'www.manacity.in';

  /* Business Dashboard Routes */
  return (
    <Routes>
      {/* Public Aggregator Directory & Storefront Routes */}
      <Route path="/" element={isSubdomain ? <PublicBusinessWebsite /> : <Home onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} user={user} />} />
      <Route path="/:city" element={<Home onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} user={user} />} />
      <Route path="/:city/:category" element={<Home onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} user={user} />} />
      <Route path="/biz/:slug" element={<PublicBusinessWebsite />} />
      <Route path="/site/:subdomain" element={<PublicBusinessWebsite />} />


      {/* Auth Routes */}
      <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} onNavigateToRegister={() => navigate('/register')} />} />
      <Route path="/register" element={<Register onAuthSuccess={handleAuthSuccess} onNavigateToLogin={() => navigate('/login')} />} />

      {/* Compliance / Landing Pages */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/delete-account" element={<DeleteAccount />} />

      {/* Review System Pages */}
      <Route path="/review/*" element={<ReviewSubmit />} />
      <Route path="/r/*" element={<PublicReviewLanding />} />
      <Route path="/print-review-qr" element={<ReviewPosterPrint />} />

      {/* Super Admin Console Route */}
      <Route 
        path="/admin/*" 
        element={
          user && user.role === 'SUPER_ADMIN' ? (
            <SuperAdminDashboardLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Dashboard Routes with Admin / Customer Portal Mode Toggle */}
      <Route 
        path="/dashboard/*" 
        element={
          user ? (
            user.role === 'CUSTOMER' ? (
              <CustomerDashboardLayout user={user} onLogout={handleLogout} />
            ) : portalMode === 'customer' ? (
              <CustomerDashboardLayout user={user} onLogout={handleLogout} isOwner={true} onSwitchPortal={() => handleTogglePortalMode('admin')} />
            ) : (
              <AdminDashboardLayout user={user} businessGroup={businessGroup} onLogout={handleLogout} setView={(v) => navigate(`/${v}`)} onSwitchPortal={() => handleTogglePortalMode('customer')} />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      <Route path="/onboarding" element={user ? <OnboardingWizard onCompleteOnboarding={(updatedBg) => { setBusinessGroup(updatedBg); navigate('/dashboard'); }} onCancel={() => navigate('/dashboard')} /> : <Navigate to="/login" replace />} />
      <Route path="/locations" element={user ? <Locations onBack={() => navigate('/dashboard')} onNavigateToOnboarding={() => navigate('/onboarding')} /> : <Navigate to="/login" replace />} />
      <Route path="/billing" element={user ? <Billing onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" replace />} />
      <Route path="/website-builder" element={user ? <WebsiteBuilder onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" replace />} />
      <Route path="/reviews" element={user ? <ReviewManagement onBack={() => navigate('/dashboard')} /> : <Navigate to="/login" replace />} />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
