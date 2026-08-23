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
  MoreHorizontal
} from 'lucide-react';

export default function MobileHeader({ user, selectedCity = 'tirupati', onCityChange }) {
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
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      
      {/* Row 1: Brand & Top Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.85rem',
        borderBottom: '1px solid #f1f5f9'
      }}>
        {/* Left: Logo & City Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/logo-horizontal.png"
            alt="ManaCity Logo"
            onClick={() => navigate('/')}
            style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }}
          />

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            padding: '0.18rem 0.45rem',
            borderRadius: '14px'
          }}>
            <MapPin size={11} color="#2563eb" />
            <select
              value={selectedCity}
              onChange={handleCitySelect}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                outline: 'none',
                fontWeight: 800,
                fontSize: '0.72rem',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {cities.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#fff', color: '#0f172a' }}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Right: Saved, Bell & Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ cursor: 'pointer', color: '#475569' }} onClick={() => navigate('/dashboard')}>
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

      {/* Row 2: Full Width Mobile SearchBar */}
      <div style={{ padding: '0.5rem 0.85rem' }}>
        <SearchBar selectedCity={selectedCity} />
      </div>

      {/* Row 3: Horizontal Touch Category Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.4rem 0.85rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        borderTop: '1px solid #f1f5f9'
      }}>
        {topHeaderCategories.map((cat, i) => (
          <div
            key={i}
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <cat.icon size={13} color={cat.color} />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
