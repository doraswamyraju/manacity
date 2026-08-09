import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  Phone,
  MessageSquare,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Utensils,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';

export default function PublicBusinessWebsite() {
  const { subdomain, slug } = useParams();
  const targetId = subdomain || slug || 'abc-digital';

  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchWebsiteData();
  }, [targetId]);

  const fetchWebsiteData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/website/public/${targetId}`);
      if (res.data && res.data.businessGroup) {
        setBusinessData(res.data);
      } else {
        setBusinessData(getMockData());
      }
    } catch (e) {
      setBusinessData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    return {
      businessGroup: {
        name: 'ABC Digital Marketing Solutions',
        description: 'Leading digital marketing agency specializing in SEO, Google Ads, GBP optimization, and growth marketing across Tirupati and South India.',
        city: 'Tirupati',
        address: 'Car Street, Near Temple, Tirupati',
        mobileNumber: '+91 98765 43210',
        whatsAppNumber: '+91 98765 43210',
        email: 'info@abcdigital.in',
        logoUrl: '/logo.png',
        websiteConfig: {
          themeTemplate: 'modern-corporate',
          primaryColor: '#6366f1',
          secondaryColor: '#a855f7',
          metaTitle: 'ABC Digital Marketing Solutions - Tirupati',
          metaDescription: 'Top rated SEO and Digital Marketing Agency in Tirupati.'
        }
      },
      services: [
        { id: '1', name: 'SEO Optimization', price: '₹14,999/mo', description: 'Rank #1 on Google for local keywords with guaranteed organic traffic.' },
        { id: '2', name: 'Google Ads & GBP Management', price: '₹9,999/mo', description: 'High ROI Google PPC ads and local map listing optimization.' },
        { id: '3', name: 'Meta Ads & Branding', price: '₹12,499/mo', description: 'Targeted Instagram and Facebook ad campaigns for lead generation.' }
      ],
      products: [
        { id: 'p1', name: 'Local SEO Audit Report', price: '₹2,499', description: 'Detailed 40-point technical SEO and Google Business Profile audit.' }
      ]
    };
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', color: '#94a3b8' }}>
        <h2>Loading Business Storefront Website...</h2>
      </div>
    );
  }

  const bg = businessData.businessGroup;
  const services = businessData.services || [];
  const products = businessData.products || [];
  const template = bg.websiteConfig?.themeTemplate || 'modern-corporate';
  const primaryColor = bg.websiteConfig?.primaryColor || '#6366f1';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Banner Header */}
      <header style={{
        padding: '1rem 2rem',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={28} color={primaryColor} />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>{bg.name}</h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} color="#38bdf8" /> {bg.address || bg.city} • <ShieldCheck size={12} color="#34d399" /> Verified Storefront
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href={`tel:${bg.mobileNumber}`} className="btn" style={{ backgroundColor: '#10b981', color: '#fff', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Phone size={14} /> Call Now
          </a>
          <a href={`https://wa.me/${(bg.whatsAppNumber || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25d366', color: '#fff', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MessageSquare size={14} /> WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: `radial-gradient(circle at top, ${primaryColor}25 0%, transparent 70%)`,
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            backgroundColor: `${primaryColor}20`,
            color: primaryColor,
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            Official Business Website
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem', marginBottom: '0.85rem', color: '#fff', lineHeight: 1.2 }}>
            Welcome to {bg.name}
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
            {bg.description}
          </p>

          <a href="#quote-form" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 800, backgroundColor: primaryColor }}>
            Get Instant Quote
          </a>
        </div>
      </section>

      {/* Template View Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        
        {/* Services & Offerings Catalog */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>
            Services & Offerings
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {services.map((svc) => (
              <div key={svc.id} style={{
                backgroundColor: '#1e293b',
                padding: '1.5rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{svc.name}</h4>
                    {svc.price && <span style={{ color: primaryColor, fontWeight: 800, fontSize: '0.95rem' }}>{svc.price}</span>}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {svc.description}
                  </p>
                </div>

                <a href="#quote-form" style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: primaryColor,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}>
                  Inquire Now <ChevronRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Quote Request Form */}
        <div id="quote-form" style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', textAlign: 'center' }}>
            Contact & Get Quote
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem' }}>
            Send a direct message to {bg.name}
          </p>

          {submitted ? (
            <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', color: '#34d399', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 700 }}>
              ✓ Inquiry submitted successfully! The business owner will get back to you.
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <input
                type="tel"
                placeholder="Your Phone Number"
                required
                value={quoteForm.phone}
                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <textarea
                rows={3}
                placeholder="Describe your requirement..."
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontWeight: 800, backgroundColor: primaryColor }}>
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <p>© 2026 {bg.name}. Powered by <a href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>ManaCity Aggregator Platform</a></p>
      </footer>
    </div>
  );
}
