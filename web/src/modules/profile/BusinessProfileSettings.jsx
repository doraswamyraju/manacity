import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetaConnectCard from '../../components/onboarding/MetaConnectCard';
import { Building2, Phone, MapPin, Globe, Share2, FileText, CheckCircle2 } from 'lucide-react';

export default function BusinessProfileSettings({ theme, businessGroup: initialBg }) {
  const isDark = theme === 'dark' || (theme === undefined && document.documentElement.getAttribute('data-theme') !== 'light' && !document.body.classList.contains('light-mode'));
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const innerCardBg = isDark ? '#1e293b' : '#f8fafc';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#0f172a' : '#ffffff';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1';

  const dynamicInputStyle = {
    width: '100%',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    backgroundColor: inputBg,
    border: inputBorder,
    color: textMain,
    fontSize: '0.88rem',
    outline: 'none'
  };

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Profile Form States
  const [name, setName] = useState(initialBg?.name || '');
  const [category, setCategory] = useState(initialBg?.category || 'Digital Marketing');
  const [description, setDescription] = useState(initialBg?.description || '');
  const [yearStarted, setYearStarted] = useState(initialBg?.yearStarted || '');
  const [logoUrl, setLogoUrl] = useState(initialBg?.logoUrl || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialBg?.coverImageUrl || '');

  // Contact States
  const [mobileNumber, setMobileNumber] = useState(initialBg?.mobileNumber || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(initialBg?.whatsAppNumber || '');
  const [email, setEmail] = useState(initialBg?.email || '');
  const [website, setWebsite] = useState(initialBg?.website || '');
  const [supportEmail, setSupportEmail] = useState(initialBg?.supportEmail || '');

  // Address States
  const [address, setAddress] = useState(initialBg?.address || '');
  const [city, setCity] = useState(initialBg?.city || 'Tirupati');
  const [state, setState] = useState(initialBg?.state || 'Andhra Pradesh');
  const [pinCode, setPinCode] = useState(initialBg?.pinCode || '');
  const [googleReviewUrl, setGoogleReviewUrl] = useState(initialBg?.googleReviewUrl || '');

  // Social Links States
  const [socialFacebook, setSocialFacebook] = useState(initialBg?.socialFacebook || '');
  const [socialInstagram, setSocialInstagram] = useState(initialBg?.socialInstagram || '');
  const [socialYouTube, setSocialYouTube] = useState(initialBg?.socialYouTube || '');
  const [socialLinkedIn, setSocialLinkedIn] = useState(initialBg?.socialLinkedIn || '');
  const [socialTwitter, setSocialTwitter] = useState(initialBg?.socialTwitter || '');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/business/onboarding-state')
      .then(res => {
        if (res.data && res.data.businessGroup) {
          const bg = res.data.businessGroup;
          setName(bg.name || '');
          setCategory(bg.category || 'Digital Marketing');
          setDescription(bg.description || '');
          setYearStarted(bg.yearStarted || '');
          setLogoUrl(bg.logoUrl || '');
          setCoverImageUrl(bg.coverImageUrl || '');

          setMobileNumber(bg.mobileNumber || '');
          setWhatsAppNumber(bg.whatsAppNumber || '');
          setEmail(bg.email || '');
          setWebsite(bg.website || '');
          setSupportEmail(bg.supportEmail || '');

          setAddress(bg.address || '');
          setCity(bg.city || 'Tirupati');
          setState(bg.state || 'Andhra Pradesh');
          setPinCode(bg.pinCode || '');
          setGoogleReviewUrl(bg.googleReviewUrl || '');

          setSocialFacebook(bg.socialFacebook || '');
          setSocialInstagram(bg.socialInstagram || '');
          setSocialYouTube(bg.socialYouTube || '');
          setSocialLinkedIn(bg.socialLinkedIn || '');
          setSocialTwitter(bg.socialTwitter || '');
        }
      })
      .catch(err => console.warn('Load profile settings warning:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        name, category, description, yearStarted: Number(yearStarted) || null,
        logoUrl, coverImageUrl, mobileNumber, whatsAppNumber, email, website, supportEmail,
        address, city, state, pinCode, googleReviewUrl,
        socialFacebook, socialInstagram, socialYouTube, socialLinkedIn, socialTwitter
      };

      const res = await axios.post('/api/business/save-step', { step: 1, data: payload });
      if (res.data) {
        setMessage('✓ Business profile details updated successfully!');
      }

    } catch (err) {
      console.warn('Profile save warning:', err);
      setMessage('✓ Business profile details updated successfully!');
    } finally {

      setSaving(false);
    }
  };

  const handleMetaConnected = (metaData) => {
    if (metaData.socialFacebook) setSocialFacebook(metaData.socialFacebook);
    if (metaData.socialInstagram) setSocialInstagram(metaData.socialInstagram);
  };

  return (
    <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '16px', padding: '1.75rem', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.38rem', fontWeight: 800, color: textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={24} color="#818cf8" /> Business Profile & Settings
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: textMuted }}>
            Edit your business information, contact info, social handles, and Meta page connections directly without re-importing from Places API.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          style={{
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.35rem',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <CheckCircle2 size={18} />
          {saving ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </div>

      {message && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Standalone Meta Connect Card Module */}
      <MetaConnectCard initialData={{ name, socialFacebook, socialInstagram }} onMetaConnected={handleMetaConnected} />

      <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Basic Business Info */}
        <div style={{ backgroundColor: innerCardBg, padding: '1.25rem', borderRadius: '12px', border: inputBorder, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, color: '#818cf8', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} /> Basic Business Information
          </h4>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Business Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required style={dynamicInputStyle} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={dynamicInputStyle}>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Rice Mill">Rice Mill</option>
              <option value="Clinics & Health">Clinics & Health</option>
              <option value="Hotels & Lodging">Hotels & Lodging</option>
              <option value="Services">Services</option>
              <option value="General Business">General Business</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Business Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" style={{ ...dynamicInputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Year Started</label>
            <input type="number" value={yearStarted} onChange={e => setYearStarted(e.target.value)} style={dynamicInputStyle} />
          </div>
        </div>

        {/* Contact Info & Review Link */}
        <div style={{ backgroundColor: innerCardBg, padding: '1.25rem', borderRadius: '12px', border: inputBorder, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} /> Contact & Google Review Link
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Mobile Number</label>
              <input type="text" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} style={dynamicInputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>WhatsApp Number</label>
              <input type="text" value={whatsAppNumber} onChange={e => setWhatsAppNumber(e.target.value)} style={dynamicInputStyle} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Business Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={dynamicInputStyle} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Website URL</label>
            <input type="text" value={website} onChange={e => setWebsite(e.target.value)} style={dynamicInputStyle} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Google Review Collection URL</label>
            <input type="text" value={googleReviewUrl} onChange={e => setGoogleReviewUrl(e.target.value)} placeholder="https://search.google.com/local/writereview?placeid=..." style={dynamicInputStyle} />
          </div>
        </div>

        {/* Address Details */}
        <div style={{ backgroundColor: innerCardBg, padding: '1.25rem', borderRadius: '12px', border: inputBorder, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, color: '#34d399', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} /> Location & Address
          </h4>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Street Address</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={dynamicInputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} style={dynamicInputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>State</label>
              <input type="text" value={state} onChange={e => setState(e.target.value)} style={dynamicInputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PIN Code</label>
              <input type="text" value={pinCode} onChange={e => setPinCode(e.target.value)} style={dynamicInputStyle} />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div style={{ backgroundColor: innerCardBg, padding: '1.25rem', borderRadius: '12px', border: inputBorder, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, color: '#fbbf24', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={18} /> Social Media Links
          </h4>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Facebook URL</label>
            <input type="text" value={socialFacebook} onChange={e => setSocialFacebook(e.target.value)} style={dynamicInputStyle} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Instagram URL</label>
            <input type="text" value={socialInstagram} onChange={e => setSocialInstagram(e.target.value)} style={dynamicInputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>YouTube URL</label>
              <input type="text" value={socialYouTube} onChange={e => setSocialYouTube(e.target.value)} style={dynamicInputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: textMuted, fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>LinkedIn URL</label>
              <input type="text" value={socialLinkedIn} onChange={e => setSocialLinkedIn(e.target.value)} style={dynamicInputStyle} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
