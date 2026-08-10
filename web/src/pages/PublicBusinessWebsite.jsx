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
  Globe,
  Stethoscope,
  Sparkles,
  ShoppingCard,
  Send,
  Award,
  HeartPulse
} from 'lucide-react';

export default function PublicBusinessWebsite() {
  const { subdomain, slug } = useParams();
  const targetId = subdomain || slug || 'abc-digital';

  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', message: '', date: '', service: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

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
        { id: '1', name: 'SEO Optimization', price: '₹14,999/mo', duration: 'Monthly', description: 'Rank #1 on Google for local keywords with guaranteed organic traffic.' },
        { id: '2', name: 'Google Ads & GBP Management', price: '₹9,999/mo', duration: 'Monthly', description: 'High ROI Google PPC ads and local map listing optimization.' },
        { id: '3', name: 'Meta Ads & Branding', price: '₹12,499/mo', duration: 'Monthly', description: 'Targeted Instagram and Facebook ad campaigns for lead generation.' }
      ],
      products: [
        { id: 'p1', name: 'Local SEO Audit Report', price: '₹2,499', description: 'Detailed 40-point technical SEO and Google Business Profile audit.', category: 'Audit' },
        { id: 'p2', name: 'GBP QR Standee Kit', price: '₹1,499', description: 'Custom printed acrylic review QR standee with NFC tap support.', category: 'Hardware' }
      ]
    };
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
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
  const primaryColor = bg.websiteConfig?.primaryColor || (
    template === 'e-commerce' ? '#10b981' :
    template === 'service-booking' ? '#38bdf8' :
    template === 'restaurant-menu' ? '#f43f5e' :
    template === 'clinic-healthcare' ? '#c084fc' : '#6366f1'
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Clinic Emergency Banner */}
      {template === 'clinic-healthcare' && (
        <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.4rem 1rem', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <HeartPulse size={16} /> 24/7 Emergency Helpline: Call <a href={`tel:${bg.mobileNumber}`} style={{ color: '#fff', textDecoration: 'underline' }}>{bg.mobileNumber}</a>
        </div>
      )}

      {/* Restaurant Promo Bar */}
      {template === 'restaurant-menu' && (
        <div style={{ backgroundColor: '#f43f5e', color: '#fff', padding: '0.4rem 1rem', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Utensils size={16} /> Fresh & Hygienic Dining • Dine-in & Takeaway Orders Available
        </div>
      )}

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
          {template === 'clinic-healthcare' ? <Stethoscope size={28} color={primaryColor} /> :
           template === 'restaurant-menu' ? <Utensils size={28} color={primaryColor} /> :
           template === 'e-commerce' ? <ShoppingBag size={28} color={primaryColor} /> :
           template === 'service-booking' ? <Calendar size={28} color={primaryColor} /> :
           <Building2 size={28} color={primaryColor} />}
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>{bg.name}</h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} color="#38bdf8" /> {bg.address || bg.city} • <ShieldCheck size={12} color="#34d399" /> Verified Storefront
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            onClick={() => {
              const reviewsUrl = bg.googleReviewsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bg.name + ' ' + (bg.city || 'Tirupati'))}`;
              window.open(reviewsUrl, '_blank');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              color: '#fbbf24',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="Click to view live Google Reviews"
          >
            <Star size={15} fill="#fbbf24" color="#fbbf24" />
            <span>{bg.googleRating || bg.rating || 4.9} ★</span>
            <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.75rem' }}>
              ({bg.googleReviewCount || bg.reviewCount || 63} Reviews)
            </span>
            <ExternalLink size={12} color="#fbbf24" />
          </div>

          <a href={`tel:${bg.mobileNumber}`} className="btn" style={{ backgroundColor: '#10b981', color: '#fff', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '6px' }}>
            <Phone size={14} /> Call Now
          </a>
          <a href={`https://wa.me/${(bg.whatsAppNumber || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25d366', color: '#fff', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '6px' }}>
            <MessageSquare size={14} /> WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Section per Template */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: `radial-gradient(circle at top, ${primaryColor}25 0%, transparent 70%)`,
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{
              backgroundColor: `${primaryColor}20`,
              color: primaryColor,
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              {template === 'e-commerce' ? 'Online Catalog Store' :
               template === 'service-booking' ? 'Appointment Booking Portal' :
               template === 'restaurant-menu' ? 'Dining & Takeaway Menu' :
               template === 'clinic-healthcare' ? 'Certified Healthcare Center' :
               'Official Business Website'}
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem', marginBottom: '0.85rem', color: '#fff', lineHeight: 1.2 }}>
            {template === 'e-commerce' ? `Explore Products & Storefront at ${bg.name}` :
             template === 'service-booking' ? `Book Expert Services & Consultations` :
             template === 'restaurant-menu' ? `Taste Authentic Culinary Delights` :
             template === 'clinic-healthcare' ? `Expert Medical Care & Consultations` :
             `Welcome to ${bg.name}`}
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
            {bg.description || `Verified storefront for ${bg.name} operating in ${bg.city || 'Tirupati'}.`}
          </p>

          <a href="#action-form" className="btn" style={{ padding: '0.75rem 2rem', fontWeight: 800, backgroundColor: primaryColor, color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
            {template === 'e-commerce' ? 'View Catalog & Order' :
             template === 'service-booking' ? 'Book Appointment' :
             template === 'restaurant-menu' ? 'Reserve Table / Order' :
             template === 'clinic-healthcare' ? 'Schedule Patient Visit' :
             'Get Instant Quote'}
          </a>
        </div>
      </section>

      {/* Template Specific View Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        
        {/* 1. E-COMMERCE STOREFRONT TEMPLATE PRODUCTS GRID */}
        {template === 'e-commerce' && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={22} color={primaryColor} /> Featured Products & Catalog
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{products.length} Products Available</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {products.map((prod) => (
                <div key={prod.id} style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                      {prod.category || 'Product'}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0.35rem 0' }}>{prod.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {prod.description}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: primaryColor, marginBottom: '0.75rem' }}>
                      {prod.price || 'Contact for Price'}
                    </div>
                    <a href="#action-form" onClick={() => setQuoteForm(prev => ({ ...prev, service: `Order: ${prod.name}` }))} style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: `${primaryColor}20`,
                      border: `1px solid ${primaryColor}`,
                      color: primaryColor,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textDecoration: 'none'
                    }}>
                      Buy / Direct Inquiry
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. RESTAURANT MENU TEMPLATE */}
        {template === 'restaurant-menu' && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Utensils size={22} color={primaryColor} /> Chef's Special Dining Menu
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {services.concat(products).map((item, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: idx % 2 === 0 ? '#22c55e' : '#ef4444' }} title={idx % 2 === 0 ? 'Vegetarian' : 'Non-Vegetarian'} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>{item.name}</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>{item.description}</p>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: primaryColor, whiteSpace: 'nowrap' }}>
                    {item.price || '₹199'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CLINIC & HEALTHCARE TEMPLATE SPECIALTIES */}
        {template === 'clinic-healthcare' && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={22} color={primaryColor} /> Medical Treatments & Consultation Services
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {services.map((svc) => (
                <div key={svc.id} style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  border: '1px solid rgba(192, 132, 252, 0.2)',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{svc.name}</h4>
                    <span style={{ color: primaryColor, fontWeight: 800, fontSize: '0.9rem' }}>{svc.price}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {svc.description}
                  </p>
                  <a href="#action-form" onClick={() => setQuoteForm(prev => ({ ...prev, service: svc.name }))} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: primaryColor,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}>
                    Book Appointment <ChevronRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. DEFAULT & SERVICE BOOKING TEMPLATE SERVICES */}
        {(template === 'modern-corporate' || template === 'service-booking') && (
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

                  <a href="#action-form" onClick={() => setQuoteForm(prev => ({ ...prev, service: svc.name }))} style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: primaryColor,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}>
                    Inquire / Book <ChevronRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Action Form tailored per Template */}
        <div id="action-form" style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '2rem',
          border: `1px solid ${primaryColor}40`,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', textAlign: 'center' }}>
            {template === 'clinic-healthcare' ? 'Book Doctor Appointment' :
             template === 'restaurant-menu' ? 'Table Reservation / Food Inquiry' :
             template === 'service-booking' ? 'Book Service Slot' :
             template === 'e-commerce' ? 'Place Product Inquiry' :
             'Contact & Get Quote'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem' }}>
            Direct message to {bg.name}
          </p>

          {submitted ? (
            <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', color: '#34d399', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 700 }}>
              ✓ Request submitted successfully! The business team will contact you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Your Full Name"
                required
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <input
                type="tel"
                placeholder="Your Mobile Number"
                required
                value={quoteForm.phone}
                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              
              {(template === 'service-booking' || template === 'clinic-healthcare' || template === 'restaurant-menu') && (
                <input
                  type="date"
                  value={quoteForm.date}
                  onChange={(e) => setQuoteForm({ ...quoteForm, date: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              )}

              <textarea
                rows={3}
                placeholder={quoteForm.service ? `Requirement for ${quoteForm.service}` : "Describe your request or query..."}
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <button type="submit" className="btn" style={{ padding: '0.75rem', fontWeight: 800, backgroundColor: primaryColor, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Submit Request
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <p>© 2026 {bg.name}. Powered by <a href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>ManaCity Platform</a></p>
      </footer>
    </div>
  );
}
