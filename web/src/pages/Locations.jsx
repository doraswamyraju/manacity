import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Clock, Plus, Trash2, ArrowLeft, Briefcase, Award } from 'lucide-react';

function Locations({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [error, setError] = useState('');

  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [locName, setLocName] = useState('');
  const [locCategory, setLocCategory] = useState('Hotel');
  const [locAddress, setLocAddress] = useState('');
  const [locCity, setLocCity] = useState('');
  const [locCountry, setLocCountry] = useState('India');
  const [locPhone, setLocPhone] = useState('');
  
  // Weekly Operating Hours State
  const [hours, setHours] = useState({
    Monday: { open: '09:00', close: '18:00', active: true },
    Tuesday: { open: '09:00', close: '18:00', active: true },
    Wednesday: { open: '09:00', close: '18:00', active: true },
    Thursday: { open: '09:00', close: '18:00', active: true },
    Friday: { open: '09:00', close: '18:00', active: true },
    Saturday: { open: '10:00', close: '16:00', active: false },
    Sunday: { open: '10:00', close: '16:00', active: false }
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/business');
      // Extract locations array from first business group
      const group = response.data.businessGroups?.[0];
      setLocations(group?.locations || []);
    } catch (err) {
      setError('Could not load locations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async () => {
    setError('');
    try {
      const formattedHours = {};
      Object.keys(hours).forEach(day => {
        if (hours[day].active) {
          formattedHours[day] = `${hours[day].open}-${hours[day].close}`;
        } else {
          formattedHours[day] = 'Closed';
        }
      });

      const payload = {
        name: locName,
        category: locCategory,
        address: locAddress,
        city: locCity,
        country: locCountry,
        phone: locPhone,
        hours: formattedHours
      };

      await axios.post('/api/business', payload);
      
      // Reset Wizard
      setLocName('');
      setLocAddress('');
      setLocCity('');
      setLocPhone('');
      setShowWizard(false);
      setWizardStep(1);
      
      // Refresh list
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register location.');
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Are you sure you want to remove this location profile?')) return;
    try {
      await axios.delete(`/api/business/${id}`);
      fetchLocations();
    } catch (err) {
      setError('Failed to delete location.');
    }
  };

  const handleHourToggle = (day) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active }
    }));
  };

  const handleTimeChange = (day, type, value) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }));
  };

  return (
    <div style={{ maxWidth: '800px', width: '100%', textAlign: 'left' }}>
      <button 
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '0.95rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--accent-error)',
          color: 'var(--accent-error)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {!showWizard ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>Business Locations</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your corporate branches and physical outlets</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
              <Plus size={18} /> Add Location
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading locations...</p>
          ) : locations.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Locations Found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Get started by adding your first business location branch.</p>
              <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
                Add First Location
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {locations.map(loc => (
                <div key={loc.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{loc.name}</h3>
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(25, 118, 210, 0.15)',
                        color: 'var(--accent-primary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600
                      }}>
                        {loc.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={14} /> {loc.address ? `${loc.address}, ${loc.city}` : 'No Address Registered'}
                      </span>
                      {loc.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Phone size={14} /> {loc.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Gamified Stats Preview */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-success)', fontWeight: 600, fontSize: '0.9rem' }}>
                        <Award size={16} /> Level {loc.level}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{loc.xp} XP</span>
                    </div>

                    <button 
                      onClick={() => handleDeleteLocation(loc.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-error)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {/* Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Step {wizardStep} of 3: {
              wizardStep === 1 ? 'Primary Information' : 
              wizardStep === 2 ? 'Contact Details' : 
              'Operating Hours'
            }</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Registration Wizard</span>
          </div>

          {/* STEP 1: Basic Info */}
          {wizardStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Location / Branch Name</label>
                <input 
                  type="text" 
                  value={locName} 
                  onChange={(e) => setLocName(e.target.value)} 
                  placeholder="e.g. ManaCity Headquarters" 
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Business Category</label>
                <select 
                  value={locCategory} 
                  onChange={(e) => setLocCategory(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="Hotel">Hotel / Homestay</option>
                  <option value="Restaurant">Restaurant / Cafe</option>
                  <option value="Travel Agency">Travel Agency / Tours</option>
                  <option value="Retail">Retail Store</option>
                  <option value="Services">Professional Services</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowWizard(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setWizardStep(2)} disabled={!locName}>Next Step</button>
              </div>
            </div>
          )}

          {/* STEP 2: Address & Phone */}
          {wizardStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Street Address</label>
                <input 
                  type="text" 
                  value={locAddress} 
                  onChange={(e) => setLocAddress(e.target.value)} 
                  placeholder="e.g. 123 Business Park, Sector 4" 
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>City</label>
                  <input 
                    type="text" 
                    value={locCity} 
                    onChange={(e) => setLocCity(e.target.value)} 
                    placeholder="e.g. Tirupati" 
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Country</label>
                  <input 
                    type="text" 
                    value={locCountry} 
                    onChange={(e) => setLocCountry(e.target.value)} 
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Contact Phone Number</label>
                <input 
                  type="text" 
                  value={locPhone} 
                  onChange={(e) => setLocPhone(e.target.value)} 
                  placeholder="e.g. +91 98765 43210" 
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setWizardStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => setWizardStep(3)}>Next Step</button>
              </div>
            </div>
          )}

          {/* STEP 3: Weekly Hours Scheduler */}
          {wizardStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Define working days and office hours for this location:</p>
              
              {Object.keys(hours).map(day => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '120px' }}>
                    <input 
                      type="checkbox" 
                      checked={hours[day].active} 
                      onChange={() => handleHourToggle(day)} 
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 500, color: hours[day].active ? '#fff' : 'var(--text-muted)' }}>{day}</span>
                  </div>

                  {hours[day].active ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="time" 
                        value={hours[day].open} 
                        onChange={(e) => handleTimeChange(day, 'open', e.target.value)} 
                        style={timeInputStyle}
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>to</span>
                      <input 
                        type="time" 
                        value={hours[day].close} 
                        onChange={(e) => handleTimeChange(day, 'close', e.target.value)} 
                        style={timeInputStyle}
                      />
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Closed</span>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-secondary" onClick={() => setWizardStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={handleCreateLocation}>Complete Registration</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  width: '100%',
  boxSizing: 'border-box'
};

const selectStyle = {
  ...inputStyle,
  colorScheme: 'dark',
  cursor: 'pointer'
};

const timeInputStyle = {
  padding: '0.4rem 0.6rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer'
};

export default Locations;
