import React, { lazy } from 'react';
import * as HeaderComponents from './blocks/headers/index.jsx';
import * as HeroComponents from './blocks/hero/index.jsx';
import * as AboutComponents from './blocks/about-us-short/index.jsx';
import * as ServicesComponents from './blocks/services/index.jsx';

// Component registry mapping block variant keys and names directly to their React components
export const blockComponentRegistry = {
  // Headers (1 to 10)
  'Header1': HeaderComponents.Header1,
  'Header2': HeaderComponents.Header2,
  'Header3': HeaderComponents.Header3,
  'Header4': HeaderComponents.Header4,
  'Header5': HeaderComponents.Header5,
  'Header6': HeaderComponents.Header6,
  'Header7': HeaderComponents.Header7,
  'Header8': HeaderComponents.Header8,
  'Header9': HeaderComponents.Header9,
  'Header10': HeaderComponents.Header10,

  // Heroes (1 to 5)
  'Hero1': HeroComponents.Hero1,
  'Hero2': HeroComponents.Hero2,
  'Hero3': HeroComponents.Hero3,
  'Hero4': HeroComponents.Hero4,
  'Hero5': HeroComponents.Hero5,

  // About Us (1 to 5)
  'AboutUs1': AboutComponents.AboutUs1,
  'AboutUs2': AboutComponents.AboutUs2,
  'AboutUs3': AboutComponents.AboutUs3,
  'AboutUs4': AboutComponents.AboutUs4,
  'AboutUs5': AboutComponents.AboutUs5,

  // Services (1 to 3)
  'Services1': ServicesComponents.Services1,
  'Services2': ServicesComponents.Services2,
  'Services3': ServicesComponents.Services3
};

// Aliases for friendly name lookups
export const getComponentForBlock = (variantName) => {
  if (!variantName) return null;
  const clean = variantName.replace(/[\s-_]/g, '').toLowerCase();

  for (const [key, comp] of Object.entries(blockComponentRegistry)) {
    if (key.toLowerCase() === clean) {
      return comp;
    }
  }

  // Fallbacks
  if (clean.includes('header10')) return HeaderComponents.Header10;
  if (clean.includes('header1')) return HeaderComponents.Header1;
  if (clean.includes('header2')) return HeaderComponents.Header2;
  if (clean.includes('header3')) return HeaderComponents.Header3;
  if (clean.includes('header4')) return HeaderComponents.Header4;
  if (clean.includes('header5')) return HeaderComponents.Header5;
  if (clean.includes('header6')) return HeaderComponents.Header6;
  if (clean.includes('header7')) return HeaderComponents.Header7;
  if (clean.includes('header8')) return HeaderComponents.Header8;
  if (clean.includes('header9')) return HeaderComponents.Header9;

  if (clean.includes('hero1')) return HeroComponents.Hero1;
  if (clean.includes('hero2')) return HeroComponents.Hero2;
  if (clean.includes('hero3')) return HeroComponents.Hero3;
  if (clean.includes('hero4')) return HeroComponents.Hero4;
  if (clean.includes('hero5')) return HeroComponents.Hero5;

  if (clean.includes('about1') || clean.includes('aboutus1')) return AboutComponents.AboutUs1;
  if (clean.includes('about2') || clean.includes('aboutus2')) return AboutComponents.AboutUs2;
  if (clean.includes('about3') || clean.includes('aboutus3')) return AboutComponents.AboutUs3;
  if (clean.includes('about4') || clean.includes('aboutus4')) return AboutComponents.AboutUs4;
  if (clean.includes('about5') || clean.includes('aboutus5')) return AboutComponents.AboutUs5;

  if (clean.includes('service1') || clean.includes('services1')) return ServicesComponents.Services1;
  if (clean.includes('service2') || clean.includes('services2')) return ServicesComponents.Services2;
  if (clean.includes('service3') || clean.includes('services3')) return ServicesComponents.Services3;

  return null;
};

