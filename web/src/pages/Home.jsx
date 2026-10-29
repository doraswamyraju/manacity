import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import ClaimBusinessModal from '../components/ClaimBusinessModal';
import UnonboardedEnquiryModal from '../components/UnonboardedEnquiryModal';
import PhoneCollectionModal from '../components/PhoneCollectionModal';
import CityWaitlistModal from '../components/CityWaitlistModal';
import {
  Search,
  MapPin,
  Star,
  Phone,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Building2,
  Wrench,
  Sparkles,
  Home as HomeIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Utensils,
  GraduationCap,
  Scissors,
  Car,
  Plane,
  Heart,
  MoreHorizontal,
  Flame,
  ArrowRight,
  CheckCircle,
  Clock,
  Send,
  X,
  Share2,
  Bookmark
} from 'lucide-react';

export default function Home({
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToDelete,
  onNavigateToSuperAdmin,
  user
}) {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('tirupati');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Waitlist modal state for city lock
  const [waitlistModalCity, setWaitlistModalCity] = useState(null);

  // Modals & Overlays
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [unonboardedTargetBusiness, setUnonboardedTargetBusiness] = useState(null);
  const [claimModalInfo, setClaimModalInfo] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingEnquiryAction, setPendingEnquiryAction] = useState(null);

  // Quick Quotes / Requirements Modal
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    requirement: '',
    category: 'Home Services',
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: 'tirupati'
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  // Top search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);

  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    document.body.classList.add('light-mode');
    document.body.setAttribute('data-theme', 'light');
  }, []);

  // Fetch verified directory listings strictly live from database for Tirupati
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/phase1/directory/${selectedCity}/all?query=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`
      );
      setListings(res.data?.listings || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCity, selectedCategory]);

  // City selection handler with Tirupati Region Lock
  const handleCityChange = (city) => {
    if (city && city.toLowerCase() !== 'tirupati') {
      setWaitlistModalCity(city);
      return;
    }
    setSelectedCity(city);
  };

  // Autocomplete / Search suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingSuggestions(true);
      try {
        const unifiedRes = await axios.get(
          `/api/phase1/search-unified?city=${encodeURIComponent(selectedCity)}&query=${encodeURIComponent(query)}`
        );
        const mItems = (unifiedRes.data?.masterItems || []).map(m => ({
          id: m.id || m.slug,
          businessName: m.name,
          category: m.category || 'Service',
          isMasterItem: true,
          slug: m.slug
        }));
        const bItems = (unifiedRes.data?.businesses || []).map(b => ({
          ...b,
          isVerifiedManaCity: true
        }));
        setSuggestions([...mItems, ...bItems]);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedCity]);

  // Auth Guard for Leads
  const handleEnquiryAuthGuard = (actionCallback) => {
    if (!user) {
      onNavigateToLogin();
      return;
    }
    if (!user.phone) {
      setPendingEnquiryAction(() => actionCallback);
      setShowPhoneModal(true);
      return;
    }
    actionCallback();
  };

  const handleCallClick = (listing) => {
    handleEnquiryAuthGuard(async () => {
      try {
        await axios.post('/api/phase1/lead', {
          businessGroupId: listing.id,
          channel: 'CALL'
        });
      } catch (e) {}
      window.location.href = `tel:${listing.phone}`;
    });
  };

  const handleWhatsAppClick = (listing) => {
    handleEnquiryAuthGuard(async () => {
      try {
        await axios.post('/api/phase1/lead', {
          businessGroupId: listing.id,
          channel: 'WHATSAPP'
        });
      } catch (e) {}
      const text = encodeURIComponent(`Hi ${listing.businessName}, I found your business on ManaCity.in and would like to get a quote.`);
      window.open(`https://wa.me/${(listing.whatsApp || listing.phone || '').replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    });
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/phase1/lead', {
        businessGroupId: selectedLeadModal.id,
        channel: 'FORM',
        contactName: leadForm.name,
        contactPhone: leadForm.phone,
        contactEmail: leadForm.email,
        message: leadForm.message
      });
      setLeadSubmitted(true);
      setTimeout(() => {
        setLeadSubmitted(false);
        setSelectedLeadModal(null);
        setLeadForm({ name: '', phone: '', email: '', message: '' });
      }, 2000);
    } catch (e) {
      alert('Inquiry sent successfully!');
      setSelectedLeadModal(null);
    }
  };

  // Submit Free Quotes Request
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    try {
      await axios.post('/api/phase1/unmatched-query', {
        searchQuery: quoteForm.requirement,
        city: 'tirupati',
        customerName: quoteForm.name || 'ManaCity User',
        customerPhone: quoteForm.phone,
        customerEmail: quoteForm.email,
        category: quoteForm.category
      });
      setQuoteSubmitted(true);
      setTimeout(() => {
        setQuoteSubmitted(false);
        setShowQuoteModal(false);
        setQuoteForm({
          requirement: '',
          category: 'Home Services',
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          city: 'tirupati'
        });
      }, 2200);
    } catch (err) {
      alert('Could not submit request. Please try again.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // Quick popular search pills
  const popularKeywords = [
    'AC Repair',
    'Restaurants',
    'Doctors',
    'Real Estate',
    'Hotels',
    'Electricians',
    'Beauty Spa',
    'Cabs'
  ];

  // Category Icon List matching design
  const categoryTiles = [
    { name: 'Restaurants', subtitle: 'Food & Cafes', icon: Utensils, color: '#f97316', bg: '#fff7ed' },
    { name: 'Doctors', subtitle: 'Clinics & Hospitals', icon: Heart, color: '#0284c7', bg: '#f0f9ff' },
    { name: 'Home Services', subtitle: 'AC, Electrician, Plumber', icon: Wrench, color: '#16a34a', bg: '#f0fdf4' },
    { name: 'Real Estate', subtitle: 'Buy, Rent & Agents', icon: HomeIcon, color: '#9333ea', bg: '#faf5ff' },
    { name: 'Travel', subtitle: 'Flights, Hotels, Cabs', icon: Plane, color: '#2563eb', bg: '#eff6ff' },
    { name: 'Education', subtitle: 'Schools, Colleges', icon: GraduationCap, color: '#d97706', bg: '#fffbeb' },
    { name: 'Beauty', subtitle: 'Salons & Spa', icon: Scissors, color: '#ec4899', bg: '#fdf2f8' },
    { name: 'Automotive', subtitle: 'Car, Bike, Service', icon: Car, color: '#4f46e5', bg: '#eef2ff' },
    { name: 'More', subtitle: 'All Categories', icon: MoreHorizontal, color: '#64748b', bg: '#f8fafc' }
  ];

  // Filter tabs for Trending section
  const trendingTabs = ['All', 'Restaurants', 'Doctors', 'Home Services', 'Travel', 'Real Estate'];

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff', color: '#0f172a', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Global Header with Tirupati City Guard */}
      <Header
        user={user}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />

      {/* 2. Hero Section - Tirupati Regional Hub */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
        padding: '3rem 1.5rem 4rem',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* Left Column: Heading, Badges, Search Bar */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              <Sparkles size={14} color="#0284c7" />
              TIRUPATI'S TRUSTED LOCAL PLATFORM
            </div>

            <h1 style={{
              fontSize: '3.1rem',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              margin: '0 0 1rem'
            }}>
              Your City.<br />
              <span style={{ color: '#2563eb' }}>Everything</span> You Need.
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#475569',
              lineHeight: 1.55,
              margin: '0 0 1.5rem',
              maxWidth: '520px'
            }}>
              Discover trusted local businesses, services, places and offers in <strong>Tirupati</strong>.
            </p>

            {/* 4 Feature Trust Badges */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem 1.25rem',
              marginBottom: '2rem'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
                <CheckCircle size={15} /> Verified Businesses
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>
                <Star size={15} fill="#d97706" /> Real Customer Reviews
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>
                <ShieldCheck size={15} /> Best Price Quotes
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>
                <Clock size={15} /> Instant Booking & Support
              </span>
            </div>

            {/* Hero Main Search Box */}
            <div style={{ position: 'relative', maxWidth: '580px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '2px solid #2563eb',
                borderRadius: '50px',
                padding: '0.4rem 0.5rem 0.4rem 1.25rem',
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.15)',
                gap: '0.75rem'
              }}>
                <Search size={20} color="#64748b" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') fetchListings(); }}
                  placeholder="Search for AC repair, restaurants, doctors, real estate..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: '#0f172a',
                    fontWeight: 500,
                    backgroundColor: 'transparent'
                  }}
                />

                {/* City Locked Indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#0f172a'
                }}>
                  <MapPin size={14} color="#2563eb" />
                  <span>Tirupati</span>
                </div>

                <button
                  type="button"
                  onClick={fetchListings}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '40px',
                    padding: '0.7rem 1.5rem',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  Search
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  zIndex: 50,
                  overflow: 'hidden',
                  maxHeight: '320px',
                  overflowY: 'auto'
                }}>
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setQuery(item.businessName);
                        setShowSuggestions(false);
                        fetchListings();
                      }}
                      style={{
                        padding: '0.75rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f8fafc',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Search size={15} color="#94a3b8" />
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{item.businessName}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                        {item.category || 'Listing'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular Search Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Popular:</span>
                {popularKeywords.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => {
                      setQuery(word);
                      setSelectedCategory('All');
                      fetchListings();
                    }}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e0f2fe'; e.currentTarget.style.color = '#0369a1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tirupati Heritage & Verified Badge Showcase */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              height: '380px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
              border: '3px solid #ffffff'
            }}>
              {/* High-res Tirupati Gopuram image */}
              <img
                src="https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80"
                alt="Tirupati City & Temples"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)'
              }} />

              {/* Top Verified Floating Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.12)'
              }}>
                <div style={{ backgroundColor: '#eff6ff', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a' }}>5,000+</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Verified Businesses</div>
                </div>
              </div>

              {/* Bottom Card: Our Tirupati Community */}
              <div style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(10px)',
                borderRadius: '18px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontSize: '0.92rem', fontWeight: 900 }}>
                    Our Tirupati <Heart size={16} fill="#ef4444" color="#ef4444" />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                    Our Businesses • Our Community
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('trending-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Tiles Grid */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 1.5rem 2rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}>
          {categoryTiles.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (cat.name === 'More') {
                  setSelectedCategory('All');
                } else {
                  setSelectedCategory(cat.name);
                }
                const el = document.getElementById('trending-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem 0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = cat.color;
                e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: cat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: cat.color
              }}>
                <cat.icon size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{cat.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '105px' }}>
                  {cat.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Get Multiple Quotes Banner */}
      <section style={{ maxWidth: '1240px', margin: '1rem auto 2.5rem', padding: '0 1.5rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fed7aa 100%)',
          border: '1px solid #fde68a',
          borderRadius: '24px',
          padding: '2rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '2rem',
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.12)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '0.25rem 0.65rem',
              borderRadius: '16px',
              fontSize: '0.72rem',
              fontWeight: 800,
              marginBottom: '0.75rem'
            }}>
              <Check size={13} />
              BEST DEAL GUARANTEE
            </div>

            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#78350f', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
              Get Multiple Quotes from Verified Professionals
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#92400e', margin: '0 0 1.5rem' }}>
              Compare prices, read real verified reviews, and choose the best service provider in Tirupati.
            </p>

            <button
              type="button"
              onClick={() => setShowQuoteModal(true)}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 18px rgba(37, 99, 235, 0.3)'
              }}
            >
              Get Free Quotes
              <ArrowRight size={17} />
            </button>
          </div>

          {/* 3 Step Workflow Graphic */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.9)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                <Send size={20} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Post Requirement</div>
            </div>

            <ChevronRight size={18} color="#94a3b8" />

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                <MessageSquare size={20} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Receive Quotes</div>
            </div>

            <ChevronRight size={18} color="#94a3b8" />

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                <CheckCircle size={20} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Compare & Choose</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending in Tirupati - Live Database Only */}
      <section id="trending-section" style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem 3.5rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Trending in Tirupati
              </h2>
              <Flame size={24} color="#f97316" fill="#f97316" />
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.35rem 0 0' }}>
              Most popular verified businesses loved by our local community
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
            {trendingTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedCategory(tab)}
                style={{
                  backgroundColor: selectedCategory === tab ? '#2563eb' : '#f1f5f9',
                  color: selectedCategory === tab ? '#ffffff' : '#475569',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Live Database Listings Container */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>Loading verified Tirupati businesses from database...</div>
          </div>
        ) : listings.length === 0 ? (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '24px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Building2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              No Verified Businesses Listed Yet in This Category
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
              All listings on ManaCity are 100% verified and loaded directly from our live database. Be the first business owner to get featured in Tirupati!
            </p>
            <button
              type="button"
              onClick={() => onNavigateToRegister ? onNavigateToRegister() : window.location.href = '/register'}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.75rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              List Your Business in Tirupati For Free
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {listings.map((item) => {
              const bgImage = item.coverImageUrl || item.photos?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80';
              const profileUrl = `/site/${item.slug || item.id}`;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 30px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  }}
                >
                  <div>
                    {/* Card Cover Header */}
                    <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                      <img
                        src={bgImage}
                        alt={item.businessName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <ShieldCheck size={12} /> Verified
                      </div>

                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}>
                        <Heart size={16} color="#ef4444" />
                      </div>
                    </div>

                    {/* Card Info */}
                    <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.15rem 0.45rem', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 800 }}>
                          <Star size={12} fill="#d97706" />
                          <span>{item.rating || 4.9}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>({item.reviewCount || 45})</span>
                        <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>•</span>
                        <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700 }}>{item.category}</span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem', lineHeight: 1.3 }}>
                        {item.businessName}
                      </h3>

                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} color="#94a3b8" />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.address || 'Tirupati, Andhra Pradesh'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.6rem' }}>
                    <button
                      type="button"
                      onClick={() => handleCallClick(item)}
                      style={{
                        flex: 1,
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.55rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Phone size={14} /> Call
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppClick(item)}
                      style={{
                        flex: 1,
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.55rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={() => window.open(profileUrl, '_blank')}
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.55rem 0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="View Details"
                    >
                      <ExternalLink size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Tirupati in Your Pocket - App Section */}
      <section style={{
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        padding: '4rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '3rem', alignItems: 'center' }}>
          
          {/* Mobile Mockup Visual */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '280px',
              height: '520px',
              backgroundColor: '#0f172a',
              borderRadius: '44px',
              padding: '12px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              margin: '0 auto',
              border: '4px solid #334155',
              position: 'relative'
            }}>
              {/* Screen Inner */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '34px',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Header in Phone */}
                <div style={{ backgroundColor: '#2563eb', padding: '1.25rem 1rem 0.75rem', color: '#ffffff', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>ManaCity Mobile</div>
                  <div style={{ fontSize: '1rem', fontWeight: 900 }}>Tirupati</div>
                </div>
                {/* Search mock */}
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '0.45rem 0.75rem', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Search size={13} /> Search in Tirupati...
                  </div>
                </div>
                {/* Mini cards */}
                <div style={{ flex: 1, padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af' }}>Top Doctors & Clinics</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Book consultation fast</div>
                  </div>
                  <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>AC & Electrical Repairs</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Verified vendors nearby</div>
                  </div>
                  <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9a3412' }}>Restaurants & Catering</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Explore menus & ratings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Value Props */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '0.25rem 0.75rem',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>
              LOCAL CONVENIENCE
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem', lineHeight: 1.2 }}>
              Tirupati in <span style={{ color: '#2563eb' }}>Your Pocket</span>
            </h2>

            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
              Discover, connect and grow with ManaCity mobile web & app experience. Find local businesses, book services, get instant quotes and directions — all in one place.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>Find nearby services</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>Get best quotes</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={18} />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>Read real reviews</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>Chat & call directly</span>
              </div>
            </div>

            {/* Badges / Download preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', opacity: 0.8 }}>GET IT ON</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>Google Play</div>
              </div>

              <div style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', opacity: 0.8 }}>DOWNLOAD ON THE</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>App Store</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How ManaCity Works */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '4rem 1.5rem', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>
          How ManaCity Works?
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 3rem' }}>
          Get what you need in just a few simple steps
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '2rem' }}>
          {/* Step 1 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', fontWeight: 900 }}>
              1
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>Search or Post</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Find businesses or post your specific service requirement.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', fontWeight: 900 }}>
              2
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>Get Quotes</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Receive competitive quotes from verified Tirupati professionals.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', fontWeight: 900 }}>
              3
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>Check Reviews</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Read genuine feedback from fellow residents and customers.
            </p>
          </div>

          {/* Step 4 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', fontWeight: 900 }}>
              4
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>Connect & Done</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Call, chat or book instantly and get your service accomplished.
            </p>
          </div>
        </div>
      </section>

      {/* 8. List Your Business on ManaCity Banner */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 4rem', padding: '0 1.5rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '24px',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.25rem 0.75rem',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>
              FOR BUSINESS OWNERS IN TIRUPATI
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.75rem', lineHeight: 1.25 }}>
              List Your Business on ManaCity
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#475569', margin: '0 0 1.75rem' }}>
              Get more customers, increase visibility and grow your business with Tirupati's dedicated local directory platform.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 700, color: '#1e3a8a' }}>
                <CheckCircle size={16} color="#2563eb" /> Reach local customers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 700, color: '#1e3a8a' }}>
                <CheckCircle size={16} color="#2563eb" /> Get verified badge
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 700, color: '#1e3a8a' }}>
                <CheckCircle size={16} color="#2563eb" /> Showcase your services
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 700, color: '#1e3a8a' }}>
                <CheckCircle size={16} color="#2563eb" /> Receive genuine leads
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToRegister ? onNavigateToRegister() : window.location.href = '/register'}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 18px rgba(37, 99, 235, 0.25)'
              }}
            >
              List Your Business Now
              <ArrowRight size={17} />
            </button>
          </div>

          {/* Business Showcase Illustration Box */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 12px 28px rgba(37, 99, 235, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Building2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Zero Commission Listing
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Create your business profile, upload catalogs, collect direct customer enquiries via WhatsApp and phone calls without any middlemen.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Metrics & Community Feedback */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '3.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.35rem' }}>5,000+</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Verified Businesses</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#a855f7', marginBottom: '0.35rem' }}>50,000+</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Happy Customers</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399', marginBottom: '0.35rem' }}>15+</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Categories Covered</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#facc15', marginBottom: '0.35rem' }}>4.8 ★</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Average Platform Rating</div>
          </div>
        </div>
      </section>

      {/* 10. Comprehensive Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '4rem 1.5rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          <div>
            <img src="/logo-horizontal.png" alt="ManaCity Logo" style={{ height: '48px', objectFit: 'contain', marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Your trusted local platform to discover, connect and grow in Tirupati.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Currently live exclusively in <strong>Tirupati, Andhra Pradesh</strong>.
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('All')}>Browse Categories</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onNavigateToRegister ? onNavigateToRegister() : null}>List Your Business</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onNavigateToLogin ? onNavigateToLogin() : null}>Business Login</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Top Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Restaurants')}>Restaurants & Food</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Doctors')}>Doctors & Clinics</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Home Services')}>AC & Home Repairs</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Real Estate')}>Real Estate & Plots</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Legal & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#64748b' }}>
              <button onClick={onNavigateToPrivacy} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>Privacy Policy</button>
              <button onClick={onNavigateToTerms} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>Terms of Service</button>
              <button onClick={onNavigateToDelete} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>Delete Account</button>
              {onNavigateToSuperAdmin && (
                <button onClick={onNavigateToSuperAdmin} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>Super Admin</button>
              )}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
          © 2026 ManaCity Platform. All rights reserved. Exclusively serving Tirupati, India.
        </div>
      </footer>

      {/* Free Quotes Modal */}
      {showQuoteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', padding: '1.5rem', color: '#ffffff', position: 'relative' }}>
              <button
                onClick={() => setShowQuoteModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem' }}>Get Multiple Free Quotes</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.9 }}>Connect with verified Tirupati service providers directly.</p>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {quoteSubmitted ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>Requirement Received!</h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>Verified professionals in Tirupati will reach out to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                      What service or product do you need? *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Need AC servicing for 2 split ACs in Bairagi Patteda..."
                      value={quoteForm.requirement}
                      onChange={(e) => setQuoteForm({ ...quoteForm, requirement: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: quoteSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Send size={16} />
                    {quoteSubmitting ? 'Submitting...' : 'Post Requirement & Get Quotes'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* City Waitlist Modal for Non-Tirupati selections */}
      <CityWaitlistModal
        isOpen={!!waitlistModalCity}
        onClose={() => setWaitlistModalCity(null)}
        selectedCity={waitlistModalCity}
      />

      {/* Lead Enquiry Modal */}
      {selectedLeadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ backgroundColor: '#2563eb', padding: '1.25rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Get Best Quote from {selectedLeadModal.businessName}</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setSelectedLeadModal(null)} />
            </div>
            <div style={{ padding: '1.5rem' }}>
              {leadSubmitted ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <CheckCircle size={40} color="#16a34a" style={{ margin: '0 auto 0.5rem' }} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Quote Request Sent!</h4>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    style={{ padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    style={{ padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <textarea
                    rows={3}
                    placeholder="Message / Requirement details..."
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                    style={{ padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
                    Send Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claim Business Modal */}
      <ClaimBusinessModal
        isOpen={!!claimModalInfo}
        onClose={() => setClaimModalInfo(null)}
        businessInfo={claimModalInfo}
      />

      {/* Unonboarded Business Enquiry Modal */}
      <UnonboardedEnquiryModal
        isOpen={!!unonboardedTargetBusiness}
        onClose={() => setUnonboardedTargetBusiness(null)}
        targetBusiness={unonboardedTargetBusiness}
      />

      {/* Phone collection modal for enquiries */}
      <PhoneCollectionModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onPhoneSaved={() => {
          setShowPhoneModal(false);
          if (pendingEnquiryAction) {
            pendingEnquiryAction();
            setPendingEnquiryAction(null);
          }
        }}
      />
    </div>
  );
}
