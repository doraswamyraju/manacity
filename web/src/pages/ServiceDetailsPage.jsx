import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
  ArrowLeft,
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
  Bell,
  Mic,
  Utensils,
  Hotel,
  Cross,
  Home as HomeIcon,
  Plane,
  GraduationCap,
  Wrench,
  MoreHorizontal,
  Sparkles,
  Scissors,
  Car,
  Briefcase,
  Megaphone,
  User
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
  const [sortBy, setSortBy] = useState('RATING'); // RATING, REVIEWS, NAME
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

  const cities = [
    { id: 'tirupati', name: 'Tirupati' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'vijayawada', name: 'Vijayawada' },
    { id: 'visakhapatnam', name: 'Visakhapatnam' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'bangalore', name: 'Bangalore' }
  ];

  const topHeaderCategories = [
    { name: 'Restaurants', icon: Utensils, color: '#ef4444' },
    { name: 'Doctors', icon: Cross, color: '#0ea5e9' },
    { name: 'Real Estate', icon: HomeIcon, color: '#f43f5e' },
    { name: 'Travel', icon: Plane, color: '#3b82f6' },
    { name: 'Education', icon: GraduationCap, color: '#10b981' },
    { name: 'Repairs', icon: Wrench, color: '#f59e0b' },
    { name: 'Beauty', icon: Scissors, color: '#ec4899' },
    { name: 'Automotive', icon: Car, color: '#8b5cf6' },
    { name: 'More', icon: MoreHorizontal, color: '#64748b' }
  ];

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

    // Search query filter
    if (vendorSearch.trim()) {
      const q = vendorSearch.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || (v.address && v.address.toLowerCase().includes(q)));
    }

    // Min Rating filter
    if (minRating > 0) {
      list = list.filter(v => (v.rating || 0) >= minRating);
    }

    // Verified Only filter
    if (verifiedOnly) {
      list = list.filter(v => v.isVerifiedManaCity);
    }

    // Fast Response filter
    if (fastResponseOnly) {
      list = list.filter(v => v.isVerifiedManaCity || v.rating >= 4.5);
    }

    // Category filter
    if (selectedCategoryFilter !== 'ALL') {
      list = list.filter(v => (v.category || '').toLowerCase() === selectedCategoryFilter.toLowerCase());
    }

    // Sort
    if (sortBy === 'RATING') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'REVIEWS') {
      list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortBy === 'NAME') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [data?.vendors, vendorSearch, minRating, verifiedOnly, fastResponseOnly, selectedCategoryFilter, sortBy]);

  // Handle Lead Recording for Direct Phone Call
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

  // Handle Lead Recording for WhatsApp Chat
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

  const { service, vendors, relatedServices } = data;
  const cityNameCap = data.city.charAt(0).toUpperCase() + data.city.slice(1);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* 1. Header Bar (Matching Exact Reference Screenshot Header) */}
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        {/* Main Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          width: '100%',
          flexWrap: 'wrap'
        }}>
          
          {/* Left: Logo & Location Selector Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <picture>
                <source media="(max-width: 768px)" srcSet="/logo-square.png" />
                <img src="/logo-horizontal.png" alt="ManaCity Logo" style={{ height: '36px', objectFit: 'contain' }} />
              </picture>
            </div>

            {/* Location Selector Dropdown Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <MapPin size={15} color="#2563eb" />
              <select
                value={citySlug}
                onChange={(e) => navigate(`/${e.target.value}/service/${serviceSlug}`)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0f172a',
                  outline: 'none',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {cities.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#fff', color: '#0f172a' }}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Center: Hero Search Input Bar */}
          <div style={{
            flex: '1 1 380px',
            maxWidth: '650px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: '#f8fafc',
              border: '1.5px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '24px',
              padding: '0.5rem 1rem',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
            }}>
              <Search size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder={`Search businesses, services & products in ${cityNameCap}...`}
                onFocus={() => navigate('/')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0f172a',
                  width: '100%',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              />
              <Mic size={18} color="#2563eb" style={{ cursor: 'pointer', flexShrink: 0 }} />
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flexShrink: 0 }}>
            {/* List Your Business Button */}
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #2563eb',
                color: '#2563eb',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              List Your Business
            </button>

            {/* Saved Link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
              <Heart size={18} color="#ef4444" />
              <span className="desktop-only">Saved</span>
            </div>

            {/* Notification Icon */}
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Bell size={18} color="#475569" />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 900,
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </span>
            </div>

            {/* User Profile Avatar / Login */}
            {user ? (
              <div
                onClick={() => navigate('/dashboard')}
                style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, cursor: 'pointer', overflow: 'hidden' }}
              >
                {user.avatar ? <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={18} />}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, borderRadius: '20px', cursor: 'pointer' }}>
                Login
              </button>
            )}
          </div>
        </div>

        {/* Sub-Header Horizontal Category Nav Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f1f5f9',
          padding: '0.55rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.75rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {topHeaderCategories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px'
              }}
            >
              <cat.icon size={15} color={cat.color} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </header>

      {/* 2. Top Promo Advertising Banner (Matching Reference Banner 100%) */}
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
            {/* Left Megaphone & Copy */}
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

            {/* Right Code Coupon & CTA */}
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

      {/* 3. Horizontal Filter Toolbar (Matching Screenshot Filters Bar 100%) */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0.5rem 1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {/* All Categories Dropdown */}
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

            {/* City Selector Pill */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.45rem 0.85rem', fontSize: '0.83rem', fontWeight: 700, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#2563eb" />
              <select
                value={citySlug}
                onChange={(e) => navigate(`/${e.target.value}/service/${serviceSlug}`)}
                style={{ background: 'transparent', border: 'none', color: '#0f172a', fontWeight: 800, fontSize: '0.83rem', outline: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
              >
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Sort By Dropdown */}
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

            {/* Verified Only Pill Button */}
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

            {/* Fast Response Pill Button */}
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

            {/* More Filters */}
            <button
              type="button"
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              style={{
                backgroundColor: minRating > 0 ? '#fef3c7' : '#ffffff',
                border: minRating > 0 ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                color: minRating > 0 ? '#b45309' : '#0f172a',
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
              <SlidersHorizontal size={14} /> {minRating > 0 ? '★ 4.5+ Stars' : 'More Filters'}
            </button>
          </div>

        </div>

        {/* Results Counter & Clear Filters Row */}
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

      {/* 4. Main 2-Column Content Layout (68% Left Column + 32% Right Sidebar) */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 3rem 1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: LIST VIEW BUSINESS CARDS (EXACT MATCH TO MOCKUP) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor, idx) => {
                const coverImage = vendor.coverImageUrl || fallbackCovers[idx % fallbackCovers.length];
                const isSaved = !!savedVendors[vendor.id];
                const categoryColor = idx % 3 === 0 ? '#2563eb' : (idx % 3 === 1 ? '#ea580c' : '#7c3aed');
                const categoryBg = idx % 3 === 0 ? '#2563eb' : (idx % 3 === 1 ? '#ea580c' : '#7c3aed');

                return (
                  <div
                    key={vendor.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'grid',
                      gridTemplateColumns: '220px 1fr 180px',
                      gap: '1.25rem',
                      alignItems: 'center',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)'; }}
                  >
                    
                    {/* LEFT BLOCK: BUSINESS COVER IMAGE THUMBNAIL */}
                    <div style={{ position: 'relative', height: '140px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                      <img
                        src={coverImage}
                        alt={vendor.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Top-Left Category Tag Pill */}
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: categoryBg,
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}>
                        {service.category || 'Service'}
                      </span>

                      {/* Bottom-Left Verified Badge */}
                      {vendor.isVerifiedManaCity && (
                        <span style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          backgroundColor: '#ffffff',
                          color: '#059669',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          <CheckCircle2 size={12} color="#059669" /> Verified
                        </span>
                      )}
                    </div>

                    {/* MIDDLE BLOCK: BUSINESS DETAILS & CHIPS */}
                    <div>
                      {/* Business Title & Blue Verified Checkmark */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                          {vendor.name}
                        </h3>
                        {vendor.isVerifiedManaCity && (
                          <ShieldCheck size={17} color="#2563eb" fill="#2563eb" style={{ color: '#fff' }} />
                        )}
                      </div>

                      {/* Subtitle / Category */}
                      <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginBottom: '0.45rem' }}>
                        {service.name} Agency
                      </div>

                      {/* Rating • Years in Business • Location Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.65rem', fontSize: '0.78rem' }}>
                        <span style={{ fontWeight: 900, color: '#d97706', backgroundColor: '#fef3c7', padding: '0.15rem 0.55rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          ★ {vendor.rating || 4.9} ({vendor.reviewCount || 63} reviews)
                        </span>
                        <span style={{ color: '#94a3b8' }}>•</span>
                        <span style={{ color: '#475569', fontWeight: 600 }}>8+ Years in Business</span>
                        <span style={{ color: '#94a3b8' }}>•</span>
                        <span style={{ color: '#475569', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <MapPin size={12} color="#64748b" /> {cityNameCap}
                        </span>
                      </div>

                      {/* Service Specialization Tag Chips Row */}
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                        {['Social Media Marketing', 'Google Ads', 'SEO Services', 'Content Marketing', 'Website Development'].map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              backgroundColor: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              color: '#2563eb',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '10px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, padding: '0.15rem 0.35rem' }}>+4 more</span>
                      </div>

                      {/* Trust Badges Row */}
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f8fafc', padding: '0.15rem 0.45rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <Clock size={12} color="#2563eb" /> 15-Min Response
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f8fafc', padding: '0.15rem 0.45rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <Award size={12} color="#059669" /> Best Price Guarantee
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f8fafc', padding: '0.15rem 0.45rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <Star size={12} color="#d97706" /> 5-Star Rated
                        </span>
                      </div>
                    </div>

                    {/* RIGHT BLOCK: PRICING & ACTION BUTTONS */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                      
                      {/* Save Heart Button */}
                      <button
                        type="button"
                        onClick={() => toggleSaveVendor(vendor.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}
                      >
                        <Heart size={16} color={isSaved ? '#ef4444' : '#94a3b8'} fill={isSaved ? '#ef4444' : 'none'} /> Save
                      </button>

                      {/* Price Badge */}
                      <div style={{ textAlign: 'right', margin: '0.4rem 0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Starts from</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>
                          ₹{vendor.price ? vendor.price.toLocaleString('en-IN') : '4,999'}
                        </div>
                      </div>

                      {/* Primary Enquire / Order Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedVendorForLead(vendor)}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '0.55rem 1.15rem',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'center',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                          marginBottom: '0.5rem'
                        }}
                      >
                        Enquire / Order
                      </button>

                      {/* WhatsApp & Call Action Icons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppLead(vendor)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#25d366',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                          }}
                          title="Chat on WhatsApp (Logs lead automatically)"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePhoneCallLead(vendor)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                          }}
                          title="Call Provider (Logs lead automatically)"
                        >
                          <Phone size={16} />
                        </button>
                      </div>

                      {/* View Profile Storefront Link */}
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
                          borderRadius: '10px',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        View Profile <ChevronRight size={14} />
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

          {/* RIGHT COLUMN: 3 STACKED SIDEBAR WIDGETS (EXACT MATCH TO REFERENCE SCREENSHOT) */}
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
                  <Clock size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Fast Response</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Get quick reply within 15 minutes SLA</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Award size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Best Prices</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Compare and get the best price</div>
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
