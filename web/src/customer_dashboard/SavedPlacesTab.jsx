import React, { useState, useEffect } from 'react';
import { Heart, Building2, MapPin, ExternalLink, Trash2 } from 'lucide-react';

export default function SavedPlacesTab({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [savedPlaces, setSavedPlaces] = useState([]);

  useEffect(() => {
    // Mock saved places stored in localStorage or API
    const mockSaved = [
      {
        id: '1',
        businessName: 'Rajugari Ventures - A Digital Marketing Agency in Tirupati',
        category: 'SEO & Marketing',
        city: 'Tirupati',
        address: 'Shop No.38, 1st Floor, Tuda Complex, Tirupati',
        url: 'https://rajugariventures.manacity.in'
      }
    ];
    setSavedPlaces(mockSaved);
  }, []);

  const handleRemove = (id) => {
    setSavedPlaces(prev => prev.filter(p => p.id !== id));
  };

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
            <Heart size={24} color="#ec4899" /> Saved Businesses & Favorites
          </h2>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Quick access to local businesses you have bookmarked across Tirupati and other cities.
          </p>
        </div>
      </div>

      {savedPlaces.length === 0 ? (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Heart size={40} color="#ec4899" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a' }}>No saved places yet</h3>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
            Explore ManaCity listings and click the bookmark icon to save your favorite vendors.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {savedPlaces.map(place => (
            <div
              key={place.id}
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '3px 8px', borderRadius: '4px' }}>
                    {place.category}
                  </span>
                  <button onClick={() => handleRemove(place.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: '0.5rem 0 0.25rem 0' }}>
                  {place.businessName}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem' }}>
                  <MapPin size={14} color="#ec4899" />
                  <span>{place.address}</span>
                </div>
              </div>

              <a
                href={place.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: isDark ? '#334155' : '#f1f5f9',
                  color: isDark ? '#fff' : '#0f172a',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Visit Website <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
