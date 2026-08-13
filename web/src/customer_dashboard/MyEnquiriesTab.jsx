import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, ShieldAlert, Building2, Phone, MessageSquare, AlertCircle } from 'lucide-react';

export default function MyEnquiriesTab({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production/mock fetch customer's submitted lead enquiries
    const mockLeads = [
      {
        id: 'lead-1',
        businessName: 'Rajugari Ventures - A Digital Marketing Agency in Tirupati',
        serviceRequested: 'SEO & Google Business Profile Optimization',
        status: 'NOTIFIED',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        businessPhone: '+91 079979 91101'
      },
      {
        id: 'lead-2',
        businessName: 'Sri Venkateswara Premium Rice Mill',
        serviceRequested: 'Sona Masuri 25kg Bag Price Quote',
        status: 'CLAIMED_AND_FULFILLED',
        createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        businessPhone: '+91 91234 56789'
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
            My Enquiries & Quote Requests
          </h2>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
            Track the response status of quotes sent to ManaCity businesses with 24-Hour SLA protection.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading enquiries...</div>
      ) : leads.length === 0 ? (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Clock size={40} color="#38bdf8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a' }}>No active enquiries yet</h3>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
            Search for local businesses on ManaCity.in and click "Enquire" or "Get Quote".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leads.map((lead) => {
            const hoursLeft = calculateHoursLeft(lead.createdAt);
            const isFulfilled = lead.status === 'CLAIMED_AND_FULFILLED';
            const isTimedOut = lead.status === 'TIMED_OUT' || hoursLeft === 0;

            return (
              <div
                key={lead.id}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: '12px', color: '#38bdf8' }}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#fff' : '#0f172a', margin: 0 }}>
                        {lead.businessName}
                      </h4>
                      <span style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '2px', display: 'block' }}>
                        Requested: {lead.serviceRequested}
                      </span>
                    </div>
                  </div>

                  {isFulfilled ? (
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Responded / Fulfilled
                    </span>
                  ) : isTimedOut ? (
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={14} /> SLA Timed Out
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.15)', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {hoursLeft} Hours SLA Remaining
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.8rem', color: isDark ? '#64748b' : '#94a3b8' }}>
                    Submitted on: {new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {lead.businessPhone && (
                      <a
                        href={`tel:${lead.businessPhone}`}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Phone size={13} /> Call Business
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
