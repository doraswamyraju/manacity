import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, CheckCircle, ShieldAlert, FileText } from 'lucide-react';

export default function ClaimBusinessModal({ isOpen, onClose, businessInfo }) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [roleInBusiness, setRoleInBusiness] = useState('Owner');
  const [documentType, setDocumentType] = useState('GST');
  const [documentNumber, setDocumentNumber] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a proof document file (GST / MSME / Registration Copy).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('googlePlaceId', businessInfo?.googlePlaceId || '');
      formData.append('businessName', businessInfo?.name || '');
      formData.append('applicantName', applicantName);
      formData.append('applicantPhone', applicantPhone);
      formData.append('applicantEmail', applicantEmail);
      formData.append('roleInBusiness', roleInBusiness);
      formData.append('documentType', documentType);
      formData.append('documentNumber', documentNumber);
      formData.append('documentFile', file);

      const res = await axios.post('/api/claims/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.status === 'success') {
        setSubmitted(true);
      } else {
        setError(res.data?.error || 'Failed to submit claim request.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit claim request. Please try again.');
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

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <CheckCircle size={54} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#10b981' }}>
              Claim Submitted Successfully!
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '20px' }}>
              Thank you! Our verification team will review your proof of ownership ({documentType}) for{' '}
              <strong style={{ color: '#fff' }}>{businessInfo?.name}</strong>. You will receive an update at {applicantPhone}.
            </p>
            <button onClick={onClose} style={primaryButtonStyle}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldAlert size={26} color="#f59e0b" />
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#fff' }}>
                  Claim Business Ownership
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  "{businessInfo?.name || 'This Business'}" is already registered on ManaCity.
                </p>
              </div>
            </div>

            <div style={infoBoxStyle}>
              <FileText size={16} color="#3b82f6" />
              <span>
                Upload a document (GST, MSME, or Business Registration copy) to claim and verify ownership of this business.
              </span>
            </div>

            {error && <div style={errorBoxStyle}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
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
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    placeholder="owner@business.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Role in Business</label>
                  <select
                    value={roleInBusiness}
                    onChange={(e) => setRoleInBusiness(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Owner">Owner / Proprietor</option>
                    <option value="Partner">Partner</option>
                    <option value="Manager">Manager</option>
                    <option value="Authorized Representative">Authorized Representative</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Proof Document Type *</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="GST">GST Registration Certificate</option>
                    <option value="MSME">MSME / Udyam Certificate</option>
                    <option value="REGISTRATION_CERTIFICATE">Shop & Establishment / Trade License</option>
                    <option value="OTHER">Other Business Proof</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Document Registration Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 37AAAAA0000A1Z5"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Upload Proof File (PDF / Image) *</label>
                <div style={fileUploadBoxStyle}>
                  <Upload size={24} color="#3b82f6" />
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ marginTop: '8px' }}
                  />
                  {file && (
                    <span style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>
                      Selected: {file.name}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={onClose} style={secondaryButtonStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={primaryButtonStyle}>
                  {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
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
  maxWidth: '520px',
  position: 'relative',
  border: '1fr solid #334155',
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

const infoBoxStyle = {
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '13px',
  color: '#93c5fd',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px'
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

const fileUploadBoxStyle = {
  border: '2px dashed #334155',
  borderRadius: '8px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#0f172a'
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

const secondaryButtonStyle = {
  backgroundColor: '#334155',
  color: '#cbd5e1',
  border: 'none',
  borderRadius: '6px',
  padding: '10px 16px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '14px'
};
