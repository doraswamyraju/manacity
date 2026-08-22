import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles,
  Building2,
  MapPin,
  Star,
  Phone,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Zap,
  Globe,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Search,
  SlidersHorizontal,
  Grid,
  List as ListIcon,
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
  const [sortBy, setSortBy] = useState('RATING'); // RATING, REVIEWS, NAME
  const [viewMode, setViewMode] = useState('LIST'); // Default Primary List View

  // Individual Quote Modal State
  const [selectedVendorForLead, setSelectedVendorForLead] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);

  // Broadcast Quote Sidebar State
  const [broadcastForm, setBroadcastForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', requirement: '' });
  const [broadcastSubmitted, setBroadcastSubmitted] = useState(false);
  const [submittingBroadcast, setSubmittingBroadcast] = useState(false);

  // FAQ Accordion Toggle State
  const [expandedFaq, setExpandedFaq] = useState(null);

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
    { name: 'Hotels', icon: Hotel, color: '#6366f1' },
    { name: 'Doctors', icon: Cross, color: '#0ea5e9' },
    { name: 'Real Estate', icon: HomeIcon, color: '#f43f5e' },
    { name: 'Travel', icon: Plane, color: '#3b82f6' },
    { name: 'Education', icon: GraduationCap, color: '#10b981' },
    { name: 'Repairs', icon: Wrench, color: '#f59e0b' },
    { name: 'More', icon: MoreHorizontal, color: '#64748b' }
  ];

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/phase1/service-details/${citySlug}/${serviceSlug}`);
        setData(res.data);
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

    // Sort
    if (sortBy === 'RATING') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'REVIEWS') {
      list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortBy === 'NAME') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [data?.vendors, vendorSearch, minRating, verifiedOnly, sortBy]);

  // Handle Phone Call Lead & Redirection
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

  // Handle WhatsApp Lead & Redirection
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
    const text = encodeURIComponent(`Hi ${vendor.name}, I found your business on ManaCity for ${data?.service?.name || 'Service'} in ${data?.city || 'Tirupati'}. I would like to inquire about your services and pricing.`);
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
        contactEmail: broadcastForm.email,
        message: `[BROADCAST QUOTE REQUEST] Requirement: ${broadcastForm.requirement || data?.service?.name}`,
        visitorLocation: data?.city || 'Tirupati',
        viewedServices: [data?.service?.name || 'Service']
      });
      setBroadcastSubmitted(true);
      setTimeout(() => {
        setBroadcastSubmitted(false);
        setBroadcastForm({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', requirement: '' });
      }, 3000);
    } catch (err) {
      alert('Failed to send broadcast quote request. Please try again.');
    } finally {
      setSubmittingBroadcast(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={36} color="#3b82f6" style={{ animation: 'spin 2s linear infinite' }} />
          <h3 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 800 }}>Loading Dedicated Service Page...</h3>
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
          style={{ marginTop: '1.5rem', padding: '0.65rem 1.25rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
        >
          Return to ManaCity Home
        </button>
      </div>
    );
  }

  const { service, vendors, relatedServices } = data;
  const cityNameCap = data.city.charAt(0).toUpperCase() + data.city.slice(1);

  const faqs = [
    {
      q: `What is included in ${service.name}?`,
      a: `${service.name} encompasses tailored, end-to-end local solutions provided by verified professionals in ${cityNameCap}. Services typically include initial consultation, scoping, implementation, and follow-up support.`
    },
    {
      q: `How quickly can I get quotes from providers in ${cityNameCap}?`,
      a: `Through ManaCity, providers usually respond within 15 to 30 minutes during business hours. Submitting a broadcast quote request allows multiple providers to compete and give you the best rate.`
    },
    {
      q: `Are all vendors on ManaCity verified?`,
      a: `Yes! Every business listed on ManaCity undergoes physical address, business identity, and local reputation checks prior to verification.`
    },
    {
      q: `Is there any fee or commission for customers using ManaCity?`,
      a: `No, ManaCity is 100% free for customers seeking service providers. There are zero hidden fees or brokerage commissions.`
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* 1. Main Top Header Bar */}
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
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          width: '100%',
          flexWrap: 'wrap'
        }}>
          
          {/* Left: Logo & Location Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <picture>
                <source media="(max-width: 768px)" srcSet="/logo-square.png" />
                <img src="/logo-horizontal.png" alt="ManaCity Logo" style={{ height: '36px', objectFit: 'contain' }} />
              </picture>
            </div>

            {/* Location Pill Dropdown */}
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
              <MapPin size={15} color="#3b82f6" />
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

          {/* Center: Search Bar */}
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
              border: '1.5px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '24px',
              padding: '0.5rem 1rem',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)'
            }}>
              <Search size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search anything... (businesses, services, products)"
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
              <Mic size={18} color="#3b82f6" style={{ cursor: 'pointer', flexShrink: 0 }} />
            </div>
          </div>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
              <Heart size={18} color="#ef4444" />
              <span className="desktop-only">Saved</span>
            </div>

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

            {user ? (
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', borderRadius: '20px', fontWeight: 800, backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none' }}>
                Dashboard
              </a>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 800, borderRadius: '20px', cursor: 'pointer' }}>
                Login
              </button>
            )}
          </div>
        </div>

        {/* Sub-Header Categories Bar */}
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

      {/* 2. Top Hero Section with Left Advertising Banner & Right Top Description */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1.75rem 1.5rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Breadcrumb Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ textTransform: 'capitalize' }}>{data.city}</span>
            <ChevronRight size={14} />
            <span style={{ color: '#2563eb', fontWeight: 700 }}>{service.category}</span>
            <ChevronRight size={14} />
            <span style={{ color: '#0f172a', fontWeight: 800 }}>{service.name}</span>
          </nav>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem 0', lineHeight: 1.2 }}>
            {service.name} in {cityNameCap}
          </h1>

          {/* Grid: Left Advertising Banner (60%) + Right Top Text & SLA Badges (40%) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'center' }}>
            
            {/* LEFT BOX: FEATURED ADVERTISING BANNER */}
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              borderRadius: '16px',
              padding: '1.35rem 1.5rem',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Megaphone size={18} color="#fbbf24" />
                <span style={{ fontSize: '0.72rem', fontWeight: 900, backgroundColor: 'rgba(251, 191, 36, 0.25)', color: '#fbbf24', padding: '0.2rem 0.55rem', borderRadius: '10px', letterSpacing: '0.05em' }}>
                  FEATURED SPONSOR AD
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.35rem 0', lineHeight: 1.3 }}>
                Grow Your Business in {cityNameCap}!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#dbeafe', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                Advertise your business in top spots for <strong>{service.name}</strong>. Get 10x more leads & direct customer calls today.
              </p>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.1rem',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                }}
              >
                📢 Sponsor This Service
              </button>
            </div>

            {/* RIGHT BOX: TOP DESCRIPTION TEXT & SLA GUARANTEES */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem 1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                {service.description || `Explore top-rated verified local providers offering ${service.name} in ${cityNameCap}. Compare customer ratings, contact business owners directly, and receive fast competitive quotes.`}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '0.84rem', fontWeight: 700 }}>
                  <CheckCircle2 size={16} color="#059669" /> 100% Verified Local Vendors
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '0.84rem', fontWeight: 700 }}>
                  <Clock size={16} color="#0284c7" /> Fast 15-Min Lead Response SLA
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '0.84rem', fontWeight: 700 }}>
                  <Award size={16} color="#d97706" /> Zero Brokerage Commission
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Main Container (List View Businesses & Broadcast Quote Sidebar) */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: BUSINESSES LIST VIEW */}
          <div>
            
            {/* Filter & Toolbar */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              {/* Search Vendor Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.5rem 0.85rem' }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder={`Filter provider by name or location in ${cityNameCap}...`}
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', width: '100%', outline: 'none', fontSize: '0.86rem', fontWeight: 500 }}
                />
                {vendorSearch && (
                  <X size={16} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setVendorSearch('')} />
                )}
              </div>

              {/* Filter Pills Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {/* Verified Only Toggle */}
                  <button
                    type="button"
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      border: verifiedOnly ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      backgroundColor: verifiedOnly ? '#d1fae5' : '#f8fafc',
                      color: verifiedOnly ? '#047857' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <ShieldCheck size={14} /> Verified Only
                  </button>

                  {/* Rating Selector */}
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      border: minRating > 0 ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                      backgroundColor: minRating > 0 ? '#fef3c7' : '#f8fafc',
                      color: minRating > 0 ? '#b45309' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={0}>★ All Ratings</option>
                    <option value={4.5}>★ 4.5+ Stars</option>
                    <option value={4.0}>★ 4.0+ Stars</option>
                  </select>

                  {/* Sort By Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#475569' }}>
                    <SlidersHorizontal size={14} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="RATING">Sort by: Top Rated</option>
                      <option value="REVIEWS">Sort by: Most Reviews</option>
                      <option value="NAME">Sort by: Name (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f1f5f9', padding: '0.2rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('LIST')}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'LIST' ? '#2563eb' : 'transparent',
                      color: viewMode === 'LIST' ? '#fff' : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <ListIcon size={14} /> List View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('GRID')}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'GRID' ? '#2563eb' : 'transparent',
                      color: viewMode === 'GRID' ? '#fff' : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Grid size={14} /> Grid
                  </button>
                </div>
              </div>
            </div>

            {/* Vendor Results Heading Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={22} color="#2563eb" /> Verified Businesses ({filteredVendors.length})
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Showing {filteredVendors.length} of {vendors.length} local providers
              </span>
            </div>

            {/* BUSINESS CARDS LIST VIEW */}
            {filteredVendors.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: viewMode === 'LIST' ? 'column' : 'row',
                flexWrap: viewMode === 'GRID' ? 'wrap' : 'nowrap',
                gap: '1.25rem',
                marginBottom: '3rem'
              }}>
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.35rem 1.5rem',
                      display: 'flex',
                      flexDirection: viewMode === 'LIST' ? 'row' : 'column',
                      justifyContent: 'space-between',
                      alignItems: viewMode === 'LIST' ? 'center' : 'stretch',
                      gap: '1.25rem',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s',
                      flex: viewMode === 'GRID' ? '1 1 290px' : 'none'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)'; }}
                  >
                    {/* Left: Vendor Logo, Info & Vendor Specific Price Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.15rem', flex: 1 }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '14px', backgroundColor: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#2563eb', fontSize: '1.4rem', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                        {vendor.logoUrl ? <img src={vendor.logoUrl} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : vendor.name.charAt(0)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                            {vendor.name}
                          </h3>
                          {vendor.isVerifiedManaCity && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', backgroundColor: '#d1fae5', padding: '0.2rem 0.55rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <ShieldCheck size={12} /> Verified
                            </span>
                          )}
                        </div>

                        {/* Rating & Vendor-Specific Price Banner Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            ★ {vendor.rating || 4.9} ({vendor.reviewCount || 15} reviews)
                          </span>

                          {/* Vendor Price Tag inside Card Banner */}
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', backgroundColor: '#d1fae5', padding: '0.15rem 0.6rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: '1px solid #a7f3d0' }}>
                            💰 Price: {vendor.price ? `₹${vendor.price.toLocaleString('en-IN')}` : 'Custom Quote'}
                          </span>
                        </div>

                        {/* Address */}
                        <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem', lineHeight: 1.4 }}>
                          <MapPin size={14} color="#94a3b8" style={{ flexShrink: 0 }} /> {vendor.address || cityNameCap}
                        </div>
                      </div>
                    </div>

                    {/* Right: HIGHLIGHTED Action Buttons (Call, WhatsApp, Get Quote, Storefront) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                      {/* Call Now Button (Creates Lead) */}
                      <button
                        type="button"
                        onClick={() => handlePhoneCallLead(vendor)}
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.6rem 0.9rem',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                        }}
                        title="Call Provider (Logs lead automatically)"
                      >
                        <Phone size={14} /> Call
                      </button>

                      {/* WhatsApp Chat Button (Creates Lead) */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppLead(vendor)}
                        style={{
                          backgroundColor: '#25d366',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.6rem 0.9rem',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                        }}
                        title="Chat on WhatsApp (Logs lead automatically)"
                      >
                        <MessageSquare size={14} /> WhatsApp
                      </button>

                      {/* HIGHLIGHTED GET QUOTE BUTTON */}
                      <button
                        type="button"
                        onClick={() => setSelectedVendorForLead(vendor)}
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '10px',
                          padding: '0.65rem 1.25rem',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          letterSpacing: '0.02em',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.45)'
                        }}
                      >
                        <Zap size={15} color="#fff" /> GET QUOTE
                      </button>

                      {/* Storefront Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const url = vendor.subdomain ? `https://${vendor.subdomain}.manacity.in` : `/site/${vendor.slug}`;
                          window.open(url, '_blank');
                        }}
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          borderRadius: '10px',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                        title="View Storefront Website"
                      >
                        Storefront <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #fde68a', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
                <Zap size={36} color="#d97706" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>No Matching Verified Businesses Found</h3>
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

            {/* Service FAQ Accordion Section */}
            <section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', marginBottom: '3rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={20} color="#2563eb" /> Frequently Asked Questions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {faqs.map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.2s'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : index)}
                        style={{
                          width: '100%',
                          padding: '1rem 1.25rem',
                          background: 'none',
                          border: 'none',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={18} color="#2563eb" /> : <ChevronDown size={18} color="#64748b" />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 1.25rem 1rem 1.25rem', color: '#475569', fontSize: '0.86rem', lineHeight: 1.6, borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: INSTANT BROADCAST QUOTE SIDEBAR */}
          <aside style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 12px 35px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Zap size={20} color="#2563eb" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  INSTANT MULTI-QUOTE
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                Get Free Quotes from All Providers in {cityNameCap}
              </h3>
              
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Submit your requirement once. Verified vendors offering <strong>{service.name}</strong> will contact you with competing rates!
              </p>

              {broadcastSubmitted ? (
                <div style={{ backgroundColor: '#d1fae5', border: '1px solid #10b981', color: '#047857', padding: '1.15rem 1rem', borderRadius: '12px', textAlign: 'center', fontWeight: 800, fontSize: '0.88rem' }}>
                  🎉 Broadcast Quote Sent! Verified providers in {cityNameCap} will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      required
                      value={broadcastForm.name}
                      onChange={e => setBroadcastForm({ ...broadcastForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      required
                      value={broadcastForm.phone}
                      onChange={e => setBroadcastForm({ ...broadcastForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={broadcastForm.email}
                      onChange={e => setBroadcastForm({ ...broadcastForm, email: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Specific Requirement</label>
                    <textarea
                      placeholder={`Specify your requirement for ${service.name}...`}
                      rows={3}
                      value={broadcastForm.requirement}
                      onChange={e => setBroadcastForm({ ...broadcastForm, requirement: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingBroadcast}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#2563eb',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {submittingBroadcast ? 'Broadcasting Request...' : <><Send size={16} /> Broadcast Quote Request</>}
                  </button>
                </form>
              )}
            </div>
          </aside>

        </div>

        {/* Related Services in Category */}
        {relatedServices && relatedServices.length > 0 && (
          <section style={{ marginTop: '3.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Explore Related {service.category} Offerings in {cityNameCap}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.15rem' }}>
              {relatedServices.map((rItem) => (
                <div
                  key={rItem.id}
                  onClick={() => navigate(`/${data.city}/service/${rItem.slug || rItem.id}`)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.15rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {rItem.category}
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    {rItem.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 800 }}>
                    {rItem.defaultPrice ? `Est. ₹${rItem.defaultPrice.toLocaleString('en-IN')}` : 'Custom Pricing'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Individual Vendor Inquiry Lead Capture Modal */}
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
