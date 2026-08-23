import React, { useState } from 'react';
import axios from 'axios';
import { Search, Trash2, Power, AlertTriangle, X, Plus, UserPlus, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

function BusinessesTab({ businesses, setBusinesses, searchQuery, setSearchQuery, handleStatusChange, handleDeleteBusiness, users = [], theme }) {
  const isDark = theme === 'dark';

  // 1. Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. Add Business Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizOwnerEmail, setNewBizOwnerEmail] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('Digital Marketing');
  const [newBizCity, setNewBizCity] = useState('tirupati');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizAddress, setNewBizAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [addMessage, setAddMessage] = useState({ type: '', text: '' });

  // 3. Reassign Owner Modal State
  const [reassignTarget, setReassignTarget] = useState(null);
  const [targetOwnerEmail, setTargetOwnerEmail] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);
  const [reassignMessage, setReassignMessage] = useState({ type: '', text: '' });

  const filteredBusinesses = businesses.filter(b =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await handleDeleteBusiness(deleteTarget.id, deleteTarget.name);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    if (!newBizName.trim()) return;

    setIsCreating(true);
    setAddMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/admin/businesses', {
        name: newBizName,
        ownerEmail: newBizOwnerEmail,
        category: newBizCategory,
        city: newBizCity,
        phone: newBizPhone,
        address: newBizAddress
      });

      const createdBiz = response.data.business;
      if (setBusinesses) {
        setBusinesses(prev => [createdBiz, ...prev]);
      }
      setAddMessage({ type: 'success', text: `Business "${newBizName}" created & assigned successfully!` });

      setTimeout(() => {
        setShowAddModal(false);
        setNewBizName('');
        setNewBizOwnerEmail('');
        setNewBizPhone('');
        setNewBizAddress('');
        setAddMessage({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      setAddMessage({ type: 'error', text: err.response?.data?.error || 'Failed to create business profile.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleReassignOwner = async (e) => {
    e.preventDefault();
    if (!reassignTarget || !targetOwnerEmail.trim()) return;

    setIsReassigning(true);
    setReassignMessage({ type: '', text: '' });

    try {
      const response = await axios.patch(`/api/admin/businesses/${reassignTarget.id}/reassign`, {
        targetUserEmail: targetOwnerEmail
      });

      const updatedBiz = response.data.business;
      if (setBusinesses) {
        setBusinesses(prev => prev.map(b => b.id === reassignTarget.id ? updatedBiz : b));
      }
      setReassignMessage({ type: 'success', text: `Ownership reassigned to ${updatedBiz.owner?.email || targetOwnerEmail}!` });

      setTimeout(() => {
        setReassignTarget(null);
        setTargetOwnerEmail('');
        setReassignMessage({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      setReassignMessage({ type: 'error', text: err.response?.data?.error || 'Failed to reassign business owner.' });
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* 1. Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #fca5a5',
            borderRadius: '16px',
            padding: '1.75rem',
            maxWidth: '440px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: isDark ? '#fff' : '#0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={22} color="#ef4444" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ef4444' }}>
                  Delete Business Group?
                </h3>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong style={{ color: isDark ? '#fff' : '#0f172a' }}>"{deleteTarget.name}"</strong>? This will remove all associated locations and data.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                  color: isDark ? '#fff' : '#334155',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add New Business Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '1.75rem',
            maxWidth: '520px',
            width: '92%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            color: isDark ? '#fff' : '#0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 size={22} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>
                  Add New Business & Assign Owner
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ backgroundColor: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {addMessage.text && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                backgroundColor: addMessage.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: addMessage.type === 'success' ? '#34d399' : '#fca5a5',
                border: addMessage.type === 'success' ? '1px solid #34d399' : '1px solid #ef4444'
              }}>
                {addMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tirupati Travels & Cabs"
                  value={newBizName}
                  onChange={e => setNewBizName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Assign Owner User Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. owner@gmail.com (Creates user if not exists)"
                  value={newBizOwnerEmail}
                  onChange={e => setNewBizOwnerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Taxi Service & Cab Travels"
                    value={newBizCategory}
                    onChange={e => setNewBizCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>City</label>
                  <select
                    value={newBizCity}
                    onChange={e => setNewBizCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#0f172a',
                      outline: 'none'
                    }}
                  >
                    <option value="tirupati">Tirupati</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="vijayawada">Vijayawada</option>
                    <option value="visakhapatnam">Visakhapatnam</option>
                    <option value="chennai">Chennai</option>
                    <option value="bangalore">Bangalore</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Contact Mobile</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={newBizPhone}
                    onChange={e => setNewBizPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Address</label>
                  <input
                    type="text"
                    placeholder="e.g. KT Road, Tirupati"
                    value={newBizAddress}
                    onChange={e => setNewBizAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                    border: 'none',
                    color: isDark ? '#fff' : '#334155',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '8px',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  {isCreating ? 'Creating...' : '🚀 Create & Assign Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Reassign Business Owner Modal */}
      {reassignTarget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '1.75rem',
            maxWidth: '460px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            color: isDark ? '#fff' : '#0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserPlus size={22} color="#a855f7" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>
                  Reassign Business Ownership
                </h3>
              </div>
              <button
                onClick={() => setReassignTarget(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '1rem' }}>
              Reassigning owner for business: <strong style={{ color: '#38bdf8' }}>"{reassignTarget.name}"</strong>
            </p>

            {reassignMessage.text && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                backgroundColor: reassignMessage.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: reassignMessage.type === 'success' ? '#34d399' : '#fca5a5',
                border: reassignMessage.type === 'success' ? '1px solid #34d399' : '1px solid #ef4444'
              }}>
                {reassignMessage.text}
              </div>
            )}

            <form onSubmit={handleReassignOwner} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Target User Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Enter registered user email..."
                  value={targetOwnerEmail}
                  onChange={e => setTargetOwnerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              {users.length > 0 && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: '0.25rem' }}>Or pick from existing users:</label>
                  <select
                    onChange={e => setTargetOwnerEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#0f172a',
                      fontSize: '0.82rem'
                    }}
                  >
                    <option value="">-- Select Registered User --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.email}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setReassignTarget(null)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                    border: 'none',
                    color: isDark ? '#fff' : '#334155',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isReassigning}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '8px',
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
                  }}
                >
                  {isReassigning ? 'Transferring...' : '👤 Reassign Ownership'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header Bar with Search & Add Business Button */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          padding: '0.65rem 1rem',
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Search size={18} color={isDark ? '#94a3b8' : '#64748b'} />
          <input
            type="text"
            placeholder="Search business name or owner email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: isDark ? '#fff' : '#0f172a',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            whiteSpace: 'nowrap'
          }}
        >
          <Plus size={18} /> Add Business & Assign User
        </button>
      </div>

      {/* Businesses Directory Table */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        borderRadius: '14px',
        overflowX: 'auto',
        padding: 0,
        boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              color: isDark ? '#94a3b8' : '#475569',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc'
            }}>
              <th style={{ padding: '0.85rem 1rem' }}>Business Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Owner User</th>
              <th style={{ padding: '0.85rem 1rem' }}>Locations</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions (Assign / Live / Delete)</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map(bus => {
              const currentStatus = bus.status || 'LIVE';

              return (
                <tr key={bus.id} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ color: isDark ? '#fff' : '#0f172a', display: 'block' }}>{bus.name}</strong>
                    <span style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.78rem' }}>ID: {bus.id}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ color: isDark ? '#cbd5e1' : '#334155', display: 'block', fontWeight: 700 }}>{bus.owner?.name || 'Unassigned'}</span>
                    <span style={{ color: isDark ? '#38bdf8' : '#2563eb', fontSize: '0.78rem', fontWeight: 600 }}>{bus.owner?.email || 'N/A'}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: isDark ? '#cbd5e1' : '#334155' }}>{bus._count?.locations || 0}</td>
                  
                  {/* Status Badge */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: currentStatus === 'LIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: currentStatus === 'LIVE' ? '#34d399' : '#ef4444'
                    }}>
                      ● {currentStatus}
                    </span>
                  </td>

                  {/* Actions Bar */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      
                      {/* Reassign Owner Button */}
                      <button
                        onClick={() => {
                          setReassignTarget(bus);
                          setTargetOwnerEmail(bus.owner?.email || '');
                        }}
                        style={{
                          padding: '0.35rem 0.65rem',
                          backgroundColor: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                          color: '#c084fc',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <UserPlus size={13} /> Reassign Owner
                      </button>

                      {currentStatus === 'DISABLED' ? (
                        <button
                          onClick={() => handleStatusChange(bus.id, 'LIVE')}
                          style={{
                            padding: '0.35rem 0.65rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#34d399',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Power size={13} /> Make Live
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(bus.id, 'DISABLED')}
                          style={{
                            padding: '0.35rem 0.65rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fbbf24',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Power size={13} /> Disable
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTarget({ id: bus.id, name: bus.name })}
                        style={{
                          padding: '0.35rem 0.65rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusinessesTab;
