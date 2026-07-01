import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Clock, Plus, Trash2, ArrowLeft, Briefcase, Award, Flame, CheckCircle, Circle, Target, Globe, MessageSquare, Star, Send, Copy, Share2, Users, ChevronRight, UserPlus, Info } from 'lucide-react';

function Locations({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [error, setError] = useState('');

  // Selected location details view
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'website', 'reviews', 'crm'

  // Website Customizer States
  const [subdomain, setSubdomain] = useState('');
  const [themeColor, setThemeColor] = useState('#1976D2');
  const [heroImage, setHeroImage] = useState('');
  const [siteDesc, setSiteDesc] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');

  // Reviews States
  const [reviews, setReviews] = useState([]);
  const [replyTemplates, setReplyTemplates] = useState([]);
  const [reviewReplyText, setReviewReplyText] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});

  // CRM Leads States
  const [leads, setLeads] = useState([]);
  const [updatingLeadStatus, setUpdatingLeadStatus] = useState({});

  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [locName, setLocName] = useState('');
  const [locCategory, setLocCategory] = useState('Hotel');
  const [locAddress, setLocAddress] = useState('');
  const [locCity, setLocCity] = useState('');
  const [locCountry, setLocCountry] = useState('India');
  const [locPhone, setLocPhone] = useState('');
  
  // Operating Hours State
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
      const group = response.data.businessGroups?.[0];
      setLocations(group?.locations || []);
    } catch (err) {
      setError('Could not load locations.');
    } finally {
      setLoading(false);
    }
  };

  const loadLocationTasks = async (loc) => {
    setSelectedLoc(loc);
    setTasksLoading(true);
    setError('');
    setActiveTab('tasks');

    try {
      // 1. Fetch tasks
      const taskRes = await axios.get(`/api/task/${loc.id}`);
      setTaskData(taskRes.data);

      // 2. Fetch website settings
      const webRes = await axios.get(`/api/website/${loc.id}`);
      const website = webRes.data.website;
      if (website) {
        setSubdomain(website.subdomain);
        setThemeColor(website.config.themeColor || '#1976D2');
        setHeroImage(website.config.heroImage || '');
        setSiteDesc(website.pagesJson.description || '');
        setSiteUrl(`http://manacity.in/api/website/public/${website.subdomain}`);
      } else {
        setSubdomain(loc.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
        setThemeColor('#1976D2');
        setHeroImage('');
        setSiteDesc('');
        setSiteUrl('');
      }

      // 3. Fetch reviews
      const reviewRes = await axios.get(`/api/review/${loc.id}`);
      setReviews(reviewRes.data.reviews || []);
      setReplyTemplates(reviewRes.data.templates || []);

      // 4. Fetch CRM leads
      const crmRes = await axios.get(`/api/crm/${loc.id}`);
      setLeads(crmRes.data.customers || []);
    } catch (err) {
      setError('Failed to fetch location details.');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleUpdateLeadPipeline = async (leadId, newPipeline) => {
    setUpdatingLeadStatus(prev => ({ ...prev, [leadId]: true }));
    try {
      await axios.put(`/api/crm/${leadId}`, { pipeline: newPipeline });
      
      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(l => l.id === leadId ? { ...l, pipeline: newPipeline } : l)
      );
    } catch (err) {
      setError('Failed to update lead status.');
    } finally {
      setUpdatingLeadStatus(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const handlePostReply = async (reviewId) => {
    const replyText = reviewReplyText[reviewId];
    if (!replyText) return;

    setSubmittingReply(prev => ({ ...prev, [reviewId]: true }));
    try {
      await axios.post(`/api/review/reply/${reviewId}`, { replyText });
      
      setReviews(prevReviews => 
        prevReviews.map(r => r.id === reviewId ? { ...r, replyText, repliedAt: new Date() } : r)
      );
      setReviewReplyText(prev => ({ ...prev, [reviewId]: '' }));
    } catch (err) {
      setError('Failed to submit review response.');
    } finally {
      setSubmittingReply(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleApplyTemplate = (reviewId, templateText) => {
    setReviewReplyText(prev => ({
      ...prev,
      [reviewId]: templateText
    }));
  };

  const handleSaveWebsite = async (e) => {
    e.preventDefault();
    if (!subdomain) return;
    setPublishing(true);
    setError('');

    try {
      const payload = {
        locationId: selectedLoc.id,
        subdomain,
        template: selectedLoc.category.toLowerCase().includes('hotel') ? 'hotel' : 'tourism',
        config: { themeColor, heroImage },
        pagesJson: { title: selectedLoc.name, description: siteDesc }
      };

      const response = await axios.post('/api/website', payload);
      const website = response.data.website;
      setSiteUrl(`http://manacity.in/api/website/public/${website.subdomain}`);
      alert('Congratulations! Your website has been generated and published successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish website.');
    } finally {
      setPublishing(false);
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
      
      setLocName('');
      setLocAddress('');
      setLocCity('');
      setLocPhone('');
      setShowWizard(false);
      setWizardStep(1);
      
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

  const publicReviewUrl = selectedLoc ? `http://manacity.in/review/${selectedLoc.id}` : '';

  return (
    <div style={{ maxWidth: '980px', width: '100%', textAlign: 'left' }}>
      {selectedLoc ? (
        <button 
          onClick={() => { setSelectedLoc(null); setTaskData(null); fetchLocations(); }}
          style={backBtnStyle}
        >
          <ArrowLeft size={16} /> Back to Locations List
        </button>
      ) : (
        <button onClick={onBack} style={backBtnStyle}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      )}

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

      {/* GAMIFICATION & BUILDER DETAIL OVERLAY */}
      {selectedLoc && (
        <div>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                Manage Location: <span className="gradient-text">{selectedLoc.name}</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>Configure layouts, optimization tasks, and CRM leads</p>
            </div>

            {/* Sub-navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              {['tasks', 'website', 'reviews', 'crm'].map(tabName => (
                <button 
                  key={tabName}
                  onClick={() => setActiveTab(tabName)}
                  style={{
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: activeTab === tabName ? 'var(--accent-primary)' : 'transparent',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {tabName === 'crm' ? 'CRM Leads' : tabName}
                </button>
              ))}
            </div>
          </div>

          {tasksLoading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading details...</p>
          ) : taskData && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
              
              {/* Left Panel: Score and Levels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke="url(#greenGrad)" 
                        strokeWidth="10" 
                        strokeDasharray="314" 
                        strokeDashoffset={314 - (314 * taskData.score) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)" 
                      />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{taskData.score}%</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score</span>
                    </div>
                  </div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Profile Completeness</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fill in all location specs to maximize your ranking index.</p>
                </div>

                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={20} style={{ color: 'var(--accent-primary)' }} />
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Level {taskData.level}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{taskData.xp} / {taskData.nextLevelXp} XP</span>
                  </div>
                  
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{ width: `${(taskData.xp % 100)}%`, height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: 'var(--radius-full)' }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Flame size={18} style={{ color: 'var(--accent-warning)' }} />
                      <div>
                        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700 }}>{taskData.streak} Days</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Streak</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span title="Seed badge unlocked" style={{ fontSize: '1.25rem', opacity: taskData.level >= 1 ? 1 : 0.2 }}>🌱</span>
                      <span title="Branch badge unlocked" style={{ fontSize: '1.25rem', opacity: taskData.level >= 2 ? 1 : 0.2 }}>🌿</span>
                      <span title="City builder badge unlocked" style={{ fontSize: '1.25rem', opacity: taskData.level >= 3 ? 1 : 0.2 }}>🏙️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel Option 1: Tasks */}
              {activeTab === 'tasks' && (
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={18} style={{ color: 'var(--accent-secondary)' }} /> Profile Optimization Tasks
                  </h3>

                  {taskData.tasks.map(task => (
                    <div 
                      key={task.id} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: task.completed ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.01)',
                        border: task.completed ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid var(--border-color)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        {task.completed ? (
                          <CheckCircle size={20} style={{ color: 'var(--accent-success)', marginTop: '0.1rem' }} />
                        ) : (
                          <Circle size={20} style={{ color: 'var(--text-muted)', marginTop: '0.1rem' }} />
                        )}
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: task.completed ? 'var(--text-muted)' : '#fff', textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.title}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.description}</p>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: task.completed ? 'var(--text-muted)' : 'var(--accent-primary)' }}>
                        +{task.xpReward} XP
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Right Panel Option 2: Website Builder */}
              {activeTab === 'website' && (
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={18} style={{ color: 'var(--accent-primary)' }} /> Website Customizer
                  </h3>

                  {siteUrl && (
                    <div style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid var(--accent-success)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>YOUR LIVE WEBSITE IS ACTIVE</span>
                        <a href={siteUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-success)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {subdomain}.manacity.in <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSaveWebsite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Preferred Subdomain Name</label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="text"
                          value={subdomain}
                          onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                          placeholder="subdomain"
                          required
                          style={{ ...inputStyle, borderRight: 'none', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}
                        />
                        <span style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                          fontSize: '0.95rem',
                          color: 'var(--text-secondary)'
                        }}>.manacity.in</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Theme Accent Color</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input 
                            type="color" 
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                          />
                          <input 
                            type="text"
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Template Layout</label>
                        <select style={selectStyle} disabled>
                          <option>{selectedLoc.category} template</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hero Header Image Link</label>
                      <input 
                        type="url"
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Welcome Tagline / About Details</label>
                      <textarea 
                        value={siteDesc}
                        onChange={(e) => setSiteDesc(e.target.value)}
                        placeholder="Welcome to our branches. We offer high-quality services..."
                        rows="3"
                        style={{ ...inputStyle, resize: 'none' }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={publishing}
                      style={{ width: '100%', height: '42px', marginTop: '0.5rem' }}
                    >
                      {publishing ? 'Publishing Site...' : siteUrl ? 'Update Website Layout' : 'Generate & Host Site'}
                    </button>
                  </form>
                </div>
              )}

              {/* Right Panel Option 3: Reviews */}
              {activeTab === 'reviews' && (
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Share2 size={18} style={{ color: 'var(--accent-secondary)' }} /> Review Request Campaigns
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      Copy your public feedback portal URL to collect customer ratings:
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        readOnly 
                        value={publicReviewUrl} 
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <button 
                        className="btn btn-primary" 
                        onClick={() => { navigator.clipboard.writeText(publicReviewUrl); alert('Feedback link copied!'); }}
                        style={{ padding: '0.75rem 1rem' }}
                      >
                        <Copy size={16} />
                      </button>
                      <a 
                        href={`https://wa.me/?text=Hi!%20Could%20you%20please%20take%2030%20seconds%20to%20rate%20your%20experience%20with%20us?%20Click%20here:%20${encodeURIComponent(publicReviewUrl)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '0.75rem 1rem', textDecoration: 'none' }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} /> Customer Reviews ({reviews.length})
                    </h3>

                    {reviews.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No reviews posted yet. Share your portal link to gather ratings!</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {reviews.map(rev => (
                          <div key={rev.id} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div>
                                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{rev.authorName}</strong>
                                <span style={{
                                  fontSize: '0.7rem',
                                  marginLeft: '0.5rem',
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontWeight: 600,
                                  backgroundColor: rev.sentiment === 'positive' ? 'rgba(16,185,129,0.15)' : rev.sentiment === 'negative' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                  color: rev.sentiment === 'positive' ? 'var(--accent-success)' : rev.sentiment === 'negative' ? 'var(--accent-error)' : 'var(--accent-warning)'
                                }}>
                                  {rev.sentiment.toUpperCase()}
                                </span>
                              </div>
                              <div style={{ display: 'flex', color: '#f59e0b' }}>
                                {'★'.repeat(rev.rating)}
                              </div>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                              "{rev.comment || 'No text comment left.'}"
                            </p>

                            {rev.replyText ? (
                              <div style={{ marginLeft: '1rem', padding: '0.75rem', backgroundColor: 'rgba(25,118,210,0.04)', borderLeft: '3px solid var(--accent-primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                                <strong style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>Your Response:</strong>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>"{rev.replyText}"</p>
                              </div>
                            ) : (
                              <div style={{ marginTop: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Templates:</span>
                                  {replyTemplates.filter(t => t.ratingMatch === null || t.ratingMatch === rev.rating).map(temp => (
                                    <button 
                                      key={temp.id}
                                      onClick={() => handleApplyTemplate(rev.id, temp.content)}
                                      style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: 'rgba(25,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '4px',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {temp.title}
                                    </button>
                                  ))}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <input 
                                    type="text" 
                                    value={reviewReplyText[rev.id] || ''} 
                                    onChange={(e) => setReviewReplyText(prev => ({ ...prev, [rev.id]: e.target.value }))}
                                    placeholder="Type a response to this review..."
                                    style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem', flex: 1 }}
                                  />
                                  <button 
                                    className="btn btn-primary"
                                    disabled={submittingReply[rev.id]}
                                    onClick={() => handlePostReply(rev.id)}
                                    style={{ padding: '0.5rem 1rem' }}
                                  >
                                    <Send size={14} />
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Right Panel Option 4: CRM Leads Management */}
              {activeTab === 'crm' && (
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} style={{ color: 'var(--accent-success)' }} /> CRM Contacts & Pipeline
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Follow up on contact inquiries submitted directly from your generated websites.
                  </p>

                  {leads.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <UserPlus size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No client leads captured yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {leads.map(lead => (
                        <div key={lead.id} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div>
                              <strong style={{ color: '#fff', fontSize: '1rem', display: 'block' }}>{lead.name}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {lead.email} {lead.phone ? ` | ${lead.phone}` : ''}
                              </span>
                            </div>
                            
                            {/* Pipeline Status Dropdown selector */}
                            <select
                              value={lead.pipeline}
                              disabled={updatingLeadStatus[lead.id]}
                              onChange={(e) => handleUpdateLeadPipeline(lead.id, e.target.value)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.8rem',
                                borderRadius: '4px',
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: lead.pipeline === 'CONVERTED' ? 'var(--accent-success)' : lead.pipeline === 'LOST' ? 'var(--accent-error)' : '#fff',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              <option value="LEAD">Lead</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="CONVERTED">Converted (Client)</option>
                              <option value="LOST">Lost</option>
                            </select>
                          </div>

                          {lead.notes && (
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                              <Info size={14} style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }} />
                              <span>{lead.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* CORE LOCATIONS LIST */}
      {!selectedLoc && !showWizard && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>Business Locations</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your branches and view optimization rankings</p>
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
                    <button className="btn btn-secondary" onClick={() => loadLocationTasks(loc)}>
                      Tasks & Score
                    </button>
                    
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
      )}

      {/* LOCATION CREATION WIZARD */}
      {showWizard && (
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Step {wizardStep} of 3: {
              wizardStep === 1 ? 'Primary Information' : 
              wizardStep === 2 ? 'Contact Details' : 
              'Operating Hours'
            }</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Registration Wizard</span>
          </div>

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

const backBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  marginBottom: '1.5rem',
  fontSize: '0.95rem'
};

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
