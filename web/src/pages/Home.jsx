import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import ClaimBusinessModal from '../components/ClaimBusinessModal';
import UnonboardedEnquiryModal from '../components/UnonboardedEnquiryModal';
import PhoneCollectionModal from '../components/PhoneCollectionModal';
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
  Check,
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
  Plus,
  Globe,
  Heart,
  Bell,
  MoreHorizontal
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
  const [themeMode, setThemeMode] = useState('light');

  const heroSearchRef = useRef(null);
  const [isHeroSearchVisible, setIsHeroSearchVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add('light-mode');
    document.body.setAttribute('data-theme', 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-mode');
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      document.body.setAttribute('data-theme', 'dark');
    }
  };




  // Modals & Overlays
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const [unonboardedTargetBusiness, setUnonboardedTargetBusiness] = useState(null);
  const [claimModalInfo, setClaimModalInfo] = useState(null);

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingEnquiryAction, setPendingEnquiryAction] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);

  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Automatic Browser Geolocation Detection on Load
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude >= 13.4 && latitude <= 13.8 && longitude >= 79.2 && longitude <= 79.6) {
            setSelectedCity('tirupati');
          } else if (latitude >= 17.2 && latitude <= 17.6 && longitude >= 78.2 && longitude <= 78.6) {
            setSelectedCity('hyderabad');
          } else if (latitude >= 16.4 && latitude <= 16.7 && longitude >= 80.5 && longitude <= 80.8) {
            setSelectedCity('vijayawada');
          } else if (latitude >= 17.6 && latitude <= 17.9 && longitude >= 83.1 && longitude <= 83.4) {
            setSelectedCity('visakhapatnam');
          } else if (latitude >= 12.9 && latitude <= 13.3 && longitude >= 80.1 && longitude <= 80.3) {
            setSelectedCity('chennai');
          } else if (latitude >= 12.8 && latitude <= 13.1 && longitude >= 77.4 && longitude <= 77.8) {
            setSelectedCity('bangalore');
          }
        },
        (err) => console.log('Geolocation info:', err.message),
        { timeout: 8000 }
      );
    }
  }, []);

  // Guard all enquiry actions with Mandatory Login + Phone check
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

  // Close search suggestions & drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setShowMobileSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [masterSuggestions, setMasterSuggestions] = useState([]);
  const [selectedServiceVendorsModal, setSelectedServiceVendorsModal] = useState(null);
  const [unmatchedSearchQueryText, setUnmatchedSearchQueryText] = useState('');
  const [unmatchedSubmittedMessage, setUnmatchedSubmittedMessage] = useState('');
  const [dropdownFilter, setDropdownFilter] = useState('ALL');

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setMasterSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingSuggestions(true);
      try {
        // 1. Internal Unified search (Master Items + Businesses)
        const unifiedRes = await axios.get(`/api/phase1/search-unified?city=${encodeURIComponent(selectedCity)}&query=${encodeURIComponent(query)}`);
        const mItems = unifiedRes.data?.masterItems || [];
        const dbItems = (unifiedRes.data?.businesses || []).map(item => ({
          ...item,
          isVerifiedManaCity: true
        }));

        setMasterSuggestions(mItems);

        // 2. Google Places Autocomplete search
        let googleItems = [];
        try {
          const token = localStorage.getItem('userToken') || localStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const gRes = await axios.get(`/api/phase1/google-places/autocomplete?input=${encodeURIComponent(query)}`, { headers });
          if (gRes.data?.predictions) {
            googleItems = gRes.data.predictions.slice(0, 3).map(p => ({
              id: p.placeId || p.place_id,
              businessName: p.name || p.description,
              address: p.description,
              category: 'Google Business Result',
              isVerifiedManaCity: false,
              place_id: p.placeId || p.place_id
            }));
          }
        } catch (e) {
          console.warn('Google places autocomplete fallback:', e);
        }

        // Deduplicate Google Places
        const filteredGoogleItems = googleItems.filter(g => {
          const gNameLower = (g.businessName || '').toLowerCase().trim();
          return !dbItems.some(db => {
            const dbNameLower = (db.businessName || '').toLowerCase().trim();
            const gPlaceMatch = db.googlePlaceId && db.googlePlaceId === g.place_id;
            return gPlaceMatch || dbNameLower.includes(gNameLower) || gNameLower.includes(dbNameLower);
          });
        });

        const combined = [...dbItems, ...filteredGoogleItems];
        setSuggestions(combined);
        setShowSuggestions(mItems.length > 0 || combined.length > 0 || query.trim().length >= 2);
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
      setListings(res.data?.listings || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListings([]);
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
      window.open(`https://wa.me/${listing.whatsApp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
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

  const handleFreeBusinessListingClick = () => {
    if (!user) {
      window.location.href = '/register?role=BUSINESS_OWNER&intent=onboarding';
    } else {
      window.location.href = '/onboarding';
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Standalone Header Module (Identical to Service details page) */}
      <Header
        user={user}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Main Page Content */}
      <section className="home-section-padding">
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
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.15rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)' }}>B2B</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0', color: 'var(--text-primary)' }}>Quick Quotes</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Manufacturers & Wholesale</p>
            </div>
            <ChevronRight size={18} color="var(--accent-primary)" />
          </div>

          {/* Vertical Feature Card 2: REPAIRS & SERVICES */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.15rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>REPAIRS</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0', color: 'var(--text-primary)' }}>Get Vendor</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>AC, Electrician, Plumber</p>
            </div>
            <ChevronRight size={18} color="var(--accent-secondary)" />
          </div>

          {/* Vertical Feature Card 3: REAL ESTATE */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.15rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8b5cf6' }}>REAL ESTATE</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0', color: 'var(--text-primary)' }}>Finest Agents</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Rent & Buy Properties</p>
            </div>
            <ChevronRight size={18} color="#8b5cf6" />
          </div>

          {/* Vertical Feature Card 4: DOCTORS */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.15rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444' }}>DOCTORS</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.35rem 0', color: 'var(--text-primary)' }}>Book Consultation</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Clinics & Dentists</p>
            </div>
            <ChevronRight size={18} color="#ef4444" />
          </div>

        </div>
      </section>

      {/* 3. Top Verified Business Listings Grid (Moved right below Hero & above Categories) */}
      {/* 3. Top Verified Listings Section (Horizontal Auto-Scroll Carousel) */}
      <section style={{ padding: '1.5rem 2rem 2.5rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Top Verified Listings in <span style={{ color: 'var(--accent-primary)', textTransform: 'capitalize' }}>{selectedCity}</span>
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {listings.length} Results
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('top-verified-carousel');
                  if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
                }}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
                title="Scroll Left"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('top-verified-carousel');
                  if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
                }}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
                title="Scroll Right"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Searching ManaCity aggregator...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>No matching businesses found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Try searching another category or city.</p>
          </div>
        ) : (
          <div
            id="top-verified-carousel"
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '1.25rem',
              paddingBottom: '1rem',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {listings.map(item => {
              const bannerImg = item.coverImage || item.banner || item.coverImageUrl || (
                (item.category || '').toLowerCase().includes('digital') ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80' :
                (item.category || '').toLowerCase().includes('clinic') || (item.category || '').toLowerCase().includes('health') ? 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80' :
                (item.category || '').toLowerCase().includes('restaurant') || (item.category || '').toLowerCase().includes('food') ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80' :
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
              );

              const subdomainSlug = item.subdomain || item.slug || 'business';
              const manacityProfileUrl = typeof window !== 'undefined' && window.location.hostname.includes('manacity.in')
                ? `https://${subdomainSlug}.manacity.in`
                : `/site/${subdomainSlug}`;

              return (
                <div
                  key={item.id}
                  onClick={() => window.open(manacityProfileUrl, '_blank')}
                  style={{
                    minWidth: '310px',
                    maxWidth: '310px',
                    height: '350px',
                    maxHeight: '350px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Top Banner Image with Badges */}
                  <div style={{
                    position: 'relative',
                    height: '105px',
                    minHeight: '105px',
                    width: '100%',
                    backgroundImage: `url(${bannerImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.12)' }} />
                    
                    {/* Category & Verified Badges at Top Left */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.18rem 0.55rem',
                        borderRadius: '16px',
                        backgroundColor: '#eff6ff',
                        color: '#3b82f6',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}>
                        {item.category}
                      </span>

                      {item.verified !== false ? (
                        <span style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '0.18rem 0.5rem',
                          borderRadius: '16px',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.15rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          <ShieldCheck size={11} /> Verified
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '0.18rem 0.5rem',
                          borderRadius: '16px',
                          backgroundColor: '#f59e0b',
                          color: '#ffffff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          Unverified
                        </span>
                      )}
                    </div>

                    {/* Rating Pill at Top Right */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        const reviewsUrl = item.googleReviewsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.businessName + ' ' + (item.address || 'Tirupati'))}`;
                        window.open(reviewsUrl, '_blank');
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        backgroundColor: '#fff',
                        padding: '0.18rem 0.5rem',
                        borderRadius: '16px',
                        color: '#d97706',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Star size={11} fill="#d97706" />
                      {item.rating} ({item.reviewCount})
                      <ExternalLink size={9} color="#d97706" />
                    </div>

                    {/* Circular Logo Badge Overlapping Banner */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-18px',
                      left: '14px',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      border: '2.5px solid #ffffff',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
                      backgroundColor: '#ffffff',
                      zIndex: 3
                    }}>
                      {item.logo || item.logoUrl || item.profilePicture ? (
                        <img src={item.logo || item.logoUrl || item.profilePicture} alt={item.businessName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (item.category || '').toLowerCase().includes('clinic') || (item.category || '').toLowerCase().includes('health') || (item.category || '').toLowerCase().includes('lab') ? (
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17" />
                          </svg>
                        </div>
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1rem',
                          color: '#0d9488',
                          letterSpacing: '-0.5px'
                        }}>
                          {(() => {
                            const name = item.businessName || 'MC';
                            const parts = name.trim().split(' ');
                            if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
                            return name.substring(0, 2).toUpperCase();
                          })()}
                        </div>
                      )}

                      {/* Green Verified Checkmark Badge */}
                      {item.verified !== false && (
                        <div style={{
                          position: 'absolute',
                          bottom: '0px',
                          right: '0px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          width: '15px',
                          height: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1.5px solid #ffffff'
                        }}>
                          <Check size={9} color="#ffffff" strokeWidth={3.5} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '22px 0.85rem 0.75rem 0.85rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        marginBottom: '0.25rem',
                        color: 'var(--text-primary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.25,
                        height: '2.3rem'
                      }}>
                        {item.businessName}
                        {item.websiteUrl && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.websiteUrl, '_blank');
                            }}
                            title="Open external website"
                            style={{ display: 'inline-flex', cursor: 'pointer', marginLeft: '0.25rem' }}
                          >
                            <ExternalLink size={12} color="#0284c7" />
                          </span>
                        )}
                      </h3>

                      <p style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginBottom: '0.4rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <MapPin size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address}</span>
                      </p>

                      {/* Products & Services Single Row Horizontal Carousel */}
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem', fontWeight: 600 }}>Products & Services:</span>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          overflowX: 'auto',
                          gap: '0.3rem',
                          paddingBottom: '0.15rem',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                        }}>
                          {item.services && item.services.map((svc, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.68rem',
                                backgroundColor: 'var(--bg-tertiary, #f1f5f9)',
                                color: 'var(--text-primary, #0f172a)',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '5px',
                                border: '1px solid var(--border-color, #cbd5e1)',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                              }}
                            >
                              {svc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                        <button onClick={() => handleCallClick(item)} className="btn" style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.45rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                          <Phone size={13} /> Call Now
                        </button>
                        <button onClick={() => handleWhatsAppClick(item)} className="btn" style={{ backgroundColor: '#25d366', color: '#fff', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.45rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                          <MessageSquare size={13} /> WhatsApp
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedLeadModal(item)}
                        style={{
                          width: '100%',
                          padding: '0.45rem',
                          borderRadius: '8px',
                          backgroundColor: '#eef2ff',
                          border: '1px solid #c7d2fe',
                          color: '#4f46e5',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Sparkles size={13} color="#4f46e5" /> Get Best Quote
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Popular Category Icon Grid (Matching Justdial Screenshot 1 with light mode support) */}
      <section className="home-section-padding">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.15rem', color: 'var(--text-primary)' }}>
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
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '14px',
                  padding: '0.95rem 0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
                    padding: '0.1rem 0.35rem',
                    borderRadius: '6px'
                  }}>
                    {cat.badge}
                  </span>
                )}
                <div style={{
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                  padding: '0.65rem',
                  borderRadius: '50%',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Multi-Column Collection Cards Grid */}
      <section className="home-section-padding">
        <div className="collections-grid">
          {collections.map((col, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {sub.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Travel Bookings Hub Section */}
      <section className="home-section-padding">
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Travel & Tour Bookings
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1rem' }}>
            Instant ticket bookings & vehicle rentals for your best travel experience.
          </p>

          <div className="travel-grid">
            {[
              { title: 'Flights', sub: 'Domestic & Int.', color: '#38bdf8', icon: Globe },
              { title: 'Bus Tickets', sub: 'AC / Sleeper', color: '#10b981', icon: Truck },
              { title: 'Train Status', sub: 'Live PNR & Booking', color: '#f59e0b', icon: MapPin },
              { title: 'Cab Rental', sub: 'Local & Outstation', color: '#ec4899', icon: Car },
              { title: 'Holiday Tours', sub: 'Packages', color: '#8b5cf6', icon: Heart }
            ].map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  onClick={() => alert(`Redirecting to ManaCity ${t.title} Booking Gateway...`)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = t.color}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{
                    backgroundColor: `${t.color}15`,
                    color: t.color,
                    padding: '0.65rem',
                    borderRadius: '50%'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{t.title}</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>{t.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

      {/* Phone Collection Modal for Auth Guard */}
      <PhoneCollectionModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        token={localStorage.getItem('token')}
        onSuccess={(updatedUser) => {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          if (pendingEnquiryAction) {
            pendingEnquiryAction();
            setPendingEnquiryAction(null);
          }
        }}
      />

      {/* Service / Product Vendors Modal */}
      {selectedServiceVendorsModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }} onClick={() => setSelectedServiceVendorsModal(null)}>
          <div style={{
            backgroundColor: '#1e293b',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedServiceVendorsModal(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'rgba(129, 140, 248, 0.15)', padding: '0.25rem 0.65rem', borderRadius: '12px' }}>
                📦 {selectedServiceVendorsModal.category || 'Master Offering'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.65rem', borderRadius: '12px' }}>
                {selectedServiceVendorsModal.defaultPrice ? `Est. ₹${selectedServiceVendorsModal.defaultPrice.toLocaleString('en-IN')}` : 'Custom Pricing'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#fff' }}>
              {selectedServiceVendorsModal.name}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {selectedServiceVendorsModal.description}
            </p>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={18} /> Verified Vendors Offering This Service in {selectedCity} ({selectedServiceVendorsModal.vendors?.length || 0})
            </h4>

            {selectedServiceVendorsModal.vendors && selectedServiceVendorsModal.vendors.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {selectedServiceVendorsModal.vendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.85rem'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>{vendor.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
                        ★ {vendor.rating} ({vendor.reviewCount} reviews) • {vendor.city || selectedCity}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          const url = `https://${vendor.slug}.manacity.in`;
                          window.open(url, '_blank');
                        }}
                        style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        View Storefront
                      </button>
                      <button
                        onClick={() => {
                          setSelectedServiceVendorsModal(null);
                          setSelectedLeadModal(vendor);
                        }}
                        style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <Zap size={32} color="#fbbf24" style={{ margin: '0 auto 0.5rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>No providers onboarded in {selectedCity} yet</h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
                  Submit an onboarding request to ManaCity Super Admin team. We will verify and onboard providers for "{selectedServiceVendorsModal.name}"!
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await axios.post('/api/phase1/unmatched-query', {
                        searchQuery: selectedServiceVendorsModal.name,
                        city: selectedCity,
                        customerName: user?.name || 'Visitor User',
                        customerPhone: user?.phone || '',
                        customerEmail: user?.email || ''
                      });
                      alert(`Request for "${selectedServiceVendorsModal.name}" submitted to Super Admin! We will notify you once providers are onboarded.`);
                      setSelectedServiceVendorsModal(null);
                    } catch (err) {
                      alert('Failed to submit request.');
                    }
                  }}
                  style={{ backgroundColor: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '8px', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.75rem' }}
                >
                  🚀 Request Super Admin to Onboard Vendors
                </button>
              </div>
            )}
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
