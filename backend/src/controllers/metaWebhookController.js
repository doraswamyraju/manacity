const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

// 1. GET Webhook Verification Challenge
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'manacity_webhook_secret';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[MetaWebhook] Webhook endpoint verified successfully!');
      return res.status(200).send(challenge);
    } else {
      console.warn('[MetaWebhook] Verification failed. Token mismatch.');
      return res.sendStatus(403);
    }
  }
  return res.status(400).send('Invalid request params');
};

// 2. POST Webhook Live Event Processor (Messenger, IG DMs, Comments, Likes)
exports.handleWebhookEvent = async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'page' || body.object === 'instagram') {
      console.log(`[MetaWebhook] Incoming ${body.object} webhook event received.`);

      for (const entry of (body.entry || [])) {
        const pageOrIgId = entry.id;

        // Extract messaging events from entry.messaging, entry.standby, or entry.changes
        const messagingList = [];
        if (Array.isArray(entry.messaging)) {
          messagingList.push(...entry.messaging);
        }
        if (Array.isArray(entry.standby)) {
          messagingList.push(...entry.standby);
        }
        if (Array.isArray(entry.changes)) {
          for (const change of entry.changes) {
            if (change.value && (change.field === 'messages' || change.field === 'instagram_messages' || change.field === 'messages_instagram' || change.field === 'conversations')) {
              messagingList.push(change.value);
            }
          }
        }


        // Process Facebook Page Messaging / Instagram DMs
        for (const messagingEvent of messagingList) {
          const senderId = messagingEvent.sender?.id || messagingEvent.from?.id || messagingEvent.from;
          const messageText = messagingEvent.message?.text || messagingEvent.text?.body || (typeof messagingEvent.message === 'string' ? messagingEvent.message : null);
          const messageId = messagingEvent.message?.mid || messagingEvent.id || `msg_${Date.now()}`;

          if (senderId && messageText) {
            // Find matching BusinessGroup by metaPageId or metaInstagramId
            const bg = await prisma.businessGroup.findFirst({
              where: {
                OR: [
                  { metaPageId: pageOrIgId },
                  { metaInstagramId: pageOrIgId }
                ]
              }
            });

            if (bg) {
              // Upsert MetaSyncedMessage for Unified Inbox
              await prisma.metaSyncedMessage.upsert({
                where: { metaMessageId: String(messageId) },
                update: {
                  messageText: String(messageText),
                  timestamp: new Date(),
                  status: 'SYNCED'
                },
                create: {
                  businessGroupId: bg.id,
                  metaMessageId: String(messageId),
                  senderId: String(senderId),
                  senderName: `User_${String(senderId).slice(-4)}`,
                  source: body.object === 'instagram' ? 'INSTAGRAM' : 'FACEBOOK',
                  messageText: String(messageText),
                  status: 'SYNCED'
                }
              });

              // Also record lead/visitor entry in Let'sTrack Unified Inbox
              await prisma.letsTrackVisitor.create({
                data: {
                  businessGroupId: bg.id,
                  visitorIp: 'META_API',
                  locationCity: 'Social Message',
                  deviceType: body.object.toUpperCase(),
                  pageViewed: `Message from ${senderId}: "${String(messageText).slice(0, 50)}"`
                }
              });

              console.log(`[MetaWebhook] Synced ${body.object} DM to Let'sTrack Unified Inbox for Business: ${bg.name}`);
            }
          }
        }

        // Forward raw webhook payload directly to Let'sTrack backend service (/api/webhooks/meta)
        const letsTrackUrls = [
          process.env.LETSTRACK_API_URL,
          'http://127.0.0.1:5004',
          'http://localhost:5004'
        ].filter(Boolean);

        for (const letsTrackUrl of letsTrackUrls) {
          try {
            await axios.post(`${letsTrackUrl}/api/webhooks/meta`, body, { timeout: 3000 });
            console.log(`[MetaWebhook] Forwarded raw webhook payload to Let'sTrack at ${letsTrackUrl}/api/webhooks/meta`);
            break;
          } catch (ltErr) {
            // Ignore connection fallback error
          }
        }


        // B. Page Changes (Comments, Likes, Feed updates)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'feed' || change.field === 'comments') {
              console.log(`[MetaWebhook] Feed/Comment activity change:`, change.value);
            }
          }
        }
      }

      return res.status(200).send('EVENT_RECEIVED');
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error('[MetaWebhook] Handler catch error:', error);
    return res.status(500).send('Internal Server Error');
  }
};

