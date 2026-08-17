const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
require('dotenv').config();

const prisma = new PrismaClient();
const isDryRun = process.argv.includes('--dry-run');

async function reconcile() {
  console.log(`[ReconcileScript] Starting Meta asset auto-provisioning reconciliation ${isDryRun ? '(DRY-RUN MODE - Read Only)' : '(LIVE MODE)'}...`);

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
    if (isDryRun) {
      console.log(`[DRY-RUN] Would reconcile BusinessGroup: ${bg.name} (${bg.id}) | Page ID: ${bg.metaPageId} | Existing letsTrackTenantId: ${bg.letsTrackTenantId || 'NONE'}`);
      continue;
    }

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
          metaInstagramAccountId: bg.metaInstagramId || undefined,
          pageAccessToken: bg.metaAccessToken || ''
        }, {
          headers: { 'x-provision-secret': process.env.LETSTRACK_PROVISION_SECRET || 'letstrack_manacity_internal_secret_2026' },
          timeout: 5000
        });

        if (res.data && res.data.success && res.data.tenantId) {
          console.log(`[ReconcileScript] Successfully provisioned Let'sTrack Tenant for ${bg.name}: Tenant ID ${res.data.tenantId}`);
          const updateData = { letsTrackTenantId: res.data.tenantId };
          if (res.data.apiKey) {
            updateData.letsTrackApiKey = res.data.apiKey;
          }
          await prisma.businessGroup.update({
            where: { id: bg.id },
            data: updateData
          });

        }
        break;
      } catch (err) {
        console.warn(`[ReconcileScript] Could not reach Let'sTrack at ${letsTrackUrl}:`, err.response?.data || err.message);
      }
    }
  }

  console.log(`[ReconcileScript] Reconciliation completed ${isDryRun ? '(DRY-RUN - No database mutations executed)' : 'successfully'}.`);
  await prisma.$disconnect();
}

reconcile().catch(err => {
  console.error('[ReconcileScript] Error during reconciliation:', err);
  prisma.$disconnect();
});
