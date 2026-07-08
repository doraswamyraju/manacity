import React, { useState } from 'react';
import axios from 'axios';

function DeleteAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password to verify your identity.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/delete-account', { email, password });
      setMessage(response.data.message || 'Your account and all associated data have been permanently deleted.');
      setEmail('');
      setPassword('');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Could not delete account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="ManaCity Logo" style={{ maxWidth: '180px', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Delete Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Permanent Removal Request</p>
        </div>

        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid var(--accent-error)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          fontSize: '0.9rem'
        }}>
          <strong style={{ color: 'var(--accent-error)', display: 'block', marginBottom: '0.25rem' }}>Warning:</strong>
          Deleting your account is permanent and cannot be undone. This will permanently erase:
          <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
            <li>Your account profile & subscription state</li>
            <li>All registered business groups & locations</li>
            <li>Connected Google OAuth tokens & cached reviews</li>
            <li>Generated public websites & page configurations</li>
          </ul>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--accent-error)',
            color: 'var(--accent-error)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        {message ? (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            color: '#10b981',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.95rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            {message}
            <div style={{ marginTop: '1rem' }}>
              <a href="/" className="btn btn-secondary" style={{ display: 'inline-block', width: 'auto' }}>Go to Home</a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="delete-email" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
              <input
                id="delete-email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label htmlFor="delete-password" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Password</label>
              <input
                id="delete-password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to confirm"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                backgroundColor: 'var(--accent-error)',
                borderColor: 'var(--accent-error)',
                color: '#fff',
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Processing Deletion...' : 'Permanently Delete Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default DeleteAccount;
