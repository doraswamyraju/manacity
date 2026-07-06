import React from 'react';

function Home({ onNavigateToLogin, onNavigateToRegister, onNavigateToPrivacy, onNavigateToTerms, onNavigateToDelete }) {
  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.svg" alt="ManaCity Logo" style={{ maxHeight: '40px' }} />
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Pricing</a>
          <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigateToPrivacy(); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigateToTerms(); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms</a>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onNavigateToLogin} style={{ padding: '0.5rem 1.25rem', width: 'auto' }}>Login</button>
          <button className="btn btn-primary" onClick={onNavigateToRegister} style={{ padding: '0.5rem 1.25rem', width: 'auto' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '4rem 1rem', textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
          Smart Business Growth <br/>
          <span className="gradient-text">From One Unified Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          ManaCity helps local businesses scale their presence. Securely connect your Google Business Profile, manage reviews, build stunning business websites, and boost local SEO instantly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={onNavigateToRegister} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', width: 'auto' }}>Start Free Trial</button>
          <a href="#features" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', width: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Explore Features</a>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" style={{ padding: '4rem 1rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Platform Features Built to Convert</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Everything you need to automate local marketing and gain verified visibility.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Feature 1 */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌐</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Google Business Profile Sync</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Connect your locations securely. Automatically sync contact details, photos, and hours from your Google Business Profile.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Smart Review Manager</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Read and reply to reviews using automated templates or custom responses. Build customer trust with continuous engagement.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Dynamic Website Builder</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Instantly generate search-optimized websites using your business information. Support for subdomains and custom branding.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📱</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>QR Request Campaigns</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Print customized QR codes linking directly to your review landing page. Maximize offline customer conversions effortlessly.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>SEO Task Engine</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Gamified steps reward you with XP for improving your profile completeness, leading to higher rankings in local searches.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Local CRM & Lead Pipeline</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Store customer details, track leads, and manage communications with users who contact your generated business sites.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '4rem 1rem', borderTop: '1px solid var(--border-color)', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Pricing Designed for Scale</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Simple transparent tiers. Upgrade or cancel anytime.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Free Tier */}
          <div className="glass-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Free Tier</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Perfect for starting out</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>$0 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ month</span></div>
              <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                <li>✓ 1 Business Location</li>
                <li>✓ 1 Generated Website</li>
                <li>✓ Review Dashboard</li>
                <li>✗ Custom Subdomains</li>
              </ul>
            </div>
            <button className="btn btn-secondary" onClick={onNavigateToRegister}>Get Started</button>
          </div>

          {/* Growth Tier */}
          <div className="glass-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid var(--accent-primary)' }}>
            <div>
              <span style={{ backgroundColor: 'rgba(25, 118, 210, 0.1)', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '50px', display: 'inline-block', marginBottom: '1rem' }}>POPULAR</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Growth Tier</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>For active local businesses</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>$29 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ month</span></div>
              <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                <li>✓ 5 Business Locations</li>
                <li>✓ 5 Generated Websites</li>
                <li>✓ Custom Subdomains & Styling</li>
                <li>✓ Advanced Template Options</li>
                <li>✓ Priority Customer Support</li>
              </ul>
            </div>
            <button className="btn btn-primary" onClick={onNavigateToRegister}>Start Free Trial</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        <div>
          <p>&copy; {new Date().getFullYear()} ManaCity. All rights reserved.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigateToPrivacy(); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigateToTerms(); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/delete-account" onClick={(e) => { e.preventDefault(); onNavigateToDelete(); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Delete Account</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
