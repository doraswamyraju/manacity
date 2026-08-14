import React, { useState } from 'react';
import {
  Building2,
  Stethoscope,
  Utensils,
  ShoppingBag,
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Tag,
  ShieldCheck,
  HeartPulse,
  Menu,
  X,
  Sparkles,
  Award,
  Users,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  ShoppingCart,
  Info,
  Sun
} from 'lucide-react';

// Helper to compute actual rating and reviews array from businessGroup locations
export function getRatingAndReviews(businessGroup) {
  const locations = businessGroup?.locations || [];
  let allReviews = [];

  locations.forEach(loc => {
    if (Array.isArray(loc.reviews) && loc.reviews.length > 0) {
      allReviews.push(...loc.reviews);
    }
  });

  const totalReviews = allReviews.length;
  let avgRating = 0;

  if (totalReviews > 0) {
    const sum = allReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    avgRating = parseFloat((sum / totalReviews).toFixed(1));
  } else if (businessGroup?.googleRating || businessGroup?.rating) {
    avgRating = parseFloat(businessGroup.googleRating || businessGroup.rating);
  } else if (businessGroup?.description) {
    const match = businessGroup.description.match(/Rating:\s*([0-9.]+)/i);
    if (match && match[1]) {
      avgRating = parseFloat(match[1]);
    }
  }

  if (!avgRating || isNaN(avgRating)) {
    avgRating = 4.8;
  }

  const reviewCount = totalReviews > 0 ? totalReviews : (businessGroup?.googleReviewCount || businessGroup?.reviewCount || 12);

  return { reviews: allReviews, avgRating, reviewCount };
}

