import React from 'react';
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
  HeartPulse
} from 'lucide-react';

// --- Hero Component ---
export function HeroSection({ businessGroup, settings, theme }) {
  const headline = settings.headline || (
    theme === 'e-commerce' ? `Online Product Storefront - ${businessGroup.name}` :
    theme === 'service-booking' ? `Book Services & Consultations - ${businessGroup.name}` :
    theme === 'restaurant-menu' ? `Delicious Dining & Menu - ${businessGroup.name}` :
    theme === 'clinic-healthcare' ? `Expert Care & Medical Clinic - ${businessGroup.name}` :
    `Welcome to ${businessGroup.name}`
  );

  const subheadline = settings.subheadline || businessGroup.description || 'Discover our premium offerings and business services.';
  const ctaText = settings.ctaText || (
    theme === 'e-commerce' ? 'Shop Catalog' :
    theme === 'service-booking' ? 'Book Appointment' :
    theme === 'restaurant-menu' ? 'View Menu & Order' :
    theme === 'clinic-healthcare' ? 'Consult Doctor' :
    'Get Started'
  );

  const coverUrl = businessGroup.coverImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200';

  const containerStyle = {
    position: 'relative',
    height: '55vh',
    minHeight: '380px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    background: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('${coverUrl}') center/cover no-repeat`,
    textAlign: 'center',
    padding: '2rem'
  };

  return (
    <section style={containerStyle}>
      <div style={{ maxWidth: '750px', zIndex: 2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: 'var(--primary-color, #6366f1)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
          {theme === 'clinic-healthcare' && <Stethoscope size={14} />}
          {theme === 'restaurant-menu' && <Utensils size={14} />}
          {theme === 'e-commerce' && <ShoppingBag size={14} />}
          {theme === 'service-booking' && <Calendar size={14} />}
          {theme === 'modern-corporate' && <Building2 size={14} />}
          <span>{theme.replace('-', ' ')}</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.2 }}>{headline}</h1>
        <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem', opacity: 0.9, lineHeight: 1.5 }}>{subheadline}</p>
        
        <a href="#contact" className="btn" style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', padding: '0.75rem 2rem', textDecoration: 'none', borderRadius: '8px', fontWeight: 800, display: 'inline-block' }}>
          {ctaText}
        </a>
      </div>
    </section>
  );
}

// --- About Component ---
export function AboutSection({ businessGroup, settings, theme }) {
  const title = settings.title || 'About Us';
  const desc = businessGroup.description || 'We are dedicated to offering the finest professional services serving clients with excellence.';
  const logo = businessGroup.logoUrl;

  return (
    <section id="about" style={{ padding: '3.5rem 8%', backgroundColor: 'rgba(255, 255, 255, 0.02)', textAlign: settings.alignment || 'left' }}>
      <div style={{ display: 'grid', gridTemplateColumns: logo ? '120px 1fr' : '1fr', gap: '2rem', alignItems: 'center' }}>
        {logo && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)' }} />
          </div>
        )}
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', marginBottom: '0.75rem', fontWeight: 800 }}>{title}</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.7', opacity: 0.85 }}>{desc}</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            {businessGroup.yearStarted && <span>Established: <strong>{businessGroup.yearStarted}</strong></span>}
            <span>City: <strong>{businessGroup.city || 'Tirupati'}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Services Component ---
