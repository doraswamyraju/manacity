import React, { useState } from 'react';
import axios from 'axios';
import { Phone, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function PhoneCollectionModal({ isOpen, onClose, onSuccess, token }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/auth/update-phone', { phone }, { headers });

      if (res.data?.status === 'success') {
        if (onSuccess) onSuccess(res.data.user);
        onClose();
      } else {
        setError(res.data?.error || 'Failed to save phone number.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Phone size={24} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>
            Mobile Number Required
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Please provide your 10-digit mobile number to proceed with your business enquiry.
          </p>
        </div>

        {error && <div style={errorBoxStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>10-Digit Mobile Number *</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={infoBoxStyle}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Your contact details are securely shared only with the target business for enquiry response.</span>
          </div>

          <button type="submit" disabled={loading} style={primaryButtonStyle}>
            {loading ? 'Saving Number...' : 'Save Mobile Number & Continue'}
          </button>
        </form>
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
  backgroundColor: 'rgba(0, 0, 0, 0.78)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '16px'
};

const modalStyle = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '24px',
  width: '100%',
  maxWidth: '420px',
  border: '1px solid #334155',
  color: '#f8fafc',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#cbd5e1',
  marginBottom: '6px',
  display: 'block'
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
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

const infoBoxStyle = {
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.25)',
  borderRadius: '6px',
  padding: '10px 12px',
  fontSize: '12px',
  color: '#6ee7b7',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const primaryButtonStyle = {
  backgroundColor: '#38bdf8',
  color: '#0f172a',
  border: 'none',
  borderRadius: '6px',
  padding: '11px 18px',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '14px'
};
