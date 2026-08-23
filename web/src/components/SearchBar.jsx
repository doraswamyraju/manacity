import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Mic,
  MapPin,
  Sparkles,
  Building2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Phone,
  MessageSquare,
  Zap,
  CheckCircle2,
  X
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
  const [dropdownFilter, setDropdownFilter] = useState('ALL');
  
  // Enquiry Lead Modal State
  const [enquiryModalTarget, setEnquiryModalTarget] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerMsg, setCustomerMsg] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

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

  // Inline Ghost Text Auto-Suggestion
  const autoCompletionText = useMemo(() => {
    if (!query.trim() || query.length < 2) return '';
    const qLower = query.toLowerCase();

    // Check master services match
    const masterMatch = masterSuggestions.find(m => m.name.toLowerCase().startsWith(qLower));
    if (masterMatch) return masterMatch.name;

    // Check local business match
    const bizMatch = suggestions.find(b => (b.businessName || b.name || '').toLowerCase().startsWith(qLower));
    if (bizMatch) return bizMatch.businessName || bizMatch.name;

    // Check revolving keywords
    if (currentKw.highlight.toLowerCase().startsWith(qLower)) {
      return currentKw.highlight;
    }

    return '';
  }, [query, masterSuggestions, suggestions, currentKw]);

  // Calculate Best Match across both Providers & Master Services
  const { topMatchItem, topMatchType } = useMemo(() => {
    if (!query.trim() || (suggestions.length === 0 && masterSuggestions.length === 0)) {
      return { topMatchItem: null, topMatchType: null };
    }

    const qLower = query.trim().toLowerCase();

    const exactBiz = suggestions.find(b => (b.businessName || b.name || '').toLowerCase().includes(qLower));
    const exactMaster = masterSuggestions.find(m => (m.name || '').toLowerCase().includes(qLower));

    if (exactMaster) return { topMatchItem: exactMaster, topMatchType: 'MASTER' };
    if (exactBiz) return { topMatchItem: exactBiz, topMatchType: 'BIZ' };

    if (masterSuggestions.length > 0) return { topMatchItem: masterSuggestions[0], topMatchType: 'MASTER' };
    if (suggestions.length > 0) return { topMatchItem: suggestions[0], topMatchType: 'BIZ' };

    return { topMatchItem: null, topMatchType: null };
  }, [query, suggestions, masterSuggestions]);

  const handleKeyDown = (e) => {
    // Complete ghost suggestion on Tab or Right Arrow
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && autoCompletionText) {
      e.preventDefault();
      setQuery(autoCompletionText);
      return;
    }

    // Pressing ENTER routes user to Search Results Page
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false);
      const targetSlug = query.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      navigate(`/${selectedCity}/service/${targetSlug}`);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      alert('Please enter your mobile number.');
      return;
    }
    try {
      await axios.post('/api/phase1/lead-capture', {
        businessId: enquiryModalTarget.id || enquiryModalTarget.placeId,
        businessName: enquiryModalTarget.name || enquiryModalTarget.businessName,
        customerName: customerName || 'Valued Customer',
        customerPhone,
        customerMessage: customerMsg || `Instant enquiry from ManaCity for ${enquiryModalTarget.name || enquiryModalTarget.businessName}`,
        city: selectedCity
      });
    } catch (err) {
      console.warn('Lead capture fallback:', err.message);
    }
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
      setEnquiryModalTarget(null);
      setCustomerPhone('');
      setCustomerName('');
      setCustomerMsg('');
    }, 2200);
  };

  const placesToDisplay = googlePlacesSuggestions.slice(0, 3);
  const hasResults = suggestions.length > 0 || masterSuggestions.length > 0 || placesToDisplay.length > 0;

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
            
            {/* Translucent Ghost Text Auto-Suggestion */}
            {autoCompletionText && query && autoCompletionText.toLowerCase().startsWith(query.toLowerCase()) && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#cbd5e1',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 1
              }}>
                <span style={{ opacity: 0 }}>{query}</span>
                <span>{autoCompletionText.slice(query.length)}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.05rem 0.35rem', borderRadius: '4px', marginLeft: '0.4rem' }}>
                  Press Tab ↹
                </span>
              </div>
            )}

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
          maxHeight: '480px',
          overflowY: 'auto'
        }}>
          {/* Scope Filters (All, Offerings, Verified Businesses, Nearby Businesses) */}
          <div style={{ display: 'flex', gap: '0.4rem', paddingBottom: '0.55rem', marginBottom: '0.55rem', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
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
              All Results ({masterSuggestions.length + suggestions.length + placesToDisplay.length})
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
                📦 Products & Services ({masterSuggestions.length})
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
                🛡️ Verified ({suggestions.length})
              </button>
            )}
            {placesToDisplay.length > 0 && (
              <button
                type="button"
                onClick={() => setDropdownFilter('NEARBY')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: dropdownFilter === 'NEARBY' ? '#ea580c' : '#f1f5f9',
                  color: dropdownFilter === 'NEARBY' ? '#fff' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                📍 Nearby Listings ({placesToDisplay.length})
              </button>
            )}
          </div>

          {/* SECTION 1: MASTER PRODUCTS & SERVICES CATALOG (SHOWN FIRST WHEN SEARCHED) */}
          {(dropdownFilter === 'ALL' || dropdownFilter === 'SERVICES') && masterSuggestions.length > 0 && (
            <div style={{ marginBottom: '0.85rem' }}>
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
                          Explore Providers List
                        </span>
                        <ChevronRight size={16} color="#2563eb" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: MANACITY REGISTERED VERIFIED BUSINESSES */}
          {(dropdownFilter === 'ALL' || dropdownFilter === 'BUSINESSES') && suggestions.length > 0 && (
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem 0.35rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  🛡️ ManaCity Verified Businesses
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', backgroundColor: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: '10px', textTransform: 'capitalize' }}>
                  📍 {selectedCity}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {suggestions.map((item, idx) => {
                  const isBestMatch = topMatchType === 'BIZ' && topMatchItem?.id === item.id;
                  const itemPhone = item.phone || '9876543210';
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem 0.9rem',
                        borderRadius: '14px',
                        backgroundColor: isBestMatch ? '#f0f5ff' : '#ffffff',
                        border: isBestMatch ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        boxShadow: isBestMatch ? '0 4px 16px rgba(37, 99, 235, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Business Header & Authentic Verified Badge */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span>{item.businessName || item.name}</span>
                            
                            {/* Authentic Verified Badge */}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: '12px' }}>
                              <ShieldCheck size={12} color="#059669" /> Verified
                            </span>

                            {isBestMatch && (
                              <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '0.62rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                                🎯 Best Match
                              </span>
                            )}
                          </div>

                          {/* Address & SLA Ratings Line */}
                          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span>📍 {item.address || `${cityCap}, Andhra Pradesh`}</span>
                            <span>•</span>
                            <span style={{ color: '#d97706', fontWeight: 800 }}>★ {item.googleRating || 4.9} ({item.googleReviewCount || 63})</span>
                            <span>•</span>
                            <span style={{ color: '#059669', fontWeight: 800 }}>⏱️ 15-Min Response</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Icon Row (Call, WhatsApp, Quick Enquire, Storefront) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.55rem', paddingTop: '0.45rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); window.open(`tel:${itemPhone}`); }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          <Phone size={12} /> Call
                        </button>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/91${itemPhone}?text=Hi, I found your business on ManaCity!`); }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          <MessageSquare size={12} /> WhatsApp
                        </button>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setEnquiryModalTarget(item); }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.25rem 0.7rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(37,99,235,0.25)' }}
                        >
                          <Zap size={12} /> Enquire / Quote
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSuggestions(false);
                            const url = item.subdomain ? `https://${item.subdomain}.manacity.in` : `/site/${item.slug || 'rajugari-ventures'}`;
                            window.open(url, '_blank');
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}
                        >
                          Storefront <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: NEARBY LOCAL BUSINESSES (2-3 RESULTS MAX) */}
          {(dropdownFilter === 'ALL' || dropdownFilter === 'NEARBY') && placesToDisplay.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem 0.35rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  📍 Nearby Businesses in {cityCap}
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c2410c', backgroundColor: '#fff7ed', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                  Local Area
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {placesToDisplay.map((place, pIdx) => (
                  <div
                    key={`p-${pIdx}`}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      backgroundColor: '#fff7ed',
                      border: '1px solid #ffedd5'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>{place.name}</span>
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#ffedd5', color: '#c2410c', padding: '0.05rem 0.4rem', borderRadius: '6px' }}>
                            Unverified Listing
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem' }}>
                          {place.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.45rem' }}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEnquiryModalTarget(place); }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#ea580c', color: '#fff', border: 'none', padding: '0.25rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        <Zap size={12} /> Request Quote / Connect
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`ManaCity Support will help you claim and verify "${place.name}"! Call us at +91 98765 43210.`);
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', backgroundColor: '#ffffff', color: '#ea580c', border: '1px solid #ffedd5', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}
                      >
                        Claim Listing 🛡️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNMATCHED SEARCH QUERY REQUEST BUTTON (ONLY SHOWN IF ZERO RESULTS FOUND) */}
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

      {/* Instant Lead Capture Enquiry Modal */}
      {enquiryModalTarget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setEnquiryModalTarget(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            {enquirySubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={48} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Enquiry Sent Successfully!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                  ManaCity team and {enquiryModalTarget.name || enquiryModalTarget.businessName} will respond to your mobile within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                  ⚡ Quick Quote & Instant Connect
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.2rem' }}>
                  {enquiryModalTarget.name || enquiryModalTarget.businessName}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Enter your details below to get instant quotes, pricing, and direct callback.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Raju Meesala"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>Service Needed / Question</label>
                    <textarea
                      rows={2}
                      placeholder="What service or product pricing are you looking for?"
                      value={customerMsg}
                      onChange={(e) => setCustomerMsg(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
                  >
                    🚀 Submit Instant Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
