import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Check, CreditCard, ShieldAlert } from 'lucide-react';

function Billing({ onBack }) {
  const [subscription, setSubscription] = useState(null);
  const [tiers, setTiers] = useState({});
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/subscription');
      setSubscription(response.data.subscription);
      setTiers(response.data.availableTiers);
    } catch (err) {
      setError('Could not load billing details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierName) => {
    setError('');
    setUpgrading(true);
    try {
      const response = await axios.post('/api/subscription/checkout', { tier: tierName });
      if (response.data.checkoutUrl) {
        // Redirect to mock Stripe payment checkout page
        window.location.href = response.data.checkoutUrl;
      }
    } catch (err) {
      setError('Upgrade checkouts are temporarily offline.');
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', width: '100%', color: 'var(--text-secondary)' }}>
        <p>Loading billing configuration...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', width: '100%', textAlign: 'left' }}>
      <button 
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '0.95rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--accent-error)',
          color: 'var(--accent-error)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {/* Current Active Plan Overview */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, uppercase: 'true' }}>CURRENT ACTIVE PLAN</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
            ManaCity <span className="gradient-text">{subscription?.tier}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Locations limit: <strong>{subscription?.locationLimit}</strong> branches | Website limit: <strong>{subscription?.websiteLimit}</strong> builders
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)', fontWeight: 600 }}>
            <Check size={18} /> Active Account
          </div>
          {subscription?.expiresAt && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Renews: {new Date(subscription.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>Available Subscription Plans</h3>
      
      {/* Plans Pricing Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {Object.keys(tiers).map(tierName => {
          const tier = tiers[tierName];
          const isActive = subscription?.tier === tierName;

          return (
            <div 
              key={tierName} 
              className="glass-card" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isActive ? '2px solid var(--accent-success)' : '1px solid var(--glass-border)',
                transform: isActive ? 'scale(1.02)' : 'none',
                position: 'relative'
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '1.5rem',
                  backgroundColor: 'var(--accent-success)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  CURRENT PLAN
                </span>
              )}

              <div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{tierName}</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>${tier.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} style={{ color: 'var(--accent-success)' }} /> Up to {tier.locationLimit} Location{tier.locationLimit > 1 ? 's' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} style={{ color: 'var(--accent-success)' }} /> Up to {tier.websiteLimit} Generated Website{tier.websiteLimit > 1 ? 's' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} style={{ color: 'var(--accent-success)' }} /> Gamified Tasks Engine
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} style={{ color: 'var(--accent-success)' }} /> Review request campaigns
                  </span>
                </div>
              </div>

              <button 
                className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                disabled={isActive || upgrading}
                onClick={() => handleUpgrade(tierName)}
                style={{ width: '100%', height: '42px' }}
              >
                {isActive ? 'Current Active' : upgrading ? 'Redirecting...' : 'Upgrade Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Billing;
