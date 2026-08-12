const PROVISION_SECRET = process.env.LETSTRACK_PROVISION_SECRET || 'letstrack_manacity_internal_secret_2026';

/**
 * Provisions a tenant and admin user in LetsTrack automatically for a ManaCity business.
 * @param {Object} params
 * @param {string} params.businessName
 * @param {string} [params.domain]
 * @param {string} params.ownerName
 * @param {string} params.ownerEmail
 * @returns {Promise<{ apiKey: string, tenantId: string } | null>}
 */
export async function provisionLetsTrackTenant({ businessName, domain, ownerName, ownerEmail }) {
  if (!businessName || !ownerEmail) {
    console.error('[LetsTrack Provisioning] Missing required parameters');
    return null;
  }

  const normalizedDomain = domain ? (domain.startsWith('http') ? domain : `https://${domain}`) : 'https://manacity.in';

  const urlsToTry = [
    process.env.LETSTRACK_API_URL,
    'http://127.0.0.1:5004',
    'http://localhost:5004',
    'https://livechat.vrhere.in'
  ].filter(Boolean);

  for (const baseUrl of urlsToTry) {
    try {
      const response = await fetch(`${baseUrl}/api/internal/provision-tenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-provision-secret': PROVISION_SECRET
        },
        body: JSON.stringify({
          tenantName: businessName,
          domain: normalizedDomain,
          adminName: ownerName || businessName,
          email: ownerEmail
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[LetsTrack Provisioning] Successfully provisioned tenant via', baseUrl, 'Tenant ID:', data.tenant?.id);
        return {
          apiKey: data.tenant?.apiKey,
          tenantId: data.tenant?.id
        };
      }
      const errorText = await response.text();
      console.warn('[LetsTrack Provisioning] Attempt at', baseUrl, 'failed:', response.status, errorText);
    } catch (err) {
      console.warn('[LetsTrack Provisioning] Connection error trying', baseUrl, err.message);
    }
  }

  console.error('[LetsTrack Provisioning] All fallback endpoints failed for owner:', ownerEmail);
  return null;
}
