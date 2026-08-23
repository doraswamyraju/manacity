import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  QrCode,
  CheckCircle2,
  Phone,
  MessageSquare,
  TrendingUp,
  Users,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Search,
  Lock,
  UserCheck
} from 'lucide-react';
import Header from '../components/Header';

export default function ListYourBusiness({ onAuthSuccess, onNavigateToLogin, user }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessNameInput, setBusinessNameInput] = useState('');
  const [cityInput, setCityInput] = useState('tirupati');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError('Please fill in all required fields including your 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        phone,
        password,
        role: 'BUSINESS_OWNER',
        businessName: businessNameInput,
        city: cityInput
      });
      const { token, user: authedUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(authedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      onAuthSuccess(authedUser);
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
        role: 'BUSINESS_OWNER'
      });
      const { token, user: authedUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(authedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      onAuthSuccess(authedUser);
    } catch (err) {
      setError(err.response?.data?.error || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      color: '#059669',
      bg: '#ecfdf5',
      title: 'Authentic Verified Badge',
      description: 'Get the official ManaCity Verified Shield badge on your profile to build instant trust with 400% higher customer conversions.'
    },
    {
      icon: Globe,
      color: '#2563eb',
      bg: '#eff6ff',
      title: 'Free Storefront & Website',
      description: 'Get a mobile-optimized business webpage (yourname.manacity.in) complete with product catalog, gallery, map, and WhatsApp ordering.'
    },
    {
      icon: Zap,
      color: '#d97706',
      bg: '#fffbeb',
      title: 'Direct Instant Leads (0% Commission)',
      description: 'Customers connect with you directly via WhatsApp and Phone. No middlemen, no commission fees on sales.'
    },
    {
      icon: Star,
      color: '#7c3aed',
      bg: '#f5f3ff',
      title: 'Auto Google Reviews & QR Standees',
      description: 'Generate print-ready QR code posters for your shop counter to collect 5-star Google Reviews automatically from customers.'
    },
    {
      icon: Search,
      color: '#0284c7',
      bg: '#f0f9ff',
      title: 'Local Area Search Dominance',
      description: 'Rank #1 on ManaCity search when customers in Tirupati, Hyderabad, Vijayawada & Vizag search for your products or services.'
    },
    {
      icon: TrendingUp,
      color: '#ea580c',
      bg: '#fff7ed',
      title: 'Business Analytics & Lead Tracking',
      description: 'Track customer views, enquiry calls, quote requests, and performance metrics in your dedicated Business Admin Console.'
    }
  ];

  const comparisonItems = [
    { feature: 'Direct Customer Calls & WhatsApp', manacity: 'YES (Instant 0% Commission)', traditional: 'No (Masked Numbers / Paid Calls)' },
    { feature: 'Verified Business Shield Badge', manacity: 'YES (Free Verification)', traditional: 'Expensive Premium Upgrade' },
    { feature: 'Free Mobile Storefront Website', manacity: 'YES (subdomain.manacity.in)', traditional: 'Not Provided' },
    { feature: 'Google Review QR Standee Generator', manacity: 'YES (Print-Ready Posters)', traditional: 'Not Provided' },
    { feature: 'Commission Fee per Lead/Sale', manacity: '0% (Zero Commission)', traditional: '15% to 30% Commission' }
  ];

  const faqs = [
    {
      q: 'Is listing my business on ManaCity completely free?',
      a: 'Yes! Basic business listing, profile creation, storefront website, and receiving customer phone calls & WhatsApp messages is 100% free with zero commission.'
    },
    {
      q: 'How do I get the Verified Business Badge?',
      a: 'After signing up, upload your GST number, shop front photo, or business registration document in your Admin Console. Our Super Admin team verifies and activates your shield badge within 24 hours.'
    },
    {
      q: 'How do customers contact my business on ManaCity?',
      a: 'Customers can directly click "Call", "WhatsApp", "Storefront", or "Enquire / Quote" on your listing. All enquiries are sent directly to your mobile phone via SMS and WhatsApp.'
    },
    {
      q: 'Can I edit my products, services, and pricing later?',
      a: 'Absolutely! You get a full Business Admin Console where you can add/edit products, services, photos, operating hours, and locations anytime.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Header Component */}
      <Header user={user} selectedCity={cityInput} onCityChange={setCityInput} />

      {/* 2. Hero Section with Split Feature Banner & Registration Form */}
      <section style={{
        position: 'relative',
        padding: '3.5rem 1.5rem',
        background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.18), transparent 70%), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Hero Value Proposition */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              <Sparkles size={14} color="#38bdf8" /> #1 Local Business Aggregator Platform
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.1rem)', fontWeight: 900, lineHeight: 1.15, color: '#ffffff', marginBottom: '1rem' }}>
              Grow Your Business <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10x Faster</span> with ManaCity
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
              Get verified, build a free storefront website, capture instant direct leads via WhatsApp & Phone, and auto-collect 5-star Google Reviews from local customers across Andhra Pradesh & Telangana.
            </p>

            {/* Platform Stats Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>15,000+</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Active Businesses</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#818cf8' }}>250K+</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Monthly Leads</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399' }}>0%</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Commission Fee</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700 }}>
              <CheckCircle2 size={18} color="#34d399" /> Instant Registration
              <span style={{ color: '#475569' }}>•</span>
              <CheckCircle2 size={18} color="#34d399" /> Free Forever Tier
              <span style={{ color: '#475569' }}>•</span>
              <CheckCircle2 size={18} color="#34d399" /> 100% Direct Leads
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: 'rgba(37, 99, 235, 0.15)', borderRadius: '50%', marginBottom: '0.75rem' }}>
                <Building2 size={24} color="#38bdf8" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                Register Your Business Free
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Join ManaCity in less than 2 minutes
              </p>
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Business / Owner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajugari Ventures"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setBusinessNameInput(e.target.value); }}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="owner@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>10-Digit Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Primary City</label>
                  <select
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none', textTransform: 'capitalize' }}
                  >
                    <option value="tirupati">Tirupati</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="vijayawada">Vijayawada</option>
                    <option value="visakhapatnam">Visakhapatnam</option>
                    <option value="chennai">Chennai</option>
                    <option value="bangalore">Bangalore</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.8rem',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.15s'
                }}
              >
                {loading ? 'Setting up Profile...' : '🚀 Register & Claim Business Profile'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.5rem' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>OR 1-CLICK SIGN UP</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed.')}
                text="signup_with"
                theme="filled_dark"
                shape="rectangular"
                width="340px"
              />
            </div>

            <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
              Already registered?{' '}
              <span
                onClick={onNavigateToLogin}
                style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 800 }}
              >
                Sign In Here
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Platform Features & Benefits Grid */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#0f172a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
              Why Local Businesses Choose <span style={{ color: '#38bdf8' }}>ManaCity</span>
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Everything you need to build online authority, capture high-intent leads, and automate customer reviews in one unified platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {features.map((f, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '46px',
                  height: '46px',
                  backgroundColor: f.bg,
                  borderRadius: '14px',
                  marginBottom: '1.2rem'
                }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.45rem' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. ManaCity vs Traditional Directories Comparison Table */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#1e293b', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>
              How ManaCity Beats Traditional Directories
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Zero commission fees, direct customer contact, and complete control over your business identity.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#0f172a', borderRadius: '16px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#1e293b' }}>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>FEATURE</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.95rem', color: '#38bdf8', fontWeight: 900 }}>🛡️ MANACITY PLATFORM</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.9rem', color: '#64748b' }}>TRADITIONAL DIRECTORIES</th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, i) => (
                  <tr key={i} style={{ borderBottom: i === comparisonItems.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>{item.feature}</td>
                    <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.88rem', fontWeight: 800, color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.05)' }}>
                      <CheckCircle2 size={16} color="#34d399" style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                      {item.manacity}
                    </td>
                    <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>{item.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 5. 3-Step Simple Onboarding Workflow */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#0f172a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
            Get Verified in 3 Simple Steps
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', marginBottom: '3.5rem' }}>
            Start receiving direct customer enquiries in less than 5 minutes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '2rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', margin: '0 auto 1.25rem' }}>1</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>Enter Business Info</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>Search your existing business name or enter details to auto-sync Google Places data.</p>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '2rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#7c3aed', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', margin: '0 auto 1.25rem' }}>2</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>Add Offerings & WhatsApp</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>Add your catalog items, price range, storefront photos, and WhatsApp mobile number.</p>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '2rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#059669', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', margin: '0 auto 1.25rem' }}>3</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>Get Verified & Receive Leads</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>Get your Verified Shield badge and receive direct phone calls and quote requests!</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Frequently Asked Questions (Accordion) */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#1e293b', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ffffff', textAlign: 'center', marginBottom: '2.5rem' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.1rem 1.5rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.2rem', color: '#38bdf8' }}>{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Bottom Action CTA Bar */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center', backgroundColor: '#0f172a', background: 'radial-gradient(circle at 50% 100%, rgba(37, 99, 235, 0.25), transparent 70%)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Expand Your Business in {cityCap}?
          </h2>
          <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '2rem' }}>
            Join 15,000+ local businesses already growing on ManaCity with zero commission fees.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.95rem 2.2rem',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: 900,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)'
            }}
          >
            🚀 Claim & Register Your Business Free
          </button>
        </div>
      </section>

    </div>
  );
}
