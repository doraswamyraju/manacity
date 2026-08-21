import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LeadCaptureModal from '../components/LeadCaptureModal';
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
  ChevronRight
} from 'lucide-react';

export default function ServiceDetailsPage({ user }) {
  const { city, slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVendorForLead, setSelectedVendorForLead] = useState(null);

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header Bar */}
      <header style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}
          >
            <ArrowLeft size={18} /> Back to ManaCity
          </button>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Mana<span style={{ color: '#fff' }}>City</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Business Dashboard
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        
        {/* Breadcrumb Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ textTransform: 'capitalize' }}>{data.city}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#818cf8', fontWeight: 700 }}>{service.category}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#fff', fontWeight: 700 }}>{service.name}</span>
        </nav>

        {/* Hero Service Overview Card */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2.25rem',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'rgba(129, 140, 248, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '12px' }}>
              📦 {service.category}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '12px' }}>
              {service.defaultPrice ? `Est. Price: ₹${service.defaultPrice.toLocaleString('en-IN')}` : 'Custom Pricing'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} /> Verified ManaCity Master Offering
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0 0 1rem 0', lineHeight: 1.25 }}>
            {service.name} in {data.city.charAt(0).toUpperCase() + data.city.slice(1)}
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '850px' }}>
            {service.description || `Explore verified local providers offering ${service.name} in ${data.city}. Connect directly with high-rated vendors for fast quotes, pricing, and execution.`}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', pt: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} color="#10b981" /> 100% Verified Local Providers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} color="#10b981" /> 24-Hour Lead SLA Response
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} color="#10b981" /> Zero Brokerage Commission
            </div>
          </div>
        </div>

        {/* Vendors List Section */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={24} color="#38bdf8" /> Verified Vendors Offering This Service ({vendors.length})
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
                Compare local ratings, addresses, and connect directly with verified business owners in {data.city}.
              </p>
            </div>
          </div>

          {vendors.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s, borderColor 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#334155', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#818cf8', fontSize: '1.2rem' }}>
                        {vendor.logoUrl ? <img src={vendor.logoUrl} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : vendor.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        ★ {vendor.rating} ({vendor.reviewCount})
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0 0 0.4rem 0', lineHeight: 1.3 }}>
                      {vendor.name}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
                      <MapPin size={14} color="#64748b" /> {vendor.address}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
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
                        padding: '0.6rem',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      Storefront <ExternalLink size={14} />
                    </button>
                    
                    <button
                      onClick={() => setSelectedVendorForLead(vendor)}
                      style={{
                        flex: 1,
                        backgroundColor: '#10b981',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '0.6rem',
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
                      Get Quote <MessageSquare size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
              <Zap size={36} color="#fbbf24" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>No Verified Providers Registered in {data.city} Yet</h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.4rem', maxWidth: '600px', margin: '0.4rem auto 1.25rem auto' }}>
                Submit an onboarding request to the ManaCity Super Admin team. Our local team will verify and onboard top providers for "{service.name}" in {data.city}!
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
                    alert(`Request for "${service.name}" submitted to Super Admin! We will notify you once providers are onboarded.`);
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
        </section>

        {/* Related Services in Category */}
        {relatedServices && relatedServices.length > 0 && (
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              Related {service.category} Offerings in {data.city}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {relatedServices.map((rItem) => (
                <div
                  key={rItem.id}
                  onClick={() => navigate(`/${data.city}/service/${rItem.slug || rItem.id}`)}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    cursor: 'pointer',
                    transition: 'backgroundColor 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {rItem.category}
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                    {rItem.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                    {rItem.defaultPrice ? `Est. ₹${rItem.defaultPrice.toLocaleString('en-IN')}` : 'Custom Pricing'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Lead Capture Modal */}
      {selectedVendorForLead && (
        <LeadCaptureModal
          isOpen={!!selectedVendorForLead}
          onClose={() => setSelectedVendorForLead(null)}
          listing={{
            id: selectedVendorForLead.id,
            businessGroupId: selectedVendorForLead.id,
            businessName: selectedVendorForLead.name,
            contactPhone: selectedVendorForLead.phone
          }}
          user={user}
        />
      )}

      {/* Footer */}
      <footer style={{ marginTop: '4rem', padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '0.85rem' }}>
        <p>© 2026 ManaCity Aggregator Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
