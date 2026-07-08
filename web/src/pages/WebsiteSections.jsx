import React from 'react';

// --- Hero Component ---
export function HeroSection({ businessGroup, settings, theme }) {
  const headline = settings.headline || `Welcome to ${businessGroup.name}`;
  const subheadline = settings.subheadline || businessGroup.description || 'Discover our premium offerings and business services.';
  const ctaText = settings.ctaText || 'Get Started';
  const showCta = settings.showCta !== undefined ? settings.showCta : true;
  const coverUrl = businessGroup.coverImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200';

  const containerStyle = {
    position: 'relative',
    height: theme === 'elegant' ? '80vh' : '65vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    background: `url('${coverUrl}') center/cover no-repeat`,
    textAlign: 'center'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '2rem'
  };

  return (
    <section style={containerStyle}>
      <div style={overlayStyle} />
      <div style={contentStyle}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-primary)' }}>{headline}</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>{subheadline}</p>
        {showCta && (
          <a href="#contact" className="btn btn-primary" style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)', color: '#fff', padding: '0.75rem 2rem', textDecoration: 'none', borderRadius: '4px', fontWeight: 600 }}>
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}

// --- About Component ---
export function AboutSection({ businessGroup, settings, theme }) {
  const title = settings.title || 'About Us';
  const desc = businessGroup.description || 'We are dedicated to offering the finest professional services in our domain, serving clients globally with excellence.';
  const logo = businessGroup.logoUrl;

  return (
    <section id="about" style={{ padding: '5rem 10%', backgroundColor: 'rgba(255, 255, 255, 0.02)', textAlign: settings.alignment || 'left' }}>
      <div style={{ display: 'grid', gridTemplateColumns: logo ? '1fr 2fr' : '1fr', gap: '2rem', alignItems: 'center' }}>
        {logo && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)' }} />
          </div>
        )}
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>{title}</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.85 }}>{desc}</p>
          {businessGroup.yearStarted && (
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>Serving since {businessGroup.yearStarted}</p>
          )}
        </div>
      </div>
    </section>
  );
}

