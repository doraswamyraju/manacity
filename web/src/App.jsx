import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Locations from './pages/Locations';
import Billing from './pages/Billing';

function App() {
  const [view, setView] = useState('login'); // login, register, dashboard, locations, billing
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-authenticate with stored token
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
      setView('dashboard');
      
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
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setView('login');
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
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

          <div style={{ 
            backgroundColor: 'rgba(25, 118, 210, 0.05)', 
            border: '1px solid var(--border-color)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <p style={{ color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              ✓ Core Setup Successful
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Authentication is fully functional on both backend endpoints and frontend layouts. Ready to proceed with Stage 3: Business Setup.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            <button className="btn btn-primary" onClick={() => setView('locations')} style={{ width: '100%' }}>
              Setup Business Location
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
