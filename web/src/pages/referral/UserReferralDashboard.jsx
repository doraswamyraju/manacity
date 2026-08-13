import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Share2,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  Users,
  MousePointer,
  Clock,
  CheckCircle2,
  Building2,
  Package,
  Wrench,
  QrCode,
  Send,
  AlertCircle,
  CreditCard,
  Zap,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';

function UserReferralDashboard({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  const [stats, setStats] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [globalReward, setGlobalReward] = useState({ commissionType: 'PERCENTAGE', commissionValue: 10 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [itemCopiedId, setItemCopiedId] = useState(null);
  
  // Payout profile & modal state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    payoutMethod: 'UPI',
    upiId: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    panNumber: ''
  });
  const [savingPayout, setSavingPayout] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'catalog' | 'ledger' | 'payouts'
  const [qrModalUrl, setQrModalUrl] = useState(null);

  useEffect(() => {
    fetchReferralData();
    fetchCatalog();
  }, []);

  const fetchReferralData = async () => {
    try {
      const res = await axios.get('/api/referrals/stats');
      if (res.data.status === 'success') {
        setStats(res.data.data);
        if (res.data.data.payoutProfile) {
          setPayoutForm({
            payoutMethod: res.data.data.payoutProfile.payoutMethod || 'UPI',
            upiId: res.data.data.payoutProfile.upiId || '',
            accountHolder: res.data.data.payoutProfile.accountHolder || '',
            accountNumber: res.data.data.payoutProfile.accountNumber || '',
            ifscCode: res.data.data.payoutProfile.ifscCode || '',
            panNumber: res.data.data.payoutProfile.panNumber || ''
          });
        }
      }
    } catch (err) {
      console.error('Error fetching referral stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalog = async () => {
    try {
      const res = await axios.get('/api/referrals/catalog');
      if (res.data.status === 'success') {
        setCatalog(res.data.data.catalog || []);
        if (res.data.data.globalDefault) {
          setGlobalReward(res.data.data.globalDefault);
        }
      }
    } catch (err) {
      console.error('Error fetching referral catalog:', err);
    }
  };

  const getBaseUrl = () => {
    return window.location.origin;
  };

  const getReferralUrl = (itemId = null, itemType = null) => {
    const code = stats?.referralCode || 'MYREF';
    let url = `${getBaseUrl()}/?ref=${code}`;
    if (itemId) {
      url += `&item=${itemId}&type=${itemType}`;
    }
    return url;
  };

  const handleCopyLink = (url = null, itemId = null) => {
    const linkToCopy = url || getReferralUrl();
    navigator.clipboard.writeText(linkToCopy);
    if (itemId) {
      setItemCopiedId(itemId);
      setTimeout(() => setItemCopiedId(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = (customUrl = null, itemName = null) => {
    const link = customUrl || getReferralUrl();
    const text = itemName
      ? `Hey! Check out ${itemName} on ManaCity: ${link}`
      : `Hey! Check out ManaCity for amazing local business services and products: ${link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSavePayoutProfile = async (e) => {
    e.preventDefault();
    setSavingPayout(true);
    setMessage(null);
    try {
      const res = await axios.post('/api/referrals/payout-profile', payoutForm);
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: 'Payout account saved successfully!' });
        setShowPayoutModal(false);
        fetchReferralData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save payout profile.' });
    } finally {
      setSavingPayout(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!stats?.canRequestPayout) return;
    setRequestingPayout(true);
    setMessage(null);
    try {
      const res = await axios.post('/api/referrals/request-payout');
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: res.data.message });
        fetchReferralData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Payout request failed.' });
    } finally {
      setRequestingPayout(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b' }}>
        <div className="spinner" style={{ marginBottom: '1rem' }}>Loading Refer & Earn Portal...</div>
      </div>
    );
  }

  const mainReferralLink = getReferralUrl();

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e1b4b 0%, #311b92 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        borderRadius: '20px',
        padding: '2.25rem',
        marginBottom: '2rem',
        border: isDark ? '1px solid rgba(129, 140, 248, 0.2)' : '1px solid #cbd5e1',
        boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 25px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '50px', backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(129, 140, 248, 0.3)', color: '#818cf8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' }}>
            <Zap size={14} /> Customer Partner Program
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: isDark ? '#fff' : '#1e1b4b' }}>
            Refer Friends & Earn Commissions
          </h1>
          <p style={{ margin: '0 0 1.5rem 0', color: isDark ? '#cbd5e1' : '#334155', maxWidth: '650px', fontSize: '1.05rem', lineHeight: '1.5' }}>
            Share your unique referral link or specific products with your network. Whenever someone completes a sale using your link, you earn referral income directly into your bank or UPI account!
          </p>

          {/* Referral Link Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : '#fff',
            padding: '0.6rem 0.75rem 0.6rem 1.25rem',
            borderRadius: '14px',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            maxWidth: '680px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Your Code: <strong style={{ color: '#34d399' }}>{stats?.referralCode}</strong>
            </span>
            <input
              type="text"
              readOnly
              value={mainReferralLink}
              style={{
                flex: '1',
                minWidth: '220px',
                background: 'transparent',
                border: 'none',
                color: isDark ? '#38bdf8' : '#0284c7',
                fontSize: '0.92rem',
                fontWeight: '600',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleCopyLink(mainReferralLink)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: copied ? '#10b981' : '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>

              <button
                onClick={() => handleShareWhatsApp(mainReferralLink)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Send size={15} /> WhatsApp
              </button>

              <button
                onClick={() => setQrModalUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mainReferralLink)}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                  color: isDark ? '#fff' : '#0f172a',
                  border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <QrCode size={16} /> QR
              </button>
            </div>
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

      {/* 2. Key Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <MetricCard
          isDark={isDark}
          title="Total Link Clicks"
          value={stats?.totalClicks || 0}
          icon={MousePointer}
          color="#38bdf8"
          subtitle="Unique visitors tracked"
        />

        <MetricCard
          isDark={isDark}
          title="Successful Referrals"
          value={stats?.totalReferrals || 0}
          icon={Users}
          color="#a78bfa"
          subtitle="Converted sales & signups"
        />

        <MetricCard
          isDark={isDark}
          title="Total Income Earned"
          value={`₹${(stats?.totalEarned || 0).toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="#34d399"
          subtitle={`₹${(stats?.paidOutAmount || 0).toLocaleString('en-IN')} paid to bank`}
        />

        <MetricCard
          isDark={isDark}
          title="Available Balance"
          value={`₹${(stats?.approvedBalance || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="#fbbf24"
          subtitle={`Holding: ₹${(stats?.pendingVerification || 0).toLocaleString('en-IN')}`}
          action={
            <button
              onClick={handleRequestPayout}
              disabled={!stats?.canRequestPayout || requestingPayout}
              style={{
                marginTop: '0.75rem',
                width: '100%',
                backgroundColor: stats?.canRequestPayout ? '#10b981' : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
                color: stats?.canRequestPayout ? '#fff' : (isDark ? '#64748b' : '#94a3b8'),
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: stats?.canRequestPayout ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease'
              }}
            >
              {requestingPayout ? 'Submitting...' : stats?.canRequestPayout ? 'Withdraw Money' : `Min ₹${stats?.minimumPayoutAmount || 500} Req`}
            </button>
          }
        />
      </div>

      {/* Payout Account Header / Status */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1rem' }}>
              Payout Account Setup ({stats?.payoutProfile?.payoutMethod || 'Not Configured'})
            </h4>
            <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.88rem' }}>
              {stats?.payoutProfile?.upiId
                ? `UPI ID: ${stats.payoutProfile.upiId}`
                : stats?.payoutProfile?.accountNumber
                ? `Bank A/C: ****${stats.payoutProfile.accountNumber.slice(-4)} (${stats.payoutProfile.ifscCode})`
                : 'Add your UPI ID or Bank account to receive referral earnings automatically.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPayoutModal(true)}
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
            color: isDark ? '#fff' : '#0f172a',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '0.6rem 1.2rem',
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {stats?.payoutProfile ? 'Update Payout Details' : '+ Add Payout Account'}
        </button>
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem'
      }}>
        <TabButton
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          isDark={isDark}
          icon={TrendingUp}
          label="Sales Ledger & Activity"
        />
        <TabButton
          active={activeTab === 'catalog'}
          onClick={() => setActiveTab('catalog')}
          isDark={isDark}
          icon={Package}
          label={`Product & Service Catalog (${catalog.length})`}
        />
        <TabButton
          active={activeTab === 'payouts'}
          onClick={() => setActiveTab('payouts')}
          isDark={isDark}
          icon={Clock}
          label={`Payout Requests (${stats?.payouts?.length || 0})`}
        />
      </div>

      {/* TAB 1: SALES LEDGER */}
      {activeTab === 'overview' && (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#fff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.15rem' }}>
            Referral Conversions & Earned Ledger
          </h3>

          {!stats?.commissions || stats.commissions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
              <Users size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0' }}>No Referral Conversions Yet</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Share your link or browse the catalog tab to send product referral links to friends!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                    color: isDark ? '#94a3b8' : '#64748b'
                  }}>
                    <th style={{ padding: '0.85rem' }}>Date</th>
                    <th style={{ padding: '0.85rem' }}>Product / Item</th>
                    <th style={{ padding: '0.85rem' }}>Buyer Info</th>
                    <th style={{ padding: '0.85rem' }}>Sale Amount</th>
                    <th style={{ padding: '0.85rem' }}>Commission Earned</th>
                    <th style={{ padding: '0.85rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.commissions.map((comm) => (
                    <tr
                      key={comm.id}
                      style={{
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
                        color: isDark ? '#cbd5e1' : '#334155'
                      }}
                    >
                      <td style={{ padding: '0.85rem', whiteSpace: 'nowrap' }}>
                        {new Date(comm.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.85rem', fontWeight: '600', color: isDark ? '#fff' : '#0f172a' }}>
                        {comm.itemName}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        {comm.buyerEmailObfuscated}
                      </td>
                      <td style={{ padding: '0.85rem', fontWeight: '600' }}>
                        ₹{comm.saleAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem', fontWeight: '700', color: '#34d399' }}>
                        +₹{comm.earnedAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <StatusBadge status={comm.status} isDark={isDark} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT & SERVICE CATALOG */}
      {activeTab === 'catalog' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.35rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.15rem' }}>
              Product & Service Referral Links
            </h3>
            <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              Select a specific product or service to copy its unique referral link and share it directly with your contacts.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1.25rem'
          }}>
            {catalog.map((item) => {
              const itemLink = getReferralUrl(item.id, item.itemType);
              const isCopied = itemCopiedId === item.id;

              return (
                <div
                  key={`${item.source}-${item.id}`}
                  style={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: item.itemType === 'SERVICE' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: item.itemType === 'SERVICE' ? '#38bdf8' : '#f43f5e'
                      }}>
                        {item.itemType}
                      </span>
                      {item.price && (
                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: isDark ? '#fff' : '#0f172a' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <h4 style={{ margin: '0 0 0.4rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.05rem' }}>
                      {item.name}
                    </h4>

                    {item.businessName && (
                      <p style={{ margin: '0 0 0.75rem 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>
                        By {item.businessName}
                      </p>
                    )}

                    {/* Reward Badge */}
                    <div style={{
                      backgroundColor: isDark ? 'rgba(52, 211, 153, 0.15)' : '#d1fae5',
                      color: isDark ? '#34d399' : '#047857',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <Zap size={16} /> Earn: {item.reward?.rewardText || '10% per sale'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleCopyLink(itemLink, item.id)}
                      style={{
                        flex: 1,
                        backgroundColor: isCopied ? '#10b981' : '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.55rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      {isCopied ? 'Link Copied!' : 'Copy Item Link'}
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(itemLink, item.name)}
                      style={{
                        backgroundColor: '#25D366',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.55rem 0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PAYOUT HISTORY */}
      {activeTab === 'payouts' && (
        <div style={{
          backgroundColor: isDark ? '#1e293b' : '#fff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: isDark ? '#fff' : '#0f172a', fontSize: '1.15rem' }}>
            Withdrawal & Payout Requests
          </h3>

          {!stats?.payouts || stats.payouts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
              <Clock size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0' }}>No Payout Requests Yet</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>When your approved balance reaches ₹{stats?.minimumPayoutAmount || 500}, you can request a cash withdrawal here.</p>
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
                    <th style={{ padding: '0.85rem' }}>Requested Amount</th>
                    <th style={{ padding: '0.85rem' }}>Payment Reference / UTR</th>
                    <th style={{ padding: '0.85rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.payouts.map((p) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
                        color: isDark ? '#cbd5e1' : '#334155'
                      }}
                    >
                      <td style={{ padding: '0.85rem' }}>
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.85rem', fontWeight: '700', color: isDark ? '#fff' : '#0f172a' }}>
                        ₹{p.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        {p.paymentRef ? (
                          <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{p.paymentRef}</span>
                        ) : (
                          <span style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Processing...</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <StatusBadge status={p.status} isDark={isDark} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PAYOUT DETAILS MODAL */}
      {showPayoutModal && (
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
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: isDark ? '#fff' : '#0f172a' }}>
              Payout Account Setup
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              Enter your UPI ID or Bank account details where you want to receive referral commission payouts.
            </p>

            <form onSubmit={handleSavePayoutProfile}>
              {/* Method Selector */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setPayoutForm(prev => ({ ...prev, payoutMethod: 'UPI' }))}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: payoutForm.payoutMethod === 'UPI' ? '2px solid #6366f1' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
                    backgroundColor: payoutForm.payoutMethod === 'UPI' ? (isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff') : 'transparent',
                    color: isDark ? '#fff' : '#0f172a',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  UPI ID (Instant)
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutForm(prev => ({ ...prev, payoutMethod: 'BANK_TRANSFER' }))}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: payoutForm.payoutMethod === 'BANK_TRANSFER' ? '2px solid #6366f1' : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'),
                    backgroundColor: payoutForm.payoutMethod === 'BANK_TRANSFER' ? (isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff') : 'transparent',
                    color: isDark ? '#fff' : '#0f172a',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Bank Transfer (NEFT/IMPS)
                </button>
              </div>

              {payoutForm.payoutMethod === 'UPI' ? (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                    UPI ID (e.g., 9876543210@paytm, user@ybl)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@upi"
                    value={payoutForm.upiId}
                    onChange={e => setPayoutForm({ ...payoutForm, upiId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#0f172a' : '#fff',
                      color: isDark ? '#fff' : '#0f172a',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Name as in Bank"
                      value={payoutForm.accountHolder}
                      onChange={e => setPayoutForm({ ...payoutForm, accountHolder: e.target.value })}
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                        Account Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12-16 digits"
                        value={payoutForm.accountNumber}
                        onChange={e => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
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
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SBIN0001234"
                        value={payoutForm.ifscCode}
                        onChange={e => setPayoutForm({ ...payoutForm, ifscCode: e.target.value.toUpperCase() })}
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
                </>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
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
                  disabled={savingPayout}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: savingPayout ? 'wait' : 'pointer'
                  }}
                >
                  {savingPayout ? 'Saving...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {qrModalUrl && (
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
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: isDark ? '#fff' : '#0f172a' }}>
              Your Referral QR Code
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>
              Friends can scan this QR code with their mobile camera to use your referral link.
            </p>

            <img
              src={qrModalUrl}
              alt="Referral QR Code"
              style={{ width: '220px', height: '220px', borderRadius: '12px', marginBottom: '1.25rem', border: '4px solid #fff' }}
            />

            <button
              onClick={() => setQrModalUrl(null)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#6366f1',
                color: '#fff',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Close QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function MetricCard({ title, value, icon: Icon, color, subtitle, action, isDark }) {
  return (
    <div style={{
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: '16px',
      padding: '1.25rem',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: '600', color: isDark ? '#94a3b8' : '#64748b' }}>
            {title}
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color
          }}>
            <Icon size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: '800', color: isDark ? '#fff' : '#0f172a', marginBottom: '0.25rem' }}>
          {value}
        </div>
      </div>
      <div>
        {subtitle && (
          <p style={{ margin: 0, fontSize: '0.8rem', color: isDark ? '#64748b' : '#94a3b8' }}>
            {subtitle}
          </p>
        )}
        {action}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, isDark }) {
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
        transition: 'all 0.2s ease'
      }}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function StatusBadge({ status, isDark }) {
  let bg = 'rgba(148,163,184,0.15)';
  let color = '#94a3b8';
  let label = status;

  if (status === 'PAID') {
    bg = 'rgba(52,211,153,0.15)';
    color = '#34d399';
    label = 'PAID TO BANK';
  } else if (status === 'APPROVED') {
    bg = 'rgba(251,191,36,0.15)';
    color = '#fbbf24';
    label = 'APPROVED';
  } else if (status === 'PENDING_VERIFICATION') {
    bg = 'rgba(56,189,248,0.15)';
    color = '#38bdf8';
    label = 'HOLDING (14d)';
  } else if (status === 'PAYOUT_REQUESTED') {
    bg = 'rgba(167,139,250,0.15)';
    color = '#a78bfa';
    label = 'WITHDRAWAL REQUESTED';
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

export default UserReferralDashboard;
