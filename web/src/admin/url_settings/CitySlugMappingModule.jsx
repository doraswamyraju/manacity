import React from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';

export default function CitySlugMappingModule({
  isDark,
  citySlugMapping,
  setCitySlugMapping
}) {
  const cardStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #cbd5e1',
    backgroundColor: isDark ? '#1f2937' : '#f8fafc',
    color: isDark ? '#fff' : '#0f172a',
    fontSize: '0.9rem',
    outline: 'none'
  };

  const handleCityChange = (index, field, value) => {
    const updated = [...citySlugMapping];
    updated[index][field] = value;
    setCitySlugMapping(updated);
  };

  const handleAddCity = () => {
    setCitySlugMapping([
      ...citySlugMapping,
      { cityId: `city-${Date.now()}`, name: 'New City', slug: 'new-city', active: true }
    ]);
  };

  const handleRemoveCity = (index) => {
    const updated = citySlugMapping.filter((_, i) => i !== index);
    setCitySlugMapping(updated);
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <MapPin size={20} color="#34d399" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            3. City Slug & Region Mappings
          </h3>
        </div>

        <button
          onClick={handleAddCity}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(52, 211, 153, 0.1)',
            color: '#34d399',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add City Slug
        </button>
      </div>

      <p style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#64748b', marginTop: 0, marginBottom: '1rem' }}>
        Manage URL slugs for cities where manacity.in aggregates local business listings.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {citySlugMapping.map((city, idx) => (
          <div
            key={city.cityId || idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.5fr 1fr 40px',
              gap: '0.85rem',
              alignItems: 'center',
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0'
            }}
          >
            <div>
              <input
                type="text"
                placeholder="City Display Name"
                value={city.name}
                onChange={(e) => handleCityChange(idx, 'name', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="URL Slug (e.g. tirupati)"
                value={city.slug}
                onChange={(e) => handleCityChange(idx, 'slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id={`city-active-${idx}`}
                checked={city.active}
                onChange={(e) => handleCityChange(idx, 'active', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor={`city-active-${idx}`} style={{ fontSize: '0.82rem', fontWeight: 600, color: isDark ? '#d1d5db' : '#334155', cursor: 'pointer' }}>
                {city.active ? 'Active' : 'Disabled'}
              </label>
            </div>

            <button
              onClick={() => handleRemoveCity(idx)}
              title="Remove City"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f87171',
                cursor: 'pointer',
                padding: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
