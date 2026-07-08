import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Step 1: Business Information ---
function StepBusinessInfo({ initialData, onNext, onSaveDraft }) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [yearStarted, setYearStarted] = useState(initialData.yearStarted || '');
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData.coverImageUrl || '');
  const [error, setError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append('media', file);
      const response = await axios.post('/api/business/media', formData);
      if (type === 'logo') setLogoUrl(response.data.url);
      else setCoverImageUrl(response.data.url);
    } catch (err) {
      setError('File upload failed.');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingCover(false);
    }
  };

  const handleNext = () => {
    if (!name.trim()) {
      setError('Business Name is required.');
      return;
    }
    if (description && description.length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    setError('');
    const data = { name, description, yearStarted, logoUrl, coverImageUrl };
    onNext(data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 1: Business Information</h3>
      
      {error && <div style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Business Name *</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Acme Corporation"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Business Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Describe your business services or products..."
          rows="3"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Year Started</label>
        <input 
          type="number" 
          value={yearStarted} 
          onChange={(e) => setYearStarted(e.target.value)} 
          placeholder="e.g. 2020"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Business Logo</label>
          <input type="file" onChange={(e) => handleUpload(e, 'logo')} accept="image/*" />
          {logoUrl && <img src={logoUrl} alt="Logo Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginTop: '0.5rem' }} />}
          {uploadingLogo && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uploading...</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Cover Image</label>
          <input type="file" onChange={(e) => handleUpload(e, 'cover')} accept="image/*" />
          {coverImageUrl && <img src={coverImageUrl} alt="Cover Preview" style={{ width: '100%', height: '60px', borderRadius: '4px', objectFit: 'cover', marginTop: '0.5rem' }} />}
          {uploadingCover && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uploading...</span>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={handleNext}>Next Step</button>
      </div>
    </div>
  );
}

// --- Step 2: Contact Information ---
function StepContactInfo({ initialData, onNext, onBack }) {
  const [mobileNumber, setMobileNumber] = useState(initialData.mobileNumber || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(initialData.whatsAppNumber || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [website, setWebsite] = useState(initialData.website || '');
  const [supportEmail, setSupportEmail] = useState(initialData.supportEmail || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mobileNumber && !phoneRegex.test(mobileNumber)) {
      setError('Mobile Number must be a valid 10-digit number.');
      return;
    }
    if (whatsAppNumber && !phoneRegex.test(whatsAppNumber)) {
      setError('WhatsApp Number must be a valid 10-digit number.');
      return;
    }
    if (email && !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (supportEmail && !emailRegex.test(supportEmail)) {
      setError('Please enter a valid support email address.');
      return;
    }

    setError('');
    onNext({ mobileNumber, whatsAppNumber, email, website, supportEmail });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 2: Contact Information</h3>

      {error && <div style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Mobile Number</label>
        <input 
          type="text" 
          value={mobileNumber} 
          onChange={(e) => setMobileNumber(e.target.value)} 
          placeholder="10-digit mobile number"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>WhatsApp Number</label>
        <input 
          type="text" 
          value={whatsAppNumber} 
          onChange={(e) => setWhatsAppNumber(e.target.value)} 
          placeholder="10-digit WhatsApp number"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Business Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="contact@company.com"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Website URL</label>
        <input 
          type="text" 
          value={website} 
          onChange={(e) => setWebsite(e.target.value)} 
          placeholder="https://company.com"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Support Email</label>
        <input 
          type="email" 
          value={supportEmail} 
          onChange={(e) => setSupportEmail(e.target.value)} 
          placeholder="support@company.com"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next Step</button>
      </div>
    </div>
  );
}

// --- Step 3: Address ---
function StepAddress({ initialData, onNext, onBack }) {
  const [country, setCountry] = useState(initialData.country || '');
  const [state, setState] = useState(initialData.state || '');
  const [city, setCity] = useState(initialData.city || '');
  const [areaLocality, setAreaLocality] = useState(initialData.areaLocality || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [pinCode, setPinCode] = useState(initialData.pinCode || '');
  const [googleMapsLink, setGoogleMapsLink] = useState(initialData.googleMapsLink || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!country || !state || !city || !pinCode || !address) {
      setError('Please fill in all mandatory address fields.');
      return;
    }
    setError('');
    onNext({ country, state, city, areaLocality, address, pinCode, googleMapsLink });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 3: Address Details</h3>

      {error && <div style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Country *</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. India" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>State *</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Andhra Pradesh" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>City *</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Tirupati" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Area / Locality</label>
          <input type="text" value={areaLocality} onChange={(e) => setAreaLocality(e.target.value)} placeholder="e.g. Karakambadi" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Full Street Address *</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House/Flat No, Building, Street Name" style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>PIN Code *</label>
          <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="6-digit PIN" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Google Maps Link (Optional)</label>
          <input type="text" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} placeholder="https://maps.app.goo.gl/..." style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next Step</button>
      </div>
    </div>
  );
}

// --- Step 4: Business Details ---
function StepBusinessDetails({ initialData, onNext, onBack }) {
  const [workingDays, setWorkingDays] = useState(initialData.workingDays || []);
  const [businessHours, setBusinessHours] = useState(initialData.businessHours || { open: '09:00', close: '18:00' });
  const [languagesSpoken, setLanguagesSpoken] = useState(initialData.languagesSpoken || []);
  const [servicesOffered, setServicesOffered] = useState(initialData.servicesOffered || []);
  const [productsOffered, setProductsOffered] = useState(initialData.productsOffered || []);
  const [paymentMethods, setPaymentMethods] = useState(initialData.paymentMethods || []);
  
  // Reusable business documents list
  const [documents, setDocuments] = useState(initialData.documents || [
    { type: 'GST', value: '' },
    { type: 'UDYAM', value: '' },
    { type: 'FSSAI', value: '' },
    { type: 'SHOP_LICENSE', value: '' }
  ]);

  const [newLanguage, setNewLanguage] = useState('');
  const [newService, setNewService] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [error, setError] = useState('');

  const handleDayToggle = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handlePaymentToggle = (method) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const handleDocumentChange = (type, val) => {
    setDocuments(documents.map(doc => doc.type === type ? { ...doc, value: val } : doc));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languagesSpoken.includes(newLanguage.trim())) {
      setLanguagesSpoken([...languagesSpoken, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleAddService = () => {
    if (newService.trim() && !servicesOffered.includes(newService.trim())) {
      setServicesOffered([...servicesOffered, newService.trim()]);
      setNewService('');
    }
  };

  const handleAddProduct = () => {
    if (newProduct.trim() && !productsOffered.includes(newProduct.trim())) {
      setProductsOffered([...productsOffered, newProduct.trim()]);
      setNewProduct('');
    }
  };

  const handleNext = () => {
    if (workingDays.length === 0) {
      setError('Please select at least one Working Day.');
      return;
    }
    setError('');
    onNext({
      workingDays,
      businessHours,
      languagesSpoken,
      servicesOffered,
      productsOffered,
      paymentMethods,
      documents
    });
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const allPaymentMethods = ['UPI', 'Cash', 'Credit/Debit Card', 'Net Banking'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 4: Business Details & Documents</h3>

      {error && <div style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Working Days *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {daysOfWeek.map(day => {
            const selected = workingDays.includes(day);
            return (
              <button 
                key={day} 
                type="button"
                onClick={() => handleDayToggle(day)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: selected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Opening Time</label>
          <input type="time" value={businessHours.open} onChange={(e) => setBusinessHours({ ...businessHours, open: e.target.value })} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Closing Time</label>
          <input type="time" value={businessHours.close} onChange={(e) => setBusinessHours({ ...businessHours, close: e.target.value })} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Languages Spoken</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} placeholder="e.g. English" style={inputStyle} />
          <button type="button" className="btn btn-secondary" onClick={handleAddLanguage}>Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
          {languagesSpoken.map(lang => (
            <span key={lang} style={chipStyle} onClick={() => setLanguagesSpoken(languagesSpoken.filter(l => l !== lang))}>{lang} ✗</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Services Offered</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="e.g. Consultation" style={inputStyle} />
          <button type="button" className="btn btn-secondary" onClick={handleAddService}>Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
          {servicesOffered.map(service => (
            <span key={service} style={chipStyle} onClick={() => setServicesOffered(servicesOffered.filter(s => s !== service))}>{service} ✗</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Products Offered</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} placeholder="e.g. Web Template" style={inputStyle} />
          <button type="button" className="btn btn-secondary" onClick={handleAddProduct}>Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
          {productsOffered.map(product => (
            <span key={product} style={chipStyle} onClick={() => setProductsOffered(productsOffered.filter(p => p !== product))}>{product} ✗</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Payment Methods</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {allPaymentMethods.map(method => {
            const selected = paymentMethods.includes(method);
            return (
              <button 
                key={method} 
                type="button"
                onClick={() => handlePaymentToggle(method)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: selected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {method}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Business Documents (Optional)</h4>
        {documents.map(doc => (
          <div key={doc.type} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{doc.type}</label>
            <input 
              type="text" 
              value={doc.value} 
              onChange={(e) => handleDocumentChange(doc.type, e.target.value)} 
              placeholder={`Enter ${doc.type} ID`}
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next Step</button>
      </div>
    </div>
  );
}

// --- Step 5: Social Links ---
function StepSocialLinks({ initialData, onNext, onBack }) {
  const [socialFacebook, setSocialFacebook] = useState(initialData.socialFacebook || '');
  const [socialInstagram, setSocialInstagram] = useState(initialData.socialInstagram || '');
  const [socialYouTube, setSocialYouTube] = useState(initialData.socialYouTube || '');
  const [socialLinkedIn, setSocialLinkedIn] = useState(initialData.socialLinkedIn || '');
  const [socialTwitter, setSocialTwitter] = useState(initialData.socialTwitter || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    if (socialFacebook && !urlRegex.test(socialFacebook)) {
      setError('Please enter a valid URL for Facebook.');
      return;
    }
    if (socialInstagram && !urlRegex.test(socialInstagram)) {
      setError('Please enter a valid URL for Instagram.');
      return;
    }
    if (socialYouTube && !urlRegex.test(socialYouTube)) {
      setError('Please enter a valid URL for YouTube.');
      return;
    }
    if (socialLinkedIn && !urlRegex.test(socialLinkedIn)) {
      setError('Please enter a valid URL for LinkedIn.');
      return;
    }
    if (socialTwitter && !urlRegex.test(socialTwitter)) {
      setError('Please enter a valid URL for X/Twitter.');
      return;
    }

    setError('');
    onNext({ socialFacebook, socialInstagram, socialYouTube, socialLinkedIn, socialTwitter });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 5: Social Links</h3>

      {error && <div style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Facebook URL</label>
        <input type="text" value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="https://facebook.com/your-page" style={inputStyle} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Instagram URL</label>
        <input type="text" value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} placeholder="https://instagram.com/your-profile" style={inputStyle} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>YouTube Channel URL</label>
        <input type="text" value={socialYouTube} onChange={(e) => setSocialYouTube(e.target.value)} placeholder="https://youtube.com/c/your-channel" style={inputStyle} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>LinkedIn Page URL</label>
        <input type="text" value={socialLinkedIn} onChange={(e) => setSocialLinkedIn(e.target.value)} placeholder="https://linkedin.com/company/your-company" style={inputStyle} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>X / Twitter URL</label>
        <input type="text" value={socialTwitter} onChange={(e) => setSocialTwitter(e.target.value)} placeholder="https://x.com/your-profile" style={inputStyle} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next Step</button>
      </div>
    </div>
  );
}

// --- Step 6: Completion / Review ---
function StepCompletion({ summaryData, onComplete, onBack, onNavigateToStep }) {
  const documentsList = summaryData.documents || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 6: Review & Submit</h3>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Please review all your onboarding details below before finalizing your profile.</p>

      {/* Review Card */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h4 style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', color: 'var(--accent-secondary)' }}>
            Business Info <span style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--accent-primary)' }} onClick={() => onNavigateToStep(1)}>Edit</span>
          </h4>
          <p><strong>Name:</strong> {summaryData.name}</p>
          <p><strong>Description:</strong> {summaryData.description || 'N/A'}</p>
          <p><strong>Year Started:</strong> {summaryData.yearStarted || 'N/A'}</p>
        </div>

        <div>
          <h4 style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', color: 'var(--accent-secondary)' }}>
            Contact Info <span style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--accent-primary)' }} onClick={() => onNavigateToStep(2)}>Edit</span>
          </h4>
          <p><strong>Mobile:</strong> {summaryData.mobileNumber || 'N/A'}</p>
          <p><strong>WhatsApp:</strong> {summaryData.whatsAppNumber || 'N/A'}</p>
          <p><strong>Email:</strong> {summaryData.email || 'N/A'}</p>
          <p><strong>Website:</strong> {summaryData.website || 'N/A'}</p>
        </div>

        <div>
          <h4 style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', color: 'var(--accent-secondary)' }}>
            Address <span style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--accent-primary)' }} onClick={() => onNavigateToStep(3)}>Edit</span>
          </h4>
          <p><strong>City/Country:</strong> {summaryData.city}, {summaryData.country}</p>
          <p><strong>Full Address:</strong> {summaryData.address} ({summaryData.pinCode})</p>
        </div>

        <div>
          <h4 style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', color: 'var(--accent-secondary)' }}>
            Business Details & Documents <span style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--accent-primary)' }} onClick={() => onNavigateToStep(4)}>Edit</span>
          </h4>
          <p><strong>Working Days:</strong> {summaryData.workingDays ? summaryData.workingDays.join(', ') : 'N/A'}</p>
          <p><strong>Languages Spoken:</strong> {summaryData.languagesSpoken ? summaryData.languagesSpoken.join(', ') : 'N/A'}</p>
          <p><strong>Services:</strong> {summaryData.servicesOffered ? summaryData.servicesOffered.join(', ') : 'N/A'}</p>
          <p><strong>Products:</strong> {summaryData.productsOffered ? summaryData.productsOffered.join(', ') : 'N/A'}</p>
          <p><strong>Payment Methods:</strong> {summaryData.paymentMethods ? summaryData.paymentMethods.join(', ') : 'N/A'}</p>
          
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Documents:</strong>
            {documentsList.filter(d => d.value).map(doc => (
              <p key={doc.type} style={{ fontSize: '0.85rem', marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>• {doc.type}: {doc.value}</p>
            ))}
            {documentsList.filter(d => d.value).length === 0 && <p style={{ fontSize: '0.85rem', marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>No documents added</p>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onComplete}>Complete Onboarding</button>
      </div>
    </div>
  );
}

// --- Main Wizard Controller Page ---
export default function OnboardingWizard({ onCompleteOnboarding, onCancel }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Fetch onboarding state from backend
    axios.get('/api/business/onboarding-state')
      .then(res => {
        const bg = res.data.businessGroup;
        // Map database state to layout fields
        setFormData({
          name: bg.name || '',
          description: bg.description || '',
          yearStarted: bg.yearStarted || '',
          logoUrl: bg.logoUrl || '',
          coverImageUrl: bg.coverImageUrl || '',
          mobileNumber: bg.mobileNumber || '',
          whatsAppNumber: bg.whatsAppNumber || '',
          email: bg.email || '',
          website: bg.website || '',
          supportEmail: bg.supportEmail || '',
          country: bg.country || '',
          state: bg.state || '',
          city: bg.city || '',
          areaLocality: bg.areaLocality || '',
          address: bg.address || '',
          pinCode: bg.pinCode || '',
          googleMapsLink: bg.googleMapsLink || '',
          workingDays: bg.workingDays || [],
          businessHours: bg.businessHours || { open: '09:00', close: '18:00' },
          languagesSpoken: bg.languages ? bg.languages.map(l => l.language) : [],
          servicesOffered: bg.services ? bg.services.map(s => s.name) : [],
          productsOffered: bg.products ? bg.products.map(p => p.name) : [],
          paymentMethods: bg.paymentMethods ? bg.paymentMethods.map(m => m.methodName) : [],
          documents: bg.documents || [
            { type: 'GST', value: '' },
            { type: 'UDYAM', value: '' },
            { type: 'FSSAI', value: '' },
            { type: 'SHOP_LICENSE', value: '' }
          ],
          socialFacebook: bg.socialFacebook || '',
          socialInstagram: bg.socialInstagram || '',
          socialYouTube: bg.socialYouTube || '',
          socialLinkedIn: bg.socialLinkedIn || '',
          socialTwitter: bg.socialTwitter || '',
        });
        // Resume from last saved step (if onboarding incomplete)
        if (!bg.isSetupComplete && bg.setupStep) {
          setStep(bg.setupStep);
        }
      })
      .catch(err => console.error('Failed to load onboarding status:', err))
      .finally(() => setLoading(false));
  }, []);

  const saveStepProgress = async (nextStep, updatedData) => {
    setSaving(true);
    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);

    try {
      await axios.post('/api/business/save-step', {
        step: nextStep,
        data: updatedData
      });
      setStep(nextStep);
    } catch (err) {
      console.error('Failed to auto-save progress:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    setSaving(true);
    try {
      const response = await axios.post('/api/business/complete-onboarding');
      if (response.data.status === 'success') {
        onCompleteOnboarding(response.data.businessGroup);
      }
    } catch (err) {
      console.error('Failed to finalize onboarding:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        <h3>Loading Wizard...</h3>
      </div>
    );
  }

  // Calculate Onboarding Percentage (out of 5 input steps)
  const progressPercent = Math.min(Math.round(((step - 1) / 5) * 100), 100);

  return (
    <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
      {/* Wizard Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Business Onboarding</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure your profile to unlock full platform capability.</p>
        
        {/* Progress Bar */}
        <div style={{ marginTop: '1.25rem', width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--accent-secondary)', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
          <span>Progress: {progressPercent}%</span>
          {saving && <span style={{ color: 'var(--accent-secondary)' }}>Auto-saving...</span>}
        </div>
      </div>

      {step === 1 && (
        <StepBusinessInfo 
          initialData={formData} 
          onNext={(data) => saveStepProgress(2, data)} 
        />
      )}

      {step === 2 && (
        <StepContactInfo 
          initialData={formData} 
          onNext={(data) => saveStepProgress(3, data)} 
          onBack={() => setStep(1)} 
        />
      )}

      {step === 3 && (
        <StepAddress 
          initialData={formData} 
          onNext={(data) => saveStepProgress(4, data)} 
          onBack={() => setStep(2)} 
        />
      )}

      {step === 4 && (
        <StepBusinessDetails 
          initialData={formData} 
          onNext={(data) => saveStepProgress(5, data)} 
          onBack={() => setStep(3)} 
        />
      )}

      {step === 5 && (
        <StepSocialLinks 
          initialData={formData} 
          onNext={(data) => saveStepProgress(6, data)} 
          onBack={() => setStep(4)} 
        />
      )}

      {step === 6 && (
        <StepCompletion 
          summaryData={formData} 
          onComplete={handleFinalSubmit} 
          onBack={() => setStep(5)} 
          onNavigateToStep={(s) => setStep(s)} 
        />
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <span 
          onClick={onCancel}
          style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Cancel and return to Dashboard
        </span>
      </div>
    </div>
  );
}

// Styling Constants
const inputStyle = {
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  width: '100%',
  boxSizing: 'border-box'
};

const chipStyle = {
  backgroundColor: 'rgba(25, 118, 210, 0.1)',
  border: '1px solid var(--border-color)',
  color: 'var(--accent-secondary)',
  padding: '0.25rem 0.5rem',
  borderRadius: '12px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem'
};