// --- Services Component ---
export function ServicesSection({ businessGroup, settings, theme }) {
  const list = businessGroup.services || [];
  const columns = settings.columns || 3;

  if (list.length === 0) return null;

  return (
    <section id="services" style={{ padding: '5rem 10%' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Our Services</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${300 / columns}px, 1fr))`,
        gap: '2rem'
      }}>
        {list.map((srv, idx) => (
          <div key={idx} style={cardStyle(theme)}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{srv.name}</h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Professional quality service tailored to your exact specifications.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Products Component ---
export function ProductsSection({ businessGroup, settings, theme }) {
  const list = businessGroup.products || [];
  const columns = settings.columns || 3;

  if (list.length === 0) return null;

  return (
    <section id="products" style={{ padding: '5rem 10%', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Featured Products</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${300 / columns}px, 1fr))`,
        gap: '2rem'
      }}>
        {list.map((prod, idx) => (
          <div key={idx} style={cardStyle(theme)}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>{prod.name}</h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>High quality product engineered to guarantee satisfaction.</p>
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
    <section id="gallery" style={{ padding: '5rem 10%' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Gallery</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {images.map((img, idx) => (
          <img key={idx} src={img} alt="Gallery item" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
        ))}
      </div>
    </section>
  );
}

// --- Reviews Component ---
export function ReviewsSection({ businessGroup, settings, theme }) {
  // Placeholder review list
  const reviews = [
    { author: 'Jane Doe', rating: 5, comment: 'Exceptional service and extremely friendly support staff!' },
    { author: 'Mark Smith', rating: 5, comment: 'Highly recommended. Their products completely changed our workflow.' }
  ];

  return (
    <section id="reviews" style={{ padding: '5rem 10%', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Testimonials</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {reviews.map((rev, idx) => (
          <div key={idx} style={{ padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
            <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>{'★'.repeat(rev.rating)}</div>
            <p style={{ fontStyle: 'italic', marginBottom: '0.5rem', opacity: 0.9 }}>"{rev.comment}"</p>
            <strong>- {rev.author}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Contact Component ---
export function ContactSection({ businessGroup, settings, theme }) {
  const showForm = settings.showForm !== undefined ? settings.showForm : true;

  return (
    <section id="contact" style={{ padding: '5rem 10%' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Contact Us</h2>
      <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 1fr' : '1fr', gap: '4rem' }}>
        {showForm && (
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" style={formInputStyle} required />
            <input type="email" placeholder="Your Email" style={formInputStyle} required />
            <textarea placeholder="Message" rows="4" style={formInputStyle} required />
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)', color: '#fff', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none' }}>
              Send Message
            </button>
          </form>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Get In Touch</h3>
          <p><strong>Mobile:</strong> {businessGroup.mobileNumber || 'N/A'}</p>
          <p><strong>WhatsApp:</strong> {businessGroup.whatsAppNumber || 'N/A'}</p>
          <p><strong>Email:</strong> {businessGroup.email || 'N/A'}</p>
          <p><strong>Support Email:</strong> {businessGroup.supportEmail || 'N/A'}</p>
          <p><strong>Address:</strong> {businessGroup.address ? `${businessGroup.address}, ${businessGroup.city}, ${businessGroup.country}` : 'N/A'}</p>
          {businessGroup.googleMapsLink && (
            <a href={businessGroup.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// --- FAQ Component ---
export function FaqSection({ businessGroup, settings, theme }) {
  const faqs = [
    { q: 'What payment methods do you accept?', a: `We accept ${businessGroup.paymentMethods ? businessGroup.paymentMethods.map(m => m.methodName).join(', ') : 'standard methods'}.` },
    { q: 'In which languages can we communicate?', a: `We speak ${businessGroup.languages ? businessGroup.languages.map(l => l.language).join(', ') : 'English'}.` }
  ];

  return (
    <section id="faq" style={{ padding: '5rem 10%', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{faq.q}</h4>
            <p style={{ opacity: 0.85 }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- CTA Component ---
export function CtaSection({ businessGroup, settings, theme }) {
  const btnColor = settings.buttonColor || 'var(--primary-color)';

  return (
    <section style={{ padding: '4rem 10%', backgroundColor: 'rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Interested in Working with Us?</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Get in touch today to discuss how we can accelerate your projects.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {businessGroup.whatsAppNumber && (
          <a href={`https://wa.me/91${businessGroup.whatsAppNumber}`} target="_blank" rel="noopener noreferrer" className="btn" style={{ backgroundColor: '#25d366', color: '#fff', textDecoration: 'none', padding: '0.65rem 1.5rem', borderRadius: '4px', fontWeight: 600 }}>
            WhatsApp Us
          </a>
        )}
        {businessGroup.mobileNumber && (
          <a href={`tel:${businessGroup.mobileNumber}`} className="btn" style={{ backgroundColor: btnColor, color: '#fff', textDecoration: 'none', padding: '0.65rem 1.5rem', borderRadius: '4px', fontWeight: 600 }}>
            Call Now
          </a>
        )}
      </div>
    </section>
  );
}

// --- Footer Component ---
export function FooterSection({ businessGroup, settings, theme }) {
  const copyright = settings.copyright || `© ${new Date().getFullYear()} ${businessGroup.name}. All rights reserved.`;

  return (
    <footer style={{ padding: '3rem 10%', backgroundColor: '#0f172a', color: '#94a3b8', textAlign: 'center', fontSize: '0.9rem' }}>
      <p style={{ marginBottom: '1rem' }}>{copyright}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.85rem' }}>
        <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About</a>
        <a href="#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Services</a>
        <a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a>
      </div>
    </footer>
  );
}

// Helper styling generators
const cardStyle = (theme) => ({
  backgroundColor: theme === 'elegant' ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
  border: theme === 'elegant' ? 'none' : '1px solid var(--border-color)',
  borderBottom: theme === 'elegant' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
  padding: '2rem',
  borderRadius: theme === 'elegant' ? '0px' : '8px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
});

const formInputStyle = {
  padding: '0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
