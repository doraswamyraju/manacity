import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import {
  MapPin,
  Heart,
  Bell,
  User,
  Utensils,
  Cross,
  Home as HomeIcon,
  Plane,
  GraduationCap,
  Wrench,
  Scissors,
  Car,
  MoreHorizontal,
  PlusCircle
} from 'lucide-react';

export default function Header({ user, selectedCity = 'tirupati', onCityChange }) {
  const navigate = useNavigate();

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
    { name: 'Doctors', icon: Cross, color: '#0ea5e9' },
    { name: 'Real Estate', icon: HomeIcon, color: '#f43f5e' },
    { name: 'Travel', icon: Plane, color: '#3b82f6' },
    { name: 'Education', icon: GraduationCap, color: '#10b981' },
    { name: 'Repairs', icon: Wrench, color: '#f59e0b' },
    { name: 'Beauty', icon: Scissors, color: '#ec4899' },
    { name: 'Automotive', icon: Car, color: '#8b5cf6' },
    { name: 'More', icon: MoreHorizontal, color: '#64748b' }
  ];

  const handleCitySelect = (e) => {
    const newCity = e.target.value;
    if (onCityChange) {
      onCityChange(newCity);
    } else {
      navigate(`/${newCity}/service/digital-marketing`);
    }
  };

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      {/* CSS Responsive Styles */}
      <style>{`
        @keyframes searchGlowRotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes keywordSlideUp {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes searchIconPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(37,99,235,0.4)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 8px rgba(124,58,237,0.8)); }
        }

        .header-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.65rem 1.5rem;
          width: 100%;
        }

        .desktop-action-btn {
          display: flex;
          align-items: center;
        }

        @media (max-width: 768px) {
          .header-top-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.55rem;
            padding: 0.55rem 0.85rem;
          }

          .header-mobile-brand-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .header-mobile-logo {
            height: 38px !important;
          }

          .header-action-group {
            gap: 0.65rem !important;
          }

          .desktop-list-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Top Header Container */}
      <div className="header-top-row">
        
        {/* Brand Bar (Logo, City Selector & Right Actions on Mobile) */}
        <div className="header-mobile-brand-bar">
          
          {/* Left: Logo & City Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => navigate('/')}
              title="ManaCity Home - Discover. Connect. Get it done."
            >
              <img
                src="/logo-horizontal.png"
                alt="ManaCity Logo"
                className="header-mobile-logo"
                style={{ height: '48px', objectFit: 'contain' }}
              />
            </div>

            {/* Compact City Selector Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '0.2rem 0.5rem',
              borderRadius: '16px'
            }}>
              <MapPin size={12} color="#2563eb" />
              <select
                value={selectedCity}
                onChange={handleCitySelect}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0f172a',
                  outline: 'none',
                  fontWeight: 800,
                  fontSize: '0.74rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {cities.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#fff', color: '#0f172a' }}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="header-action-group" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            <button
              type="button"
              className="desktop-list-btn"
              onClick={() => navigate('/register')}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #2563eb',
                color: '#2563eb',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              List Your Business
            </button>

            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#475569' }} onClick={() => navigate('/dashboard')}>
              <Heart size={18} color="#ef4444" />
            </div>

            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Bell size={18} color="#475569" />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.58rem',
                fontWeight: 900,
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </span>
            </div>

            {user ? (
              <div
                onClick={() => navigate('/dashboard')}
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, cursor: 'pointer', overflow: 'hidden' }}
              >
                {user.avatar ? <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={16} />}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, borderRadius: '16px', cursor: 'pointer' }}>
                Login
              </button>
            )}
          </div>
        </div>

        {/* SearchBar Component (Full width on mobile, centered on desktop) */}
        <SearchBar selectedCity={selectedCity} />

      </div>

      {/* Sub-Header Horizontal Category Nav Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        padding: '0.45rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch'
      }}>
        {topHeaderCategories.map((cat, i) => (
          <div
            key={i}
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer',
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              flexShrink: 0
            }}
          >
            <cat.icon size={14} color={cat.color} />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
