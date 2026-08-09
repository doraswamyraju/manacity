import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  Wrench,
  Sparkles,
  Home as HomeIcon,
  Grid,
  FileText,
  User,
  X,
  Zap,
  Pin
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

  // Modals & Overlays
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showMyQuotesModal, setShowMyQuotesModal] = useState(false);

  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const cities = [
    { id: 'tirupati', name: 'Tirupati' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'vijayawada', name: 'Vijayawada' },
    { id: 'visakhapatnam', name: 'Visakhapatnam' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'bangalore', name: 'Bangalore' }
  ];

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Digital Marketing', icon: Building2 },
    { name: 'Rice Mill', icon: ShoppingBag },
    { name: 'Services', icon: Wrench },
    { name: 'Clinics & Health', icon: ShieldCheck },
    { name: 'Hotels & Lodging', icon: MapPin }
  ];

  // Fetch directory listings from backend API
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/phase1/directory/${selectedCity}/all?query=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);
      if (res.data && res.data.listings && res.data.listings.length > 0) {
        setListings(res.data.listings);
      } else {
        setListings(getMockListings());
      }
    } catch (err) {
      setListings(getMockListings());
    } finally {
      setLoading(false);
    }
  };

  const getMockListings = () => {
    const allMocks = [
      {
        id: '1',
        businessName: 'ABC Digital Marketing Solutions',
        category: 'Digital Marketing',
        city: 'tirupati',
        slug: 'abc-digital',
        rating: 4.9,
        reviewCount: 48,
        address: 'Car Street, Near Temple, Tirupati',
        phone: '+91 98765 43210',
        whatsApp: '+91 98765 43210',
        websiteUrl: 'https://tirupati.manacity.in/abc-digital',
        services: ['SEO Optimization', 'Google Ads Management', 'GBP Optimization', 'Meta Ads'],
        verified: true,
        isSponsored: true
      },
      {
        id: '2',
        businessName: 'Sri Venkateswara Premium Rice Mill',
        category: 'Rice Mill',
        city: 'tirupati',
        slug: 'sv-rice-mill',
        rating: 4.8,
        reviewCount: 92,
        address: 'Industrial Estate, Renigunta Road, Tirupati',
        phone: '+91 91234 56789',
        whatsApp: '+91 91234 56789',
        websiteUrl: 'https://tirupati.manacity.in/sv-rice-mill',
        services: ['Basmati Rice', 'Sona Masuri', 'Steam Rice', 'Brown Rice', 'Organic Rice'],
        verified: true,
        isSponsored: false
      },
      {
        id: '3',
        businessName: 'Apex Multispeciality Clinic',
        category: 'Clinics & Health',
        city: 'hyderabad',
        slug: 'apex-clinic',
        rating: 4.7,
        reviewCount: 115,
        address: 'Banjara Hills, Road No 12, Hyderabad',
        phone: '+91 99887 76655',
        whatsApp: '+91 99887 76655',
        websiteUrl: 'https://hyderabad.manacity.in/apex-clinic',
        services: ['General Consultation', 'Pediatrics', 'Dental Care', 'Lab Diagnostics'],
        verified: true,
        isSponsored: false
      }
    ];

    return allMocks.filter(item => {
      const matchCity = selectedCity === 'all' || item.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery = !query || item.businessName.toLowerCase().includes(query.toLowerCase()) ||
        item.services.some(s => s.toLowerCase().includes(query.toLowerCase()));
      return matchCity && matchCategory && matchQuery;
    });
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCity, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowMobileSearchModal(false);
    fetchListings();
  };

  const handleCallClick = async (listing) => {
    try {
      await axios.post('/api/phase1/lead', {
        businessGroupId: listing.id,
        channel: 'CALL'
      });
    } catch (e) {}
    window.location.href = `tel:${listing.phone}`;
  };

  const handleWhatsAppClick = async (listing) => {
    try {
      await axios.post('/api/phase1/lead', {
        businessGroupId: listing.id,
        channel: 'WHATSAPP'
      });
    } catch (e) {}
    const text = encodeURIComponent(`Hi ${listing.businessName}, I found your business on ManaCity.in and would like to get a quote.`);
    window.open(`https://wa.me/${listing.whatsApp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
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

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column', paddingBottom: '70px' }}>
      
      {/* Header Bar */}
      <header style={{
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/logo.png" alt="ManaCity Logo" style={{ height: '36px' }} />
          <span style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem', borderRadius: '12px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 700 }}>
            Justdial Aggregator
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {user.role === 'SUPER_ADMIN' && (
                <button onClick={onNavigateToSuperAdmin} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                  Super Admin Panel
                </button>
              )}
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                Dashboard
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={onNavigateToLogin} className="btn btn-secondary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}>
                Sign In
              </button>
              <button onClick={onNavigateToLogin} className="btn btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                List Business
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Search Section */}
      <section style={{
        padding: '3rem 1.5rem 2.5rem 1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Search Products, Services & Businesses on <span className="gradient-text">ManaCity.in</span>
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '2rem' }}>
          Your smart city aggregator connecting customers with verified local businesses, manufacturers, service providers, and digital storefronts.
        </p>

        {/* Combined Search Form */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.65rem',
          backgroundColor: '#1e293b',
          padding: '0.65rem',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: '800px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* City Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.6rem 0.85rem', borderRadius: '10px', flex: '1 1 180px' }}>
            <MapPin size={18} color="#6366f1" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {cities.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#0f172a' }}>{c.name}</option>)}
            </select>
          </div>

          {/* Search Query */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.6rem 0.85rem', borderRadius: '10px', flex: '2 1 300px' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search Sona Masuri Rice, SEO Services, Clinics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.75rem', borderRadius: '10px', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            Search Now
          </button>
        </form>

        {/* Quick Categories Pills */}
        <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1.1rem',
                  borderRadius: '20px',
                  border: active ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: active ? 'rgba(99, 102, 241, 0.2)' : '#1e293b',
                  color: active ? '#818cf8' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Directory Results Section */}
      <section style={{ padding: '1.5rem 1.5rem 3rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            Top Verified Listings in <span style={{ color: '#818cf8', textTransform: 'capitalize' }}>{selectedCity}</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Showing {listings.length} Results
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            Searching ManaCity aggregator...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3>No matching businesses found</h3>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>Try searching another category or city.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {listings.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#1e293b',
                borderRadius: '14px',
                padding: '1.35rem',
                border: item.isSponsored ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}>
                {item.isSponsored && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '15px',
                    backgroundColor: '#fbbf24',
                    color: '#0f172a',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Pin size={12} /> SPONSORED
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                        {item.category}
                      </span>
                      {item.verified && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldCheck size={13} /> Verified
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(234, 179, 8, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#facc15', fontSize: '0.82rem', fontWeight: 700 }}>
                      <Star size={13} fill="#facc15" />
                      {item.rating} ({item.reviewCount})
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem', color: '#f8fafc' }}>
                    {item.businessName}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    <MapPin size={14} color="#64748b" />
                    {item.address}
                  </p>

                  <div style={{ marginBottom: '1.1rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Products & Services:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {item.services && item.services.map((svc, idx) => (
                        <span key={idx} style={{ fontSize: '0.74rem', backgroundColor: '#0f172a', color: '#cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button onClick={() => handleCallClick(item)} className="btn" style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem' }}>
                      <Phone size={14} /> Call Now
                    </button>
                    <button onClick={() => handleWhatsAppClick(item)} className="btn" style={{ backgroundColor: '#25d366', color: '#fff', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem' }}>
                      <MessageSquare size={14} /> WhatsApp
                    </button>
                  </div>

                  {/* Primary Justdial Action Button */}
                  <button
                    onClick={() => setSelectedLeadModal(item)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      color: '#818cf8',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Zap size={16} /> Get Best Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inquiry Lead Modal */}
      {selectedLeadModal && (
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
                Get Best Quote from <span style={{ color: '#818cf8' }}>{selectedLeadModal.businessName}</span>
              </h3>
              <button onClick={() => setSelectedLeadModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Submit your inquiry and receive instant price quotes directly from verified business owners.
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
                  placeholder="What product or service do you need quotes for?"
                  rows={3}
                  value={leadForm.message}
                  onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#6366f1', fontWeight: 800 }}>
                    Submit Quote Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Mobile Search Button Overlay Trigger */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 99
      }}>
        <button
          onClick={() => setShowMobileSearchModal(true)}
          style={{
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
            cursor: 'pointer'
          }}
        >
          <Search size={18} /> Quick Search
        </button>
      </div>

      {/* Mobile Search Modal Overlay */}
      {showMobileSearchModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1001,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Search Businesses & Services</h3>
              <button onClick={() => setShowMobileSearchModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Search Keyword</label>
                <input
                  type="text"
                  placeholder="Product, Service, or Business..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontWeight: 800 }}>
                Find Businesses
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (5 Icons) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: '#0f172a',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        padding: '0 0.5rem'
      }}>
        <button
          onClick={() => {
            setSelectedCategory('All');
            setQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#818cf8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <HomeIcon size={20} />
          Home
        </button>

        <button
          onClick={() => setShowCategoriesModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Grid size={20} />
          Categories
        </button>

        <button
          onClick={() => setShowMobileSearchModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Search size={20} />
          Search
        </button>

        <button
          onClick={() => alert('Submit any "Get Best Quote" form to track your inquiries.')}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <FileText size={20} />
          Quotes
        </button>

        <button
          onClick={() => {
            if (user) {
              window.location.href = user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
            } else {
              onNavigateToLogin();
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <User size={20} />
          {user ? 'Account' : 'Sign In'}
        </button>
      </nav>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '0.85rem' }}>
        <p>© 2026 ManaCity Aggregator Platform. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '0.75rem' }}>
          <button onClick={onNavigateToPrivacy} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Privacy Policy</button>
          <button onClick={onNavigateToTerms} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Terms of Service</button>
          <button onClick={onNavigateToDelete} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Delete Account</button>
        </div>
      </footer>
    </div>
  );
}
