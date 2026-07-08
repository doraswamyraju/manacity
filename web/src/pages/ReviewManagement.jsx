import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReviewManagement({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [timeline, setTimeline] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reviews, setReviews] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [qrs, setQrs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [landingPage, setLandingPage] = useState(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal / Form States
  const [showModal, setShowModal] = useState(null); // 'campaign', 'qr', 'customer', 'reply', 'crm'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Load user locations
    axios.get('/api/business')
      .then(res => {
        const groups = res.data.businessGroups || [];
        const locs = groups.flatMap(g => g.locations || []);
        setLocations(locs);
        if (locs.length > 0) {
          setSelectedLocation(locs[0]);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        setError('Failed to load business locations.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setLoading(true);
      setError('');
      setSuccess('');
      loadTabData();
    }
  }, [selectedLocation, activeTab, timeline, startDate, endDate, page, filterStatus]);

  const loadTabData = () => {
    const locId = selectedLocation.id;
    let promise;

    if (activeTab === 'dashboard') {
      promise = axios.get(`/api/reviews/analytics?locationId=${locId}&timeline=${timeline}&startDate=${startDate}&endDate=${endDate}`)
        .then(res => setAnalytics(res.data));
    } else if (activeTab === 'inbox') {
      promise = axios.get(`/api/reviews/inbox?locationId=${locId}&search=${searchQuery}&status=${filterStatus}&page=${page}&limit=10`)
        .then(res => {
          setReviews(res.data.data || []);
          setTotalPages(res.data.pagination?.totalPages || 1);
        });
    } else if (activeTab === 'campaigns') {
      promise = axios.get(`/api/reviews/campaigns?locationId=${locId}&search=${searchQuery}&page=${page}&limit=10`)
        .then(res => {
          setCampaigns(res.data.data || []);
          setTotalPages(res.data.pagination?.totalPages || 1);
        });
    } else if (activeTab === 'qrs') {
      promise = axios.get(`/api/reviews/qrs?locationId=${locId}&search=${searchQuery}&page=${page}&limit=10`)
        .then(res => {
          setQrs(res.data.data || []);
          setTotalPages(res.data.pagination?.totalPages || 1);
        });
    } else if (activeTab === 'customers') {
      promise = axios.get(`/api/reviews/customers?locationId=${locId}&search=${searchQuery}&page=${page}&limit=10`)
        .then(res => {
          setCustomers(res.data.data || []);
          setTotalPages(res.data.pagination?.totalPages || 1);
        });
    } else if (activeTab === 'landing') {
      promise = axios.get(`/api/reviews/landing-page/${locId}`)
        .then(res => setLandingPage(res.data.data));
    }

    promise
      .catch(err => setError('Failed to retrieve requested module information.'))
      .finally(() => setLoading(false));
  };

  // ----------------------------------------
  // Action Handlers
  // ----------------------------------------
  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingItem) {
        await axios.put(`/api/reviews/campaigns/${editingItem.id}`, formData);
        setSuccess('Campaign updated successfully.');
      } else {
        await axios.post('/api/reviews/campaigns', { ...formData, locationId: selectedLocation.id });
        setSuccess('Campaign created successfully.');
      }
      setShowModal(null);
      loadTabData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save campaign.');
    }
  };

  const handleSaveQR = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/reviews/qrs', { ...formData, locationId: selectedLocation.id });
      setSuccess('QR Code profile generated successfully.');
      setShowModal(null);
      loadTabData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save QR code.');
    }
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingItem) {
        await axios.put(`/api/reviews/customers/${editingItem.id}`, formData);
        setSuccess('Customer record updated.');
      } else {
        await axios.post('/api/reviews/customers', { ...formData, locationId: selectedLocation.id });
        setSuccess('New customer lead registered.');
      }
      setShowModal(null);
      loadTabData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save customer.');
    }
  };

  const handleTriggerRequest = async (customerId, campaignId, channel) => {
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/reviews/requests', { campaignId, customerId, channel });
      setSuccess('Review request dispatched to customer.');
      loadTabData();
    } catch (err) {
      setError('Failed to dispatch request.');
    }
  };

  const handleSaveLandingPage = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/reviews/landing-page', { ...landingPage, locationId: selectedLocation.id });
      setSuccess('Landing page preferences updated successfully.');
    } catch (err) {
      setError('Failed to save settings.');
    }
  };

  const handleUpdateCRM = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/reviews/inbox/${editingItem.id}`, formData);
      setSuccess('CRM metadata updated.');
      setShowModal(null);
      loadTabData();
    } catch (err) {
      setError('Failed to update CRM parameters.');
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/review/reply/${editingItem.id}`, { replyText: formData.replyText });
      setSuccess('Owner reply updated successfully.');
      setShowModal(null);
      loadTabData();
    } catch (err) {
      setError('Failed to post reply.');
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'campaign') await axios.delete(`/api/reviews/campaigns/${id}`);
      if (type === 'customer') await axios.delete(`/api/reviews/customers/${id}`);
      if (type === 'qr') await axios.delete(`/api/reviews/qrs/${id}`);
      setSuccess('Item deleted successfully.');
      loadTabData();
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  // Utility to copy public links
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header / Switcher */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Review Management</h2>
          {locations.length > 1 && (
            <select 
              value={selectedLocation?.id || ''} 
              onChange={(e) => setSelectedLocation(locations.find(l => l.id === e.target.value))}
              style={selectStyle}
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          )}
          {locations.length === 1 && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>({selectedLocation?.name})</span>
          )}
        </div>
        <button className="btn btn-secondary" onClick={onBack}>Exit Console</button>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { id: 'dashboard', label: 'Dashboard & Charts' },
          { id: 'inbox', label: 'CRM Inbox' },
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'qrs', label: 'QR Generator' },
          { id: 'landing', label: 'Landing Page Settings' },
          { id: 'customers', label: 'Customers CRM' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => { setActiveTab(t.id); setPage(1); setError(''); setSuccess(''); }}
            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>{error}</div>}
      {success && <div style={{ color: '#4caf50', fontSize: '0.9rem' }}>{success}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <h3>Fetching module information...</h3>
        </div>
      ) : (
        <>
          {/* ========================================================= */}
          {/* TAB: DASHBOARD */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && analytics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Date Filters Row */}
              <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Time Filter:</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setStartDate(today); setEndDate(today);
                  }}>Today</button>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => {
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    setStartDate(yesterday); setEndDate(yesterday);
                  }}>Yesterday</button>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => {
                    const start = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
                    const end = new Date().toISOString().split('T')[0];
                    setStartDate(start); setEndDate(end);
                  }}>7 Days</button>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => {
                    const start = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
                    const end = new Date().toISOString().split('T')[0];
                    setStartDate(start); setEndDate(end);
                  }}>30 Days</button>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => {
                    setStartDate(''); setEndDate('');
                  }}>Clear Filters</button>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
                  <span style={{ fontSize: '0.9rem' }}>to</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* KPIs Widgets Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={widgetLabelStyle}>Total Reviews</div>
                  <div style={widgetValStyle}>{analytics.summary.totalReviews}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Google: {analytics.summary.googleReviews} | Internal: {analytics.summary.internalReviews}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={widgetLabelStyle}>Average Rating</div>
                  <div style={widgetValStyle}>{analytics.summary.averageRating} ★</div>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                    {'★'.repeat(Math.round(analytics.summary.averageRating))}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={widgetLabelStyle}>Total requests</div>
                  <div style={widgetValStyle}>
                    {analytics.summary.requestsSent + analytics.summary.requestsOpened + analytics.summary.reviewsSubmitted}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Sent: {analytics.summary.requestsSent} | Open: {analytics.summary.requestsOpened}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={widgetLabelStyle}>QR Scans</div>
                  <div style={widgetValStyle}>{analytics.summary.totalQrScans}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Active QRs: {analytics.summary.activeQrs}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={widgetLabelStyle}>Conversion CTR</div>
                  <div style={widgetValStyle}>{analytics.summary.conversionRate}%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Active Campaign: {analytics.summary.activeCampaigns}
                  </div>
                </div>
              </div>

              {/* Visual Performance Charts (Row 1) */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', width: '100%' }}>
                
                {/* Growth and Trends Line/Bar Chart */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Review Growth Cumulative Trend</h3>
                    <select value={timeline} onChange={(e) => setTimeline(e.target.value)} style={selectStyle}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  {analytics.timeline && analytics.timeline.length > 0 ? (
                    <svg viewBox="0 0 800 200" style={{ width: '100%', height: 'auto', background: 'rgba(255,255,255,0.01)', borderRadius: '4px', padding: '10px' }}>
                      {/* Grid Lines */}
                      <line x1="50" y1="30" x2="750" y2="30" stroke="rgba(255,255,255,0.05)" />
                      <line x1="50" y1="90" x2="750" y2="90" stroke="rgba(255,255,255,0.05)" />
                      <line x1="50" y1="150" x2="750" y2="150" stroke="rgba(255,255,255,0.05)" />

                      {/* Cumulative trend line */}
                      {(() => {
                        const maxVal = Math.max(...analytics.timeline.map(d => d.cumulativeCount), 1);
                        const points = analytics.timeline.map((data, idx) => {
                          const x = 50 + (idx * (700 / Math.max(1, analytics.timeline.length - 1)));
                          const y = 150 - (data.cumulativeCount / maxVal) * 120;
                          return `${x},${y}`;
                        }).join(' ');

                        return (
                          <>
                            <polyline fill="none" stroke="var(--accent-secondary)" strokeWidth="3" points={points} />
                            {analytics.timeline.map((data, idx) => {
                              const x = 50 + (idx * (700 / Math.max(1, analytics.timeline.length - 1)));
                              const y = 150 - (data.cumulativeCount / maxVal) * 120;
                              return (
                                <g key={idx} cursor="pointer" onClick={() => { setActiveTab('inbox'); setFilterStatus(''); }}>
                                  <circle cx={x} cy={y} r="4" fill="#fff" stroke="var(--accent-secondary)" strokeWidth="2" />
                                  <text x={x} y="175" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">{data.bucket}</text>
                                  <text x={x} y={y - 8} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">{data.cumulativeCount}</text>
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>No growth records found for this time window.</div>
                  )}
                </div>

                {/* Rating Distribution Breakdown */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Rating Scores</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = analytics.ratingDistribution[stars] || 0;
                      const pct = analytics.summary.totalReviews > 0 ? (count / analytics.summary.totalReviews) * 100 : 0;
                      return (
                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <span style={{ width: '45px', textAlign: 'right' }}>{stars} ★</span>
                          <div style={{ flex: 1, height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '4px' }} />
                          </div>
                          <span style={{ width: '30px', opacity: 0.7 }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Data Lists Row (Top QRs / Top Campaigns) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
                
                {/* Top QR Codes */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0' }}>Top Performing QR Stands</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {analytics.topQrs.map((qr, idx) => (
                      <div key={idx} onClick={() => setActiveTab('qrs')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{qr.name}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Class: {qr.type}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{qr.scanCounter} Scans</div>
                        </div>
                      </div>
                    ))}
                    {analytics.topQrs.length === 0 && <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>No scans tracked yet.</div>}
                  </div>
                </div>

                {/* Top Campaigns */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0' }}>Top Campaigns CTR</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {analytics.topCampaigns.map((camp, idx) => (
                      <div key={idx} onClick={() => setActiveTab('campaigns')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{camp.name}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Sent: {camp.totalSent} | Conv: {camp.totalCompleted}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#4caf50' }}>{camp.conversionRate}% CTR</div>
                        </div>
                      </div>
                    ))}
                    {analytics.topCampaigns.length === 0 && <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>No campaigns registered.</div>}
                  </div>
                </div>

              </div>

              {/* scheduled reports & CSV export Row */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>Daily/Weekly Reports</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
                    Receive automated summary email briefings at: <strong>{analytics.scheduledReportsConfig?.recipients?.join(', ') || 'user@example.com'}</strong>
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={() => {
                  // Client-side CSV generation
                  const headers = 'Bucket,Reviews Count,Cumulative Growth,Average Rating\n';
                  const rows = (analytics.timeline || []).map(t => `${t.bucket},${t.reviewsCount},${t.cumulativeCount},${t.averageRating}`).join('\n');
                  const blob = new Blob([headers + rows], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.setAttribute('href', url);
                  a.setAttribute('download', 'manacity-reviews-report.csv');
                  a.click();
                }}>
                  Export Report (CSV)
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CRM INBOX */}
          {/* ========================================================= */}
          {activeTab === 'inbox' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Search reviews..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  style={{ ...inputStyle, flex: 1 }}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
                  <option value="">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="OPEN">Open</option>
                  <option value="REPLIED">Replied</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <button className="btn btn-primary" onClick={loadTabData}>Search</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(rev => (
                  <div key={rev.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {rev.reviewerName || rev.authorName}
                          <span style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--accent-secondary)' }}>
                            {rev.source}
                          </span>
                        </h4>
                        <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>{'★'.repeat(rev.rating)}</div>
                        <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>{rev.reviewText || rev.comment}</p>
                        
                        {rev.ownerReply && (
                          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--accent-secondary)', borderRadius: '4px', marginBottom: '1rem' }}>
                            <strong style={{ fontSize: '0.85rem' }}>Your Reply:</strong>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.85 }}>{rev.ownerReply || rev.replyText}</p>
                          </div>
                        )}

                        {/* CRM Metadata Badge tags */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Status: <strong>{rev.status}</strong></span>
                          <span style={{ color: 'var(--text-secondary)' }}>Priority: <strong>{rev.priority}</strong></span>
                          {rev.assignedTo && <span style={{ color: 'var(--text-secondary)' }}>Assigned to: <strong>{rev.assignedTo}</strong></span>}
                          {rev.tags && rev.tags.map((t, idx) => (
                            <span key={idx} style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>#{t}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => { setEditingItem(rev); setFormData({ status: rev.status, priority: rev.priority, assignedTo: rev.assignedTo || '', internalNotes: rev.internalNotes || '', tags: rev.tags ? rev.tags.join(', ') : '' }); setShowModal('crm'); }}>
                          Manage CRM
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => { setEditingItem(rev); setFormData({ replyText: rev.ownerReply || rev.replyText || '' }); setShowModal('reply'); }}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CAMPAIGNS */}
          {/* ========================================================= */}
          {activeTab === 'campaigns' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search campaigns..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  style={{ ...inputStyle, width: '300px' }}
                />
                <button className="btn btn-primary" onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', isActive: true }); setShowModal('campaign'); }}>
                  + Create Campaign
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {campaigns.map(camp => (
                  <div key={camp.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{camp.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>{camp.description || 'No description provided.'}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      <div>Total Sent: <strong>{camp.totalSent}</strong></div>
                      <div>Total Completed: <strong>{camp.totalCompleted}</strong></div>
                      <div>Conv. Rate: <strong>{camp.conversionRate}%</strong></div>
                      <div>Avg. Rating: <strong>{camp.averageRating} ★</strong></div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.8rem' }} onClick={() => { setEditingItem(camp); setFormData({ name: camp.name, description: camp.description, isActive: camp.isActive }); setShowModal('campaign'); }}>Edit</button>
                      <button className="btn btn-secondary" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.8rem', color: 'var(--accent-error)' }} onClick={() => handleDeleteItem('campaign', camp.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: QR CODES */}
          {/* ========================================================= */}
          {activeTab === 'qrs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search QRs..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  style={{ ...inputStyle, width: '300px' }}
                />
                <button className="btn btn-primary" onClick={() => { setFormData({ name: '', type: 'COUNTER', qrTypeClass: 'STATIC', campaignId: '' }); setShowModal('qr'); }}>
                  + Generate QR Code
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {qrs.map(qr => {
                  const scanUrl = `${window.location.origin}/r/${qr.uniqueQrId}`;
                  return (
                    <div key={qr.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textLeft: 'center' }}>
                      <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px' }}>
                        {qr.qrImage ? (
                          <img src={qr.qrImage} alt="QR Code" style={{ width: '120px', height: '120px', display: 'block' }} />
                        ) : (
                          <div style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee', color: '#333', fontSize: '0.75rem', fontWeight: 600 }}>
                            Generating...
                          </div>
                        )}
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{qr.name}</h4>
                        <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--accent-secondary)' }}>
                          {qr.type} ({qr.qrTypeClass})
                        </span>
                      </div>

                      <div style={{ width: '100%', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                        <div>Scan Count: <strong>{qr.scanCounter}</strong></div>
                        {qr.lastScan ? (
                          <div>Last Scan: <strong>{new Date(qr.lastScan).toLocaleDateString()}</strong></div>
                        ) : (
                          <div>Last Scan: <strong>Never</strong></div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem' }} onClick={() => copyToClipboard(scanUrl)}>Copy Link</button>
                        <a href={`/print-review-qr?qrId=${qr.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', textAlign: 'center', textDecoration: 'none', lineHeight: 'normal', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Print Poster
                        </a>
                      </div>
                      <button className="btn btn-secondary" style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-error)' }} onClick={() => handleDeleteItem('qr', qr.id)}>Delete QR</button>
                    </div>
                  );
                })}
              </div>
              {renderPagination()}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: LANDING PAGE SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'landing' && landingPage && (
            <form onSubmit={handleSaveLandingPage} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3>Configure Review Landing Page</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label>Branding Logo URL</label>
                  <input type="text" value={landingPage.logoUrl || ''} onChange={(e) => setLandingPage({ ...landingPage, logoUrl: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label>Rating Redirect Threshold</label>
                  <select value={landingPage.ratingThreshold} onChange={(e) => setLandingPage({ ...landingPage, ratingThreshold: Number(e.target.value) })} style={inputStyle}>
                    <option value="5">5 Stars only</option>
                    <option value="4">4 Stars or above</option>
                    <option value="3">3 Stars or above</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label>Welcome Question / Message</label>
                <input type="text" value={landingPage.welcomeMessage} onChange={(e) => setLandingPage({ ...landingPage, welcomeMessage: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label>Google Business Review URL</label>
                  <input type="text" value={landingPage.googleReviewUrl || ''} onChange={(e) => setLandingPage({ ...landingPage, googleReviewUrl: e.target.value })} placeholder="https://g.page/r/..." style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label>Facebook Review URL</label>
                  <input type="text" value={landingPage.facebookReviewUrl || ''} onChange={(e) => setLandingPage({ ...landingPage, facebookReviewUrl: e.target.value })} placeholder="https://facebook.com/..." style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label>Thank You message</label>
                <input type="text" value={landingPage.thankYouMessage} onChange={(e) => setLandingPage({ ...landingPage, thankYouMessage: e.target.value })} style={inputStyle} />
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '200px' }}>
                Save Settings
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB: CUSTOMERS */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search contacts..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  style={{ ...inputStyle, width: '300px' }}
                />
                <button className="btn btn-primary" onClick={() => { setEditingItem(null); setFormData({ name: '', email: '', phone: '', notes: '' }); setShowModal('customer'); }}>
                  + Add Contact
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {customers.map(c => (
                  <div key={c.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{c.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Email: {c.email || 'N/A'}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Phone: {c.phone || 'N/A'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.8rem' }} onClick={() => { setEditingItem(c); setFormData({ name: c.name, email: c.email || '', phone: c.phone || '', notes: c.notes || '' }); setShowModal('customer'); }}>Edit</button>
                      <button className="btn btn-secondary" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.8rem', color: 'var(--accent-error)' }} onClick={() => handleDeleteItem('customer', c.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            
            {showModal === 'campaign' && (
              <form onSubmit={handleSaveCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>{editingItem ? 'Edit Campaign' : 'Create Campaign'}</h3>
                <input type="text" placeholder="Campaign Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
                <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={inputStyle} rows="3" />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" type="submit">Save</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}

            {showModal === 'qr' && (
              <form onSubmit={handleSaveQR} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Generate QR Code</h3>
                <input type="text" placeholder="QR Stand / Table Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
                <select value={formData.type || 'COUNTER'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={inputStyle}>
                  <option value="COUNTER">Counter Standee</option>
                  <option value="TABLE">Table Standee</option>
                  <option value="INVOICE">Invoice Header</option>
                  <option value="DIGITAL">Digital Link</option>
                </select>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" type="submit">Generate</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}

            {showModal === 'customer' && (
              <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>{editingItem ? 'Edit Contact' : 'Register Contact'}</h3>
                <input type="text" placeholder="Full Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
                <input type="email" placeholder="Email (optional)" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                <input type="text" placeholder="Phone (optional)" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} />
                <textarea placeholder="Notes" value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} style={inputStyle} rows="3" />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" type="submit">Save</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}

            {showModal === 'crm' && (
              <form onSubmit={handleUpdateCRM} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Manage CRM Review Parameters</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label>Status</label>
                  <select value={formData.status || 'NEW'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                    <option value="NEW">New</option>
                    <option value="OPEN">Open</option>
                    <option value="REPLIED">Replied</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label>Priority</label>
                  <select value={formData.priority || 'MEDIUM'} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} style={inputStyle}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <input type="text" placeholder="Assigned Team Member" value={formData.assignedTo || ''} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} style={inputStyle} />
                <textarea placeholder="Internal Notes" value={formData.internalNotes || ''} onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })} style={inputStyle} rows="3" />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" type="submit">Save CRM Specs</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}

            {showModal === 'reply' && (
              <form onSubmit={handlePostReply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Post Review Reply</h3>
                <textarea placeholder="Write owner reply..." value={formData.replyText || ''} onChange={(e) => setFormData({ ...formData, replyText: e.target.value })} style={inputStyle} rows="5" required />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" type="submit">Submit Reply</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );

  function renderPagination() {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Prev</button>
        <span style={{ display: 'flex', alignItems: 'center', px: '0.5rem' }}>Page {page} of {totalPages}</span>
        <button className="btn btn-secondary" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
      </div>
    );
  }
}

const widgetLabelStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  marginBottom: '0.35rem'
};

const widgetValStyle = {
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#fff'
};

const selectStyle = {
  padding: '0.5rem 0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer'
};

const inputStyle = {
  padding: '0.65rem 0.85rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  boxSizing: 'border-box'
};
