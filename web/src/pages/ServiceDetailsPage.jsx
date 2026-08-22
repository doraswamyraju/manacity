import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import {
  Search,
  MapPin,
  Star,
  Phone,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Send,
  HelpCircle,
  Clock,
  Award,
  Heart,
  Utensils,
  Cross,
  Home as HomeIcon,
  Plane,
  GraduationCap,
  Wrench,
  MoreHorizontal,
  Sparkles,
  Scissors,
  Car,
  Megaphone
} from 'lucide-react';

export default function ServiceDetailsPage({ user }) {
  const { city, slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [vendorSearch, setVendorSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [fastResponseOnly, setFastResponseOnly] = useState(false);
  const [sortBy, setSortBy] = useState('RATING');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Ad Banner Visibility State
  const [showTopAdBanner, setShowTopAdBanner] = useState(true);

  // Saved Listings State
  const [savedVendors, setSavedVendors] = useState({});

  // Individual Quote Modal State
  const [selectedVendorForLead, setSelectedVendorForLead] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);

  // Broadcast Sidebar Form State
  const [broadcastForm, setBroadcastForm] = useState({
    serviceNeeded: '',
    name: user?.name || '',
    phone: user?.phone || '',
    agreeTerms: true
  });
  const [broadcastSubmitted, setBroadcastSubmitted] = useState(false);
  const [submittingBroadcast, setSubmittingBroadcast] = useState(false);

  const citySlug = (city || 'tirupati').toLowerCase();
  const serviceSlug = slug;

  const sidebarCategories = [
    { name: 'Restaurants', icon: Utensils, color: '#ef4444', bg: '#fef2f2' },
    { name: 'Doctors', icon: Cross, color: '#0ea5e9', bg: '#f0f9ff' },
    { name: 'Real Estate', icon: HomeIcon, color: '#f43f5e', bg: '#fff1f2' },
    { name: 'Travel', icon: Plane, color: '#3b82f6', bg: '#eff6ff' },
    { name: 'Education', icon: GraduationCap, color: '#10b981', bg: '#ecfdf5' },
    { name: 'Repairs', icon: Wrench, color: '#f59e0b', bg: '#fffbeb' },
    { name: 'Beauty', icon: Scissors, color: '#ec4899', bg: '#fdf2f8' },
    { name: 'Automotive', icon: Car, color: '#8b5cf6', bg: '#f5f3ff' },
    { name: 'Fitness', icon: Zap, color: '#06b6d4', bg: '#ecfeff' },
    { name: 'More', icon: MoreHorizontal, color: '#64748b', bg: '#f8fafc' }
  ];

  // Default fallback business covers
  const fallbackCovers = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  ];

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/phase1/service-details/${citySlug}/${serviceSlug}`);
        setData(res.data);
        if (res.data?.service?.name) {
          setBroadcastForm(prev => ({ ...prev, serviceNeeded: res.data.service.name }));
        }
      } catch (err) {
        console.error('Error loading service details:', err);
        setError('Service details not found or failed to load.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [citySlug, serviceSlug]);

  // Filter & Sort vendors list dynamically
  const filteredVendors = useMemo(() => {
    if (!data?.vendors) return [];
    let list = [...data.vendors];

    if (vendorSearch.trim()) {
      const q = vendorSearch.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || (v.address && v.address.toLowerCase().includes(q)));
    }

    if (minRating > 0) {
      list = list.filter(v => (v.rating || 0) >= minRating);
    }

    if (verifiedOnly) {
      list = list.filter(v => v.isVerifiedManaCity);
    }

    if (fastResponseOnly) {
      list = list.filter(v => v.isVerifiedManaCity || v.rating >= 4.5);
    }

    if (selectedCategoryFilter !== 'ALL') {
      list = list.filter(v => (v.category || '').toLowerCase() === selectedCategoryFilter.toLowerCase());
    }

    if (sortBy === 'RATING') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'REVIEWS') {
      list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortBy === 'NAME') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [data?.vendors, vendorSearch, minRating, verifiedOnly, fastResponseOnly, selectedCategoryFilter, sortBy]);

  const handlePhoneCallLead = async (vendor) => {
    try {
      await axios.post('/api/phase1/lead', {
        businessGroupId: vendor.id,
        channel: 'PHONE_CALL',
        contactName: user?.name || 'Phone Visitor',
        contactPhone: user?.phone || vendor.phone || '',
        contactEmail: user?.email || '',
        message: `[DIRECT CALL CLICKED] Clicked Phone Call for ${data?.service?.name || 'Service'}`,
        visitorLocation: data?.city || 'Tirupati',
        viewedServices: [data?.service?.name || 'Service']
      });
    } catch (err) {
      console.warn('Failed to record phone lead:', err);
    }
    const cleanPhone = (vendor.phone || '9876543210').replace(/[^0-9]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWhatsAppLead = async (vendor) => {
    try {
      await axios.post('/api/phase1/lead', {
        businessGroupId: vendor.id,
        channel: 'WHATSAPP',
        contactName: user?.name || 'WhatsApp Visitor',
        contactPhone: user?.phone || vendor.phone || '',
        contactEmail: user?.email || '',
        message: `[WHATSAPP CLICKED] Clicked WhatsApp Chat for ${data?.service?.name || 'Service'}`,
        visitorLocation: data?.city || 'Tirupati',
        viewedServices: [data?.service?.name || 'Service']
      });
    } catch (err) {
      console.warn('Failed to record whatsapp lead:', err);
    }
    const cleanPhone = (vendor.whatsApp || vendor.phone || '9876543210').replace(/[^0-9]/g, '');
    const num = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(`Hi ${vendor.name}, I found your business listing on ManaCity for ${data?.service?.name || 'Service'} in ${data?.city || 'Tirupati'}. I would like to inquire about your services and pricing.`);
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  const handleTagClick = (tag) => {
    const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/${data?.city || citySlug}/service/${tagSlug}`);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVendorForLead) return;

    setSubmittingLead(true);
    try {
      await axios.post('/api/phase1/lead', {
        businessGroupId: selectedVendorForLead.id,
        channel: 'INQUIRY_FORM',
        contactName: leadForm.name,
        contactPhone: leadForm.phone,
        contactEmail: leadForm.email,
        message: leadForm.message || `Inquiry for ${data?.service?.name || 'Service'}`,
        visitorLocation: data?.city || 'Tirupati',
        viewedServices: [data?.service?.name || 'Service']
      });
      setLeadSubmitted(true);
      setTimeout(() => {
        setLeadSubmitted(false);
        setSelectedVendorForLead(null);
        setLeadForm({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', message: '' });
      }, 2500);
    } catch (err) {
      alert('Failed to submit quote inquiry. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!filteredVendors || filteredVendors.length === 0) return;

    setSubmittingBroadcast(true);
    try {
      await axios.post('/api/phase1/lead', {
        businessGroupId: filteredVendors[0].id,
        channel: 'BROADCAST_FORM',
        contactName: broadcastForm.name,
        contactPhone: broadcastForm.phone,
        contactEmail: '',
        message: `[BROADCAST QUOTE REQUEST] Service Needed: ${broadcastForm.serviceNeeded || data?.service?.name}`,
        visitorLocation: data?.city || 'Tirupati',
        viewedServices: [data?.service?.name || 'Service']
      });
      setBroadcastSubmitted(true);
      setTimeout(() => {
        setBroadcastSubmitted(false);
        setBroadcastForm(prev => ({ ...prev, name: user?.name || '', phone: user?.phone || '' }));
      }, 3000);
    } catch (err) {
      alert('Failed to send broadcast quote request. Please try again.');
    } finally {
      setSubmittingBroadcast(false);
    }
  };

  const toggleSaveVendor = (vendorId) => {
    setSavedVendors(prev => ({ ...prev, [vendorId]: !prev[vendorId] }));
  };

  const clearAllFilters = () => {
    setVendorSearch('');
    setMinRating(0);
    setVerifiedOnly(false);
    setFastResponseOnly(false);
    setSelectedCategoryFilter('ALL');
    setSortBy('RATING');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={36} color="#2563eb" style={{ animation: 'spin 2s linear infinite' }} />
          <h3 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 800 }}>Loading Service Directory Page...</h3>
        </div>
      </div>
    );
  }

  if (error || !data || !data.service) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Service Offering Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>We couldn't find details for this service offering.</p>
        <button
          onClick={() => navigate('/')}
          style={{ marginTop: '1.5rem', padding: '0.65rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
        >
          Return to ManaCity Home
        </button>
      </div>
    );
  }

  const { service, vendors } = data;
  const cityNameCap = data.city.charAt(0).toUpperCase() + data.city.slice(1);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Animations for Metallic Shimmer Light Sweep on Enquire/Order Button */}
      <style>{`
        @keyframes enquireButtonShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      {/* 1. Standalone Header Module */}
      <Header
        user={user}
        selectedCity={citySlug}
        onCityChange={(newCity) => navigate(`/${newCity}/service/${serviceSlug}`)}
      />

      {/* 2. Top Promo Advertising Banner */}
      {showTopAdBanner && (
        <div style={{ maxWidth: '1280px', margin: '1rem auto 0.5rem auto', padding: '0 1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 100%)',
            borderRadius: '16px',
            padding: '1.1rem 1.75rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            position: 'relative',
            boxShadow: '0 8px 25px rgba(30, 27, 75, 0.3)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={28} color="#fbbf24" />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 900, backgroundColor: 'rgba(251, 191, 36, 0.25)', color: '#fbbf24', padding: '0.2rem 0.55rem', borderRadius: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  LIMITED TIME OFFER
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0.3rem 0 0.15rem 0', color: '#ffffff' }}>
                  Get 20% OFF on Premium Business Listing!
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#c7d2fe', margin: 0 }}>
                  Boost visibility, get more enquiries and grow your business with ManaCity.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ border: '1px dashed rgba(255,255,255,0.4)', borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: 700, color: '#e0e7ff', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                Use Code: <span style={{ color: '#fbbf24', fontWeight: 900 }}>MC20</span>
              </div>
              
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)'
                }}
              >
                List Your Business <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setShowTopAdBanner(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
                title="Dismiss Banner"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Horizontal Filter Toolbar */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.83rem',
                fontWeight: 700,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Restaurant">Restaurants</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Auditor / CA / Tax Consultant">CA & Tax</option>
            </select>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.45rem 0.85rem', fontSize: '0.83rem', fontWeight: 700, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#2563eb" />
              <select
                value={citySlug}
                onChange={(e) => navigate(`/${e.target.value}/service/${serviceSlug}`)}
                style={{ background: 'transparent', border: 'none', color: '#0f172a', fontWeight: 800, fontSize: '0.83rem', outline: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
              >
                {['tirupati', 'hyderabad', 'vijayawada', 'visakhapatnam', 'chennai', 'bangalore'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.83rem',
                fontWeight: 700,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="RATING">Sort by: Top Rated</option>
              <option value="REVIEWS">Sort by: Most Reviews</option>
              <option value="NAME">Sort by: Name (A-Z)</option>
            </select>

            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              style={{
                backgroundColor: verifiedOnly ? '#d1fae5' : '#ffffff',
                border: verifiedOnly ? '1.5px solid #059669' : '1px solid #cbd5e1',
                color: verifiedOnly ? '#047857' : '#0f172a',
                borderRadius: '10px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.83rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ShieldCheck size={15} color={verifiedOnly ? '#047857' : '#2563eb'} /> Verified Only
            </button>

            <button
              type="button"
              onClick={() => setFastResponseOnly(!fastResponseOnly)}
              style={{
                backgroundColor: fastResponseOnly ? '#dbeafe' : '#ffffff',
                border: fastResponseOnly ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                color: fastResponseOnly ? '#1e40af' : '#0f172a',
                borderRadius: '10px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.83rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Clock size={15} color="#2563eb" /> Fast Response
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#64748b', margin: '0.5rem 0 1rem 0' }}>
          <div>
            Showing <strong>1 – {filteredVendors.length}</strong> of <strong>{vendors.length}</strong> results in <strong>{cityNameCap}</strong>
          </div>
          {(vendorSearch || minRating > 0 || verifiedOnly || fastResponseOnly || selectedCategoryFilter !== 'ALL') && (
            <button
              type="button"
              onClick={clearAllFilters}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}
            >
              Clear all ↺
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Content Layout */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: ELEVATED PREMIUM BUSINESS CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor, idx) => {
                const coverImage = vendor.coverImageUrl || fallbackCovers[idx % fallbackCovers.length];
                const isSaved = !!savedVendors[vendor.id];
                const categoryBg = idx % 3 === 0 ? '#2563eb' : (idx % 3 === 1 ? '#ea580c' : '#7c3aed');

                const tagList = vendor.tags && vendor.tags.length > 0
                  ? vendor.tags
                  : ['Social Media Marketing', 'Google Ads', 'SEO Services', 'Content Marketing', 'Website Development'];

                const isTopRated = (vendor.rating || 4.9) >= 4.8;

                return (
                  <div
                    key={vendor.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.15rem 1.35rem',
                      display: 'grid',
                      gridTemplateColumns: '175px minmax(0, 1fr) 155px',
                      gap: '1.25rem',
                      alignItems: 'center',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.035)',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.035)';
                    }}
                  >
                    
                    {/* Top Ambient Highlight Strip */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: isTopRated ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />

                    {/* 1. LEFT COLUMN: THUMBNAIL LOGO WITH CATEGORY & VERIFIED BADGES */}
                    <div style={{ position: 'relative', height: '115px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      <img
                        src={coverImage}
                        alt={vendor.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Top-Left Category Badge */}
                      <span style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        backgroundColor: categoryBg,
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                      }}>
                        {service.category || 'Service'}
                      </span>

                      {/* Bottom-Left Verified Badge */}
                      <span style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        backgroundColor: '#ffffff',
                        color: vendor.isVerifiedManaCity ? '#059669' : '#64748b',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.18rem 0.45rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}>
                        {vendor.isVerifiedManaCity ? (
                          <><CheckCircle2 size={11} color="#059669" /> Verified</>
                        ) : (
                          'Unverified'
                        )}
                      </span>
                    </div>

                    {/* 2. MIDDLE COLUMN: TITLE, TOP CHOICE RIBBON, RATINGS & INTERACTIVE TAG CHIPS */}
                    <div style={{ minWidth: 0 }}>
                      
                      {/* Top Choice Gold Badge */}
                      {isTopRated && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontSize: '0.68rem', fontWeight: 800, padding: '0.12rem 0.5rem', borderRadius: '10px', marginBottom: '0.35rem' }}>
                          🏆 Top Rated Vendor in {cityNameCap}
                        </div>
                      )}

                      {/* Company Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {vendor.name}
                        </h3>
                        {vendor.isVerifiedManaCity && (
                          <ShieldCheck size={17} color="#2563eb" fill="#2563eb" style={{ color: '#fff', flexShrink: 0 }} />
                        )}
                      </div>

                      {/* Ratings & SLA Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.55rem', fontSize: '0.78rem' }}>
                        <span style={{ fontWeight: 900, color: '#d97706', backgroundColor: '#fef3c7', padding: '0.12rem 0.5rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          ★ {vendor.rating || 4.9} ({vendor.reviewCount || 63} reviews)
                        </span>
                        <span style={{ color: '#cbd5e1' }}>•</span>
                        <span style={{ color: '#475569', fontWeight: 600 }}>8+ Years in Business</span>
                        <span style={{ color: '#cbd5e1' }}>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.12rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                          <Clock size={11} color="#2563eb" /> 15-Min Response
                        </span>
                      </div>

                      {/* Single-Line Tag Chips WITH "+More Services ❯" Indication Pill */}
                      <div style={{ position: 'relative', minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          gap: '0.35rem',
                          alignItems: 'center',
                          overflowX: 'auto',
                          whiteSpace: 'nowrap',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                        }}>
                          {tagList.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              onClick={() => handleTagClick(tag)}
                              style={{
                                backgroundColor: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#2563eb',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.55rem',
                                borderRadius: '8px',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; e.currentTarget.style.color = '#ffffff'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
                              title={`Click to view details for ${tag}`}
                            >
                              {tag}
                            </span>
                          ))}

                          <span
                            onClick={() => setSelectedVendorForLead(vendor)}
                            style={{
                              backgroundColor: '#e0e7ff',
                              border: '1px solid #c7d2fe',
                              color: '#3730a3',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '8px',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              boxShadow: '0 2px 6px rgba(55, 48, 163, 0.12)',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3730a3'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#e0e7ff'; e.currentTarget.style.color = '#3730a3'; }}
                            title="Click to view all offered services"
                          >
                            +4 More Services ❯
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. RIGHT COLUMN: PRICING & ANIMATED ENQUIRE / ORDER BUTTON */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '0.45rem', height: '100%', flexShrink: 0 }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <button
                          type="button"
                          onClick={() => toggleSaveVendor(vendor.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}
                        >
                          <Heart size={14} color={isSaved ? '#ef4444' : '#94a3b8'} fill={isSaved ? '#ef4444' : 'none'} /> Save
                        </button>
                        
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>Starts from </span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669' }}>
                            ₹{vendor.price ? vendor.price.toLocaleString('en-IN') : '7,999'}
                          </span>
                        </div>
                      </div>

                      {/* ANIMATED ENQUIRE / ORDER NOW BUTTON */}
                      <button
                        type="button"
                        onClick={() => setSelectedVendorForLead(vendor)}
                        style={{
                          background: 'linear-gradient(110deg, #2563eb 0%, #3b82f6 30%, #60a5fa 50%, #3b82f6 70%, #2563eb 100%)',
                          backgroundSize: '250% 100%',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '0.5rem 0.9rem',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'center',
                          animation: 'enquireButtonShimmer 3s ease-in-out infinite',
                          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Enquire / Order
                      </button>

                      {/* Circular WhatsApp & Call Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppLead(vendor)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#25d366',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)'
                          }}
                          title="Chat on WhatsApp (Logs lead automatically)"
                        >
                          <MessageSquare size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePhoneCallLead(vendor)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                          }}
                          title="Call Provider (Logs lead automatically)"
                        >
                          <Phone size={14} />
                        </button>
                      </div>

                      {/* Storefront Profile Link */}
                      <button
                        type="button"
                        onClick={() => {
                          const url = vendor.subdomain ? `https://${vendor.subdomain}.manacity.in` : `/site/${vendor.slug}`;
                          window.open(url, '_blank');
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#2563eb',
                          borderRadius: '8px',
                          padding: '0.28rem 0.55rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        View Profile <ChevronRight size={13} />
                      </button>

                    </div>

                  </div>
                );
              })
            ) : (
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #fde68a', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
                <Zap size={36} color="#d97706" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>No Verified Providers Found</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.4rem', maxWidth: '600px', margin: '0.4rem auto 1.25rem auto' }}>
                  No providers matched your current search filters. Try clearing filters or submit a request to onboard top local providers!
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await axios.post('/api/phase1/unmatched-query', {
                        searchQuery: service.name,
                        city: data.city,
                        customerName: user?.name || 'Visitor User',
                        customerPhone: user?.phone || '',
                        customerEmail: user?.email || ''
                      });
                      alert(`Request for "${service.name}" submitted to ManaCity Super Admin team! We will notify you once providers are onboarded.`);
                    } catch (err) {
                      alert('Failed to submit request.');
                    }
                  }}
                  style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)' }}
                >
                  🚀 Request Super Admin to Onboard Local Providers
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: 3 STACKED SIDEBAR WIDGETS */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
            
            {/* WIDGET 1: SEND ENQUIRY TO ALL VENDORS CARD */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '16px',
              padding: '1.35rem',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Send Enquiry to All Vendors
                </h3>
                <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', fontSize: '0.62rem', fontWeight: 900, padding: '0.15rem 0.45rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                  NEW
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                Submit once, receive responses from all relevant verified vendors.
              </p>

              {broadcastSubmitted ? (
                <div style={{ backgroundColor: '#d1fae5', border: '1px solid #10b981', color: '#047857', padding: '1rem', borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  🎉 Enquiry Sent! Verified providers in {cityNameCap} will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>What service do you need?</label>
                    <select
                      value={broadcastForm.serviceNeeded}
                      onChange={e => setBroadcastForm({ ...broadcastForm, serviceNeeded: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 600 }}
                    >
                      <option value={service.name}>{service.name}</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="SEO Services">SEO Services</option>
                      <option value="Website Development">Website Development</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      required
                      value={broadcastForm.name}
                      onChange={e => setBroadcastForm({ ...broadcastForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your mobile number"
                      required
                      value={broadcastForm.phone}
                      onChange={e => setBroadcastForm({ ...broadcastForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                    <input
                      type="checkbox"
                      checked={broadcastForm.agreeTerms}
                      onChange={e => setBroadcastForm({ ...broadcastForm, agreeTerms: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>I agree to the Terms & Conditions and Privacy Policy</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingBroadcast || !broadcastForm.agreeTerms}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '10px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {submittingBroadcast ? 'Sending...' : <><Send size={15} /> Send Enquiry to All Vendors</>}
                  </button>
                </form>
              )}
            </div>

            {/* WIDGET 2: POPULAR CATEGORIES GRID */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Popular Categories
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/')}>
                  View all ⌕
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem', textAlign: 'center' }}>
                {sidebarCategories.map((c, cIdx) => (
                  <div
                    key={cIdx}
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <c.icon size={18} color={c.color} />
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 3: WHY CHOOSE MANACITY? TRUST BOX */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
                Why Choose ManaCity?
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>100% Verified Businesses</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Every listing is manually verified for your trust</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Award size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Best Price Guarantee</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Compare & get lowest direct vendor pricing</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Clock size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Fast Response</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Get quick reply within 15 minutes SLA</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Zap size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>No Commission</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Zero brokerage on all enquiries</div>
                  </div>
                </div>
              </div>
            </div>

          </aside>

        </div>

      </main>

      {/* Individual Vendor Inquiry Lead Modal */}
      {selectedVendorForLead && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.75rem', maxWidth: '450px', width: '100%', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Get Best Quote from <span style={{ color: '#2563eb' }}>{selectedVendorForLead.name}</span>
              </h3>
              <button onClick={() => setSelectedVendorForLead(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Submit your inquiry for {service.name} and receive instant price quotes directly.
            </p>

            {leadSubmitted ? (
              <div style={{ backgroundColor: '#d1fae5', border: '1px solid #10b981', color: '#047857', padding: '1rem', borderRadius: '10px', textAlign: 'center', fontWeight: 800 }}>
                ✓ Inquiry Sent Successfully! The business will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem' }}
                />
                <input
                  type="tel"
                  placeholder="Your Mobile Number"
                  required
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem' }}
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={leadForm.email}
                  onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem' }}
                />
                <textarea
                  placeholder={`Requirements for ${service.name}...`}
                  rows={3}
                  value={leadForm.message}
                  onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem' }}
                />
                <button
                  type="submit"
                  disabled={submittingLead}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
                >
                  {submittingLead ? 'Sending...' : 'Submit Quote Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: '4rem', padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#64748b', fontSize: '0.85rem' }}>
        <p>© 2026 ManaCity Aggregator Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
