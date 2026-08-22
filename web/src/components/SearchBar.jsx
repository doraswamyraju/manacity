import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Mic,
  Sparkles,
  Building2,
  ShieldCheck,
  ChevronRight,
  ExternalLink
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownFilter, setDropdownFilter] = useState('ALL');

  useEffect(() => {
    const timer = setInterval(() => {
      setKeywordIdx(prev => (prev + 1) % revolvingKeywords.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [revolvingKeywords.length]);

  // Live Autocomplete Search Fetcher
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setMasterSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [bizRes, masterRes] = await Promise.all([
          axios.get(`/api/phase1/search-suggestions?q=${encodeURIComponent(query)}&city=${selectedCity}`),
          axios.get(`/api/phase1/master-services-search?q=${encodeURIComponent(query)}`)
        ]);

        const rawBiz = bizRes.data || [];
        const rawMaster = masterRes.data || [];

        setSuggestions(rawBiz);
        setMasterSuggestions(rawMaster);
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

  // Calculate Best Match across both Providers & Master Services
  const { topMatchItem, topMatchType } = useMemo(() => {
    if (!query.trim() || (suggestions.length === 0 && masterSuggestions.length === 0)) {
      return { topMatchItem: null, topMatchType: null };
    }

    const qLower = query.trim().toLowerCase();

    // Check if any business name starts with or closely matches the query
    const exactBiz = suggestions.find(b => (b.businessName || b.name || '').toLowerCase().includes(qLower));
    const exactMaster = masterSuggestions.find(m => (m.name || '').toLowerCase().includes(qLower) && m.id !== qLower.replace(/[^a-z0-9]+/g, '-'));

    if (exactBiz && exactMaster) {
      const bizName = (exactBiz.businessName || exactBiz.name).toLowerCase();
      const masterName = exactMaster.name.toLowerCase();
      if (bizName.startsWith(qLower) && !masterName.startsWith(qLower)) {
        return { topMatchItem: exactBiz, topMatchType: 'BIZ' };
      }
      return { topMatchItem: exactMaster, topMatchType: 'MASTER' };
    }

    if (exactBiz) return { topMatchItem: exactBiz, topMatchType: 'BIZ' };
    if (exactMaster) return { topMatchItem: exactMaster, topMatchType: 'MASTER' };

    if (suggestions.length > 0) return { topMatchItem: suggestions[0], topMatchType: 'BIZ' };
    if (masterSuggestions.length > 0) return { topMatchItem: masterSuggestions[0], topMatchType: 'MASTER' };

    return { topMatchItem: null, topMatchType: null };
  }, [query, suggestions, masterSuggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false);
      if (topMatchItem && topMatchType === 'BIZ') {
        const url = topMatchItem.subdomain ? `https://${topMatchItem.subdomain}.manacity.in` : `/site/${topMatchItem.slug || 'rajugari-ventures'}`;
        window.open(url, '_blank');
      } else {
        const targetSlug = query.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/${selectedCity}/service/${targetSlug}`);
      }
    }
  };

  const hasResults = suggestions.length > 0 || masterSuggestions.length > 0;

  return (
    <div ref={searchContainerRef} style={{ flex: '1 1 380px', maxWidth: '650px', position: 'relative' }}>
      
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
                if (suggestions.length > 0 || masterSuggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder=""
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                width: '100%',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: 700,
                zIndex: 2
              }}
            />

            {!query && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  animation: 'keywordSlideUp 0.45s ease-out'
                }}
              >
                <span>{currentKw.prefix}</span>
                <span style={{
                  backgroundColor: currentKw.bg,
                  color: currentKw.color,
                  padding: '0.12rem 0.5rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  border: `1px solid ${currentKw.color}33`
                }}>
                  {currentKw.highlight}
                </span>
                <span>in {cityCap}...</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.25rem 0.6rem', borderRadius: '14px', cursor: 'pointer', flexShrink: 0 }}>
            <Mic size={14} color="#2563eb" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb' }}>Voice</span>
          </div>
        </div>
      </div>

      {/* Floating Glassmorphic Autocomplete Search Overlay Dropdown */}
      {showSuggestions && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '18px',
          padding: '0.85rem',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          maxHeight: '440px',
          overflowY: 'auto'
        }}>
          {/* Scope Filters (All, Services, Businesses) */}
          <div style={{ display: 'flex', gap: '0.4rem', paddingBottom: '0.55rem', marginBottom: '0.55rem', borderBottom: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setDropdownFilter('ALL')}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: dropdownFilter === 'ALL' ? '#2563eb' : '#f1f5f9',
                color: dropdownFilter === 'ALL' ? '#fff' : '#64748b',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              All Results ({masterSuggestions.length + suggestions.length})
            </button>
            {masterSuggestions.length > 0 && (
              <button
                type="button"
                onClick={() => setDropdownFilter('SERVICES')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: dropdownFilter === 'SERVICES' ? '#7c3aed' : '#f1f5f9',
                  color: dropdownFilter === 'SERVICES' ? '#fff' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                📦 Offerings ({masterSuggestions.length})
              </button>
            )}
            {suggestions.length > 0 && (
              <button
                type="button"
                onClick={() => setDropdownFilter('BUSINESSES')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: dropdownFilter === 'BUSINESSES' ? '#059669' : '#f1f5f9',
                  color: dropdownFilter === 'BUSINESSES' ? '#fff' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🏢 Providers ({suggestions.length})
              </button>
            )}
          </div>

          {/* 1. LOCAL VERIFIED BUSINESSES SECTION */}
          {(dropdownFilter === 'ALL' || dropdownFilter === 'BUSINESSES') && suggestions.length > 0 && (
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem 0.35rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  🏢 Local Verified Businesses
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', backgroundColor: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: '10px', textTransform: 'capitalize' }}>
                  📍 {selectedCity}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {suggestions.map((item, idx) => {
                  const isBestMatch = topMatchType === 'BIZ' && topMatchItem?.id === item.id;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setShowSuggestions(false);
                        if (item.isVerifiedManaCity) {
                          const url = item.subdomain ? `https://${item.subdomain}.manacity.in` : `/site/${item.slug || 'rajugari-ventures'}`;
                          window.open(url, '_blank');
                        } else {
                          navigate(`/${selectedCity}/service/digital-marketing`);
                        }
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isBestMatch ? '#f0f5ff' : '#f8fafc',
                        border: isBestMatch ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        boxShadow: isBestMatch ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isBestMatch ? '#f0f5ff' : '#f8fafc'; e.currentTarget.style.borderColor = isBestMatch ? '#2563eb' : '#e2e8f0'; }}
                    >
                      <div style={{ flex: 1, paddingRight: '0.75rem' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <span>{item.businessName || item.name}</span>
                          <ShieldCheck size={15} color="#2563eb" />
                          {isBestMatch && (
                            <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '0.62rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                              🎯 Best Match
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {item.address || 'Tirupati, Andhra Pradesh'} • ★ {item.googleRating || 4.9} ({item.googleReviewCount || 63})
                        </div>
                      </div>

                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.25rem 0.65rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                        Visit Storefront <ExternalLink size={12} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. MASTER PRODUCTS & SERVICES CATALOG SECTION */}
          {(dropdownFilter === 'ALL' || dropdownFilter === 'SERVICES') && masterSuggestions.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem 0.35rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  📦 System Products & Services
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', backgroundColor: '#f3e8ff', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                  Master Catalog
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {masterSuggestions.map((mItem, mIdx) => {
                  const isBestMatch = topMatchType === 'MASTER' && topMatchItem?.id === mItem.id;
                  return (
                    <div
                      key={`m-${mIdx}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        const targetSlug = mItem.slug || mItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        navigate(`/${selectedCity}/service/${targetSlug}`);
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isBestMatch ? '#f0f5ff' : '#f8fafc',
                        border: isBestMatch ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        boxShadow: isBestMatch ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isBestMatch ? '#f0f5ff' : '#f8fafc'; e.currentTarget.style.borderColor = isBestMatch ? '#2563eb' : '#e2e8f0'; }}
                    >
                      <div style={{ flex: 1, paddingRight: '0.75rem' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span>{mItem.name}</span>
                          {isBestMatch && (
                            <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '0.62rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                              🎯 Best Match
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ backgroundColor: '#f3e8ff', color: '#7c3aed', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '6px', fontSize: '0.7rem' }}>
                            {mItem.category}
                          </span>
                          <span>•</span>
                          <span style={{ color: '#059669', fontWeight: 800 }}>
                            {mItem.defaultPrice ? `Est. ₹${mItem.defaultPrice.toLocaleString('en-IN')}` : 'Custom Pricing'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.25rem 0.65rem', borderRadius: '12px' }}>
                          Explore Service Page
                        </span>
                        <ChevronRight size={16} color="#2563eb" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. UNMATCHED SEARCH QUERY REQUEST BUTTON (ONLY SHOWN IF ZERO RESULTS FOUND) */}
          {!hasResults && query.trim().length >= 3 && (
            <div style={{ padding: '0.85rem 1rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', textAlign: 'left', marginTop: '0.5rem' }}>
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
                style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)' }}
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
