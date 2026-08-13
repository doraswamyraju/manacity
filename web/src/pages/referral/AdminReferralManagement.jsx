import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Settings,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Package,
  Wrench,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Save,
  Check,
  Zap,
  CreditCard
} from 'lucide-react';

function AdminReferralManagement({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  const [overview, setOverview] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('payouts'); // 'payouts' | 'config' | 'commissions' | 'item-rates'

  // Config Form State
  const [configForm, setConfigForm] = useState({
    isEnabled: true,
    commissionType: 'PERCENTAGE',
    commissionValue: 10,
    minimumPayoutAmount: 500,
    holdingPeriodDays: 14,
    cookieValidityDays: 30
  });

  // Payout Processing Modal State
  const [processingPayout, setProcessingPayout] = useState(null);
  const [payoutForm, setPayoutForm] = useState({
    status: 'PAID',
    paymentRef: '',
    proofReceiptUrl: '',
    adminNotes: ''
  });
  const [submittingPayout, setSubmittingPayout] = useState(false);

  // Item Rate Editing State
  const [editingItem, setEditingItem] = useState(null);
  const [itemRateForm, setItemRateForm] = useState({
    isReferralEnabled: true,
    commissionType: 'GLOBAL',
    commissionValue: ''
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAdminData();
    fetchCatalog();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, commsRes, payoutsRes] = await Promise.all([
        axios.get('/api/referrals/admin/overview'),
        axios.get('/api/referrals/admin/commissions'),
        axios.get('/api/referrals/admin/payouts')
      ]);

      if (overviewRes.data.status === 'success') {
        setOverview(overviewRes.data.data);
        if (overviewRes.data.data.config) {
          setConfigForm({
            isEnabled: overviewRes.data.data.config.isEnabled,
            commissionType: overviewRes.data.data.config.commissionType || 'PERCENTAGE',
            commissionValue: overviewRes.data.data.config.commissionValue || 10,
            minimumPayoutAmount: overviewRes.data.data.config.minimumPayoutAmount || 500,
            holdingPeriodDays: overviewRes.data.data.config.holdingPeriodDays || 14,
            cookieValidityDays: overviewRes.data.data.config.cookieValidityDays || 30
          });
        }
      }
      if (commsRes.data.status === 'success') setCommissions(commsRes.data.data || []);
      if (payoutsRes.data.status === 'success') setPayouts(payoutsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching admin referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalog = async () => {
    try {
      const res = await axios.get('/api/referrals/catalog');
      if (res.data.status === 'success') {
        setCatalog(res.data.data.catalog || []);
      }
    } catch (err) {
      console.error('Error fetching catalog for admin:', err);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await axios.put('/api/referrals/admin/config', configForm);
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: 'Referral program settings updated.' });
        fetchAdminData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    }
  };

  const handleProcessPayoutSubmit = async (e) => {
    e.preventDefault();
    if (!processingPayout) return;
    setSubmittingPayout(true);
    setMessage(null);
    try {
      const res = await axios.post(`/api/referrals/admin/payouts/${processingPayout.id}/process`, payoutForm);
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: `Payout marked as ${payoutForm.status} successfully.` });
        setProcessingPayout(null);
        fetchAdminData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to process payout.' });
    } finally {
      setSubmittingPayout(false);
    }
  };

  const handleSaveItemRate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await axios.patch('/api/referrals/admin/item-commission', {
        itemType: editingItem.itemType,
        itemId: editingItem.id,
        isReferralEnabled: itemRateForm.isReferralEnabled,
        commissionType: itemRateForm.commissionType,
        commissionValue: itemRateForm.commissionValue
      });
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: `Commission settings updated for ${editingItem.name}.` });
        setEditingItem(null);
        fetchCatalog();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update item commission.' });
    }
  };

  const handleCommissionStatusChange = async (commId, newStatus) => {
    try {
      const res = await axios.patch(`/api/referrals/admin/commissions/${commId}/status`, { status: newStatus });
      if (res.data.status === 'success') {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to change commission status:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b' }}>
        <div className="spinner" style={{ marginBottom: '1rem' }}>Loading Admin Referral Management...</div>
      </div>
    );
  }

  const stats = overview?.stats || {};

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '50px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34d399', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>
            <ShieldCheck size={16} /> Admin Control Console
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: isDark ? '#fff' : '#0f172a' }}>
            Referral & Affiliate Commission Program
          </h1>
          <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.95rem' }}>
            Manage referral program rules, process customer payout requests, configure per-product commissions, and audit conversions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: configForm.isEnabled ? (isDark ? 'rgba(52, 211, 153, 0.15)' : '#d1fae5') : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2'),
            color: configForm.isEnabled ? (isDark ? '#34d399' : '#065f46') : (isDark ? '#f87171' : '#991b1b'),
            fontWeight: '700',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Zap size={16} />
            Program: {configForm.isEnabled ? 'ACTIVE' : 'DISABLED'}
          </div>
        </div>
      </div>

      {/* Global Alert Message */}
      {message && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          backgroundColor: message.type === 'success' ? (isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5') : (isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2'),
          color: message.type === 'success' ? (isDark ? '#34d399' : '#065f46') : (isDark ? '#f87171' : '#991b1b'),
          border: message.type === 'success' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(248,113,113,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{message.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <MetricBox
          isDark={isDark}
          title="Referred Sales Revenue"
          value={`₹${(stats.totalSalesRevenue || 0).toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="#38bdf8"
        />
        <MetricBox
          isDark={isDark}
          title="Total Commissions Generated"
          value={`₹${(stats.totalCommissionEarned || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="#a78bfa"
        />
        <MetricBox
          isDark={isDark}
          title="Paid Out to Referrers"
          value={`₹${(stats.totalPaidOut || 0).toLocaleString('en-IN')}`}
          icon={CheckCircle2}
          color="#34d399"
        />
        <MetricBox
          isDark={isDark}
          title="Pending Payout Requests"
          value={stats.pendingPayoutRequestsCount || 0}
          icon={Clock}
          color="#fbbf24"
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem',
        overflowX: 'auto'
      }}>
        <AdminTabButton
          active={activeTab === 'payouts'}
          onClick={() => setActiveTab('payouts')}
          isDark={isDark}
          icon={Clock}
          label={`Payout Requests Queue (${payouts.filter(p => p.status === 'PAYOUT_REQUESTED').length})`}
        />
        <AdminTabButton
          active={activeTab === 'item-rates'}
          onClick={() => setActiveTab('item-rates')}
          isDark={isDark}
          icon={Package}
          label="Per-Product/Service Rates"
        />
        <AdminTabButton
          active={activeTab === 'commissions'}
          onClick={() => setActiveTab('commissions')}
          isDark={isDark}
          icon={TrendingUp}
          label={`All Commissions Ledger (${commissions.length})`}
        />
        <AdminTabButton
          active={activeTab === 'config'}
          onClick={() => setActiveTab('config')}
          isDark={isDark}
          icon={Settings}
          label="Program Rules & Config"
        />
      </div>

      {/* TAB 1: PAYOUT REQUESTS QUEUE */}
      {activeTab === 'payouts' && (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#fff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.15rem' }}>
            Pending & Processed Payout Requests
          </h3>

          {payouts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
              <Clock size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <p>No payout requests found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                    color: isDark ? '#94a3b8' : '#64748b'
                  }}>
                    <th style={{ padding: '0.85rem' }}>Request Date</th>
                    <th style={{ padding: '0.85rem' }}>User / Referrer</th>
                    <th style={{ padding: '0.85rem' }}>Payout Method & Account Details</th>
                    <th style={{ padding: '0.85rem' }}>Amount</th>
                    <th style={{ padding: '0.85rem' }}>Status</th>
                    <th style={{ padding: '0.85rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
                        color: isDark ? '#cbd5e1' : '#334155'
                      }}
                    >
                      <td style={{ padding: '0.85rem', whiteSpace: 'nowrap' }}>
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <div style={{ fontWeight: '700', color: isDark ? '#fff' : '#0f172a' }}>{p.user?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : '#64748b' }}>{p.user?.email}</div>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        {p.payoutProfile ? (
                          p.payoutProfile.payoutMethod === 'UPI' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: '600' }}>
                              <Zap size={15} /> UPI: {p.payoutProfile.upiId}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.85rem' }}>
                              <div style={{ fontWeight: '600', color: isDark ? '#fff' : '#0f172a' }}>{p.payoutProfile.accountHolder}</div>
                              <div>A/C: {p.payoutProfile.accountNumber} | IFSC: {p.payoutProfile.ifscCode}</div>
                            </div>
                          )
                        ) : (
                          <span style={{ color: '#f87171' }}>No profile details</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem', fontWeight: '800', color: '#34d399', fontSize: '1rem' }}>
                        ₹{p.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <AdminStatusBadge status={p.status} />
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        {p.status === 'PAYOUT_REQUESTED' ? (
                          <button
                            onClick={() => {
                              setProcessingPayout(p);
                              setPayoutForm({ status: 'PAID', paymentRef: '', proofReceiptUrl: '', adminNotes: '' });
                            }}
                            style={{
                              backgroundColor: '#6366f1',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Process Payout
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                            {p.paymentRef ? `UTR: ${p.paymentRef}` : 'Completed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PER-PRODUCT/SERVICE COMMISSION RATES */}
      {activeTab === 'item-rates' && (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#fff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.35rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.15rem' }}>
              Per-Item Referral Commission Rates
            </h3>
            <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              Override global default referral rates for specific products or services in the master library.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                  color: isDark ? '#94a3b8' : '#64748b'
                }}>
                  <th style={{ padding: '0.85rem' }}>Type</th>
                  <th style={{ padding: '0.85rem' }}>Product / Service Name</th>
                  <th style={{ padding: '0.85rem' }}>Price</th>
                  <th style={{ padding: '0.85rem' }}>Current Commission Rule</th>
                  <th style={{ padding: '0.85rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((item) => (
                  <tr
                    key={`${item.source}-${item.id}`}
                    style={{
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
                      color: isDark ? '#cbd5e1' : '#334155'
                    }}
                  >
                    <td style={{ padding: '0.85rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: item.itemType === 'SERVICE' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: item.itemType === 'SERVICE' ? '#38bdf8' : '#f43f5e'
                      }}>
                        {item.itemType}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem', fontWeight: '600', color: isDark ? '#fff' : '#0f172a' }}>
                      {item.name}
                      {item.businessName && <div style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : '#64748b' }}>({item.businessName})</div>}
                    </td>
                    <td style={{ padding: '0.85rem', fontWeight: '700' }}>
                      {item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <span style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        backgroundColor: 'rgba(52, 211, 153, 0.15)',
                        color: '#34d399'
                      }}>
                        {item.reward?.rewardText}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setItemRateForm({
                            isReferralEnabled: item.reward?.isEligible !== false,
                            commissionType: item.reward?.type || 'GLOBAL',
                            commissionValue: item.reward?.value || ''
                          });
                        }}
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                          color: isDark ? '#fff' : '#0f172a',
                          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Edit size={14} /> Customize Rate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ALL COMMISSIONS LEDGER */}
      {activeTab === 'commissions' && (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#fff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.15rem' }}>
            Master Referral Commissions Ledger
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                  color: isDark ? '#94a3b8' : '#64748b'
                }}>
                  <th style={{ padding: '0.85rem' }}>Date</th>
                  <th style={{ padding: '0.85rem' }}>Referrer User</th>
                  <th style={{ padding: '0.85rem' }}>Item Purchased</th>
                  <th style={{ padding: '0.85rem' }}>Sale Amount</th>
                  <th style={{ padding: '0.85rem' }}>Commission Earned</th>
                  <th style={{ padding: '0.85rem' }}>Status</th>
                  <th style={{ padding: '0.85rem' }}>Override</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
                      color: isDark ? '#cbd5e1' : '#334155'
                    }}
                  >
                    <td style={{ padding: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ fontWeight: '700', color: isDark ? '#fff' : '#0f172a' }}>{c.user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : '#64748b' }}>{c.user?.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem', fontWeight: '600' }}>
                      {c.referral?.itemName || 'Product Sale'}
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      ₹{c.saleAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem', fontWeight: '700', color: '#34d399' }}>
                      +₹{c.earnedAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <AdminStatusBadge status={c.status} />
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <select
                        value={c.status}
                        onChange={e => handleCommissionStatusChange(c.id, e.target.value)}
                        style={{
                          backgroundColor: isDark ? '#0f172a' : '#fff',
                          color: isDark ? '#fff' : '#0f172a',
                          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '0.3rem 0.5rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value="PENDING_VERIFICATION">PENDING (Holding)</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PAID">PAID</option>
                        <option value="REJECTED">REJECTED / FLAGGED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROGRAM CONFIGURATION */}
      {activeTab === 'config' && (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#fff',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '650px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.2rem' }}>
            Referral Program Master Rules
          </h3>

          <form onSubmit={handleSaveConfig}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: '700', color: isDark ? '#fff' : '#0f172a', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={configForm.isEnabled}
                  onChange={e => setConfigForm({ ...configForm, isEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                Enable Customer Referral & Commission Program Globally
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  Default Commission Type
                </label>
                <select
                  value={configForm.commissionType}
                  onChange={e => setConfigForm({ ...configForm, commissionType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#fff' : '#0f172a'
                  }}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  Default Reward Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={configForm.commissionValue}
                  onChange={e => setConfigForm({ ...configForm, commissionValue: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#fff' : '#0f172a'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  Minimum Payout Threshold (₹)
                </label>
                <input
                  type="number"
                  required
                  value={configForm.minimumPayoutAmount}
                  onChange={e => setConfigForm({ ...configForm, minimumPayoutAmount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#fff' : '#0f172a'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  Holding Period (Days for Refund Protection)
                </label>
                <input
                  type="number"
                  required
                  value={configForm.holdingPeriodDays}
                  onChange={e => setConfigForm({ ...configForm, holdingPeriodDays: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#fff' : '#0f172a'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.8rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={18} /> Save Program Settings
            </button>
          </form>
        </div>
      )}

      {/* PROCESS PAYOUT MODAL */}
      {processingPayout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#fff',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '520px',
            width: '100%',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: isDark ? '#fff' : '#0f172a' }}>
              Process Customer Payout
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              Releasing payout of <strong style={{ color: '#34d399' }}>₹{processingPayout.totalAmount.toLocaleString('en-IN')}</strong> to {processingPayout.user?.name}.
            </p>

            {/* Account Details Box */}
            <div style={{
              backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
            }}>
              <div style={{ fontWeight: '700', color: isDark ? '#fff' : '#0f172a', marginBottom: '0.4rem' }}>
                Recipient Details:
              </div>
              {processingPayout.payoutProfile ? (
                processingPayout.payoutProfile.payoutMethod === 'UPI' ? (
                  <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '1rem' }}>
                    UPI ID: {processingPayout.payoutProfile.upiId}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                    <div>Holder: <strong>{processingPayout.payoutProfile.accountHolder}</strong></div>
                    <div>Account: <strong>{processingPayout.payoutProfile.accountNumber}</strong></div>
                    <div>IFSC: <strong>{processingPayout.payoutProfile.ifscCode}</strong></div>
                  </div>
                )
              ) : (
                <div style={{ color: '#f87171' }}>No payout profile set up!</div>
              )}
            </div>

            <form onSubmit={handleProcessPayoutSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  Action / Status
                </label>
                <select
                  value={payoutForm.status}
                  onChange={e => setPayoutForm({ ...payoutForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#fff' : '#0f172a'
                  }}
                >
                  <option value="PAID">Approve & Mark PAID</option>
                  <option value="REJECTED">Reject Payout Request</option>
                </select>
              </div>

              {payoutForm.status === 'PAID' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                    Bank Reference / UTR Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTR1234567890"
                    value={payoutForm.paymentRef}
                    onChange={e => setPayoutForm({ ...payoutForm, paymentRef: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#0f172a' : '#fff',
                      color: isDark ? '#fff' : '#0f172a'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setProcessingPayout(null)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: 'transparent',
                    color: isDark ? '#cbd5e1' : '#64748b',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: payoutForm.status === 'PAID' ? '#10b981' : '#ef4444',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: submittingPayout ? 'wait' : 'pointer'
                  }}
                >
                  {submittingPayout ? 'Processing...' : `Confirm ${payoutForm.status}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ITEM RATE MODAL */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#fff',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '480px',
            width: '100%',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: isDark ? '#fff' : '#0f172a' }}>
              Custom Referral Rate: {editingItem.name}
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>
              Configure specific referral commission earnings for this product/service.
            </p>

            <form onSubmit={handleSaveItemRate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: isDark ? '#fff' : '#0f172a' }}>
                  <input
                    type="checkbox"
                    checked={itemRateForm.isReferralEnabled}
                    onChange={e => setItemRateForm({ ...itemRateForm, isReferralEnabled: e.target.checked })}
                  />
                  Enable Referrals for this item
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                  Commission Type
                </label>
                <select
                  value={itemRateForm.commissionType}
                  onChange={e => setItemRateForm({ ...itemRateForm, commissionType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#fff' : '#0f172a'
                  }}
                >
                  <option value="GLOBAL">Use Global Program Rate</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                </select>
              </div>

              {itemRateForm.commissionType !== 'GLOBAL' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                    Reward Value ({itemRateForm.commissionType === 'PERCENTAGE' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={itemRateForm.commissionValue}
                    onChange={e => setItemRateForm({ ...itemRateForm, commissionValue: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#0f172a' : '#fff',
                      color: isDark ? '#fff' : '#0f172a'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    backgroundColor: 'transparent',
                    color: isDark ? '#cbd5e1' : '#64748b',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Item Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function MetricBox({ title, value, icon: Icon, color, isDark }) {
  return (
    <div style={{
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '16px',
      padding: '1.25rem',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isDark ? '#94a3b8' : '#64748b' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: isDark ? '#fff' : '#0f172a', marginTop: '0.3rem' }}>
          {value}
        </div>
      </div>
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        backgroundColor: `${color}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color
      }}>
        <Icon size={20} />
      </div>
    </div>
  );
}

function AdminTabButton({ active, onClick, icon: Icon, label, isDark }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.65rem 1.1rem',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: active ? (isDark ? '#334155' : '#e0e7ff') : 'transparent',
        color: active ? (isDark ? '#fff' : '#4338ca') : (isDark ? '#94a3b8' : '#64748b'),
        fontWeight: active ? '700' : '600',
        fontSize: '0.9rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function AdminStatusBadge({ status }) {
  let bg = 'rgba(148,163,184,0.15)';
  let color = '#94a3b8';
  let label = status;

  if (status === 'PAID') {
    bg = 'rgba(52,211,153,0.15)';
    color = '#34d399';
    label = 'PAID';
  } else if (status === 'APPROVED') {
    bg = 'rgba(251,191,36,0.15)';
    color = '#fbbf24';
    label = 'APPROVED';
  } else if (status === 'PENDING_VERIFICATION') {
    bg = 'rgba(56,189,248,0.15)';
    color = '#38bdf8';
    label = 'PENDING HOLD';
  } else if (status === 'PAYOUT_REQUESTED') {
    bg = 'rgba(167,139,250,0.15)';
    color = '#a78bfa';
    label = 'PAYOUT REQUESTED';
  } else if (status === 'REJECTED') {
    bg = 'rgba(248,113,113,0.15)';
    color = '#f87171';
    label = 'REJECTED';
  }

  return (
    <span style={{
      padding: '0.3rem 0.65rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      backgroundColor: bg,
      color,
      display: 'inline-block'
    }}>
      {label}
    </span>
  );
}

export default AdminReferralManagement;
