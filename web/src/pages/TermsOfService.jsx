import React from 'react';

function TermsOfService() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'left', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <img src="/logo.svg" alt="ManaCity Logo" style={{ maxWidth: '150px', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Last updated: July 6, 2026</p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2>1. Terms Acceptance</h2>
          <p>By accessing or using ManaCity (manacity.in), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        </div>

        <div>
          <h2>2. Description of Service</h2>
          <p>ManaCity is a local business growth platform providing review management, landing page building, customer CRM, and Google Business Profile management integrations. Services are provided on subscription tiers as detailed on our Pricing page.</p>
        </div>

        <div>
          <h2>3. User Account Responsibilities</h2>
          <p>You must provide accurate and complete registration information. You are solely responsible for maintaining the confidentiality of your account credentials and for any activity that occurs under your account. You must notify us immediately of any unauthorized access.</p>
        </div>

        <div>
          <h2>4. Integration with Google Services</h2>
          <p>Our platform allows integrations with third-party products, notably Google Business Profile. By linking your Google account, you grant ManaCity the permissions required to perform updates and read reviews on your behalf. You are responsible for ensuring compliance with Google's own terms of service.</p>
        </div>

        <div>
          <h2>5. Payments, Upgrades & Refunds</h2>
          <p>Subscription fees are billed in advance on a recurring monthly or annual basis. All paid fees are non-refundable. You can cancel your subscription at any time; your cancellation will take effect at the end of the current billing cycle.</p>
        </div>

        <div>
          <h2>6. Termination of Service</h2>
          <p>We reserve the right to suspend or terminate your account at any time, without prior notice, if you violate these terms or engage in activity that harms the platform or other users.</p>
        </div>

        <div>
          <h2>7. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <p>Email: <strong>support@manacity.in</strong></p>
        </div>
      </section>
    </div>
  );
}

export default TermsOfService;
