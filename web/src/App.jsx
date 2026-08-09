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
import SuperAdminDashboardLayout from './superadmin/SuperAdminDashboardLayout';
import AdminDashboardLayout from './admin_dashboard/AdminDashboardLayout';
import CustomerDashboardLayout from './customer_dashboard/CustomerDashboardLayout';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [businessGroup, setBusinessGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOnboardingState = () => {
    axios.get('/api/business/onboarding-state')
      .then((res) => {
        setBusinessGroup(res.data.businessGroup);
      })
      .catch(() => {});
  };

  // Auto-authenticate with stored token
  useEffect(() => {
    const isPublicRoute = 
      location.pathname.startsWith('/review/') ||
      location.pathname.startsWith('/r/') ||
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
        .catch(() => {
          handleLogout();
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
    } else if (authenticatedUser.role === 'BUSINESS_OWNER') {
      navigate('/onboarding');
      fetchOnboardingState();
    } else {
      navigate('/dashboard');
      fetchOnboardingState();
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

  return (
    <Routes>
      {/* Public Aggregator Directory Routes */}
      <Route path="/" element={<Home onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} user={user} />} />
      <Route path="/:city" element={<Home onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} user={user} />} />
      <Route path="/:city/:category" element={<Home onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} user={user} />} />
      <Route path="/biz/:slug" element={<Home onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} user={user} />} />

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

      {/* Business Dashboard Routes */}
      <Route 
        path="/dashboard/*" 
        element={
          user ? (
            user.role === 'CUSTOMER' ? (
              <CustomerDashboardLayout user={user} onLogout={handleLogout} />
            ) : (
              <AdminDashboardLayout user={user} businessGroup={businessGroup} onLogout={handleLogout} setView={(v) => navigate(`/${v}`)} />
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
