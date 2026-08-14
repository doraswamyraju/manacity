import React, { useState } from 'react';
import axios from 'axios';

export default function MetaConnectCard({ initialData, onMetaConnected }) {
  const [connecting, setConnecting] = useState(false);
  const [connectedPage, setConnectedPage] = useState(initialData?.metaPageName || null);
  const [connectedIg, setConnectedIg] = useState(initialData?.socialInstagram || null);
  const [error, setError] = useState('');

  const handleFacebookLogin = () => {
    setConnecting(true);
    setError('');

    const appId = '1311990813621733';
    const redirectUri = encodeURIComponent('https://manacity.in');
    const scope = encodeURIComponent('public_profile,email,pages_show_list,pages_read_engagement,instagram_basic');
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
                setConnectedPage(res.data.pageName);
                setConnectedIg(res.data.instagramHandle);
                if (onMetaConnected) {
                  onMetaConnected({
                    metaPageId: res.data.pageId,
                    metaPageName: res.data.pageName,
                    socialFacebook: res.data.facebookUrl,
                    socialInstagram: res.data.instagramUrl,
                    metaAccessToken: accessToken
                  });
                }
              }
            })
            .catch((err) => {
              console.error('Meta connection error:', err);
              setError('Failed to fetch Facebook Page details. Please try again.');
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
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(24, 119, 242, 0.2)', fontSize: '0.82rem', color: '#10b981', display: 'flex', gap: '1.5rem' }}>
          <span>✓ Connected Facebook Page: <strong>{connectedPage}</strong></span>
          {connectedIg && <span>✓ Linked Instagram: <strong>{connectedIg}</strong></span>}
        </div>
      )}

      {error && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>{error}</span>}
    </div>
  );
}
