import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Tag,
  Zap,
  Globe,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function SubscriptionsTab({ subscriptions = [], theme = 'dark' }) {
  const isDark = theme === 'dark';

  // State for Plan Price Configurations
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [savingPlanKey, setSavingPlanKey] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Default seeded plans if none returned yet from database
  const defaultPlans = [
    {
      planKey: 'FREE',
      title: 'Free Single-Page Microsite',
      description: 'Default free landing microsite generated from Google Profile for all businesses',
      priceInr: 0,
      interval: 'LIFETIME',
      features: ['1 Subdomain (yourname.manacity.in)', 'Basic Modern Theme', 'Catalog Sync', 'Verified Local Badge'],
      isActive: true,
      discountPercentage: 0
    },
    {
      planKey: 'BUILDER_ANNUAL',
      title: 'Smart Website Builder (Annual)',
      description: 'Full modular drag-and-drop page builder with 10+ Headers, 5+ Heroes & Custom Blocks',
      priceInr: 1999,
      interval: 'ANNUAL',
      features: ['All Premium Headers & Hero Layouts', 'Custom CSS & Font Styles', 'Custom Domain Connect (BYOD)', 'Automatic Catalog Sync', 'Priority Lead Notifications'],
      isActive: true,
      discountPercentage: 0
    },
    {
      planKey: 'BUILDER_LIFETIME',
      title: 'Smart Website Builder (Lifetime Deal)',
      description: 'One-time investment for lifetime access to all current and future Super Admin block layouts',
      priceInr: 3999,
      interval: 'LIFETIME',
      features: ['Lifetime Access to All Pro Blocks', 'Unlimited Layout Reordering', 'BYOD + 1-Click Domain Connect', 'Zero Monthly Fees Forever', 'Premium SEO Rich Snippets'],
      isActive: true,
      discountPercentage: 20
    },
    {
      planKey: 'PRO_PLATFORM_ANNUAL',
      title: 'ManaCity Pro All-Inclusive Suite',
      description: 'Complete digital suite including Advanced Builder, LMS Leads CRM, LetsTrack Analytics & WhatsApp Sync',
      priceInr: 7999,
      interval: 'ANNUAL',
      features: ['Smart Modular Website Builder', 'Lead Management & Telemetry CRM', 'Direct WhatsApp & Call Click Tracking', 'Priority Directory Ranking', 'Multi-Location Support'],
      isActive: true,
      discountPercentage: 15
    }
  ];

  useEffect(() => {
    fetchPlanConfigs();
  }, []);

  const fetchPlanConfigs = async () => {
    setLoadingPlans(true);
    try {
      const res = await axios.get('/api/admin/subscription-plans');
      if (res.data?.plans && res.data.plans.length > 0) {
        setPlans(res.data.plans);
      } else {
        setPlans(defaultPlans);
      }
    } catch (err) {
      console.warn('Using default plans:', err.message);
      setPlans(defaultPlans);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handlePriceChange = (planKey, field, value) => {
    setPlans(prev => prev.map(p => {
      if (p.planKey === planKey) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleFeatureChange = (planKey, index, value) => {
    setPlans(prev => prev.map(p => {
      if (p.planKey === planKey) {
        const updatedFeatures = [...(p.features || [])];
        updatedFeatures[index] = value;
        return { ...p, features: updatedFeatures };
      }
      return p;
    }));
  };

  const handleAddFeature = (planKey) => {
    setPlans(prev => prev.map(p => {
      if (p.planKey === planKey) {
        return { ...p, features: [...(p.features || []), 'New Pro Feature'] };
      }
      return p;
    }));
  };

  const handleRemoveFeature = (planKey, index) => {
    setPlans(prev => prev.map(p => {
      if (p.planKey === planKey) {
        const updatedFeatures = [...(p.features || [])].filter((_, i) => i !== index);
        return { ...p, features: updatedFeatures };
      }
      return p;
    }));
  };

  const handleSavePlan = async (plan) => {
    setSavingPlanKey(plan.planKey);
    setFeedbackMsg(null);
    try {
      await axios.post('/api/admin/subscription-plans', {
        planKey: plan.planKey,
        title: plan.title,
        description: plan.description,
        priceInr: parseFloat(plan.priceInr) || 0,
        interval: plan.interval,
        features: plan.features,
        isActive: plan.isActive,
        discountPercentage: parseFloat(plan.discountPercentage) || 0
      });
      setFeedbackMsg({ type: 'success', text: `Saved "${plan.title}" pricing successfully!` });
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save plan pricing.' });
    } finally {
      setSavingPlanKey(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Top Section: Dedicated Subscription Pricing & Add-on Costs Control */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#6366f1', color: '#fff', display: 'flex' }}>
                <CreditCard size={20} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                Platform Subscription & Builder Add-on Pricing
              </h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: isDark ? '#94a3b8' : '#64748b', margin: '0.35rem 0 0' }}>
              Configure live prices for the Website Builder Add-on, Platform Pro tiers, and custom domain margins. Changes reflect instantly in business checkout portals.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPlanConfigs}
            disabled={loadingPlans}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
              color: isDark ? '#cbd5e1' : '#334155',
              border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Refresh Prices
          </button>
        </div>

        {feedbackMsg && (
          <div style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.86rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: feedbackMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: feedbackMsg.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${feedbackMsg.type === 'success' ? '#10b981' : '#ef4444'}`
          }}>
            {feedbackMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {feedbackMsg.text}
          </div>
        )}

        {/* Plan Pricing Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
          {plans.map((plan) => {
            const isSaving = savingPlanKey === plan.planKey;
            const isBuilderPlan = plan.planKey.includes('BUILDER');

            return (
              <div
                key={plan.planKey}
                style={{
                  backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                  border: isBuilderPlan ? '2px solid #6366f1' : `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {isBuilderPlan && (
                  <div style={{
                    position: 'absolute',
                    top: '-11px',
                    right: '1.25rem',
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '12px',
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
                  }}>
                    WEBSITE BUILDER ADD-ON
                  </div>
                )}

                <div>
                  {/* Plan Header */}
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      type="text"
                      value={plan.title}
                      onChange={(e) => handlePriceChange(plan.planKey, 'title', e.target.value)}
                      style={{
                        width: '100%',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: isDark ? '#ffffff' : '#0f172a',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: `1px dashed ${isDark ? '#475569' : '#cbd5e1'}`,
                        padding: '0.2rem 0',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <textarea
                      value={plan.description || ''}
                      onChange={(e) => handlePriceChange(plan.planKey, 'description', e.target.value)}
                      placeholder="Plan description..."
                      rows={2}
                      style={{
                        width: '100%',
                        fontSize: '0.78rem',
                        color: isDark ? '#94a3b8' : '#64748b',
                        backgroundColor: 'transparent',
                        border: 'none',
                        resize: 'none',
                        outline: 'none',
                        marginTop: '0.35rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Price & Billing Cycle Input */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    marginBottom: '1.25rem'
                  }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#6366f1' }}>₹</span>
                    <input
                      type="number"
                      value={plan.priceInr}
                      onChange={(e) => handlePriceChange(plan.planKey, 'priceInr', e.target.value)}
                      placeholder="0"
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        color: isDark ? '#f8fafc' : '#0f172a',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '110px'
                      }}
                    />

                    <select
                      value={plan.interval}
                      onChange={(e) => handlePriceChange(plan.planKey, 'interval', e.target.value)}
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                        color: isDark ? '#cbd5e1' : '#334155',
                        border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                        borderRadius: '6px',
                        padding: '0.35rem 0.5rem',
                        outline: 'none'
                      }}
                    >
                      <option value="ANNUAL">/ year</option>
                      <option value="MONTHLY">/ month</option>
                      <option value="LIFETIME">One-Time (Lifetime)</option>
                    </select>
                  </div>

                  {/* Feature Checklist */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b' }}>
                        Included Features
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddFeature(plan.planKey)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6366f1',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        <Plus size={12} /> Add Feature
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {(plan.features || []).map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle size={13} color="#10b981" />
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => handleFeatureChange(plan.planKey, fIdx, e.target.value)}
                            style={{
                              flex: 1,
                              fontSize: '0.8rem',
                              color: isDark ? '#e2e8f0' : '#334155',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderBottom: `1px dotted ${isDark ? '#334155' : '#cbd5e1'}`,
                              outline: 'none',
                              padding: '0.1rem 0'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(plan.planKey, fIdx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save CTA */}
                <button
                  type="button"
                  onClick={() => handleSavePlan(plan)}
                  disabled={isSaving}
                  style={{
                    backgroundColor: isBuilderPlan ? '#6366f1' : (isDark ? '#334155' : '#e2e8f0'),
                    color: isBuilderPlan ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.65rem 1rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s'
                  }}
                >
                  <Save size={14} />
                  <span>{isSaving ? 'Saving...' : 'Save Plan Pricing'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Bottom Section: Live Active Subscriptions & Business Upgrades Log */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
              Live Business Subscription Records ({subscriptions.length})
            </h3>
            <p style={{ fontSize: '0.84rem', color: isDark ? '#94a3b8' : '#64748b', margin: '0.25rem 0 0' }}>
              Real-time audit log of businesses on free vs paid builder tiers.
            </p>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
            <CreditCard size={36} color="#64748b" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ fontSize: '0.9rem', margin: 0 }}>No business subscriptions recorded yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {subscriptions.map(sub => (
              <div
                key={sub.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: isDark ? '#ffffff' : '#0f172a' }}>
                      {sub.businessGroup?.name || 'Local Business'}
                    </strong>
                    {sub.hasAdvancedBuilder && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#6366f1', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                        PRO BUILDER ACTIVE
                      </span>
                    )}
                  </div>
                  <span style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem' }}>
                    {sub.businessGroup?.email || 'No email provided'}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    color: sub.tier === 'FREE' ? '#94a3b8' : '#10b981',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    {sub.tier}
                  </span>
                  <span style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.74rem', display: 'block', marginTop: '0.15rem' }}>
                    Status: {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
