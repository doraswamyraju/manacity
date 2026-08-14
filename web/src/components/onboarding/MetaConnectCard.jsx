import React, { useState } from 'react';
import axios from 'axios';

export default function MetaConnectCard({ initialData, onMetaConnected }) {
  const [connecting, setConnecting] = useState(false);
  const [connectedPage, setConnectedPage] = useState(initialData?.metaPageName || null);
  const [connectedIg, setConnectedIg] = useState(initialData?.socialInstagram || null);
  const [availablePages, setAvailablePages] = useState([]);
  const [showPageModal, setShowPageModal] = useState(false);
  const [metaToken, setMetaToken] = useState('');
  const [error, setError] = useState('');

  const handleSelectPage = async (page) => {
    try {
      await axios.post('/api/marketing/meta/connect', { accessToken: metaToken, selectedPageId: page.pageId });
      setConnectedPage(page.pageName);
      setConnectedIg(page.instagramHandle);
      setShowPageModal(false);

      if (onMetaConnected) {
        onMetaConnected({
          metaPageId: page.pageId,
          metaPageName: page.pageName,
          socialFacebook: page.facebookUrl,
          socialInstagram: page.instagramUrl,
          metaAccessToken: metaToken
        });
      }
    } catch (e) {
      setError('Failed to select page.');
    }
  };

  const handleFacebookLogin = () => {
    setConnecting(true);
    setError('');

    const appId = '1311990813621733';
    const redirectUri = encodeURIComponent('https://manacity.in');
    const scope = encodeURIComponent('public_profile,email,pages_show_list,pages_read_engagement,pages_read_user_content,instagram_basic,business_management');
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    // Open real Meta Facebook OAuth popup window directly
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      'Facebook OAuth Login',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
    );

    // Listen for hash fragment token return or popup close
    const checkPopup = setInterval(() => {
      try {
        if (popup && popup.location && popup.location.href.includes('access_token')) {
          const hashParams = new URLSearchParams(popup.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          popup.close();
          clearInterval(checkPopup);

          // Exchange token for page details via backend API
          axios.post('/api/marketing/meta/connect', { accessToken })
            .then((res) => {
              if (res.data && res.data.success) {
                if (res.data.pages && res.data.pages.length > 1) {
                  setAvailablePages(res.data.pages);
                  setShowPageModal(true);
                  setMetaToken(accessToken);
                } else if (res.data.selectedPage) {
                  const sel = res.data.selectedPage;
                  setConnectedPage(sel.pageName);
                  setConnectedIg(sel.instagramHandle);
                  if (onMetaConnected) {
                    onMetaConnected({
                      metaPageId: sel.pageId,
                      metaPageName: sel.pageName,
                      socialFacebook: sel.facebookUrl,
                      socialInstagram: sel.instagramUrl,
                      metaAccessToken: accessToken
                    });
                  }
                }
              }
            })
            .catch((err) => {
              console.error('Meta connection error:', err);
              const errMsg = err.response?.data?.error || 'Failed to fetch Facebook Business Page details.';
              setError(errMsg);
            })
            .finally(() => setConnecting(false));
        } else if (!popup || popup.closed) {
          clearInterval(checkPopup);
          setConnecting(false);
        }
      } catch (e) {
        // Cross-origin restriction while user navigates Facebook dialog
      }
    }, 500);
  };

  return (
    <div style={{
      backgroundColor: 'rgba(24, 119, 242, 0.08)',
      border: '1px solid rgba(24, 119, 242, 0.3)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
            <strong style={{ color: '#1877f2', fontSize: '1rem' }}>Meta Instant Integration (sriddha.com Setup)</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Connect your Facebook Page & Instagram Business profile in 1-click. Auto-fills URLs and enables Meta Ads.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFacebookLogin}
          disabled={connecting}
          style={{
            backgroundColor: '#1877f2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.25rem',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(24, 119, 242, 0.3)'
          }}
        >
          {connecting ? (
            <span>Connecting Meta Assets...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {connectedPage ? '✓ Meta Connected' : 'Connect Facebook & Instagram'}
            </>
          )}
        </button>
      </div>

      {connectedPage && (
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(24, 119, 242, 0.2)', fontSize: '0.82rem', color: '#10b981', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span>✓ Connected Facebook Page: <strong>{connectedPage}</strong></span>
          {connectedIg && <span>✓ Linked Instagram: <strong>{connectedIg}</strong></span>}
        </div>
      )}

      {error && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>{error}</span>}

      {/* Managed Page Selection Modal */}
      {showPageModal && availablePages.length > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999999, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#0f172a', border: '1px solid #1877f2', borderRadius: '16px',
            padding: '1.75rem', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.9)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 0.5rem 0' }}>
              Select Facebook Page to Connect
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              We found multiple Facebook Pages associated with your account. Select the page for your business:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {availablePages.map(page => (
                <div
                  key={page.pageId}
                  onClick={() => handleSelectPage(page)}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1877f2'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <div>
                    <strong style={{ color: '#fff', display: 'block', fontSize: '0.95rem' }}>{page.pageName}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#60a5fa' }}>{page.facebookUrl}</span>
                    {page.instagramHandle && (
                      <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginTop: '0.15rem' }}>
                        Linked Instagram: {page.instagramHandle}
                      </span>
                    )}
                  </div>
                  <button type="button" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#1877f2', color: '#fff', fontSize: '0.78rem', fontWeight: 700 }}>
                    Select
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPageModal(false)}
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
