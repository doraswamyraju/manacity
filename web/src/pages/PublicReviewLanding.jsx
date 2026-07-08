import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PublicReviewLanding() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState(null);
  const [location, setLocation] = useState(null);
  const [landingPage, setLandingPage] = useState(null);

  // Flow State: 'rating', 'feedback', 'redirecting', 'thanks'
  const [step, setStep] = useState('rating');
  const [selectedRating, setSelectedRating] = useState(0);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Parse path and query params
  const pathParts = window.location.pathname.split('/');
  const uniqueQrId = pathParts[pathParts.length - 1];
  const searchParams = new URLSearchParams(window.location.search);
  const requestId = searchParams.get('req');

  useEffect(() => {
    if (!uniqueQrId) {
      setError('Invalid QR code link.');
      setLoading(false);
      return;
    }

    // 1. Increment Scan counter and resolve config
    axios.post(`/api/reviews/qrs/${uniqueQrId}/scan`)
      .then(res => {
        setQrData(res.data.qr);
        setLocation(res.data.location);
        setLandingPage(res.data.landingPage);

        // 2. Track request opened if request parameter exists
        if (requestId) {
          axios.put(`/api/reviews/requests/${requestId}`, { action: 'open' })
            .catch(err => console.error('Failed to log request open event:', err));
        }
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to scan or resolve QR code.');
      })
      .finally(() => setLoading(false));
  }, [uniqueQrId, requestId]);

  const handleRatingSelect = async (rating) => {
    setSelectedRating(rating);

    // Track request rating if request parameter exists
    if (requestId) {
      axios.put(`/api/reviews/requests/${requestId}`, { action: 'rate' })
        .catch(err => console.error('Failed to log rating event:', err));
    }

    const threshold = landingPage?.ratingThreshold || 4;

    if (rating >= threshold) {
      setStep('redirecting');
      
      // Track request redirection if request parameter exists
      if (requestId) {
        try {
          await axios.put(`/api/reviews/requests/${requestId}`, { action: 'redirect' });
          await axios.put(`/api/reviews/requests/${requestId}`, { action: 'complete' });
        } catch (err) {
          console.error(err);
        }
      }

      // Redirect to Google Business profile reviews page
      const redirectUrl = landingPage?.googleReviewUrl || 'https://google.com';
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);

    } else {
      setStep('feedback');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      // 1. Post to unified Review database as source INTERNAL
      await axios.post('/api/reviews/inbox', {
        locationId: location.id,
        source: 'INTERNAL',
        reviewerName: name || 'Anonymous Guest',
        rating: selectedRating,
        reviewText: feedbackText,
        metadata: {
          phone,
          email,
          uniqueQrId,
          userAgent: navigator.userAgent
        }
      });

      // 2. Update request completed journey logs if request parameter exists
      if (requestId) {
        await axios.put(`/api/reviews/requests/${requestId}`, { action: 'complete' });
      }

      setStep('thanks');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div className="glass-card" style={cardStyle}>
          <h3>Loading review landing page...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div className="glass-card" style={{ ...cardStyle, borderColor: 'var(--accent-error)' }}>
          <h3 style={{ color: 'var(--accent-error)' }}>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="glass-card" style={cardStyle}>
        {/* Branding Logo */}
        {location?.logoUrl ? (
          <img src={location.logoUrl} alt="Logo" style={logoStyle} />
        ) : (
          <div style={logoPlaceholderStyle}>
            {location?.name?.substring(0, 2).toUpperCase()}
          </div>
        )}

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{location?.name}</h2>

        {/* STEP 1: Star Rating Flow */}
        {step === 'rating' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{landingPage?.welcomeMessage}</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRatingSelect(star)}
                  style={starButtonStyle}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Google Redirecting screen */}
        {step === 'redirecting' && (
          <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={spinnerStyle} />
            <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Thank you for your rating!</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Redirecting you to our Google Business reviews profile page to submit your review...</p>
          </div>
        )}

        {/* STEP 3: Internal Feedback Form */}
        {step === 'feedback' && (
          <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.95rem', opacity: 0.85, textAlign: 'center' }}>
              We value your experience. Please share your private feedback with us so we can improve:
            </p>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={inputStyle} required />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Mobile Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 9876543210" style={inputStyle} required />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Email (Optional)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. name@example.com" style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Detailed Feedback</label>
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Please let us know what went wrong..." rows="4" style={inputStyle} required />
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', marginTop: '0.5rem' }}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}

        {/* STEP 4: Thank You Screen */}
        {step === 'thanks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem 0' }}>
            <div style={successCheckStyle}>✓</div>
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{landingPage?.thankYouMessage || 'Thank you for your feedback!'}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Your response has been registered privately with the manager.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// Styling Constants
const containerStyle = {
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#090d16',
  padding: '1rem',
  boxSizing: 'border-box'
};

const cardStyle = {
  maxWidth: '450px',
  width: '100%',
  padding: '2.5rem 2rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  boxSizing: 'border-box'
};

const logoStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  margin: '0 auto 0.5rem auto',
  border: '3px solid var(--accent-secondary)'
};

const logoPlaceholderStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: 'var(--accent-secondary)',
  fontSize: '1.8rem',
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 0.5rem auto',
  border: '3px solid var(--accent-secondary)'
};

const starButtonStyle = {
  fontSize: '2.5rem',
  color: '#f59e0b',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.1s ease',
  outline: 'none'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
};

const labelStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const inputStyle = {
  padding: '0.65rem 0.85rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};

const successCheckStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  color: '#4caf50',
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid rgba(255,255,255,0.1)',
  borderTop: '4px solid var(--accent-secondary)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};
