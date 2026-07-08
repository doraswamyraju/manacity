import React from 'react';

function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'left', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <img src="/logo.svg" alt="ManaCity Logo" style={{ maxWidth: '150px', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Last updated: July 6, 2026</p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2>1. Introduction</h2>
          <p>Welcome to ManaCity, a local business visibility platform developed, owned, and operated by Rajugari Ventures ("we," "our," or "us"). We are committed to protecting your privacy and ensuring a secure experience. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website (manacity.in) and our mobile applications.</p>
        </div>

        <div>
          <h2>2. Information We Collect</h2>
          <p>We collect information to provide better services to all our users. The types of information we collect include:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and login credentials when you register.</li>
            <li><strong>Business & Location Details:</strong> Business name, address, hours of operation, category, and phone number to build and configure your locations and public landing pages.</li>
            <li><strong>Google User Data (with your consent):</strong> If you choose to connect your Google Business Profile, we access and store your profile information, locations, and review data to enable dashboard sync and response generation.</li>
          </ul>
        </div>

        <div>
          <h2>3. How We Use Google OAuth Data</h2>
          <p>ManaCity's use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
          <p>We specifically use your Google Business Profile data to:</p>
          <ul>
            <li>Display real-time reviews on your dashboard.</li>
            <li>Allow you to draft and submit replies to reviews directly from ManaCity.</li>
            <li>Sync operating hours and business details automatically.</li>
          </ul>
          <p>We do <strong>not</strong> share your Google data with third-party advertisers or use it for profiling.</p>
        </div>

        <div>
          <h2>4. Data Deletion & Retention</h2>
          <p>We retain your data only for as long as necessary to provide the services. You can delete your account and all associated data at any time:</p>
          <ul>
            <li>Visit the <strong><a href="/delete-account" style={{ color: 'var(--accent-primary)' }}>Delete Account Page</a></strong>.</li>
            <li>Clicking "Delete Account" will immediately erase your profile information, business configuration, review cache, and connected Google credentials from our databases.</li>
          </ul>
        </div>

        <div>
          <h2>5. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <p>Email: <strong>support@manacity.in</strong></p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
