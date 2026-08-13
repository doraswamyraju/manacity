import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClaimBusinessModal from '../components/ClaimBusinessModal';
import UnonboardedEnquiryModal from '../components/UnonboardedEnquiryModal';
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
  Pin,
  ChevronRight,
  Utensils,
  Hotel,
  HeartHandshake,
  GraduationCap,
  Briefcase,
  Cross,
  Truck,
  Scissors,
  Car,
  Bike,
  Tv,
  ShoppingCart,
  Plane,
  Bus,
  Train,
  Compass,
  Mic,
  Sun,
  Moon,
  Plus
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
  const [themeMode, setThemeMode] = useState('dark');

  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-mode');
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      document.body.removeAttribute('data-theme');
    }
  };



  // Modals & Overlays
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const [unonboardedTargetBusiness, setUnonboardedTargetBusiness] = useState(null);
  const [claimModalInfo, setClaimModalInfo] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);

  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingSuggestions(true);
      try {
        // 1. Internal DB search
        const dbRes = await axios.get(`/api/phase1/directory/${selectedCity}/all?query=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);
        const dbItems = (dbRes.data?.listings || []).slice(0, 4).map(item => ({
          ...item,
          isVerifiedManaCity: true
        }));

        // 2. Google Places Autocomplete search
        let googleItems = [];
        try {
          const gRes = await axios.get(`/api/phase1/google-places/autocomplete?input=${encodeURIComponent(query)}`);
          if (gRes.data?.predictions) {
            googleItems = gRes.data.predictions.slice(0, 4).map(p => ({
              id: p.placeId,
              businessName: p.name || p.description,
              address: p.description,
              category: 'Google Business Result',
              isVerifiedManaCity: false,
              place_id: p.placeId
            }));
          }
        } catch (e) {
          console.warn('Google places autocomplete fallback:', e);
        }

        const combined = [...dbItems, ...googleItems];
        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
      } catch (err) {
        console.error('Fetch suggestions error:', err);
      } finally {
        setSearchingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedCity, selectedCategory]);

  const cities = [
    { id: 'tirupati', name: 'Tirupati' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'vijayawada', name: 'Vijayawada' },
    { id: 'visakhapatnam', name: 'Visakhapatnam' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'bangalore', name: 'Bangalore' }
  ];

  // 18 Icon Categories (Matching Justdial Screenshot 1)
  const iconCategories = [
    { name: 'Restaurants', icon: Utensils, color: '#f97316' },
    { name: 'Hotels', icon: Hotel, color: '#3b82f6' },
    { name: 'Beauty Spa', icon: Scissors, color: '#ec4899' },
    { name: 'Home Decor', icon: HomeIcon, color: '#8b5cf6' },
    { name: 'Ask Astro', icon: Sparkles, color: '#eab308', badge: 'BETA' },
    { name: 'Wedding Planning', icon: HeartHandshake, color: '#f43f5e', badge: 'PRO' },
    { name: 'Education', icon: GraduationCap, color: '#10b981' },
    { name: 'Rent & Hire', icon: Truck, color: '#06b6d4' },
    { name: 'Hospitals', icon: Cross, color: '#ef4444' },
    { name: 'Contractors', icon: Wrench, color: '#6366f1' },
    { name: 'Pet Shops', icon: ShoppingBag, color: '#f59e0b' },
    { name: 'PG/Hostels', icon: Building2, color: '#14b8a6' },
    { name: 'Real Estate', icon: Briefcase, color: '#3b82f6' },
    { name: 'Dentists', icon: Cross, color: '#0ea5e9' },
    { name: 'Gym', icon: Zap, color: '#84cc16' },
    { name: 'Loans', icon: FileText, color: '#10b981' },
    { name: 'Event Organisers', icon: Sparkles, color: '#d946ef' },
    { name: 'Packers & Movers', icon: Truck, color: '#64748b' }
  ];

  // Collection Grid Cards (Matching Justdial Screenshot 2)
  const collections = [
    {
      title: 'Wedding Requisites',
      color: '#f43f5e',
      items: [
        { name: 'Banquet Halls', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&auto=format&fit=crop&q=80' },
        { name: 'Bridal Requisite', img: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=300&auto=format&fit=crop&q=80' },
        { name: 'Caterers', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=300&auto=format&fit=crop&q=80' }
      ]
    },
    {
      title: 'Beauty & Spa',
      color: '#ec4899',
      items: [
        { name: 'Beauty Parlours', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80' },
        { name: 'Spa & Massages', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&auto=format&fit=crop&q=80' },
        { name: 'Salons', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80' }
      ]
    },
    {
      title: 'Repairs & Services',
      color: '#3b82f6',
      items: [
        { name: 'AC Service', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80' },
        { name: 'Car Service', img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&auto=format&fit=crop&q=80' },
        { name: 'Bike Service', img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80' }
      ]
    },
    {
      title: 'Daily Needs',
      color: '#10b981',
      items: [
        { name: 'Movies', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80' },
        { name: 'Grocery', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80' },
        { name: 'Electricians', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80' }
      ]
    }
  ];

  // Tourist Places Cards (Matching Justdial Screenshot 3)
  const touristPlaces = [
    { name: 'Tirupati Temple', city: 'Tirupati', img: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&auto=format&fit=crop&q=80' },
    { name: 'Chennai Marina', city: 'Chennai', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&auto=format&fit=crop&q=80' },
    { name: 'Pondicherry French Quarter', city: 'Pondicherry', img: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=400&auto=format&fit=crop&q=80' },
    { name: 'Bangalore Palace', city: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&auto=format&fit=crop&q=80' }
  ];

  // Popular Search Blue Cards (Matching Justdial Screenshot 3)
  const popularSearches = [
    { title: 'Car Rental', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&auto=format&fit=crop&q=80' },
    { title: 'Interior Designers', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&auto=format&fit=crop&q=80' },
    { title: 'AC Repair & Services', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80' },
    { title: 'Taxi Services', img: 'https://images.unsplash.com/photo-1556122071-e404eaedb77f?w=300&auto=format&fit=crop&q=80' },
    { title: 'Self Driven Cars', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80' }
  ];

  // Fetch directory listings
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
        businessName: 'Rajugari Ventures - A Digital Marketing Agency in Tirupati',
        category: 'Digital Marketing',
        city: 'tirupati',
        slug: 'rajugariventures',
        rating: 4.9,
        reviewCount: 63,
        address: 'Shop No.38, 1st Floor, Tuda Complex, near Anna Canteen, Bairagi patteda, Tirupati, Andhra Pradesh 517502',
        phone: '+91 079979 91101',
        whatsApp: '+91 079979 91101',
        websiteUrl: '/site/rajugariventures',
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
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', paddingBottom: '70px' }}>
      
      {/* 1. Header Bar (Matching Justdial Screenshot 1 Top Nav) */}
      <header style={{
        padding: '0.85rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="ManaCity Logo" style={{ height: '32px' }} />
          <span className="desktop-only" style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem', borderRadius: '12px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 800 }}>
            ManaCity Directory
          </span>
        </div>

        {/* Desktop Header Links */}
        <div className="desktop-only" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {themeMode === 'dark' ? <Moon size={14} color="#38bdf8" /> : <Sun size={14} color="#f59e0b" />}
            {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>

          <a href="#hiring" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>We Are Hiring</a>
          <a href="#advertise" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Advertise</a>
          <button onClick={onNavigateToRegister} style={{ background: 'rgba(255,152,0,0.15)', color: '#ff9800', border: '1px solid rgba(255,152,0,0.4)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
            Free Business Listing
          </button>
          {user ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {user.role === 'SUPER_ADMIN' && (
                <button onClick={onNavigateToSuperAdmin} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                  Super Admin
                </button>
              )}
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                Dashboard
              </a>
            </div>
          ) : (
            <button onClick={onNavigateToLogin} className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', background: '#3b82f6', fontWeight: 700 }}>
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Clean Mobile Header Actions (Justdial Mobile Style) */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onNavigateToRegister}
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '0.4rem 0.7rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            📢 Advertise
          </button>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.4rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Toggle Theme"
          >
            {themeMode === 'dark' ? <Moon size={16} color="#38bdf8" /> : <Sun size={16} color="#f59e0b" />}
          </button>
          <button
            onClick={() => user ? (window.location.href = user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard') : onNavigateToLogin()}
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              padding: '0.4rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <User size={16} />
          </button>
        </div>

      </header>

      {/* Floating Side Action Badges (Desktop Only) */}
      <div className="desktop-only" style={{ position: 'fixed', right: 0, top: '40%', zIndex: 99, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <button onClick={onNavigateToRegister} style={{ writingMode: 'vertical-rl', backgroundColor: '#3b82f6', color: '#fff', padding: '0.85rem 0.4rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
          Free Listing
        </button>
        <button onClick={onNavigateToRegister} style={{ writingMode: 'vertical-rl', backgroundColor: '#f97316', color: '#fff', padding: '0.85rem 0.4rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
          Advertise
        </button>
      </div>


      {/* 2. Hero Search & Promo Banners Section (Matching Justdial Screenshot 1) */}
      <section className="home-section-padding">
        <h1 style={{ fontSize: 'clamp(1.3rem, 5vw, 2.2rem)', fontWeight: 900, marginBottom: '1.25rem', color: '#fff' }}>
          Search across <span style={{ color: '#38bdf8' }}>'10,000+' Verified Businesses</span>
        </h1>

        {/* Integrated Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          backgroundColor: '#1e293b',
          padding: '0.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.65rem 1rem', borderRadius: '8px', flex: '1 1 180px' }}>
            <MapPin size={18} color="#38bdf8" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontWeight: 700, textTransform: 'capitalize' }}
            >
              {cities.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#0f172a' }}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.65rem 1rem', borderRadius: '8px', flex: '3 1 260px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search for Spa, Salons, Rice Mills, SEO..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.92rem' }}
            />
            <Mic size={18} color="#6366f1" style={{ cursor: 'pointer' }} />

            {/* Live Autocomplete Suggestions Overlay Dropdown */}
            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                zIndex: 1000,
                maxHeight: '280px',
                overflowY: 'auto'
              }}>
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setShowSuggestions(false);
                      if (item.isVerifiedManaCity) {
                        const url = item.subdomain
                          ? `https://${item.subdomain}.manacity.in`
                          : `/site/${item.slug || 'kumar-shirts'}`;
                        window.open(url, '_blank');
                      } else {
                        setUnonboardedTargetBusiness(item);
                      }
                    }}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{item.businessName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.address || item.category}</div>
                    </div>
                    {item.isVerifiedManaCity ? (
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                        Verified Page
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                        Enquire
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.75rem', borderRadius: '8px', fontWeight: 800, background: '#38bdf8', color: '#0f172a', width: '100%', maxWidth: '120px' }}>
            Search
          </button>
        </form>

        {/* Hero Feature Banner Carousel Grid */}
        <div className="hero-banner-grid">
          {/* Main Airfare / Offer Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '180px'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.6rem', borderRadius: '12px' }}>
                FLIGHTS & TRAVEL
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.65rem', marginBottom: '0.35rem' }}>
                Fly at Lowest Airfares
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#e0f2fe' }}>Instant ticket bookings & budget-friendly stays</p>
            </div>

            <button style={{ width: 'fit-content', backgroundColor: '#fff', color: '#0284c7', border: 'none', padding: '0.5rem 1.1rem', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '0.75rem' }}>
              Book Now
            </button>
          </div>

          {/* Vertical Feature Card 1: B2B */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.15rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>B2B</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0' }}>Quick Quotes</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Manufacturers & Wholesale</p>
            </div>
            <ChevronRight size={18} color="#38bdf8" />
          </div>

          {/* Vertical Feature Card 2: REPAIRS & SERVICES */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.15rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399' }}>REPAIRS</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0' }}>Get Vendor</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>AC, Electrician, Plumber</p>
            </div>
            <ChevronRight size={18} color="#34d399" />
          </div>

          {/* Vertical Feature Card 3: REAL ESTATE */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.15rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c084fc' }}>REAL ESTATE</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0' }}>Finest Agents</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Rent & Buy Properties</p>
            </div>
            <ChevronRight size={18} color="#c084fc" />
          </div>

          {/* Vertical Feature Card 4: DOCTORS */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.15rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f87171' }}>DOCTORS</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0' }}>Book Consultation</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Clinics & Dentists</p>
            </div>
            <ChevronRight size={18} color="#f87171" />
          </div>
        </div>
      </section>

      {/* 3. Popular Category Icon Grid - 4 columns on mobile, 9 columns on desktop (Matching Justdial Screenshot 1) */}
      <section className="home-section-padding">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>
          Explore Popular Categories
        </h2>

        <div className="category-icon-grid">
          {iconCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => { setSelectedCategory(cat.name); fetchListings(); }}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  padding: '0.85rem 0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.15s'
                }}
              >
                {cat.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '4px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.3rem',
                    borderRadius: '6px'
                  }}>
                    {cat.badge}
                  </span>
                )}
                <div style={{
                  backgroundColor: `${cat.color}20`,
                  color: cat.color,
                  padding: '0.6rem',
                  borderRadius: '50%',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Multi-Column Collection Cards Grid (Matching Justdial Screenshot 2) */}
      <section className="home-section-padding">
        <div className="collections-grid">
          {collections.map((col, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '16px', backgroundColor: col.color, borderRadius: '4px' }}></span>
                {col.title}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {col.items.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    onClick={() => { setSelectedCategory(sub.name); fetchListings(); }}
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                  >
                    <img
                      src={sub.img}
                      alt={sub.name}
                      style={{ width: '100%', height: '75px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.35rem' }}
                    />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                      {sub.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Travel Bookings Hub Section (Matching Justdial Screenshot 2) */}
      <section className="home-section-padding">
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Travel & Tour Bookings
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 0, marginBottom: '1rem' }}>
            Instant ticket bookings & vehicle rentals for your best travel experience.
          </p>

          <div className="travel-grid">

            {[
              { label: 'Flight', desc: 'Affordable Airfares', icon: Plane, color: '#38bdf8' },
              { label: 'Bus', desc: 'Comfort Rides', icon: Bus, color: '#f43f5e' },
              { label: 'Train', desc: 'IRCTC Booking', icon: Train, color: '#eab308' },
              { label: 'Hotel', desc: 'Budget Stays', icon: Hotel, color: '#34d399' },
              { label: 'Car Rentals', desc: 'Drive Anywhere', icon: Car, color: '#c084fc' }
            ].map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#0f172a',
                    padding: '1rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={24} color={t.color} style={{ margin: '0 auto 0.4rem auto' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', display: 'block' }}>{t.label}</span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{t.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Explore Top Tourist Places (Matching Justdial Screenshot 3) */}
      <section style={{ padding: '1rem 2rem 2.5rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', color: '#fff' }}>
          Explore Top Tourist Destinations
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {touristPlaces.map((tp, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer'
              }}
            >
              <img src={tp.img} alt={tp.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'block' }}>{tp.name}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{tp.city}</span>
                </div>
                <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700 }}>Explore &gt;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Popular Search Action Cards (Matching Justdial Screenshot 3) */}
      <section style={{ padding: '1rem 2rem 2.5rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', color: '#fff' }}>
          Popular Business Searches
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {popularSearches.map((ps, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#0284c7',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)'
              }}
            >
              <img src={ps.img} alt={ps.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
              <div style={{ padding: '0.85rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, display: 'block', marginBottom: '0.65rem' }}>{ps.title}</span>
                <button
                  onClick={() => setSelectedLeadModal({ id: `ps-${idx}`, businessName: ps.title })}
                  style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    color: '#0284c7',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Top Verified Business Listings Grid */}
      <section style={{ padding: '1.5rem 2rem 3rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            Top Verified Listings in <span style={{ color: '#38bdf8', textTransform: 'capitalize' }}>{selectedCity}</span>
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
                justify: 'space-between',
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

                    <div 
                      onClick={() => {
                        const reviewsUrl = item.googleReviewsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.businessName + ' ' + (item.address || 'Tirupati'))}`;
                        window.open(reviewsUrl, '_blank');
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(234, 179, 8, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#facc15', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                      title="Click to view live Google Reviews"
                    >
                      <Star size={13} fill="#facc15" />
                      {item.rating} ({item.reviewCount})
                      <ExternalLink size={11} color="#facc15" />
                    </div>
                  </div>

                  <h3
                    onClick={() => {
                      const manacityUrl = item.subdomain
                        ? `https://${item.subdomain}.manacity.in`
                        : `/site/${item.slug || 'kumar-shirts'}`;
                      window.open(manacityUrl, '_blank');
                    }}
                    style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem', color: '#f8fafc', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    title="Click to open business website"
                  >
                    {item.businessName}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const extUrl = item.websiteUrl || (item.subdomain
                          ? `https://${item.subdomain}.manacity.in`
                          : `/site/${item.slug || 'kumar-shirts'}`);
                        window.open(extUrl, '_blank');
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
                      title="Open external website"
                    >
                      <ExternalLink size={14} color="#38bdf8" />
                    </span>
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
                Get Best Quote from <span style={{ color: '#38bdf8' }}>{selectedLeadModal.businessName}</span>
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
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 800 }}>
                    Submit Quote Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Mobile Search Button */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 99
      }}>
        <button
          onClick={() => setShowMobileSearchModal(true)}
          style={{
            backgroundColor: '#38bdf8',
            color: '#0f172a',
            border: 'none',
            borderRadius: '30px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.5)',
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

      {/* Floating Search Action Button on Mobile */}
      <button
        className="floating-mobile-search-btn mobile-only"
        onClick={() => setShowMobileSearchModal(true)}
        title="Search ManaCity"
        aria-label="Search"
      >
        <Search size={24} />
      </button>

      {/* Mobile Bottom Navigation Bar (5 Icons) */}
      <nav className="mobile-only" style={{
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
            color: '#38bdf8',
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
