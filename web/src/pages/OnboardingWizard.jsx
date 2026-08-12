import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper to extract dominant primary and secondary color palette from uploaded logo
export function extractColorsFromLogo(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        const colorCounts = {};

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          if (a < 125) continue;
          if (r > 235 && g > 235 && b > 235) continue; // skip white
          if (r < 25 && g < 25 && b < 25) continue; // skip black

          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
        const primary = sortedColors[0] || '#6366f1';
        const secondary = sortedColors[1] || '#38bdf8';
        resolve({ primaryColor: primary, secondaryColor: secondary });
      } catch (e) {
        resolve({ primaryColor: '#6366f1', secondaryColor: '#38bdf8' });
      }
    };
    img.onerror = () => resolve({ primaryColor: '#6366f1', secondaryColor: '#38bdf8' });
    img.src = imageSrc;
  });
}

// --- Step 1: Business Information & Google Places Importer ---
function StepBusinessInfo({ initialData, onNext, onAutoFill }) {
  const [name, setName] = useState(initialData.name || '');
  const [category, setCategory] = useState(initialData.category || 'Digital Marketing');
  const [description, setDescription] = useState(initialData.description || '');
  const [yearStarted, setYearStarted] = useState(initialData.yearStarted || '');
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData.coverImageUrl || '');
  const [primaryColor, setPrimaryColor] = useState(initialData.primaryColor || '#6366f1');
  const [secondaryColor, setSecondaryColor] = useState(initialData.secondaryColor || '#38bdf8');
  const [error, setError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Sync state if initialData is updated via auto-fill
  useEffect(() => {
    if (initialData.name) setName(initialData.name);
    if (initialData.category) setCategory(initialData.category);
    if (initialData.description) setDescription(initialData.description);
    if (initialData.logoUrl) {
      setLogoUrl(initialData.logoUrl);
      extractColorsFromLogo(initialData.logoUrl).then(palette => {
        setPrimaryColor(palette.primaryColor);
        setSecondaryColor(palette.secondaryColor);
      });
    }
    if (initialData.coverImageUrl) setCoverImageUrl(initialData.coverImageUrl);
  }, [initialData]);

  // Google Places Importer State
  const [placesQuery, setPlacesQuery] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchingPredictions, setSearchingPredictions] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Debounced Autocomplete fetch
  useEffect(() => {
    if (!placesQuery.trim() || selectedPlaceId) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingPredictions(true);
      try {
        const res = await axios.get(`/api/phase1/google-places/autocomplete?input=${encodeURIComponent(placesQuery)}`);
        if (res.data && res.data.predictions) {
          setPredictions(res.data.predictions);
          setShowDropdown(res.data.predictions.length > 0);
          setError('');
        }
      } catch (err) {
        console.warn('Autocomplete fetch error:', err);
        const apiErrMsg = err.response?.data?.error || err.message;
        setError(apiErrMsg);
      } finally {
        setSearchingPredictions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [placesQuery, selectedPlaceId]);

  const handleSelectPrediction = (prediction) => {
    setPlacesQuery(prediction.name);
    setSelectedPlaceId(prediction.placeId);
    setShowDropdown(false);
  };

  const handleGooglePlacesImport = async () => {
    if (!placesQuery.trim()) {
      setError('Please type a business name to search on Google Places.');
      return;
    }
    setImporting(true);
    setError('');
    setImportSuccess(false);
    try {
      // Send Google Places Search & Import request with optional placeId
      const res = await axios.post('/api/phase1/google-places/import', {
        businessName: placesQuery,
        placeId: selectedPlaceId
      });

      if (res.data && res.data.data) {
        const place = res.data.data.importedPlace;
        const parsed = place.parsedAddress || {};

        setName(place.name || name);
        if (place.category) setCategory(place.category);
        setDescription(`Official Google Business profile for ${place.name || name}. Rating: ${place.rating || '4.8'}/5.`);
        setImportSuccess(true);

        if (onAutoFill) {
          const autoReviewUrl = place.placeId
            ? `https://search.google.com/local/writereview?placeid=${place.placeId}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((place.name || name) + ' ' + (parsed.city || 'Tirupati'))}`;

          onAutoFill({
            name: place.name,
            category: place.category || 'Digital Marketing',
            description: `Official Google Business profile for ${place.name}. Rating: ${place.rating || '4.8'}/5.`,
            address: parsed.street || place.address || '',
            city: parsed.city || 'Tirupati',
            state: parsed.state || 'Andhra Pradesh',
            country: parsed.country || 'India',
            pinCode: parsed.pinCode || '517501',
            mobileNumber: place.phone || '',
            whatsAppNumber: place.phone || '',
            website: place.website || '',
            googleReviewUrl: autoReviewUrl,
            supportEmail: ''
          });
        }
      }
    } catch (err) {
      console.error('Google Places Import Error:', err);
      const serverErrMsg = err.response?.data?.error || err.message;
      setError(`Failed to import profile (${serverErrMsg}). You can type your business details manually below.`);
    } finally {
      setImporting(false);
    }
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingCover(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const response = await axios.post('/api/business/media', { base64Data });
        if (type === 'logo') setLogoUrl(response.data.url);
        else setCoverImageUrl(response.data.url);
      };
      reader.readAsDataURL(file);
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
    setError('');
    const data = { name, category, description, yearStarted, logoUrl, coverImageUrl, primaryColor, secondaryColor };
    onNext(data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 1: Business Information & Google Places Import</h3>
      
      {/* Google Places 1-Click Auto Import Box */}
      <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1', padding: '1rem', borderRadius: '10px', marginBottom: '0.5rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#818cf8', display: 'block', marginBottom: '0.4rem' }}>
          ⚡ 1-Click Import from Google Places API
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Type your business name (e.g. Rajugari Ventures)..."
            value={placesQuery}
            onChange={e => {
              setPlacesQuery(e.target.value);
              setSelectedPlaceId(null);
              if (!showDropdown && e.target.value.trim().length >= 2) {
                setShowDropdown(true);
              }
            }}
            onFocus={() => { if (placesQuery.trim().length >= 2) setShowDropdown(true); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleGooglePlacesImport(); } }}
            style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.85rem' }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGooglePlacesImport}
            disabled={importing}
            style={{ backgroundColor: '#6366f1', fontSize: '0.85rem', padding: '0.6rem 1rem' }}
          >
            {importing ? 'Importing...' : 'Auto-Import'}
          </button>

          {/* Live Autocomplete Dropdown */}
          {showDropdown && (predictions.length > 0 || searchingPredictions) && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#0f172a',
              border: '1px solid #6366f1',
              borderRadius: '6px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
              zIndex: 9999,
              marginTop: '4px',
              maxHeight: '250px',
              overflowY: 'auto'
            }}>
              {searchingPredictions && (
                <div style={{ padding: '0.6rem 0.8rem', fontSize: '0.8rem', color: '#818cf8' }}>
                  🔍 Searching Google Places matching profiles...
                </div>
              )}
              {predictions.map((p) => (
                <div
                  key={p.placeId}
                  onClick={() => handleSelectPrediction(p)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.25)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.9rem' }}>{p.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {importSuccess && (
          <span style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.5rem', display: 'block', fontWeight: 600 }}>
            ✓ Successfully imported business name, address & rating from Google Places! Redirecting...
          </span>
        )}
      </div>

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
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Business Category *</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          style={selectStyle}
        >
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Rice Mill">Rice Mill</option>
          <option value="Clinics & Health">Clinics & Health</option>
          <option value="Hotels & Lodging">Hotels & Lodging</option>
          <option value="Services">Services</option>
          <option value="General Business">General Business</option>
        </select>
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
  const cleanDigits = (val) => {
    if (!val) return '';
    const digits = val.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits;
  };

  const [mobileNumber, setMobileNumber] = useState(cleanDigits(initialData.mobileNumber));
  const [whatsAppNumber, setWhatsAppNumber] = useState(cleanDigits(initialData.whatsAppNumber));
  const [email, setEmail] = useState(initialData.email || '');
  const [website, setWebsite] = useState(initialData.website || '');
  const [supportEmail, setSupportEmail] = useState(initialData.supportEmail || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData.mobileNumber) setMobileNumber(cleanDigits(initialData.mobileNumber));
    if (initialData.whatsAppNumber) setWhatsAppNumber(cleanDigits(initialData.whatsAppNumber));
    if (initialData.email) setEmail(initialData.email);
    if (initialData.website) setWebsite(initialData.website);
  }, [initialData]);

  const handleNext = () => {
    const phoneDigits = mobileNumber.replace(/\D/g, '');
    const waDigits = whatsAppNumber.replace(/\D/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (phoneDigits && (phoneDigits.length < 10 || phoneDigits.length > 12)) {
      setError('Mobile Number must be a valid 10-digit number.');
      return;
    }
    if (waDigits && (waDigits.length < 10 || waDigits.length > 12)) {
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
    onNext({ mobileNumber: phoneDigits || mobileNumber, whatsAppNumber: waDigits || whatsAppNumber, email, website, supportEmail });
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
  const [country, setCountry] = useState(initialData.country || 'India');
  const [state, setState] = useState(initialData.state || 'Andhra Pradesh');
  const [city, setCity] = useState(initialData.city || 'Tirupati');
  const [areaLocality, setAreaLocality] = useState(initialData.areaLocality || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [pinCode, setPinCode] = useState(initialData.pinCode || '517501');
  const [googleMapsLink, setGoogleMapsLink] = useState(initialData.googleMapsLink || '');
  const [googleReviewUrl, setGoogleReviewUrl] = useState(initialData.googleReviewUrl || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData.country) setCountry(initialData.country);
    if (initialData.state) setState(initialData.state);
    if (initialData.city) setCity(initialData.city);
    if (initialData.address) setAddress(initialData.address);
    if (initialData.pinCode) setPinCode(initialData.pinCode);
    if (initialData.googleReviewUrl) setGoogleReviewUrl(initialData.googleReviewUrl);
  }, [initialData]);

  const handleNext = () => {
    if (!country || !state || !city || !pinCode || !address) {
      setError('Please fill in all mandatory address fields.');
      return;
    }
    setError('');
    onNext({ country, state, city, areaLocality, address, pinCode, googleMapsLink, googleReviewUrl });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Step 3: Address & Online Review Links</h3>

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

      {/* Google Review Collection Link Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
        <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>⭐ Google Profile Link for Review Collection ONLY</label>
        <input 
          type="text" 
          value={googleReviewUrl} 
          onChange={(e) => setGoogleReviewUrl(e.target.value)} 
          placeholder="https://search.google.com/local/writereview?placeid=... or https://g.page/r/.../review" 
          style={inputStyle} 
        />
        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          💡 Used ONLY to direct customers to write official Google reviews for your business profile.
        </span>
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

  // Master Category Library State
  const [libraryItems, setLibraryItems] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  useEffect(() => {
    setLoadingLibrary(true);
    const cat = initialData.category || 'All';
    axios.get(`/api/phase1/library?category=${encodeURIComponent(cat)}`)
      .then(res => {
        if (res.data && res.data.items) {
          setLibraryItems(res.data.items);
        }
      })
      .catch(err => console.warn('Library load error:', err))
      .finally(() => setLoadingLibrary(false));
  }, [initialData.category]);

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

      {/* Category Master Product & Service Library Recommendations */}
      <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid #6366f1', padding: '1rem', borderRadius: '10px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.4rem' }}>
          ⚡ Recommended Master Catalog Items ({initialData.category || 'General Business'})
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Click <strong>+ Add</strong> on any item to attach it directly to your business profile catalog.
        </p>

        {loadingLibrary ? (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading category catalog...</span>
        ) : libraryItems.length === 0 ? (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No catalog suggestions found for this category.</span>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
            {libraryItems.map(item => {
              const isAdded = item.type === 'SERVICE' ? servicesOffered.includes(item.name) : productsOffered.includes(item.name);
              return (
                <div 
                  key={item.id} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: isAdded ? 'rgba(16, 185, 129, 0.1)' : '#0f172a',
                    border: isAdded ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', overflow: 'hidden' }}>
                    <span style={{ color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {item.type} {item.price ? `| ₹${item.price}` : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (item.type === 'SERVICE') {
                        if (!servicesOffered.includes(item.name)) setServicesOffered([...servicesOffered, item.name]);
                      } else {
                        if (!productsOffered.includes(item.name)) setProductsOffered([...productsOffered, item.name]);
                      }
                    }}
                    disabled={isAdded}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: isAdded ? '#10b981' : '#6366f1',
                      color: '#fff',
                      cursor: isAdded ? 'default' : 'pointer',
                      marginLeft: '0.5rem'
                    }}
                  >
                    {isAdded ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
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

  const handleAutoFill = (importedData) => {
    const newFormData = { ...formData, ...importedData };
    setFormData(newFormData);
  };

  const saveStepProgress = async (nextStep, updatedData, directBusinessGroup) => {
    setSaving(true);
    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);

    if (updatedData && updatedData.isSetupComplete) {
      if (directBusinessGroup) {
        onCompleteOnboarding(directBusinessGroup, 'website-builder');
      } else {
        handleFinalSubmit();
      }
      setSaving(false);
      return;
    }

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
        onCompleteOnboarding(response.data.businessGroup, 'website-builder');
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
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#090d16',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{ maxWidth: '650px', width: '100%', padding: '2.5rem' }}>
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
            onNext={(data, directBg) => saveStepProgress(2, data, directBg)} 
            onAutoFill={handleAutoFill}
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

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  backgroundColor: '#0f172a'
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
