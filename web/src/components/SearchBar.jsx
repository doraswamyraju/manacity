import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Mic,
  MapPin,
  ShieldCheck,
  ChevronRight,
  X,
  Building2,
  Package
} from 'lucide-react';

export default function SearchBar({ selectedCity = 'tirupati' }) {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const cityCap = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);

  // Revolving Category Keywords with Individual Vibrant Colors
  const revolvingKeywords = useMemo(() => [
    { prefix: 'Search', highlight: 'Digital Marketing Agencies', color: '#2563eb', bg: '#eff6ff' },
    { prefix: 'Find Top', highlight: 'CA & Tax Consultants', color: '#059669', bg: '#ecfdf5' },
    { prefix: 'Discover', highlight: 'Restaurants & Cafes', color: '#ea580c', bg: '#fff7ed' },
    { prefix: 'Explore', highlight: 'Real Estate & Villas', color: '#7c3aed', bg: '#f5f3ff' },
    { prefix: 'Book Verified', highlight: 'Doctors & Clinics', color: '#0284c7', bg: '#f0f9ff' },
    { prefix: 'Connect with', highlight: 'AC & Electrician Repairs', color: '#d97706', bg: '#fffbeb' }
  ], []);

  const [keywordIdx, setKeywordIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [masterSuggestions, setMasterSuggestions] = useState([]);
  const [googlePlacesSuggestions, setGooglePlacesSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setKeywordIdx(prev => (prev + 1) % revolvingKeywords.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [revolvingKeywords.length]);

  // Live Autocomplete Search Fetcher (ManaCity DB + Google Places API)
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setMasterSuggestions([]);
      setGooglePlacesSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [bizRes, masterRes, placesRes] = await Promise.allSettled([
          axios.get(`/api/phase1/search-suggestions?q=${encodeURIComponent(query)}&city=${selectedCity}`),
          axios.get(`/api/phase1/master-services-search?q=${encodeURIComponent(query)}`),
          axios.get(`/api/phase1/google-places/autocomplete?input=${encodeURIComponent(query + ' ' + selectedCity)}`)
        ]);

        const rawBiz = bizRes.status === 'fulfilled' ? (bizRes.value.data || []) : [];
        const rawMaster = masterRes.status === 'fulfilled' ? (masterRes.value.data || []) : [];
        const rawPlaces = placesRes.status === 'fulfilled' ? (placesRes.value.data?.predictions || []) : [];

        setSuggestions(rawBiz);
        setMasterSuggestions(rawMaster);
        setGooglePlacesSuggestions(rawPlaces);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search fetch error:', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, selectedCity]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentKw = revolvingKeywords[keywordIdx];

  // Filter out Google Places predictions if already in ManaCity Verified Businesses
  const placesToDisplay = useMemo(() => {
    return googlePlacesSuggestions
      .filter(place => {
        const placeNorm = (place.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
        const isAlreadyVerified = suggestions.some(b => {
          const bNorm = (b.businessName || b.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
          return (bNorm && placeNorm) && (bNorm.includes(placeNorm) || placeNorm.includes(bNorm));
        });
        return !isAlreadyVerified;
      })
      .slice(0, 3);
  }, [googlePlacesSuggestions, suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false);
      const targetSlug = query.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      navigate(`/${selectedCity}/service/${targetSlug}`);
    }
  };

  const hasResults = suggestions.length > 0 || masterSuggestions.length > 0 || placesToDisplay.length > 0;

  // Highlight matching query prefix in item title (JustDial style)
  const renderHighlightedTitle = (title, q) => {
    if (!title || !q) return title;
    const idx = title.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return title;
    const match = title.substring(idx, idx + q.length);
    const before = title.substring(0, idx);
    const after = title.substring(idx + q.length);
    return (
      <span>
        {before}
        <strong style={{ color: '#2563eb', fontWeight: 900 }}>{match}</strong>
        {after}
      </span>
    );
  };

  return (
    <div ref={searchContainerRef} style={{ width: '100%', maxWidth: '650px', position: 'relative', boxSizing: 'border-box' }}>
      
      {/* Search Input Container with Rotating Rainbow Border */}
      <div style={{
        position: 'relative',
        padding: '2.5px',
        borderRadius: '26px',
        background: 'linear-gradient(90deg, #2563eb, #7c3aed, #ec4899, #10b981, #f59e0b, #2563eb)',
        backgroundSize: '300% 300%',
        animation: 'searchGlowRotate 4s ease infinite',
        boxShadow: '0 4px 22px rgba(124, 58, 237, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '0.45rem 1rem'
        }}>
          <Search
            size={18}
            color="#2563eb"
            style={{ flexShrink: 0, animation: 'searchIconPulse 2.5s infinite ease-in-out', cursor: 'pointer' }}
            onClick={() => {
              if (query.trim()) {
                const targetSlug = query.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                navigate(`/${selectedCity}/service/${targetSlug}`);
              }
            }}
          />

          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (hasResults) setShowSuggestions(true);
              }}
              placeholder=""
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                width: '100%',
                outline: 'none',
                fontSize: '16px',
                fontWeight: 700,
                zIndex: 2
              }}
            />

            {/* Revolving Placeholder Keyword */}
            {!query && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 'calc(100% - 10px)',
                  animation: 'keywordSlideUp 0.45s ease-out'
                }}
              >
                <span>{currentKw.prefix}</span>
                <span style={{
                  backgroundColor: currentKw.bg,
                  color: currentKw.color,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  border: `1px solid ${currentKw.color}33`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '160px'
                }}>
                  {currentKw.highlight}
                </span>
              </div>
            )}
          </div>

          {/* Clear Button (x) or Voice Mic */}
          {query ? (
            <X
              size={18}
              color="#94a3b8"
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => { setQuery(''); setSuggestions([]); setMasterSuggestions([]); setGooglePlacesSuggestions([]); setShowSuggestions(false); }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.25rem 0.6rem', borderRadius: '14px', cursor: 'pointer', flexShrink: 0 }}>
              <Mic size={14} color="#2563eb" />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb' }}>Voice</span>
            </div>
          )}
        </div>
      </div>

      {/* JustDial-Style Ultra-Clean Vertical Suggestions List Overlay */}
      {showSuggestions && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
          zIndex: 1000,
          maxHeight: '75vh',
          overflowY: 'auto'
        }}>

          {/* 1. MASTER SYSTEM PRODUCTS & SERVICES */}
          {masterSuggestions.length > 0 && (
            <div>
              {masterSuggestions.map((mItem, mIdx) => (
                <div
                  key={`m-${mIdx}`}
                  onClick={() => {
                    setShowSuggestions(false);
                    const targetSlug = mItem.slug || mItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    navigate(`/${selectedCity}/service/${targetSlug}`);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      {renderHighlightedTitle(mItem.name, query)}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#7c3aed', fontWeight: 700 }}>{mItem.category}</span>
                      <span>•</span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>{mItem.defaultPrice ? `Est. ₹${mItem.defaultPrice.toLocaleString('en-IN')}` : 'Custom Pricing'}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}

          {/* 2. MANACITY VERIFIED BUSINESSES */}
          {suggestions.length > 0 && (
            <div>
              {suggestions.map((item, idx) => (
                <div
                  key={`b-${idx}`}
                  onClick={() => {
                    setShowSuggestions(false);
                    const url = item.subdomain ? `https://${item.subdomain}.manacity.in` : `/site/${item.slug || 'rajugari-ventures'}`;
                    window.open(url, '_blank');
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {renderHighlightedTitle(item.businessName || item.name, query)}
                      <span style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.62rem', fontWeight: 800, padding: '0.05rem 0.4rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                        <ShieldCheck size={10} color="#059669" /> Verified
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem' }}>
                      <span style={{ backgroundColor: '#059669', color: '#fff', fontWeight: 800, padding: '0.05rem 0.35rem', borderRadius: '4px', fontSize: '0.68rem', marginRight: '0.4rem' }}>
                        ★ {item.googleRating || 4.9}
                      </span>
                      <span>({item.googleReviewCount || 63}+)</span>
                      <span> • {item.address || `${cityCap}, Andhra Pradesh`}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}

          {/* 3. NEARBY LOCAL AREA LISTINGS */}
          {placesToDisplay.length > 0 && (
            <div>
              {placesToDisplay.map((place, pIdx) => (
                <div
                  key={`p-${pIdx}`}
                  onClick={() => {
                    setShowSuggestions(false);
                    const targetSlug = place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    navigate(`/${selectedCity}/service/${targetSlug}`);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff7ed'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {renderHighlightedTitle(place.name, query)}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem' }}>
                      {place.description}
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}

          {/* UNMATCHED SEARCH QUERY REQUEST BUTTON (ONLY SHOWN IF ZERO RESULTS FOUND) */}
          {!hasResults && query.trim().length >= 3 && (
            <div style={{ padding: '1rem', textAlign: 'left', backgroundColor: '#fffbeb' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#d97706', marginBottom: '0.2rem' }}>
                🔍 Didn't find exact provider for "{query}"?
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                Submit an Unmatched Search Request. ManaCity Super Admin team will verify and onboard top local providers for you in {selectedCity}!
              </div>
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  setShowSuggestions(false);
                  try {
                    await axios.post('/api/phase1/unmatched-query', {
                      searchQuery: query,
                      city: selectedCity,
                      customerName: 'Visitor User',
                      customerPhone: '',
                      customerEmail: ''
                    });
                    alert(`Request for "${query}" submitted to ManaCity Super Admin team! We will notify you once providers are onboarded.`);
                  } catch (err) {
                    alert('Failed to submit request.');
                  }
                }}
                style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
              >
                🚀 Request Super Admin to Onboard Providers
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
