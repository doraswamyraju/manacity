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
  ArrowRight
} from 'lucide-react';

// --- 1. Header Navigation Component ---
export function HeaderSection({ businessGroup, settings, theme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const name = businessGroup?.name || 'Business Name';
  const logo = businessGroup?.logoUrl;
  const phone = businessGroup?.mobileNumber;
  const whatsapp = businessGroup?.whatsAppNumber;

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
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.85rem 6%',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {logo ? (
            <img src={logo} alt={name} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid var(--primary-color, #6366f1)' }} />
          ) : (
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--primary-color, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
              {name.charAt(0)}
            </div>
          )}
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em' }}>
            {name.length > 28 ? name.substring(0, 26) + '...' : name}
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              style={{
                color: '#cbd5e1',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color, #38bdf8)'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
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
              color: '#fff',
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
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
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

  return (
    <section style={{
      position: 'relative',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      background: `linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.78) 100%), url('${coverUrl}') center/cover no-repeat`,
      textAlign: 'center',
      padding: '4rem 6%'
    }}>
      <div style={{ maxWidth: '800px', zIndex: 2 }}>
        
        {/* Industry Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.4rem 1rem',
          borderRadius: '30px',
          backgroundColor: 'var(--primary-color, #6366f1)',
          fontSize: '0.78rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
          letterSpacing: '0.05em',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
        }}>
          {theme === 'clinic-healthcare' && <Stethoscope size={14} />}
          {theme === 'restaurant-menu' && <Utensils size={14} />}
          {theme === 'e-commerce' && <ShoppingBag size={14} />}
          {theme === 'service-booking' && <Calendar size={14} />}
          {theme === 'modern-corporate' && <Building2 size={14} />}
          <span>{(theme || 'Commercial Business').replace('-', ' ')}</span>
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.18, letterSpacing: '-0.03em' }}>
          {headline}
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 2rem' }}>
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
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.85rem 2rem',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem'
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
  const title = settings?.title || 'Why Choose Us';
  
  const features = [
    { icon: <ShieldCheck size={28} color="var(--primary-color, #38bdf8)" />, title: 'Verified Quality', desc: '100% committed to high standard product and service execution.' },
    { icon: <Sparkles size={28} color="var(--primary-color, #38bdf8)" />, title: 'Professional Staff', desc: 'Experienced professionals ensuring seamless customer experience.' },
    { icon: <Clock size={28} color="var(--primary-color, #38bdf8)" />, title: 'Fast Turnaround', desc: 'Quick response time, prompt delivery, and 24/7 dedicated support.' },
    { icon: <Award size={28} color="var(--primary-color, #38bdf8)" />, title: 'Best Market Rates', desc: 'Transparent, competitive pricing with maximum value guaranteed.' }
  ];

  return (
    <section id="features" style={{ padding: '4rem 6%', backgroundColor: 'rgba(255, 255, 255, 0.015)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Built on trust, speed, and uncompromising standards</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'left'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>{feat.icon}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{feat.title}</h3>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 4. About Us Component ---
export function AboutSection({ businessGroup, settings, theme }) {
  const title = settings?.title || 'About Us';
  const desc = businessGroup?.description || 'We are dedicated to offering the finest professional commercial services, serving clients with excellence, integrity, and innovation.';
  const logo = businessGroup?.logoUrl;

  return (
    <section id="about" style={{ padding: '4rem 6%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: logo ? '140px 1fr' : '1fr', gap: '2.5rem', alignItems: 'center' }}>
        {logo && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '130px', height: '130px', borderRadius: '16px', objectFit: 'cover', border: '3px solid var(--primary-color, #6366f1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }} />
          </div>
        )}
        <div>
          <span style={{ color: 'var(--primary-color, #38bdf8)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company Overview</span>
          <h2 style={{ fontSize: '1.9rem', color: '#fff', marginTop: '0.25rem', marginBottom: '1rem', fontWeight: 800 }}>{title}</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#cbd5e1', marginBottom: '1.5rem' }}>{desc}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color, #38bdf8)' }}>{businessGroup?.yearStarted || '2020'}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Established Year</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color, #38bdf8)' }}>{businessGroup?.city || 'Tirupati'}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Primary Location</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color, #38bdf8)' }}>100%</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 5. Services Component ---
export function ServicesSection({ businessGroup, settings, theme }) {
  const userServices = businessGroup?.services || [];

  // Fallback sample services if business has no services added
  const list = userServices.length > 0 ? userServices : [
    { name: 'Core Commercial Consultation', price: 'Contact for Quote', description: 'Comprehensive business consultation and tailored implementation strategy.' },
    { name: 'Premium Service Package', price: 'Custom Pricing', description: 'End-to-end professional package designed for scaling operations.' },
    { name: 'Standard Maintenance & Support', price: 'Subscription', description: '24/7 technical assistance, ongoing updates, and direct advisor access.' }
  ];

  return (
    <section id="services" style={{ padding: '4rem 6%', backgroundColor: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {theme === 'restaurant-menu' ? 'Dining & Culinary Offerings' :
           theme === 'clinic-healthcare' ? 'Medical Treatments & Procedures' :
           theme === 'service-booking' ? 'Bookable Services & Packages' :
           'Our Professional Services'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>High quality offerings crafted for maximum results</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {list.map((srv, idx) => (
          <div key={idx} style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, fontWeight: 700 }}>{srv.name}</h3>
                {srv.price && <span style={{ color: 'var(--primary-color, #38bdf8)', fontWeight: 800, fontSize: '0.9rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>{srv.price}</span>}
              </div>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {srv.description || 'Quality professional offering tailored to your exact requirements.'}
              </p>
            </div>
            
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color, #38bdf8)', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
              <span>Book / Enquire</span>
              <ArrowRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 6. Products Component ---
export function ProductsSection({ businessGroup, settings, theme }) {
  const userProducts = businessGroup?.products || [];

  // Fallback sample products if business has no products added
  const list = userProducts.length > 0 ? userProducts : [
    { name: 'Featured Commercial Item A', price: '₹2,499', description: 'Top quality verified commercial grade product with warranty.' },
    { name: 'Enterprise Bundle Kit B', price: '₹4,999', description: 'All-in-one product package built for durability and performance.' }
  ];

  return (
    <section id="products" style={{ padding: '4rem 6%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {theme === 'e-commerce' ? 'Product Catalog' : 'Featured Products'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Premium products delivered with speed and care</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {list.map((prod, idx) => (
          <div key={idx} style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary-color, #a855f7)', marginBottom: '0.5rem', fontWeight: 700 }}>{prod.name}</h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '1.25rem', lineHeight: 1.5 }}>{prod.description || 'Verified product offering.'}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{prod.price || 'Contact for price'}</span>
              <a href="#contact" style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', padding: '0.4rem 0.9rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem' }}>Order Now</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 7. Gallery Component ---
export function GallerySection({ businessGroup, settings, theme }) {
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
    <section id="gallery" style={{ padding: '4rem 6%', backgroundColor: 'rgba(255, 255, 255, 0.015)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Photo Gallery</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>A visual showcase of our facility, work, and operations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {displayImages.map((img, idx) => (
          <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', height: '200px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src={img} alt={`Gallery item ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 8. Customer Reviews Component ---
export function ReviewsSection({ businessGroup, settings, theme }) {
  const reviews = [
    { author: 'Ramesh K.', rating: 5, comment: 'Outstanding service and extremely fast support. Highly recommended for commercial needs!' },
    { author: 'Priya M.', rating: 5, comment: 'Very professional staff, quick communication, and top quality results in Tirupati.' },
    { author: 'Srinivas R.', rating: 5, comment: 'Transparent pricing and great attention to detail. Will definitely work together again.' }
  ];

  return (
    <section id="reviews" style={{ padding: '4rem 6%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Customer Testimonials</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>What our valued clients say about their experience with us</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {reviews.map((rev, idx) => (
          <div key={idx} style={{
            padding: '1.5rem',
            borderRadius: '12px',
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ color: '#fbbf24', marginBottom: '0.75rem', fontSize: '1rem' }}>{'★'.repeat(rev.rating)}</div>
              <p style={{ fontStyle: 'italic', color: '#cbd5e1', marginBottom: '1.25rem', fontSize: '0.92rem', lineHeight: 1.6 }}>"{rev.comment}"</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                {rev.author.charAt(0)}
              </div>
              <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{rev.author}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 9. FAQ Accordion Component ---
export function FaqSection({ businessGroup, settings, theme }) {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    { q: 'What services or products do you specialize in?', a: `We specialize in providing high quality commercial offerings tailored for ${businessGroup?.name || 'our clients'} in ${businessGroup?.city || 'Tirupati'}.` },
    { q: 'What payment methods do you accept?', a: 'We accept UPI, cash, credit/debit cards, net banking, and official invoices.' },
    { q: 'How can I book an appointment or place an inquiry?', a: 'You can submit your details in the contact form below or reach us directly via WhatsApp / phone call.' },
    { q: 'Where is your business located?', a: `We are located at ${businessGroup?.address || businessGroup?.city || 'Tirupati, Andhra Pradesh'}.` }
  ];

  return (
    <section id="faq" style={{ padding: '4rem 6%', backgroundColor: 'rgba(255, 255, 255, 0.015)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Clear answers to standard questions</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '750px', margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            style={{
              padding: '1.2rem 1.5rem',
              backgroundColor: '#1e293b',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1rem', color: '#fff', margin: 0, fontWeight: 700 }}>{faq.q}</h4>
              <ChevronDown size={18} color="var(--primary-color, #38bdf8)" style={{ transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </div>
            {openIdx === idx && (
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginTop: '0.85rem', marginBottom: 0, lineHeight: 1.6 }}>{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 10. Call To Action Component ---
export function CtaSection({ businessGroup, settings, theme }) {
  return (
    <section style={{
      padding: '4rem 6%',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Ready to elevate your experience?</h2>
      <p style={{ color: '#cbd5e1', marginBottom: '2rem', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Get in touch with us today for instant quotes, service consultations, or direct assistance.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {businessGroup?.whatsAppNumber && (
          <a href={`https://wa.me/${(businessGroup.whatsAppNumber || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25d366', color: '#fff', textDecoration: 'none', padding: '0.75rem 1.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={16} />
            <span>Chat on WhatsApp</span>
          </a>
        )}
        {businessGroup?.mobileNumber && (
          <a href={`tel:${businessGroup.mobileNumber}`} style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', textDecoration: 'none', padding: '0.75rem 1.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" style={{ padding: '4rem 6%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {theme === 'clinic-healthcare' ? 'Book Patient Appointment' :
           theme === 'restaurant-menu' ? 'Table Booking & Orders' :
           theme === 'service-booking' ? 'Schedule Consultation' :
           'Get In Touch With Us'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Send a direct message or visit our official office location</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
        
        {/* Contact Form */}
        <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#4caf50' }}>
              <CheckCircle2 size={48} style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>Thank You!</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Your request has been received. Our team will contact you shortly.</p>
            </div>
          ) : (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
              <input type="text" placeholder="Your Name" style={formInputStyle} required />
              <input type="tel" placeholder="Mobile Number" style={formInputStyle} required />
              <textarea placeholder="Message / Service Details" rows="4" style={formInputStyle} required />
              <button type="submit" style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', padding: '0.85rem', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 800, fontSize: '0.95rem' }}>
                Submit Request
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary-color, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              <MapPin size={20} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>Address</h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                {businessGroup?.address ? `${businessGroup.address}, ${businessGroup.city || ''}` : 'Tirupati, Andhra Pradesh'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary-color, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              <Phone size={20} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>Phone / Mobile</h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>{businessGroup?.mobileNumber || 'Contact Office'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary-color, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              <Clock size={20} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>Working Hours</h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>Monday - Saturday: 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 12. Footer Component ---
export function FooterSection({ businessGroup, settings, theme }) {
  const name = businessGroup?.name || 'Business Name';

  return (
    <footer style={{ padding: '3rem 6% 2rem', backgroundColor: '#0b1120', color: '#64748b', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.4rem' }}>{name}</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.82rem' }}>Commercial Business Website • Powered by ManaCity</p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About</a>
          <a href="#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Services</a>
          <a href="#products" style={{ color: '#94a3b8', textDecoration: 'none' }}>Products</a>
          <a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', textAlign: 'center', color: '#475569', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} {name}. All rights reserved.
      </div>
    </footer>
  );
}

const formInputStyle = {
  padding: '0.75rem 0.95rem',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
