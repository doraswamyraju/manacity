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
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  let targetId = subdomain || slug;
  if (!targetId && hostname.endsWith('.manacity.in') && hostname !== 'manacity.in' && hostname !== 'www.manacity.in') {
    targetId = hostname.replace('.manacity.in', '');
  }
  if (!targetId) targetId = 'abc-digital';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [websiteConfig, setWebsiteConfig] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchWebsiteData();
  }, [targetId]);

  useEffect(() => {
    const letsTrackWidgetId = websiteConfig?.letsTrackWidgetId;

    if (letsTrackWidgetId) {
      window.LetsTrackConfig = { websiteId: letsTrackWidgetId };

      // Remove existing script/root if switching business/re-rendering
      const existingScript = document.getElementById('letstrack-widget-script');
      if (existingScript) {
        existingScript.remove();
      }
      const existingRoot = document.getElementById('letstrack-widget-root');
      if (existingRoot) {
        existingRoot.remove();
      }

      const script = document.createElement('script');
      script.id = 'letstrack-widget-script';
      script.src = import.meta.env.VITE_LETSTRACK_WIDGET_URL || 'https://livechat.vrhere.in/widget.js';
      script.setAttribute('data-api-key', letsTrackWidgetId);
      script.async = true;
      document.body.appendChild(script);
    }
  }, [websiteConfig]);

  const fetchWebsiteData = async () => {
    setLoading(true);
    setError(null);
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
        setError('Website not found');
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || 'Website not found');
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

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Outfit, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', backgroundColor: '#0f172a', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <Building2 size={64} color="#6366f1" style={{ marginBottom: '1.5rem', marginLeft: 'auto', marginRight: 'auto' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Site Not Found
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            The website you are looking for does not exist, has been unpublished, or is currently unavailable.
          </p>
          <a href="https://manacity.in" style={{ display: 'inline-block', backgroundColor: '#6366f1', color: '#fff', padding: '0.8rem 2rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}>
            Go to ManaCity
          </a>
        </div>
      </div>
    );
  }

  const bg = {
    ...(businessData.businessGroup || {}),
    services: businessData.services || businessData.businessGroup?.services || [],
    products: businessData.products || businessData.businessGroup?.products || []
  };
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
