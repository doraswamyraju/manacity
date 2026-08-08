import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Phone, MessageSquare, ExternalLink, ShieldCheck, Building2, ShoppingBag, Wrench, Sparkles, Filter } from 'lucide-react';

export default function Home({ onNavigateToLogin, onNavigateToRegister, onNavigateToPrivacy, onNavigateToTerms, onNavigateToDelete, onNavigateToSuperAdmin, user }) {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('tirupati');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
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
      // Endpoint fallback to mock search if needed
      const res = await axios.get(`/api/phase1/directory/${selectedCity}/all?query=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);
      if (res.data && res.data.listings) {
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
        verified: true
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
        verified: true
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
        verified: true
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
    const text = encodeURIComponent(`Hi ${listing.businessName}, I found your business on ManaCity.in and would like to inquire about your products/services.`);
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
      alert('Failed to send lead. Please try calling directly.');
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <header style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="ManaCity Logo" style={{ height: '40px' }} />
          <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600 }}>
            Aggregated Directory
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Logged in as <strong>{user.name}</strong></span>
              {user.role === 'SUPER_ADMIN' && (
                <button onClick={onNavigateToSuperAdmin} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  Super Admin Panel
                </button>
              )}
              <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Dashboard
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={onNavigateToLogin} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>
                Sign In
              </button>
              <button onClick={onNavigateToLogin} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                List Your Business
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Search Section */}
      <section style={{
        padding: '4rem 2rem 3rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
          Search Products, Services & Local Businesses on <span className="gradient-text">ManaCity.in</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '650px', marginBottom: '2.5rem' }}>
          Your smart city aggregator connecting customers with verified local businesses, manufacturers, service providers, and digital storefronts.
        </p>

        {/* Combined Search Form */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          backgroundColor: '#1e293b',
          padding: '0.75rem',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: '850px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* City Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.6rem 1rem', borderRadius: '10px', flex: '1 1 200px' }}>
            <MapPin size={18} color="#6366f1" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', cursor: 'pointer' }}
            >
              {cities.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#0f172a' }}>{c.name}</option>)}
            </select>
          </div>

          {/* Search Query */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.6rem 1rem', borderRadius: '10px', flex: '2 1 350px' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by Product (e.g. Sona Masuri Rice), Service (e.g. SEO), or Business..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            Search Now
          </button>
        </form>

        {/* Quick Categories Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px',
                  border: active ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: active ? 'rgba(99, 102, 241, 0.2)' : '#1e293b',
                  color: active ? '#818cf8' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
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

      {/* Aggregator Results Section */}
      <section style={{ padding: '2rem 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Top Verified Businesses in <span style={{ color: '#818cf8', textTransform: 'capitalize' }}>{selectedCity}</span>
          </h2>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Showing {listings.length} Results
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            Searching ManaCity database...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3>No matching businesses found</h3>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Try searching another product, service, or select a different city.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {listings.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                      {item.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(234, 179, 8, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#facc15', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Star size={14} fill="#facc15" />
                      {item.rating} ({item.reviewCount})
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: '#f8fafc' }}>
                    {item.businessName}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                    <MapPin size={14} color="#64748b" />
                    {item.address}
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Products & Services:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {item.services && item.services.map((svc, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#0f172a', color: '#cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button onClick={() => handleCallClick(item)} className="btn" style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem' }}>
                      <Phone size={14} /> Call Business
                    </button>
                    <button onClick={() => handleWhatsAppClick(item)} className="btn" style={{ backgroundColor: '#25d366', color: '#fff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem' }}>
                      <MessageSquare size={14} /> WhatsApp
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => setSelectedLeadModal(item)} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}>
                      Send Inquiry Form
                    </button>

                    <a href={`/directory/${item.city}/${item.slug}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
                      View Site <ExternalLink size={12} />
                    </a>
                  </div>
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
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '2rem', maxWidth: '450px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Send Inquiry to <span style={{ color: '#818cf8' }}>{selectedLeadModal.businessName}</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              The business owner will receive your contact details directly in their ManaCity dashboard and mobile notifications.
            </p>

            {leadSubmitted ? (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                ✓ Inquiry Sent Successfully! The business owner will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  required
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <input
                  type="email"
                  placeholder="Your Email (Optional)"
                  value={leadForm.email}
                  onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <textarea
                  placeholder="Specify product/service required..."
                  rows={3}
                  value={leadForm.message}
                  onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#6366f1' }}>
                    Submit Lead
                  </button>
                  <button type="button" onClick={() => setSelectedLeadModal(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '0.85rem' }}>
        <p>© 2026 ManaCity Platform. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          <button onClick={onNavigateToPrivacy} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Privacy Policy</button>
          <button onClick={onNavigateToTerms} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Terms of Service</button>
          <button onClick={onNavigateToDelete} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Delete Account</button>
        </div>
      </footer>
    </div>
  );
}