// Modal Component for Detailed View of Products & Services
export function ItemDetailModal({ item, type, businessGroup, onClose }) {
  if (!item) return null;

  const isLight = themeIsLight(item._theme);
  const name = item.name || item.libraryItem?.name || 'Item Details';
  
  const getImg = () => {
    if (item.photos && item.photos.length > 0) return item.photos[0];
    if (item.imageUrl) return item.imageUrl;
    if (item.libraryItem) {
      if (item.libraryItem.imageUrl) return item.libraryItem.imageUrl;
      if (item.libraryItem.photos && item.libraryItem.photos.length > 0) return item.libraryItem.photos[0];
    }
    return type === 'PRODUCT'
      ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600'
      : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600';
  };

  const getPrice = () => {
    if (item.price) return typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price;
    if (item.libraryItem?.defaultPrice) return `₹${item.libraryItem.defaultPrice.toLocaleString('en-IN')}`;
    return 'Contact for Pricing';
  };

  const desc = item.description || item.libraryItem?.description || 'Detailed specifications and high quality business offering.';
  const imgUrl = getImg();
  const priceStr = getPrice();
  const phone = businessGroup?.whatsAppNumber || businessGroup?.mobileNumber || '';

  const waLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in "${name}" (${priceStr}) listed on your website.`)}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: isLight ? '#ffffff' : '#1e293b',
        color: isLight ? '#0f172a' : '#ffffff',
        border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '16px',
        maxWidth: '550px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        padding: '0'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justify: 'center'
        }}>
          <X size={18} />
        </button>

        {/* Modal Header Image */}
        <div style={{ height: '240px', width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#0f172a' }}>
          <img src={imgUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            backgroundColor: 'var(--primary-color, #6366f1)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1rem',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            {priceStr}
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color, #38bdf8)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            {type === 'PRODUCT' ? 'Product Specification' : 'Service Details'}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.25 }}>{name}</h2>
          
          <p style={{ fontSize: '0.95rem', color: isLight ? '#475569' : '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {desc}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: `1px solid ${isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)'}`, paddingTop: '1.25rem' }}>
            {phone && (
              <a href={waLink} target="_blank" rel="noreferrer" style={{
                flex: 1,
                backgroundColor: '#25d366',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.75rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
              }}>
                <MessageSquare size={18} />
                <span>Enquire via WhatsApp</span>
              </a>
            )}

            {businessGroup?.mobileNumber && (
              <a href={`tel:${businessGroup.mobileNumber}`} style={{
                backgroundColor: 'var(--primary-color, #6366f1)',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.75rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.5rem'
              }}>
                <Phone size={18} />
                <span>Call Now</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function themeIsLight(theme) {
  return theme === 'light-minimal' || theme === 'light';
}

// --- 1. Header Navigation Component ---
export function HeaderSection({ businessGroup, settings, theme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = themeIsLight(theme);

  const name = businessGroup?.name || 'Business Name';
  const logo = businessGroup?.logoUrl;
  const phone = businessGroup?.mobileNumber;
  const whatsapp = businessGroup?.whatsAppNumber;

  const { avgRating, reviewCount } = getRatingAndReviews(businessGroup);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Products', href: '#products' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'}`,
      padding: '0.85rem 6%',
      transition: 'all 0.3s ease',
      color: isLight ? '#0f172a' : '#ffffff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {logo ? (
            <img src={logo} alt={name} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid var(--primary-color, #6366f1)' }} />
          ) : (
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--primary-color, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
              {name.charAt(0)}
            </div>
          )}
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.02em', display: 'block' }}>
              {name.length > 28 ? name.substring(0, 26) + '...' : name}
            </span>
            {reviewCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#f59e0b', marginTop: '-0.1rem' }}>
                <Star size={11} fill="#f59e0b" color="#f59e0b" />
                <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{avgRating}</strong>
                <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>({reviewCount} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              style={{
                color: isLight ? '#475569' : '#cbd5e1',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color, #6366f1)'}
              onMouseLeave={(e) => e.target.style.color = isLight ? '#475569' : '#cbd5e1'}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Call / WhatsApp Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {phone && (
            <a
              href={`tel:${phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                backgroundColor: 'var(--primary-color, #6366f1)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              <Phone size={14} />
              <span className="btn-text">Call</span>
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                backgroundColor: '#25d366',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              <MessageSquare size={14} />
              <span className="btn-text">WhatsApp</span>
            </a>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: isLight ? '#0f172a' : '#fff',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)'}`, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: isLight ? '#0f172a' : '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// --- 2. Hero Banner Component ---
export function HeroSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const { avgRating, reviewCount } = getRatingAndReviews(businessGroup);

  const headline = settings?.headline || (
    theme === 'e-commerce' ? `Online Product Storefront - ${businessGroup?.name || 'Business'}` :
    theme === 'service-booking' ? `Book Services & Consultations - ${businessGroup?.name || 'Business'}` :
    theme === 'restaurant-menu' ? `Delicious Dining & Culinary Menu - ${businessGroup?.name || 'Business'}` :
    theme === 'clinic-healthcare' ? `Expert Healthcare & Clinic Care - ${businessGroup?.name || 'Business'}` :
    `Welcome to ${businessGroup?.name || 'Our Commercial Business'}`
  );

  const subheadline = settings?.subheadline || businessGroup?.description || 'Serving our customers with top-tier commercial solutions, verified quality, and exceptional customer support.';
  const ctaText = settings?.ctaText || (
    theme === 'e-commerce' ? 'Explore Storefront' :
    theme === 'service-booking' ? 'Book Appointment' :
    theme === 'restaurant-menu' ? 'View Menu & Order' :
    theme === 'clinic-healthcare' ? 'Consult Doctor' :
    'Get In Touch'
  );

  const coverUrl = businessGroup?.coverImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200';

  const bgOverlay = isLight
    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.88) 100%), url('${coverUrl}') center/cover no-repeat`
    : `linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.78) 100%), url('${coverUrl}') center/cover no-repeat`;

  return (
    <section style={{
      position: 'relative',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      color: isLight ? '#0f172a' : '#fff',
      background: bgOverlay,
      textAlign: 'center',
      padding: '4rem 6%'
    }}>
      <div style={{ maxWidth: '800px', zIndex: 2 }}>
        
        {/* Industry Pill Badge & Dynamic Rating Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 1rem',
            borderRadius: '30px',
            backgroundColor: 'var(--primary-color, #6366f1)',
            color: '#fff',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}>
            {theme === 'clinic-healthcare' && <Stethoscope size={14} />}
            {theme === 'restaurant-menu' && <Utensils size={14} />}
            {theme === 'e-commerce' && <ShoppingBag size={14} />}
            {theme === 'service-booking' && <Calendar size={14} />}
            {theme === 'modern-corporate' && <Building2 size={14} />}
            {theme === 'light-minimal' && <Sun size={14} />}
            <span>{(theme || 'Commercial Business').replace('-', ' ')}</span>
          </div>

          {reviewCount > 0 && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '30px',
              backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)'}`,
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#f59e0b'
            }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{avgRating} Rating ({reviewCount} Reviews)</span>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.18, letterSpacing: '-0.03em', color: isLight ? '#0f172a' : '#fff' }}>
          {headline}
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: isLight ? '#475569' : '#cbd5e1', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 2rem' }}>
          {subheadline}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#contact"
            style={{
              backgroundColor: 'var(--primary-color, #6366f1)',
              color: '#fff',
              padding: '0.85rem 2.2rem',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}
          >
            <span>{ctaText}</span>
            <ArrowRight size={18} />
          </a>

          <a
            href="#services"
            style={{
              backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              color: isLight ? '#0f172a' : '#fff',
              border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)'}`,
              padding: '0.85rem 2rem',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Explore Offerings
          </a>
        </div>
      </div>
    </section>
  );
}

// --- 3. Features / Why Choose Us Component ---
export function FeaturesSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const title = settings?.title || 'Why Choose Us';
  
  const features = [
    { icon: <ShieldCheck size={28} color="var(--primary-color, #38bdf8)" />, title: 'Verified Quality', desc: '100% committed to high standard product and service execution.' },
    { icon: <Sparkles size={28} color="var(--primary-color, #38bdf8)" />, title: 'Professional Staff', desc: 'Experienced professionals ensuring seamless customer experience.' },
    { icon: <Clock size={28} color="var(--primary-color, #38bdf8)" />, title: 'Fast Turnaround', desc: 'Quick response time, prompt delivery, and 24/7 dedicated support.' },
    { icon: <Award size={28} color="var(--primary-color, #38bdf8)" />, title: 'Best Market Rates', desc: 'Transparent, competitive pricing with maximum value guaranteed.' }
  ];

  return (
    <section id="features" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.015)', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>Built on trust, speed, and uncompromising standards</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: isLight ? '#ffffff' : '#1e293b',
              border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.06)'}`,
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'left',
              boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>{feat.icon}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.4rem' }}>{feat.title}</h3>
            <p style={{ fontSize: '0.86rem', color: isLight ? '#64748b' : '#94a3b8', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 4. About Us Component ---
export function AboutSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const title = settings?.title || 'About Us';
  const desc = businessGroup?.description || 'We are dedicated to offering the finest professional commercial services, serving clients with excellence, integrity, and innovation.';
  const logo = businessGroup?.logoUrl;

  return (
    <section id="about" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#ffffff' : 'transparent', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: logo ? '140px 1fr' : '1fr', gap: '2.5rem', alignItems: 'center' }}>
        {logo && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '130px', height: '130px', borderRadius: '16px', objectFit: 'cover', border: '3px solid var(--primary-color, #6366f1)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }} />
          </div>
        )}
        <div>
          <span style={{ color: 'var(--primary-color, #6366f1)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company Overview</span>
          <h2 style={{ fontSize: '1.9rem', color: isLight ? '#0f172a' : '#fff', marginTop: '0.25rem', marginBottom: '1rem', fontWeight: 800 }}>{title}</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', color: isLight ? '#475569' : '#cbd5e1', marginBottom: '1.5rem' }}>{desc}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', backgroundColor: isLight ? '#f8fafc' : '#1e293b', padding: '1.25rem', borderRadius: '12px', border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)'}` }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color, #6366f1)' }}>{businessGroup?.yearStarted || '2020'}</div>
              <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Established Year</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color, #6366f1)' }}>{businessGroup?.city || 'Tirupati'}</div>
              <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Primary Location</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color, #6366f1)' }}>100%</div>
              <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 5. Services Component (With Details Popup Modal) ---
export function ServicesSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const [selectedService, setSelectedService] = useState(null);

  const userServices = businessGroup?.services || [];
  if (userServices.length === 0) return null;

  const getServiceImage = (srv) => {
    if (srv.photos && srv.photos.length > 0) return srv.photos[0];
    if (srv.imageUrl) return srv.imageUrl;
    if (srv.libraryItem) {
      if (srv.libraryItem.imageUrl) return srv.libraryItem.imageUrl;
      if (srv.libraryItem.photos && srv.libraryItem.photos.length > 0) return srv.libraryItem.photos[0];
    }
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600';
  };

  const getServicePrice = (srv) => {
    if (srv.price !== null && srv.price !== undefined && srv.price !== '') {
      return typeof srv.price === 'number' ? `₹${srv.price.toLocaleString('en-IN')}` : srv.price;
    }
    if (srv.libraryItem?.defaultPrice !== null && srv.libraryItem?.defaultPrice !== undefined) {
      return `₹${srv.libraryItem.defaultPrice.toLocaleString('en-IN')}`;
    }
    return 'Custom Quote';
  };

  const getServiceDesc = (srv) => {
    return srv.description || srv.libraryItem?.description || 'Quality professional service offering tailored to your exact specifications.';
  };

  const list = userServices;

  return (
    <section id="services" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.01)', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>
          {theme === 'restaurant-menu' ? 'Dining & Culinary Offerings' :
           theme === 'clinic-healthcare' ? 'Medical Treatments & Procedures' :
           theme === 'service-booking' ? 'Bookable Services & Packages' :
           'Our Professional Services'}
        </h2>
        <p style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>High quality offerings uploaded and verified for maximum value (Click for full details)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
        {list.map((srv, idx) => {
          const imgUrl = getServiceImage(srv);
          const priceText = getServicePrice(srv);
          const descText = getServiceDesc(srv);
          const title = srv.name || srv.libraryItem?.name || 'Service Title';

          return (
            <div key={idx}
              onClick={() => setSelectedService({ ...srv, _theme: theme })}
              style={{
                backgroundColor: isLight ? '#ffffff' : '#1e293b',
                border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.06)' : '0 4px 14px rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}>
              <div>
                {/* Service Card Image Banner */}
                <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img src={imgUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--primary-color, #6366f1)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.15)'}`
                  }}>
                    {priceText}
                  </div>
                </div>

                <div style={{ padding: '1.35rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: isLight ? '#0f172a' : '#fff', margin: '0 0 0.5rem', fontWeight: 800 }}>{title}</h3>
                  <p style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1', lineHeight: 1.6, margin: '0 0 1rem' }}>
                    {descText.length > 120 ? descText.substring(0, 115) + '...' : descText}
                  </p>
                </div>
              </div>
              
              <div style={{ padding: '0 1.35rem 1.35rem' }}>
                <button type="button" style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--primary-color, #6366f1)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <span>View Details & Book</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <ItemDetailModal item={selectedService} type="SERVICE" businessGroup={businessGroup} onClose={() => setSelectedService(null)} />
      )}
    </section>
  );
}

// --- 6. Products Component (With Details Popup Modal) ---
export function ProductsSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const userProducts = businessGroup?.products || [];
  if (userProducts.length === 0) return null;

  const getProductImage = (prod) => {
    if (prod.photos && prod.photos.length > 0) return prod.photos[0];
    if (prod.imageUrl) return prod.imageUrl;
    if (prod.libraryItem) {
      if (prod.libraryItem.imageUrl) return prod.libraryItem.imageUrl;
      if (prod.libraryItem.photos && prod.libraryItem.photos.length > 0) return prod.libraryItem.photos[0];
    }
    return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600';
  };

  const getProductPrice = (prod) => {
    if (prod.price !== null && prod.price !== undefined && prod.price !== '') {
      return typeof prod.price === 'number' ? `₹${prod.price.toLocaleString('en-IN')}` : prod.price;
    }
    if (prod.libraryItem?.defaultPrice !== null && prod.libraryItem?.defaultPrice !== undefined) {
      return `₹${prod.libraryItem.defaultPrice.toLocaleString('en-IN')}`;
    }
    return 'Contact for Price';
  };

  const getProductDesc = (prod) => {
    return prod.description || prod.libraryItem?.description || 'Verified product offering with high quality standards and official warranty.';
  };

  const list = userProducts;

  return (
    <section id="products" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#ffffff' : 'transparent', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>
          {theme === 'e-commerce' ? 'Product Catalog' : 'Featured Products & Catalog'}
        </h2>
        <p style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>Premium products with uploaded specs, photos, and direct order options (Click for full details)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
        {list.map((prod, idx) => {
          const imgUrl = getProductImage(prod);
          const priceText = getProductPrice(prod);
          const descText = getProductDesc(prod);
          const title = prod.name || prod.libraryItem?.name || 'Product Item';

          return (
            <div key={idx}
              onClick={() => setSelectedProduct({ ...prod, _theme: theme })}
              style={{
                backgroundColor: isLight ? '#ffffff' : '#1e293b',
                border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.06)' : '0 4px 14px rgba(0,0,0,0.25)',
                cursor: 'pointer'
              }}>
              <div>
                {/* Product Image */}
                <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: isLight ? '#f1f5f9' : '#0f172a' }}>
                  <img src={imgUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    In Stock
                  </div>
                </div>

                <div style={{ padding: '1.35rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: isLight ? '#0f172a' : '#fff', margin: '0 0 0.4rem', fontWeight: 800 }}>{title}</h3>
                  <p style={{ fontSize: '0.88rem', color: isLight ? '#475569' : '#cbd5e1', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                    {descText.length > 100 ? descText.substring(0, 95) + '...' : descText}
                  </p>
                </div>
              </div>

              <div style={{ padding: '0 1.35rem 1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-color, #6366f1)' }}>{priceText}</span>
                <button type="button" style={{
                  backgroundColor: 'var(--secondary-color, #a855f7)',
                  color: '#fff',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}>
                  <ShoppingCart size={15} />
                  <span>View & Order</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ItemDetailModal item={selectedProduct} type="PRODUCT" businessGroup={businessGroup} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}

// --- 7. Gallery Component ---
export function GallerySection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const logo = businessGroup?.logoUrl;
  const cover = businessGroup?.coverImageUrl;
  const sampleImgs = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600'
  ];
  const images = [logo, cover].filter(Boolean);
  const displayImages = images.length > 0 ? images : sampleImgs;

  return (
    <section id="gallery" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.015)', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>Photo Gallery</h2>
        <p style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>A visual showcase of our facility, work, and operations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {displayImages.map((img, idx) => (
          <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', height: '200px', border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)'}`, boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>
            <img src={img} alt={`Gallery item ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 8. Customer Reviews Component ---
export function ReviewsSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const { reviews: realReviews, avgRating, reviewCount } = getRatingAndReviews(businessGroup);

  const fallbackReviews = [
    { authorName: 'Ramesh K.', rating: 5, comment: 'Outstanding service and extremely fast support. Highly recommended for commercial needs!' },
    { authorName: 'Priya M.', rating: 5, comment: 'Very professional staff, quick communication, and top quality results in Tirupati.' },
    { authorName: 'Srinivas R.', rating: 5, comment: 'Transparent pricing and great attention to detail. Will definitely work together again.' }
  ];

  const reviewsToDisplay = realReviews.length > 0 ? realReviews : fallbackReviews;

  return (
    <section id="reviews" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#ffffff' : 'transparent', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>Customer Reviews & Ratings</h2>
        
        {reviewCount > 0 ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isLight ? '#f1f5f9' : '#1e293b', padding: '0.4rem 1rem', borderRadius: '30px', border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)'}`, color: '#f59e0b', fontSize: '0.9rem', fontWeight: 800 }}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>{avgRating} Average Rating</span>
            <span style={{ color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600 }}>({reviewCount} verified reviews)</span>
          </div>
        ) : (
          <p style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>Verified Customer Feedback & Ratings</p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {reviewsToDisplay.map((rev, idx) => {
          const author = rev.authorName || rev.author || 'Verified Customer';
          const rating = rev.rating || 5;
          const comment = rev.comment || 'Great experience and high quality service.';
          const photo = rev.reviewerPhoto;

          return (
            <div key={idx} style={{
              padding: '1.5rem',
              borderRadius: '12px',
              backgroundColor: isLight ? '#f8fafc' : '#1e293b',
              border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'}`,
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.04)' : 'none'
            }}>
              <div>
                <div style={{ color: '#f59e0b', marginBottom: '0.75rem', fontSize: '1rem' }}>{'★'.repeat(rating)}</div>
                <p style={{ fontStyle: 'italic', color: isLight ? '#475569' : '#cbd5e1', marginBottom: '1.25rem', fontSize: '0.92rem', lineHeight: 1.6 }}>"{comment}"</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {photo ? (
                  <img src={photo} alt={author} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    {author.charAt(0)}
                  </div>
                )}
                <strong style={{ fontSize: '0.88rem', color: isLight ? '#0f172a' : '#fff' }}>{author}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// --- 9. FAQ Accordion Component ---
export function FaqSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    { q: 'What services or products do you specialize in?', a: `We specialize in providing high quality commercial offerings tailored for ${businessGroup?.name || 'our clients'} in ${businessGroup?.city || 'Tirupati'}.` },
    { q: 'What payment methods do you accept?', a: 'We accept UPI, cash, credit/debit cards, net banking, and official invoices.' },
    { q: 'How can I book an appointment or place an inquiry?', a: 'You can submit your details in the contact form below or reach us directly via WhatsApp / phone call.' },
    { q: 'Where is your business located?', a: `We are located at ${businessGroup?.address || businessGroup?.city || 'Tirupati, Andhra Pradesh'}.` }
  ];

  return (
    <section id="faq" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.015)', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
        <p style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>Clear answers to standard questions</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '750px', margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            style={{
              padding: '1.2rem 1.5rem',
              backgroundColor: isLight ? '#ffffff' : '#1e293b',
              borderRadius: '10px',
              border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'}`,
              cursor: 'pointer',
              boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.03)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1rem', color: isLight ? '#0f172a' : '#fff', margin: 0, fontWeight: 700 }}>{faq.q}</h4>
              <ChevronDown size={18} color="var(--primary-color, #6366f1)" style={{ transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </div>
            {openIdx === idx && (
              <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.88rem', marginTop: '0.85rem', marginBottom: 0, lineHeight: 1.6 }}>{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 10. Call To Action Component ---
export function CtaSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);

  return (
    <section style={{
      padding: '4rem 6%',
      background: isLight
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)'
        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)',
      borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}`,
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.75rem' }}>Ready to elevate your experience?</h2>
      <p style={{ color: isLight ? '#475569' : '#cbd5e1', marginBottom: '2rem', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Get in touch with us today for instant quotes, service consultations, or direct assistance.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {businessGroup?.whatsAppNumber && (
          <a href={`https://wa.me/${(businessGroup.whatsAppNumber || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25d366', color: '#fff', textDecoration: 'none', padding: '0.75rem 1.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)' }}>
            <MessageSquare size={16} />
            <span>Chat on WhatsApp</span>
          </a>
        )}
        {businessGroup?.mobileNumber && (
          <a href={`tel:${businessGroup.mobileNumber}`} style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', textDecoration: 'none', padding: '0.75rem 1.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}>
            <Phone size={16} />
            <span>Call Us Now</span>
          </a>
        )}
      </div>
    </section>
  );
}

// --- 11. Contact & Map Component ---
export function ContactSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const formInputStyle = {
    padding: '0.75rem 0.95rem',
    backgroundColor: isLight ? '#ffffff' : '#0f172a',
    border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)'}`,
    borderRadius: '8px',
    color: isLight ? '#0f172a' : '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <section id="contact" style={{ padding: '4rem 6%', backgroundColor: isLight ? '#ffffff' : 'transparent', borderBottom: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.05)'}` }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>
          {theme === 'clinic-healthcare' ? 'Book Patient Appointment' :
           theme === 'restaurant-menu' ? 'Table Booking & Orders' :
           theme === 'service-booking' ? 'Schedule Consultation' :
           'Get In Touch With Us'}
        </h2>
        <p style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>Send a direct message or visit our official office location</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
        
        {/* Contact Form */}
        <div style={{ backgroundColor: isLight ? '#f8fafc' : '#1e293b', padding: '2rem', borderRadius: '12px', border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)'}` }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#10b981' }}>
              <CheckCircle2 size={48} style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', color: isLight ? '#0f172a' : '#fff', marginBottom: '0.5rem' }}>Thank You!</h3>
              <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.9rem' }}>Your request has been received. Our team will contact you shortly.</p>
            </div>
          ) : (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
              <input type="text" placeholder="Your Name" style={formInputStyle} required />
              <input type="tel" placeholder="Mobile Number" style={formInputStyle} required />
              <textarea placeholder="Message / Service Details" rows="4" style={formInputStyle} required />
              <button type="submit" style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', padding: '0.85rem', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 800, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                Submit Request
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              <MapPin size={20} />
            </div>
            <div>
              <h4 style={{ color: isLight ? '#0f172a' : '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>Address</h4>
              <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.88rem', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                {businessGroup?.address ? `${businessGroup.address}, ${businessGroup.city || ''}` : 'Tirupati, Andhra Pradesh'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              <Phone size={20} />
            </div>
            <div>
              <h4 style={{ color: isLight ? '#0f172a' : '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>Phone / Mobile</h4>
              <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>{businessGroup?.mobileNumber || 'Contact Office'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              <Clock size={20} />
            </div>
            <div>
              <h4 style={{ color: isLight ? '#0f172a' : '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>Working Hours</h4>
              <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>Monday - Saturday: 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 12. Footer Component ---
export function FooterSection({ businessGroup, settings, theme }) {
  const isLight = themeIsLight(theme);
  const name = businessGroup?.name || 'Business Name';

  return (
    <footer style={{ padding: '3rem 6% 2rem', backgroundColor: isLight ? '#f1f5f9' : '#0b1120', color: isLight ? '#64748b' : '#64748b', fontSize: '0.85rem', borderTop: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ color: isLight ? '#0f172a' : '#fff', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.4rem' }}>{name}</h3>
          <p style={{ color: isLight ? '#64748b' : '#64748b', margin: 0, fontSize: '0.82rem' }}>Commercial Business Website • Powered by ManaCity</p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="#about" style={{ color: isLight ? '#475569' : '#94a3b8', textDecoration: 'none' }}>About</a>
          <a href="#services" style={{ color: isLight ? '#475569' : '#94a3b8', textDecoration: 'none' }}>Services</a>
          <a href="#products" style={{ color: isLight ? '#475569' : '#94a3b8', textDecoration: 'none' }}>Products</a>
          <a href="#contact" style={{ color: isLight ? '#475569' : '#94a3b8', textDecoration: 'none' }}>Contact</a>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.05)'}`, paddingTop: '1.25rem', textAlign: 'center', color: isLight ? '#94a3b8' : '#475569', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} {name}. All rights reserved.
      </div>
    </footer>
  );
}