// Complete default block definitions matching project 3999
export const default3999Blocks = [
  // HEADERS
  {
    id: 'b-header-1',
    category: 'HEADER',
    name: 'Header 1',
    title: 'Modern Sticky Header with Announcement & Contacts Bar',
    variant: 'Header1',
    blockKey: 'header-1',
    isPremium: false,
    description: 'Top blue contact strip with phone, email, and social links; sticky navigation with responsive services dropdown.',
    defaultData: {
      companyName: 'ManaCity Business',
      phoneNumber: '+91 87907 91101',
      emailAddress: 'contact@manacity.in',
      services: ['Home', 'About Us', 'Services', 'Contact'],
      logoUrl: 'https://placehold.co/140x48/1e3a8a/ffffff?text=ManaCity'
    }
  },
  {
    id: 'b-header-2',
    category: 'HEADER',
    name: 'Header 2',
    title: 'High-Tech Analytics Header with Metrics Bar',
    variant: 'Header2',
    blockKey: 'header-2',
    isPremium: true,
    description: 'Corporate dashboard-style header with real-time KPI tickers and dropdown mega menus.',
    defaultData: {
      companyName: 'ManaCity Enterprise',
      phoneNumber: '+91 87907 91101',
      emailAddress: 'enterprise@manacity.in',
      logoUrl: 'https://placehold.co/140x48/0f172a/ffffff?text=Enterprise'
    }
  },
  {
    id: 'b-header-3',
    category: 'HEADER',
    name: 'Header 3',
    title: 'Clean Minimalist Navigation with Direct CTA',
    variant: 'Header3',
    blockKey: 'header-3',
    isPremium: false,
    description: 'Streamlined logo on left, clean navigation links, and high-conversion Book Now button.',
    defaultData: {
      companyName: 'ManaCity Studio',
      phoneNumber: '+91 87907 91101',
      services: ['Overview', 'Portfolio', 'Pricing', 'Reviews']
    }
  },
  {
    id: 'b-header-4',
    category: 'HEADER',
    name: 'Header 4',
    title: 'Full Megamenu Enterprise Header',
    variant: 'Header4',
    blockKey: 'header-4',
    isPremium: true,
    description: 'Multi-column mega-nav layout with categorized service previews, ideal for multi-branch organizations.',
    defaultData: {
      companyName: 'MegaCorp ManaCity',
      phoneNumber: '+91 87907 91101'
    }
  },
  {
    id: 'b-header-5',
    category: 'HEADER',
    name: 'Header 5',
    title: 'Center Logo Boutique Header',
    variant: 'Header5',
    blockKey: 'header-5',
    isPremium: true,
    description: 'Elegantly centered brand mark flanked by split navigation links on desktop.',
    defaultData: {
      companyName: 'Luxury Boutique',
      phoneNumber: '+91 87907 91101'
    }
  },
  {
    id: 'b-header-6',
    category: 'HEADER',
    name: 'Header 6',
    title: 'Direct WhatsApp & Phone Click-to-Call Header',
    variant: 'Header6',
    blockKey: 'header-6',
    isPremium: false,
    description: 'Designed for high conversions with instant WhatsApp chat button and highlighted business hours.',
    defaultData: {
      companyName: 'Local Hero Services',
      phoneNumber: '+91 87907 91101'
    }
  },

  // HEROES
  {
    id: 'b-hero-1',
    category: 'HERO',
    name: 'Hero 1',
    title: 'Impact Split Banner with Floating Trust Badges',
    variant: 'Hero1',
    blockKey: 'hero-1',
    isPremium: false,
    description: 'Bold value proposition on left with bullet points and action buttons; rich hero image with floating rating cards.',
    defaultData: {
      badge: 'Verified #1 in Tirupati',
      headline: 'Accelerate Your Local Business Growth Today',
      subheadline: 'Attract high-intent customers, automate appointments, and stand out in your city with verified credibility.',
      primaryBtnText: 'Get Started Today',
      secondaryBtnText: 'View Case Studies'
    }
  },
  {
    id: 'b-hero-2',
    category: 'HERO',
    name: 'Hero 2',
    title: 'Modern Glassmorphism with Embedded Quote Form',
    variant: 'Hero2',
    blockKey: 'hero-2',
    isPremium: true,
    description: 'High-converting 1-step instant quote request form directly inside the hero banner.',
    defaultData: {
      headline: 'Experience Premium Business Services On Demand',
      subheadline: 'Trusted by over 4,000+ satisfied clients across Andhra Pradesh.',
      formTitle: 'Request a Free Quote'
    }
  },
  {
    id: 'b-hero-3',
    category: 'HERO',
    name: 'Hero 3',
    title: 'Atmospheric Video & KPI Counter Showcase',
    variant: 'Hero3',
    blockKey: 'hero-3',
    isPremium: true,
    description: 'Hero section with animated counters, review stats, and dynamic visual background.',
    defaultData: {
      headline: 'Empowering Businesses with Cutting-Edge Solutions',
      subheadline: 'From local presence to nationwide reach, we build the foundation for your ongoing success.'
    }
  },
  {
    id: 'b-hero-4',
    category: 'HERO',
    name: 'Hero 4',
    title: 'Minimalist Clean Typography Hero',
    variant: 'Hero4',
    blockKey: 'hero-4',
    isPremium: false,
    description: 'Large typography hero with clean whitespace, brand imagery, and social proof numbers.',
    defaultData: {
      headline: 'Simplicity meets uncompromised excellence',
      subheadline: 'Discover bespoke craftsmanship and customer-first support tailored to your journey.'
    }
  },
  {
    id: 'b-hero-5',
    category: 'HERO',
    name: 'Hero 5',
    title: 'Full-Width Action Hero with Video Popup',
    variant: 'Hero5',
    blockKey: 'hero-5',
    isPremium: false,
    description: 'Full-width visual banner with play button trigger for business promo videos.',
    defaultData: {
      headline: 'See How We Transform Daily Workflows',
      subheadline: 'Watch our 2-minute introductory video walkthrough.'
    }
  },

  // ABOUT US
  {
    id: 'b-about-1',
    category: 'ABOUT',
    name: 'About Us 1',
    title: 'Classic Brand Story with Verified Trust Badges',
    variant: 'AboutUs1',
    blockKey: 'about-1',
    isPremium: false,
    description: 'Dual-column layout: Founder journey and mission on left, office/team photos with milestone counters on right.',
    defaultData: {
      badge: 'About Our Company',
      title: 'Dedicated to Serving Our Local Community with Pride',
      description: 'With over a decade of dedicated expertise, we take immense pride in delivering top-tier solutions that elevate our customers and drive sustainable community impact.',
      stats: [
        { label: 'Years Active', value: '10+' },
        { label: 'Happy Clients', value: '5,000+' },
        { label: 'Rating', value: '4.9 ★' }
      ]
    }
  },
  {
    id: 'b-about-2',
    category: 'ABOUT',
    name: 'About Us 2',
    title: 'Modern Cards & Core Values Showcase',
    variant: 'AboutUs2',
    blockKey: 'about-2',
    isPremium: false,
    description: 'Clean modern grid highlighting core business pillars: Integrity, Quality, Innovation, and Customer Focus.',
    defaultData: {
      title: 'Why Our Clients Choose Us Every Day',
      description: 'We believe in transparency, speed, and continuous improvement.'
    }
  },
  {
    id: 'b-about-3',
    category: 'ABOUT',
    name: 'About Us 3',
    title: 'Timeline & Milestone Achievements',
    variant: 'AboutUs3',
    blockKey: 'about-3',
    isPremium: true,
    description: 'Vertical or horizontal timeline detailing founding milestones, expansion, and prestigious awards.',
    defaultData: {
      title: 'Our Journey of Growth & Innovation',
      description: 'From humble beginnings to an industry leader.'
    }
  },
  {
    id: 'b-about-4',
    category: 'ABOUT',
    name: 'About Us 4',
    title: 'Executive Team & Leadership Profiles',
    variant: 'AboutUs4',
    blockKey: 'about-4',
    isPremium: true,
    description: 'Showcase company founders, lead engineers, and department heads with social links.',
    defaultData: {
      title: 'Meet the Minds Behind Our Success'
    }
  },
  {
    id: 'b-about-5',
    category: 'ABOUT',
    name: 'About Us 5',
    title: 'Mission, Vision & Strategic Goals',
    variant: 'AboutUs5',
    blockKey: 'about-5',
    isPremium: false,
    description: 'Bold 3-column breakdown of Company Mission, Long-term Vision, and Core Culture values.',
    defaultData: {
      title: 'Our Vision for the Future'
    }
  },

  // SERVICES
  {
    id: 'b-services-1',
    category: 'SERVICES',
    name: 'Services 1',
    title: 'Icon Grid with Service Highlights & Pricing',
    variant: 'Services1',
    blockKey: 'services-1',
    isPremium: false,
    description: 'Responsive multi-column cards with icons, summary descriptions, and learn more anchors.',
    defaultData: {
      title: 'Comprehensive Services Tailored for You',
      subtitle: 'Explore our popular packages designed to meet your specific objectives.'
    }
  },
  {
    id: 'b-services-2',
    category: 'SERVICES',
    name: 'Services 2',
    title: 'Interactive Tabbed Service Explorer',
    variant: 'Services2',
    blockKey: 'services-2',
    isPremium: true,
    description: 'Category switcher tabs allowing visitors to drill into details without leaving the section.',
    defaultData: {
      title: 'Explore Our Specialized Offerings'
    }
  },
  {
    id: 'b-services-3',
    category: 'SERVICES',
    name: 'Services 3',
    title: 'Comparison & Featured Package Matrix',
    variant: 'Services3',
    blockKey: 'services-3',
    isPremium: true,
    description: 'Side-by-side service plans highlighting the Most Popular option with detailed feature checklists.',
    defaultData: {
      title: 'Flexible Plans for Every Budget'
    }
  }
];
