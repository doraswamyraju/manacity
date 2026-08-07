import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { Building2, UserCheck, ShieldCheck, Sparkles, Check } from 'lucide-react';

function Register({ onAuthSuccess, onNavigateToLogin }) {
  const [role, setRole] = useState('BUSINESS_OWNER'); // BUSINESS_OWNER or CUSTOMER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [allowPlacesAccess, setAllowPlacesAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role,
        allowPlacesAccess: role === 'BUSINESS_OWNER' ? allowPlacesAccess : false
      });
      const { token, user } = response.data;
      
      // Save credentials locally
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configure default axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      onAuthSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/google', {
        idToken: credentialResponse.credential,
        role,
        allowPlacesAccess: role === 'BUSINESS_OWNER' ? allowPlacesAccess : false
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      onAuthSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
  };

  return (
    <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc' }}>
      
      {/* Header & Logo */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img 
          src="/logo.png" 
          alt="ManaCity Logo" 
          style={{ width: '100%', maxWidth: '180px', marginBottom: '0.75rem' }} 
        />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
          Create Your <span className="gradient-text">ManaCity</span> Account
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Join the local business directory & aggregator platform
        </p>
      </div>

      {/* Role Selection Switcher */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.35rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => setRole('BUSINESS_OWNER')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.6rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: role === 'BUSINESS_OWNER' ? '#6366f1' : 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Building2 size={16} /> Admin (Business Owner)
        </button>

        <button
          type="button"
          onClick={() => setRole('CUSTOMER')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.6rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: role === 'CUSTOMER' ? '#6366f1' : 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <UserCheck size={16} /> User (Customer)
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          color: '#ef4444',
          padding: '0.75rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1' }}>Full Name *</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === 'BUSINESS_OWNER' ? 'Business Owner Name' : 'Customer Name'}
            required
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1' }}>Email Address *</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@business.com"
            required
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1' }}>Password *</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Business Owner Specific: Google Places API Permission Switch */}
        {role === 'BUSINESS_OWNER' && (
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            padding: '0.85rem',
            textAlign: 'left'
          }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allowPlacesAccess}
                onChange={(e) => setAllowPlacesAccess(e.target.checked)}
                style={{ marginTop: '0.2rem', accentColor: '#6366f1' }}
              />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={14} /> Allow 1-Click Google Places API Import
                </span>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                  Permits ManaCity to import your Google Place photos, ratings, address, and hours for 2-minute website generation.
                </p>
              </div>
            </label>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '0.5rem', height: '44px', backgroundColor: '#6366f1', fontSize: '0.9rem' }}
        >
          {loading ? 'Creating Account...' : role === 'BUSINESS_OWNER' ? 'Sign Up as Business Admin' : 'Sign Up as Customer'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', gap: '0.5rem' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>or continue with</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          theme="filled_dark"
          shape="rectangular"
          width="360px"
        />
      </div>

      <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
        Already registered?{' '}
        <span 
          onClick={onNavigateToLogin}
          style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
        >
          Sign In Here
        </span>
      </div>
    </div>
  );
}

export default Register;

