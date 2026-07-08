import React, { useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle } from 'lucide-react';

function ReviewSubmit() {
  // Extract locationId from URL path (e.g. /review/locationId)
  const pathParts = window.location.pathname.split('/');
  const locationId = pathParts[pathParts.length - 1];

  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName) {
      setError('Please provide your name.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/review/submit', {
        locationId,
        authorName,
        rating,
        comment
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={containerStyle}>
        <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
          <CheckCircle size={64} style={{ color: 'var(--accent-success)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Thank You!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1rem' }}>
            Your feedback has been submitted successfully. We appreciate your time!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/logo.png" 
            alt="ManaCity Logo" 
            style={{ width: '100%', maxWidth: '180px', marginBottom: '1rem' }} 
          />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Customer Feedback</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Rate your recent experience with our services</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--accent-error)',
            color: 'var(--accent-error)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Star Rating Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '1rem', fontWeight: 600 }}>Your Rating</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={36}
                  fill={star <= (hoverRating || rating) ? '#f59e0b' : 'none'}
                  stroke={star <= (hoverRating || rating) ? '#f59e0b' : 'var(--text-muted)'}
                  style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Your Full Name</label>
            <input 
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. John Smith"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Detailed Comments</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or what we can improve..."
              rows="4"
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', height: '46px', marginTop: '0.5rem' }}
          >
            {submitting ? 'Submitting...' : 'Post Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: '#0b0d19'
};

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

export default ReviewSubmit;
