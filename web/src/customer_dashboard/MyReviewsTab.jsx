import React, { useState } from 'react';
import { Star, MessageSquare, Building2, ThumbsUp } from 'lucide-react';

export default function MyReviewsTab({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      businessName: 'Rajugari Ventures - A Digital Marketing Agency in Tirupati',
      rating: 5,
      comment: 'Excellent SEO & GBP service! Ranked our local business on top of Tirupati search results within 2 weeks.',
      date: '2026-08-10',
      helpfulCount: 4
    }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={24} color="#fbbf24" /> My Posted Reviews & Feedback
          </h2>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Review history of ratings and public feedback you have submitted for local businesses.
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Star size={40} color="#fbbf24" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a' }}>No reviews posted yet</h3>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
            Visit local business pages or scan QR codes in store to submit your ratings & reviews.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(rev => (
            <div
              key={rev.id}
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
                  {rev.businessName}
                </h4>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} color={i < rev.rating ? '#fbbf24' : '#475569'} fill={i < rev.rating ? '#fbbf24' : 'none'} />
                  ))}
                </div>
              </div>

              <p style={{ color: isDark ? '#cbd5e1' : '#334155', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
                "{rev.comment}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.8rem', color: isDark ? '#64748b' : '#94a3b8' }}>
                <span>Posted on: {rev.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700 }}>
                  <ThumbsUp size={13} /> {rev.helpfulCount} people found this helpful
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
