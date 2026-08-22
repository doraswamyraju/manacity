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
  Award
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
  const [viewMode, setViewMode] = useState('GRID'); // GRID, LIST

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
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={36} color="#818cf8" style={{ animation: 'spin 2s linear infinite' }} />
          <h3 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Loading Dedicated Service Page...</h3>
        </div>
      </div>
    );
  }

  if (error || !data || !data.service) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Service Offering Not Found</h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>We couldn't find details for this service offering.</p>
        <button
          onClick={() => navigate('/')}
          style={{ marginTop: '1.5rem', padding: '0.65rem 1.25rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
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
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header Bar */}
      <header style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}
          >
            <ArrowLeft size={18} /> Back to ManaCity
          </button>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            Mana<span style={{ color: '#fff' }}>City</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '20px', padding: '0.5rem 1.1rem', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}
          >
            Business Dashboard
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Breadcrumb Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ textTransform: 'capitalize' }}>{data.city}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#818cf8', fontWeight: 700 }}>{service.category}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#fff', fontWeight: 700 }}>{service.name}</span>
        </nav>

        {/* Hero Service Overview Banner */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem 2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'rgba(129, 140, 248, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '12px' }}>
              📦 {service.category}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '12px' }}>
              {service.defaultPrice ? `Est. Price: ₹${service.defaultPrice.toLocaleString('en-IN')}` : 'Custom Market Pricing'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} /> Verified ManaCity Master Offering
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#fff', margin: '0 0 0.75rem 0', lineHeight: 1.25 }}>
            {service.name} in {cityNameCap}
          </h1>

          <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '900px' }}>
            {service.description || `Explore top-rated verified local providers offering ${service.name} in ${cityNameCap}. Compare verified customer ratings, contact business owners directly, and receive fast competitive quotes.`}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.86rem' }}>
              <CheckCircle2 size={16} color="#10b981" /> 100% Verified Local Vendors
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.86rem' }}>
              <Clock size={16} color="#38bdf8" /> Fast 15-Min Response SLA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.86rem' }}>
              <Award size={16} color="#f59e0b" /> Zero Brokerage Commission
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout (70% Vendors & Filters + 30% Broadcast Sidebar) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: VENDORS LIST & FILTER CONTROLS */}
          <div>
            
            {/* Filter & Sort Toolbar */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              {/* Search Vendor Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.5rem 0.85rem' }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder={`Search provider by name or location in ${cityNameCap}...`}
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.86rem' }}
                />
                {vendorSearch && (
                  <X size={16} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setVendorSearch('')} />
                )}
              </div>

              {/* Filter Pills Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {/* Verified Only Toggle Pill */}
                  <button
                    type="button"
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      border: verifiedOnly ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: verifiedOnly ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.04)',
                      color: verifiedOnly ? '#10b981' : '#94a3b8',
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
                      border: minRating > 0 ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: minRating > 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.04)',
                      color: minRating > 0 ? '#fbbf24' : '#94a3b8',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={0} style={{ backgroundColor: '#1e293b' }}>★ All Ratings</option>
                    <option value={4.5} style={{ backgroundColor: '#1e293b' }}>★ 4.5+ Stars</option>
                    <option value={4.0} style={{ backgroundColor: '#1e293b' }}>★ 4.0+ Stars</option>
                  </select>

                  {/* Sort By Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <SlidersHorizontal size={14} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '0.35rem 0.6rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: '#0f172a',
                        color: '#fff',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#0f172a', padding: '0.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('GRID')}
                    style={{
                      padding: '0.3rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'GRID' ? '#3b82f6' : 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('LIST')}
                    style={{
                      padding: '0.3rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'LIST' ? '#3b82f6' : 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="List View"
                  >
                    <ListIcon size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Vendor Results Count Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={22} color="#38bdf8" /> Verified Vendors ({filteredVendors.length})
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Showing {filteredVendors.length} of {vendors.length} local providers
              </span>
            </div>

            {/* Vendor Cards Rendering */}
            {filteredVendors.length > 0 ? (
              <div style={{
                display: viewMode === 'GRID' ? 'grid' : 'flex',
                gridTemplateColumns: viewMode === 'GRID' ? 'repeat(auto-fill, minmax(290px, 1fr))' : 'none',
                flexDirection: viewMode === 'LIST' ? 'column' : 'none',
                gap: '1.25rem',
                marginBottom: '3rem'
              }}>
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s, borderColor 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div>
                      {/* Top Header inside Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#334155', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#38bdf8', fontSize: '1.2rem', flexShrink: 0 }}>
                          {vendor.logoUrl ? <img src={vendor.logoUrl} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : vendor.name.charAt(0)}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ★ {vendor.rating || 4.8} ({vendor.reviewCount || 12})
                          </span>
                          {vendor.isVerifiedManaCity && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)', padding: '0.15rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <ShieldCheck size={12} /> Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Business Name & Address */}
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.35rem 0', lineHeight: 1.3 }}>
                        {vendor.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem', lineHeight: 1.4 }}>
                        <MapPin size={14} color="#64748b" style={{ flexShrink: 0 }} /> {vendor.address || cityNameCap}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const url = vendor.subdomain ? `https://${vendor.subdomain}.manacity.in` : `/site/${vendor.slug}`;
                          window.open(url, '_blank');
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          borderRadius: '10px',
                          padding: '0.55rem',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        Storefront <ExternalLink size={13} />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setSelectedVendorForLead(vendor)}
                        style={{
                          flex: 1,
                          backgroundColor: '#10b981',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '10px',
                          padding: '0.55rem',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        Get Quote <MessageSquare size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#1e293b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
                <Zap size={36} color="#fbbf24" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>No Matching Verified Providers Found</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.4rem', maxWidth: '600px', margin: '0.4rem auto 1.25rem auto' }}>
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
                  style={{ backgroundColor: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
                >
                  🚀 Request Super Admin to Onboard Local Providers
                </button>
              </div>
            )}

            {/* Service FAQ Accordion Section */}
            <section style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={20} color="#818cf8" /> Frequently Asked Questions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {faqs.map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.06)',
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
                          color: '#fff',
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
                        {isOpen ? <ChevronUp size={18} color="#818cf8" /> : <ChevronDown size={18} color="#94a3b8" />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 1.25rem 1rem 1.25rem', color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
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
          <aside style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              backgroundColor: '#1e293b',
              border: '1.5px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 12px 35px rgba(59, 130, 246, 0.1)',
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Zap size={20} color="#3b82f6" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  INSTANT MULTI-QUOTE
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                Get Free Quotes from All Providers in {cityNameCap}
              </h3>
              
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Submit your requirement once. Verified vendors offering <strong>{service.name}</strong> will contact you with competing rates!
              </p>

              {broadcastSubmitted ? (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1.15rem 1rem', borderRadius: '12px', textAlign: 'center', fontWeight: 800, fontSize: '0.88rem' }}>
                  🎉 Broadcast Quote Sent! Verified providers in {cityNameCap} will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.25rem', display: 'block' }}>Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      required
                      value={broadcastForm.name}
                      onChange={e => setBroadcastForm({ ...broadcastForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.25rem', display: 'block' }}>Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      required
                      value={broadcastForm.phone}
                      onChange={e => setBroadcastForm({ ...broadcastForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.25rem', display: 'block' }}>Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={broadcastForm.email}
                      onChange={e => setBroadcastForm({ ...broadcastForm, email: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.25rem', display: 'block' }}>Specific Requirement</label>
                    <textarea
                      placeholder={`Specify your requirement for ${service.name}...`}
                      rows={3}
                      value={broadcastForm.requirement}
                      onChange={e => setBroadcastForm({ ...broadcastForm, requirement: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingBroadcast}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#3b82f6',
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
                      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
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
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Explore Related {service.category} Offerings in {cityNameCap}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.15rem' }}>
              {relatedServices.map((rItem) => (
                <div
                  key={rItem.id}
                  onClick={() => navigate(`/${data.city}/service/${rItem.slug || rItem.id}`)}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '1.15rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.borderColor = '#818cf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {rItem.category}
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                    {rItem.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>
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
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.75rem', maxWidth: '450px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Get Best Quote from <span style={{ color: '#38bdf8' }}>{selectedVendorForLead.name}</span>
              </h3>
              <button onClick={() => setSelectedVendorForLead(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Submit your inquiry for {service.name} and receive instant price quotes directly.
            </p>

            {leadSubmitted ? (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 700 }}>
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
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <input
                  type="tel"
                  placeholder="Your Mobile Number"
                  required
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={leadForm.email}
                  onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <textarea
                  placeholder={`Requirements for ${service.name}...`}
                  rows={3}
                  value={leadForm.message}
                  onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <button
                  type="submit"
                  disabled={submittingLead}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 800, border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
                >
                  {submittingLead ? 'Sending...' : 'Submit Quote Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: '4rem', padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '0.85rem' }}>
        <p>© 2026 ManaCity Aggregator Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
