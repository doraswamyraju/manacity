const LETSTRACK_API_URL = process.env.LETSTRACK_API_URL || 'http://localhost:5004';
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

  try {
    const response = await fetch(`${LETSTRACK_API_URL}/api/internal/provision-tenant`, {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[LetsTrack Provisioning] Failed with status', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('[LetsTrack Provisioning] Successfully provisioned tenant:', data.tenant?.id);
    return {
      apiKey: data.tenant?.apiKey,
      tenantId: data.tenant?.id
    };
  } catch (error) {
    console.error('[LetsTrack Provisioning] Error provisioning tenant in LetsTrack:', error);
    return null;
  }
}
