import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Clock, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

export default function UnonboardedEnquiryModal({ isOpen, onClose, targetBusiness }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceRequested, setServiceRequested] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setCustomerName(u.name);
        if (u.phone) setCustomerPhone(u.phone);
        if (u.email) setCustomerEmail(u.email);
      }
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/external-leads/submit', {
        googlePlaceId: targetBusiness?.place_id || targetBusiness?.id || 'google_place_unonboarded',
        businessName: targetBusiness?.name || targetBusiness?.businessName,
        businessPhone: targetBusiness?.phone || targetBusiness?.formatted_phone_number || null,
        businessAddress: targetBusiness?.address || targetBusiness?.vicinity || null,
        customerName,
        customerPhone,
        customerEmail,
        serviceRequested,
        message
      });

      if (res.data?.status === 'success') {
        setSubmittedLead(res.data.lead);

        // Fetch fallback recommended onboarded businesses right away as backup options
        try {
          const statusRes = await axios.get(`/api/external-leads/status/${res.data.lead.id}`);
          if (statusRes.data?.alternativeBusinesses) {
            setAlternatives(statusRes.data.alternativeBusinesses);
          }
        } catch (e) {
          console.warn('Could not fetch alternatives:', e);
        }
      } else {
        setError(res.data?.error || 'Failed to send enquiry.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle} aria-label="Close modal">
          <X size={20} />
        </button>

        {submittedLead ? (
          <div>
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <CheckCircle2 size={50} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', margin: '0 0 6px 0' }}>
                Enquiry Sent to {targetBusiness?.name}!
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                We have dispatched your request to the business contact.
              </p>
            </div>

            <div style={slaBoxStyle}>
              <Clock size={20} color="#eab308" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: '#fef08a' }}>
                <strong>24-Hour SLA Protection:</strong> If this business does not claim their ManaCity profile or respond within 24 hours, you will receive recommendations for top-rated verified service providers.
              </div>
            </div>

            {alternatives && alternatives.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  Verified Service Providers on ManaCity (Available Now)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {alternatives.map((alt) => (
                    <div key={alt.id} style={altCardStyle}>
                      <Building2 size={18} color="#3b82f6" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{alt.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{alt.areaLocality || alt.city || 'Verified Business'}</div>
                      </div>
                      <span style={verifiedBadgeStyle}>Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={onClose} style={{ ...primaryButtonStyle, width: '100%', marginTop: '20px' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 4px 0' }}>
                Send Enquiry to {targetBusiness?.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                {targetBusiness?.address || targetBusiness?.vicinity || 'Local Business'}
              </p>
            </div>

            {error && <div style={errorBoxStyle}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Service Requested / Product Needed</label>
                <input
                  type="text"
                  placeholder="e.g. AC Repair, Catering service, Price quote"
                  value={serviceRequested}
                  onChange={(e) => setServiceRequested(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Message Details</label>
                <textarea
                  rows={3}
                  placeholder="Explain your requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              <button type="submit" disabled={loading} style={primaryButtonStyle}>
                {loading ? 'Dispatching Enquiry...' : 'Send Enquiry Now'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '16px'
};

const modalStyle = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
  position: 'relative',
  border: '1px solid #334155',
  color: '#f8fafc',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer'
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#cbd5e1',
  marginBottom: '4px',
  display: 'block'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: '#fff',
  fontSize: '14px',
  outline: 'none'
};

const errorBoxStyle = {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '6px',
  padding: '10px',
  color: '#fca5a5',
  fontSize: '13px',
  marginBottom: '12px'
};

const slaBoxStyle = {
  backgroundColor: 'rgba(234, 179, 8, 0.1)',
  border: '1px solid rgba(234, 179, 8, 0.3)',
  borderRadius: '8px',
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '12px'
};

const altCardStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '6px',
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const verifiedBadgeStyle = {
  fontSize: '10px',
  fontWeight: '700',
  color: '#10b981',
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  borderRadius: '4px',
  padding: '2px 6px'
};

const primaryButtonStyle = {
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '10px 18px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '14px'
};
