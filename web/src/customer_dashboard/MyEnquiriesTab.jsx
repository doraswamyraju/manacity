import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, ShieldAlert, Building2, Phone, Mail, Bell, ArrowRight, Zap, AlertCircle, RefreshCw, Star } from 'lucide-react';

export default function MyEnquiriesTab({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const innerCardBg = isDark ? '#0f172a' : '#f8fafc';

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock initial customer quote enquiries with 6-stage pipeline states
  useEffect(() => {
    const mockLeads = [
      {
        id: 'lead-1',
        businessName: 'Rajugari Ventures - A Digital Marketing Agency in Tirupati',
        category: 'Digital Marketing',
        serviceRequested: 'SEO & Google Business Profile Optimization',
        status: 'QUOTE_SENT',
        quoteAmount: 12500,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        businessPhone: '+91 79979 91101',
        businessEmail: 'contact@rajugariventures.com',
        notifyChannel: 'Gmail & Mobile Push'
      },
      {
        id: 'lead-2',
        businessName: 'Sri Venkateswara Premium Rice Mill',
        category: 'Rice Mill',
        serviceRequested: 'Sona Masuri 25kg Bag Bulk Quote',
        status: 'NOTIFIED',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        businessPhone: '+91 91234 56789',
        businessEmail: 'sales@svricemill.com',
        notifyChannel: 'Gmail & Mobile Push'
      },
      {
        id: 'lead-3',
        businessName: 'Apex CA & Tax Advisory Services',
        category: 'Auditor / CA / Tax Consultant',
        serviceRequested: 'GST Return & Annual Tax Audit',
        status: 'TIMED_OUT',
        createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        businessPhone: '+91 98765 00000',
        notifyChannel: 'Gmail & Mobile Push'
      }
    ];

    setLeads(mockLeads);
    setLoading(false);
  }, []);

  const calculateHoursLeft = (createdAt) => {
    const passed = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    const left = Math.max(0, 24 - passed);
    return Math.round(left);
  };

  const getStageBadge = (status, hoursLeft) => {
    switch (status) {
      case 'SUBMITTED':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>1. Submitted</span>;
      case 'NOTIFIED':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>2. Business Notified (Push & Gmail)</span>;
      case 'CONTACTED':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>3. In Contact</span>;
      case 'QUOTE_SENT':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>4. Quote Received</span>;
      case 'CONVERTED':
      case 'CLAIMED_AND_FULFILLED':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>5. Deal Converted</span>;
      case 'TIMED_OUT':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>6. SLA Timed Out</span>;
      default:
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' }}>Pending</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: cardBg,
        border: cardBorder,
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={22} color="#38bdf8" /> My Enquiries & SLA Status Console
          </h2>
          <p style={{ color: textMuted, fontSize: '0.88rem', margin: '0.35rem 0 0 0' }}>
            Real-time enquiry progress tracked via <strong>Gmail & Mobile Push Notifications</strong> with 24-Hour SLA guarantee.
          </p>
        </div>

        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          ● Live Mobile Push & Gmail Sync
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: textMuted }}>Loading enquiries...</div>
      ) : leads.length === 0 ? (
        <div style={{
          backgroundColor: cardBg,
          border: cardBorder,
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Clock size={40} color="#38bdf8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: textMain }}>No active enquiries yet</h3>
          <p style={{ color: textMuted, fontSize: '0.9rem' }}>
            Search for local businesses on ManaCity.in and click "Enquire" or "Get Quote".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {leads.map((lead) => {
            const hoursLeft = calculateHoursLeft(lead.createdAt);
            const isFulfilled = lead.status === 'CONVERTED' || lead.status === 'CLAIMED_AND_FULFILLED';
            const isTimedOut = lead.status === 'TIMED_OUT' || (!isFulfilled && hoursLeft === 0);

            return (
              <div
                key={lead.id}
                style={{
                  backgroundColor: cardBg,
                  border: isTimedOut ? '1px solid rgba(239, 68, 68, 0.3)' : cardBorder,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.04)'
                }}
              >
                {/* Top Row: Business Name & Stage Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: '12px', color: '#38bdf8' }}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: textMain, margin: 0 }}>
                        {lead.businessName}
                      </h4>
                      <span style={{ fontSize: '0.82rem', color: textMuted, marginTop: '3px', display: 'block' }}>
                        Category: <strong>{lead.category || 'Local Service'}</strong> • Service: <em>"{lead.serviceRequested}"</em>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    {getStageBadge(lead.status, hoursLeft)}

                    {!isFulfilled && !isTimedOut && (
                      <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {hoursLeft} Hours SLA Remaining
                      </span>
                    )}
                  </div>
                </div>

                {/* Mid Row: 6-Stage Progress Indicator Bar */}
                <div style={{ backgroundColor: innerCardBg, borderRadius: '12px', padding: '1rem', border: cardBorder }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: textMuted }}>
                    <span>Stage Tracker:</span>
                    <span style={{ color: '#38bdf8' }}>Dispatched via Gmail & Mobile Push</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                    {['SUBMITTED', 'NOTIFIED', 'CONTACTED', 'QUOTE_SENT', 'CONVERTED'].map((stg, sIdx) => {
                      const stagesArr = ['SUBMITTED', 'NOTIFIED', 'CONTACTED', 'QUOTE_SENT', 'CONVERTED'];
                      const currentIdx = stagesArr.indexOf(lead.status);
                      const isPassed = isTimedOut ? false : sIdx <= currentIdx;

                      return (
                        <div
                          key={stg}
                          style={{
                            height: '6px',
                            borderRadius: '4px',
                            backgroundColor: isPassed ? '#10b981' : (isTimedOut ? '#ef4444' : (isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1')),
                            transition: 'all 0.3s ease'
                          }}
                          title={stg}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Quote Details if Available */}
                {lead.quoteAmount && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: textMuted, display: 'block' }}>Official Quotation Price Received:</span>
                      <strong style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 900 }}>₹{lead.quoteAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}>
                      Accept & Book Service
                    </button>
                  </div>
                )}

                {/* Cross-Vendor Recommendation Banner if SLA Timed Out or Pending */}
                {(isTimedOut || lead.status === 'NOTIFIED') && (
                  <div style={{
                    backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: isDark ? '#38bdf8' : '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Zap size={16} /> {isTimedOut ? 'SLA Timed Out — Get Immediate Alternate Quotes!' : 'Compare Quotes from 2 Other Top-Rated Businesses'}
                        </strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: textMuted }}>
                          Don't wait! Request quotes from other verified 4.8★ providers in Tirupati who respond within 15 mins via Gmail & Push notifications.
                        </p>
                      </div>

                      <button style={{
                        backgroundColor: '#0284c7',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        1-Click Enquire All Top Providers <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Action Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: cardBorder, paddingTop: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={14} color="#38bdf8" /> Dispatched to business via Gmail & App Push • Submitted: {new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {lead.businessPhone && (
                      <a
                        href={`tel:${lead.businessPhone}`}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Phone size={13} /> Call Business Direct
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
