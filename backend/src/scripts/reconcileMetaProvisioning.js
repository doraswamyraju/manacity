const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
require('dotenv').config();

const prisma = new PrismaClient();

async function reconcile() {
  console.log('[ReconcileScript] Starting Meta asset auto-provisioning reconciliation...');

  const businessGroups = await prisma.businessGroup.findMany({
    where: {
      metaPageId: { not: null }
    },
    include: {
      owner: true
    }
  });

  console.log(`[ReconcileScript] Found ${businessGroups.length} BusinessGroups with Meta Page IDs.`);

  const letsTrackUrls = [
    process.env.LETSTRACK_API_URL,
    'http://127.0.0.1:5004',
    'http://localhost:5004'
  ].filter(Boolean);

  for (const bg of businessGroups) {
    console.log(`[ReconcileScript] Reconciling BusinessGroup: ${bg.name} (${bg.id}) Page: ${bg.metaPageId}`);

    for (const letsTrackUrl of letsTrackUrls) {
      try {
        const res = await axios.post(`${letsTrackUrl}/api/internal/register-meta-integration`, {
          manacityBusinessGroupId: bg.id,
          businessName: bg.name,
          ownerEmail: bg.owner?.email || 'test@manacity.in',
          ownerName: bg.owner?.name || bg.name,
          metaPageId: bg.metaPageId,
          metaPageName: bg.metaPageName || bg.name,
          metaInstagramAccountId: bg.metaInstagramId || '17841447931070784',
          pageAccessToken: bg.metaAccessToken || ''
        }, {
          headers: { 'x-provision-secret': 'letstrack_manacity_internal_secret_2026' },
          timeout: 5000
        });

        console.log(`[ReconcileScript] Successfully provisioned Let'sTrack Tenant for ${bg.name}:`, res.data);
        break;
      } catch (err) {
        console.warn(`[ReconcileScript] Could not reach Let'sTrack at ${letsTrackUrl}:`, err.message);
      }
    }
  }

  console.log('[ReconcileScript] Reconciliation completed.');
  await prisma.$disconnect();
}

reconcile().catch(err => {
  console.error('[ReconcileScript] Error during reconciliation:', err);
  prisma.$disconnect();
});