export function ServicesSection({ businessGroup, settings, theme }) {
  const list = businessGroup.services || [];

  if (list.length === 0) return null;

  return (
    <section id="services" style={{ padding: '3.5rem 8%' }}>
      <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 800 }}>
        {theme === 'restaurant-menu' ? 'Dining & Culinary Offerings' :
         theme === 'clinic-healthcare' ? 'Medical Treatments & Procedures' :
         theme === 'service-booking' ? 'Bookable Services & Packages' :
         'Our Services'}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {list.map((srv, idx) => (
          <div key={idx} style={cardStyle(theme)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, fontWeight: 700 }}>{srv.name}</h3>
              {srv.price && <span style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.9rem' }}>{srv.price}</span>}
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5 }}>
              {srv.description || 'Quality professional offering tailored to your exact specifications.'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Products Component ---
export function ProductsSection({ businessGroup, settings, theme }) {
  const list = businessGroup.products || [];

  if (list.length === 0) return null;

  return (
    <section id="products" style={{ padding: '3.5rem 8%', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
      <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 800 }}>
        {theme === 'e-commerce' ? 'Product Catalog' : 'Featured Products'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
        {list.map((prod, idx) => (
          <div key={idx} style={cardStyle(theme)}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary-color, #a855f7)', marginBottom: '0.35rem', fontWeight: 700 }}>{prod.name}</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.75rem' }}>{prod.description || 'Verified product offering.'}</p>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-color)' }}>{prod.price || 'Contact for price'}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Gallery Component ---
export function GallerySection({ businessGroup, settings, theme }) {
  const logo = businessGroup.logoUrl;
  const cover = businessGroup.coverImageUrl;
  const images = [logo, cover].filter(Boolean);

  if (images.length === 0) return null;

  return (
    <section id="gallery" style={{ padding: '3.5rem 8%' }}>
      <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 800 }}>Gallery</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.map((img, idx) => (
          <img key={idx} src={img} alt="Gallery item" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
        ))}
      </div>
    </section>
  );
}

// --- Reviews Component ---
export function ReviewsSection({ businessGroup, settings, theme }) {
  const reviews = [
    { author: 'Ramesh K.', rating: 5, comment: 'Excellent experience and top notch service quality in Tirupati!' },
    { author: 'Priya M.', rating: 5, comment: 'Very professional, fast response, and friendly staff support.' }
  ];

  return (
    <section id="reviews" style={{ padding: '3.5rem 8%', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
      <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 800 }}>Customer Reviews</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {reviews.map((rev, idx) => (
          <div key={idx} style={{ padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid var(--primary-color)', backgroundColor: '#1e293b' }}>
            <div style={{ color: '#fbbf24', marginBottom: '0.35rem', fontSize: '0.9rem' }}>{'★'.repeat(rev.rating)}</div>
            <p style={{ fontStyle: 'italic', marginBottom: '0.5rem', opacity: 0.9, fontSize: '0.88rem' }}>"{rev.comment}"</p>
            <strong style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>- {rev.author}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Contact Component ---
export function ContactSection({ businessGroup, settings, theme }) {
  return (
    <section id="contact" style={{ padding: '3.5rem 8%' }}>
      <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 800 }}>
        {theme === 'clinic-healthcare' ? 'Book Patient Appointment' :
         theme === 'restaurant-menu' ? 'Table Booking & Inquiries' :
         theme === 'service-booking' ? 'Schedule Consultation' :
         'Get In Touch'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }} onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" style={formInputStyle} required />
          <input type="tel" placeholder="Mobile Number" style={formInputStyle} required />
          <textarea placeholder="Message / Details" rows="3" style={formInputStyle} required />
          <button className="btn" style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', border: 'none', fontWeight: 800 }}>
            Submit Request
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, fontWeight: 700 }}>Contact Info</h3>
          <p><strong>Mobile:</strong> {businessGroup.mobileNumber || 'N/A'}</p>
          <p><strong>WhatsApp:</strong> {businessGroup.whatsAppNumber || 'N/A'}</p>
          <p><strong>Email:</strong> {businessGroup.email || 'N/A'}</p>
          <p><strong>Address:</strong> {businessGroup.address ? `${businessGroup.address}, ${businessGroup.city}` : 'N/A'}</p>
        </div>
      </div>
    </section>
  );
}

// --- FAQ Component ---
export function FaqSection({ businessGroup, settings, theme }) {
  const faqs = [
    { q: 'What payment methods do you accept?', a: 'We accept UPI, cash, credit/debit cards, and online bank transfers.' },
    { q: 'Where are you located?', a: `We are located at ${businessGroup.address || businessGroup.city || 'Tirupati'}.` }
  ];

  return (
    <section id="faq" style={{ padding: '3.5rem 8%', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
      <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px', margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.98rem', color: 'var(--primary-color)', marginBottom: '0.35rem', fontWeight: 700 }}>{faq.q}</h4>
            <p style={{ opacity: 0.85, fontSize: '0.85rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- CTA Component ---
export function CtaSection({ businessGroup, settings, theme }) {
  return (
    <section style={{ padding: '3.5rem 8%', backgroundColor: 'rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', fontWeight: 800 }}>Connect With Us Today</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Direct support and quick response via WhatsApp or phone call.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {businessGroup.whatsAppNumber && (
          <a href={`https://wa.me/${(businessGroup.whatsAppNumber || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn" style={{ backgroundColor: '#25d366', color: '#fff', textDecoration: 'none', padding: '0.65rem 1.5rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
            WhatsApp Us
          </a>
        )}
        {businessGroup.mobileNumber && (
          <a href={`tel:${businessGroup.mobileNumber}`} className="btn" style={{ backgroundColor: 'var(--primary-color, #6366f1)', color: '#fff', textDecoration: 'none', padding: '0.65rem 1.5rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
            Call Now
          </a>
        )}
      </div>
    </section>
  );
}

// --- Footer Component ---
export function FooterSection({ businessGroup, settings, theme }) {
  return (
    <footer style={{ padding: '2rem 8%', backgroundColor: '#0f172a', color: '#64748b', textAlign: 'center', fontSize: '0.82rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <p>© {new Date().getFullYear()} {businessGroup.name}. All rights reserved.</p>
    </footer>
  );
}

const cardStyle = (theme) => ({
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  padding: '1.35rem',
  borderRadius: '12px'
});

const formInputStyle = {
  padding: '0.65rem 0.85rem',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.88rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
