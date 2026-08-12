import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  Phone,
  MessageSquare,
  MapPin,
  Star,
  ShieldCheck,
  ExternalLink,
  Stethoscope,
  Utensils,
  ShoppingBag,
  Calendar,
  HeartPulse
} from 'lucide-react';
import * as Sections from './WebsiteSections';

export default function PublicBusinessWebsite() {
  const { subdomain, slug } = useParams();
  const targetId = subdomain || slug || 'abc-digital';

  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  const [websiteConfig, setWebsiteConfig] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchWebsiteData();
  }, [targetId]);

  useEffect(() => {
    const bg = businessData?.businessGroup;
    const letsTrackApiKey = bg?.letsTrackApiKey || businessData?.letsTrackApiKey;

    if (letsTrackApiKey) {
      window.LetsTrackConfig = { websiteId: letsTrackApiKey };

      const scriptId = 'letstrack-widget-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = import.meta.env.VITE_LETSTRACK_WIDGET_URL || 'https://livechat.vrhere.in/widget/widget.js';
        script.setAttribute('data-api-key', letsTrackApiKey);
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [businessData]);

  const fetchWebsiteData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/website/public/${targetId}`);
      if (res.data && res.data.businessGroup) {
        setBusinessData(res.data);
        const web = res.data.website || res.data.businessGroup.websiteConfig || {};
        setWebsiteConfig(web);
        
        let secList = web.sections || res.data.sections || [];
        if (secList.length === 0) {
          secList = getDefaultSections();
        } else {
          secList = [...secList].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        }
        setSections(secList);
      } else {
        setBusinessData(getMockData());
        setWebsiteConfig(getMockData().websiteConfig);
        setSections(getDefaultSections());
      }
    } catch (e) {
      setBusinessData(getMockData());
      setWebsiteConfig(getMockData().websiteConfig);
      setSections(getDefaultSections());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSections = () => [
    { type: 'HEADER', enabled: true, displayOrder: 1, settings: {} },
    { type: 'HERO', enabled: true, displayOrder: 2, settings: {} },
    { type: 'FEATURES', enabled: true, displayOrder: 3, settings: {} },
    { type: 'ABOUT', enabled: true, displayOrder: 4, settings: {} },
    { type: 'SERVICES', enabled: true, displayOrder: 5, settings: {} },
    { type: 'PRODUCTS', enabled: true, displayOrder: 6, settings: {} },
    { type: 'GALLERY', enabled: true, displayOrder: 7, settings: {} },
    { type: 'REVIEWS', enabled: true, displayOrder: 8, settings: {} },
    { type: 'CONTACT', enabled: true, displayOrder: 9, settings: {} },
    { type: 'FAQ', enabled: true, displayOrder: 10, settings: {} },
    { type: 'CTA', enabled: true, displayOrder: 11, settings: {} },
    { type: 'FOOTER', enabled: true, displayOrder: 12, settings: {} }
  ];

  const getMockData = () => {
    return {
      businessGroup: {
        name: 'Rajugari Ventures - A Digital Marketing Agency in Tirupati',
        description: 'Imported Google Place listing for Rajugari Ventures - A Digital Marketing Agency in Tirupati',
        city: 'Tirupati',
        address: 'Shop No.38, 1st Floor, Tuda Complex, near Anna Canteen, Bairagi patteda, Tirupati, Andhra Pradesh 517502, India',
        mobileNumber: '+91 98765 43210',
        whatsAppNumber: '+91 98765 43210',
        email: 'info@rajugariventures.in',
        logoUrl: '/logo.png'
      },
      websiteConfig: {
        theme: 'modern-corporate',
        primaryColor: '#6366f1',
        secondaryColor: '#a855f7',
        font: 'Outfit'
      },
      services: [
        { id: '1', name: 'SEO Optimization & GBP Marketing', price: '₹14,999/mo', description: 'Local map ranking and organic traffic optimization.' },
        { id: '2', name: 'Social Media Management', price: '₹9,999/mo', description: 'Instagram & Facebook lead generation campaigns.' }
      ],
      products: []
    };
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', color: '#94a3b8' }}>
        <h2>Loading Business Website...</h2>
      </div>
    );
  }

  const bg = businessData.businessGroup || {};
  const theme = websiteConfig?.theme || 'modern-corporate';
  const primaryColor = websiteConfig?.primaryColor || '#6366f1';
  const secondaryColor = websiteConfig?.secondaryColor || '#a855f7';
  const font = websiteConfig?.font || 'Outfit';
  const { avgRating, reviewCount } = Sections.getRatingAndReviews(bg);

  const themeVars = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--font-primary': font,
    fontFamily: font
  };

  let activeSections = [...sections];
  const hasHeader = activeSections.some(sec => sec.type === 'HEADER');
  if (!hasHeader) {
    activeSections.unshift({ type: 'HEADER', enabled: true, displayOrder: 0, settings: {} });
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme === 'light-minimal' ? '#ffffff' : '#090d16', color: theme === 'light-minimal' ? '#0f172a' : '#f8fafc', fontFamily: `${font}, sans-serif`, ...themeVars }}>
      
      {/* Top Notification Bar if Clinic or Restaurant */}
      {theme === 'clinic-healthcare' && (
        <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.4rem 1rem', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <HeartPulse size={16} /> 24/7 Emergency Helpline: Call <a href={`tel:${bg.mobileNumber}`} style={{ color: '#fff', textDecoration: 'underline' }}>{bg.mobileNumber}</a>
        </div>
      )}

      {theme === 'restaurant-menu' && (
        <div style={{ backgroundColor: '#f43f5e', color: '#fff', padding: '0.4rem 1rem', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Utensils size={16} /> Fresh & Hygienic Dining • Dine-in & Takeaway Orders Available
        </div>
      )}

      {/* Persistent Top Navigation Bar */}
      <header style={{
        padding: '1rem 2rem',
        backgroundColor: theme === 'light-minimal' ? '#ffffff' : '#0f172a',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {bg.logoUrl ? (
            <img src={bg.logoUrl} alt={bg.name} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid var(--primary-color, #6366f1)' }} />
          ) : (
            theme === 'clinic-healthcare' ? <Stethoscope size={28} color={primaryColor} /> :
            theme === 'restaurant-menu' ? <Utensils size={28} color={primaryColor} /> :
            theme === 'e-commerce' ? <ShoppingBag size={28} color={primaryColor} /> :
            theme === 'service-booking' ? <Calendar size={28} color={primaryColor} /> :
            <Building2 size={28} color={primaryColor} />
          )}
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: theme === 'light-minimal' ? '#0f172a' : '#fff' }}>{bg.name}</h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} color="#38bdf8" /> {bg.address || bg.city} • <ShieldCheck size={12} color="#34d399" /> Verified Storefront
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            onClick={() => {
              const reviewsUrl = bg.googleReviewsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bg.name + ' ' + (bg.city || 'Tirupati'))}`;
              window.open(reviewsUrl, '_blank');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              color: '#fbbf24',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="Click to view live Google Reviews"
          >
            <Star size={15} fill="#fbbf24" color="#fbbf24" />
            <span>{avgRating} ★</span>
            <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.75rem' }}>
              ({reviewCount} Reviews)
            </span>
            <ExternalLink size={12} color="#fbbf24" />
          </div>

          {bg.mobileNumber && (
            <a href={`tel:${bg.mobileNumber}`} className="btn" style={{ backgroundColor: '#10b981', color: '#fff', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '6px' }}>
              <Phone size={14} /> Call Now
            </a>
          )}
          {bg.whatsAppNumber && (
            <a href={`https://wa.me/${(bg.whatsAppNumber || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25d366', color: '#fff', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '6px' }}>
              <MessageSquare size={14} /> WhatsApp
            </a>
          )}
        </div>
      </header>

      {/* Main Dynamic Engine Rendering - 100% IDENTICAL to WebsiteBuilder Preview */}
      <main style={themeVars}>
        {activeSections
          .filter(sec => sec.enabled !== false)
          .map(sec => {
            const settings = sec.settings || {};
            if (sec.type === 'HEADER') return <Sections.HeaderSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'HERO') return <Sections.HeroSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'FEATURES') return <Sections.FeaturesSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'ABOUT') return <Sections.AboutSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'SERVICES') return <Sections.ServicesSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'PRODUCTS') return <Sections.ProductsSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'GALLERY') return <Sections.GallerySection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'REVIEWS') return <Sections.ReviewsSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'CONTACT') return <Sections.ContactSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'FAQ') return <Sections.FaqSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'CTA') return <Sections.CtaSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            if (sec.type === 'FOOTER') return <Sections.FooterSection key={sec.type} businessGroup={bg} settings={settings} theme={theme} />;
            return null;
          })}
      </main>
    </div>
  );
}
