import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

function Register({ onAuthSuccess, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
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
      const response = await axios.post('/api/auth/google', { idToken: credentialResponse.credential });
      const { token, user } = response.data;
      
      // Save credentials locally
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configure default axios headers
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
    <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img 
          src="/logo.png" 
          alt="ManaCity Logo" 
          style={{ width: '100%', maxWidth: '200px', marginBottom: '1rem' }} 
        />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Start scaling your business presence</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--accent-error)',
          color: 'var(--accent-error)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>Full Name</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color var(--transition-fast)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>Email Address</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color var(--transition-fast)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color var(--transition-fast)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '0.5rem', height: '46px' }}
        >
          {loading ? 'Creating Account...' : 'Get Started'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.5rem' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)', opacity: 0.3 }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>or</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)', opacity: 0.3 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          theme="filled_dark"
          shape="rectangular"
          width="340px"
        />
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <span 
          onClick={onNavigateToLogin}
          style={{ color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 600 }}
        >
          Sign In
        </span>
      </div>
    </div>
  );
}

export default Register;