// 3. Subscribe Connected Page to Meta Webhooks via Graph API
exports.subscribePageWebhooks = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const bg = await prisma.businessGroup.findFirst({ where: { ownerId } });

    if (!bg || !bg.metaAccessToken || !bg.metaPageId) {
      return res.status(400).json({ error: 'Meta Business Page connection is not active. Please connect your Facebook Page first.' });
    }

    let pageAccessToken = bg.metaAccessToken;

    // Optional: Refresh Page Access Token if User Access Token was stored
    try {
      const pageRes = await axios.get(`https://graph.facebook.com/v26.0/me/accounts?access_token=${bg.metaAccessToken}`);
      if (pageRes.data && pageRes.data.data) {
        const foundPage = pageRes.data.data.find(p => p.id === bg.metaPageId);
        if (foundPage && foundPage.access_token) {
          pageAccessToken = foundPage.access_token;
          await prisma.businessGroup.update({
            where: { id: bg.id },
            data: { metaAccessToken: pageAccessToken }
          });
        }
      }
    } catch (tokenErr) {
      // Use existing stored token smoothly
    }

    // STEP 1: Provision / Register Let'sTrack Tenant FIRST
    const letsTrackUrls = [
      process.env.LETSTRACK_API_URL,
      'http://127.0.0.1:5004',
      'http://localhost:5004'
    ].filter(Boolean);

    let provisionSuccess = false;
    let provisionedTenantId = null;

    for (const letsTrackUrl of letsTrackUrls) {
      try {
        const provRes = await axios.post(`${letsTrackUrl}/api/internal/register-meta-integration`, {
          manacityBusinessGroupId: bg.id,
          businessName: bg.name,
          ownerEmail: req.user.email,
          ownerName: req.user.name,
          metaPageId: bg.metaPageId,
          metaPageName: bg.metaPageName,
          metaInstagramAccountId: bg.metaInstagramId || undefined,
          pageAccessToken
        }, {
          headers: { 'x-provision-secret': process.env.LETSTRACK_PROVISION_SECRET || 'letstrack_manacity_internal_secret_2026' },
          timeout: 5000
        });

        if (provRes.data && provRes.data.success && provRes.data.tenantId && typeof provRes.data.tenantId === 'string' && provRes.data.tenantId.length === 24) {
          provisionSuccess = true;
          provisionedTenantId = provRes.data.tenantId;
          console.log(`[MetaProvisioning] BusinessGroup: ${bg.id} Meta Page: ${bg.metaPageId} Let'sTrack Tenant: ${provisionedTenantId} Status: SUCCESS`);
          
          // Save letsTrackTenantId to BusinessGroup
          await prisma.businessGroup.update({
            where: { id: bg.id },
            data: { letsTrackTenantId: provisionedTenantId }
          });
          break;
        }
      } catch (ltErr) {
        console.warn(`[MetaProvisioning] Call to ${letsTrackUrl} warning:`, ltErr.response?.data || ltErr.message);
      }
    }

    if (!provisionSuccess) {
      return res.status(500).json({
        error: 'Failed to provision Let\'sTrack multi-tenant inbox for your business. Webhook subscription deferred. Please retry.'
      });
    }

    // STEP 2: Subscribe Connected Page to Meta Webhooks AFTER provisioning succeeds
    const fieldOptions = [
      ['messages', 'messaging_postbacks', 'feed', 'conversations', 'mention'],
      ['messages', 'messaging_postbacks', 'feed'],
      ['messages', 'messaging_postbacks'],
      ['messages']
    ];

    let response = null;
    let lastErr = null;

    for (const fields of fieldOptions) {
      try {
        const subUrl = `https://graph.facebook.com/v26.0/${bg.metaPageId}/subscribed_apps`;
        response = await axios.post(subUrl, {
          subscribed_fields: fields,
          access_token: pageAccessToken
        });
        if (response.data && response.data.success) {
          console.log(`[MetaWebhook] Successfully subscribed Page ${bg.metaPageId} with fields [${fields.join(', ')}]:`, response.data);
          break;
        }
      } catch (err) {
        lastErr = err;
        console.warn(`[MetaWebhook] Fields [${fields.join(', ')}] subscription warning:`, err.response?.data?.error?.message || err.message);
      }
    }

    if (response && response.data && response.data.success) {
      return res.status(200).json({
        success: true,
        message: `Successfully provisioned Let'sTrack Tenant (${provisionedTenantId}) & subscribed ${bg.metaPageName || 'Facebook Page'} to Meta Webhooks!`,
        data: response.data
      });
    } else {
      console.warn(`[MetaWebhook] Webhook subscription failed for Page ${bg.metaPageId}, but Let'sTrack Tenant (${provisionedTenantId}) remains safely provisioned.`);
      const errDetail = lastErr?.response?.data?.error?.message || 'Failed to subscribe Page to Meta webhooks.';
      return res.status(400).json({ error: errDetail, tenantId: provisionedTenantId });
    }

  } catch (error) {
    console.error('[MetaWebhook] Subscribe webhooks error:', error.response?.data || error.message);
    const errDetail = error.response?.data?.error?.message || 'Failed to subscribe Page to Meta webhooks.';
    return res.status(400).json({ error: errDetail });
  }
};



