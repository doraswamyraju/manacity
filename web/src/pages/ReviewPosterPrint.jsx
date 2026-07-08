import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReviewPosterPrint() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qr, setQr] = useState(null);
  const [location, setLocation] = useState(null);
  const [template, setTemplate] = useState('poster'); // poster, tent, sticker, card, standee, invoice

  const searchParams = new URLSearchParams(window.location.search);
  const qrId = searchParams.get('qrId');

  useEffect(() => {
    if (!qrId) {
      setError('Invalid print parameters.');
      setLoading(false);
      return;
    }

    // Load QR and Location details
    axios.get('/api/reviews/qrs')
      .then(res => {
        const list = res.data.data || [];
        const item = list.find(q => q.id === qrId);
        if (!item) {
          setError('QR Code not found.');
          return;
        }
        setQr(item);

        // Fetch location branding details
        return axios.get(`/api/reviews/landing-page/${item.locationId}`);
      })
      .then(res => {
        if (res) {
          setLandingPageDetails(res.data.data);
        }
      })
      .catch(err => setError('Failed to load branding data.'))
      .finally(() => setLoading(false));
  }, [qrId]);

  const [landingPageDetails, setLandingPageDetails] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={containerStyle}><h3>Loading Printable Template...</h3></div>;
  if (error) return <div style={containerStyle}><h3 style={{ color: 'red' }}>{error}</h3></div>;

  return (
    <div style={containerStyle}>
      {/* Print Controls (Hidden during print via @media print) */}
      <div className="print-controls" style={controlsStyle}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <strong>Print Layout:</strong>
          <select value={template} onChange={(e) => setTemplate(e.target.value)} style={selectStyle}>
            <option value="poster">A4 Poster</option>
            <option value="tent">Table Tent Fold</option>
            <option value="sticker">Circular Sticker</option>
            <option value="card">Visiting Card</option>
            <option value="standee">Roll-up Standee</option>
            <option value="invoice">Invoice Header Banner</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>Print / Save PDF</button>
      </div>

      {/* Styled Printable Frame */}
      <div className={`print-frame ${template}`} style={frameStyle(template)}>
        {/* CSS print utility injection */}
        <style>{`
          @media print {
            .print-controls { display: none !important; }
            body { background: #fff !important; color: #000 !important; margin: 0; padding: 0; }
            .print-frame { box-shadow: none !important; border: none !important; margin: 0 !important; }
          }
        `}</style>

        {/* Business Branding */}
        {landingPageDetails?.logoUrl && (
          <img src={landingPageDetails.logoUrl} alt="Logo" style={logoStyle} />
        )}
        <h1 style={titleStyle}>{qr.location.name}</h1>
        
        <h2 style={taglineStyle}>"Scan to Review Us"</h2>
        <p style={{ opacity: 0.8, fontSize: '1.1rem', margin: '0.5rem 0 1.5rem 0' }}>
          {landingPageDetails?.welcomeMessage || 'Your feedback helps us grow!'}
        </p>

        {/* Real QR Vector Image */}
        {qr.qrImage && (
          <img src={qr.qrImage} alt="QR Code" style={qrImageStyle(template)} />
        )}

        <div style={{ marginTop: '1.5rem', borderTop: '2px dashed #ccc', paddingTop: '1rem', width: '80%' }}>
          <span style={{ fontSize: '1rem', color: '#666' }}>Or visit directly at:</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333', marginTop: '0.25rem' }}>
            {qr.qrUrl}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styling configs
const containerStyle = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem 1rem',
  boxSizing: 'border-box',
  color: '#333'
};

const controlsStyle = {
  width: '100%',
  maxWidth: '800px',
  backgroundColor: '#fff',
  padding: '1rem',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  marginBottom: '2rem'
};

const selectStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '0.9rem'
};

const frameStyle = (template) => {
  const base = {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
    padding: '3rem 2rem'
  };

  if (template === 'tent') {
    return { ...base, width: '420px', height: '594px', borderBottom: '5px double #333' }; // A5 Foldable tent card
  }
  if (template === 'sticker') {
    return { ...base, width: '400px', height: '400px', borderRadius: '50%' }; // Round sticker design
  }
  if (template === 'card') {
    return { ...base, width: '350px', height: '200px', padding: '1rem' }; // Card size
  }
  if (template === 'standee') {
    return { ...base, width: '300px', height: '800px' }; // Banner standee proportions
  }
  if (template === 'invoice') {
    return { ...base, width: '700px', height: '180px', padding: '1rem', flexDirection: 'row', gap: '2rem' };
  }
  // Default A4 Poster
  return { ...base, width: '595px', height: '842px' };
};

const logoStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: '1rem',
  border: '4px solid #f1f5f9'
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 800,
  margin: '0 0 0.5rem 0',
  color: '#0f172a'
};

const taglineStyle = {
  fontSize: '1.4rem',
  fontWeight: 700,
  color: '#475569',
  margin: '0.5rem 0'
};

const qrImageStyle = (template) => {
  if (template === 'card') return { width: '80px', height: '80px' };
  if (template === 'invoice') return { width: '100px', height: '100px' };
  return { width: '220px', height: '220px' };
};
