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

        // A. Facebook Page Messaging / Instagram DMs
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            const senderId = messagingEvent.sender?.id;
            const messageText = messagingEvent.message?.text;
            const messageId = messagingEvent.message?.mid || `msg_${Date.now()}`;

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
                  where: { metaMessageId: messageId },
                  update: {
                    messageText,
                    timestamp: new Date(),
                    status: 'SYNCED'
                  },
                  create: {
                    businessGroupId: bg.id,
                    metaMessageId: messageId,
                    senderId,
                    senderName: `User_${senderId.slice(-4)}`,
                    source: body.object === 'instagram' ? 'INSTAGRAM' : 'FACEBOOK',
                    messageText,
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
                    pageViewed: `Message from ${senderId}: "${messageText.slice(0, 50)}"`
                  }
                });
                // Forward message payload to Let'sTrack backend service if active
                const letsTrackUrls = [
                  process.env.LETSTRACK_API_URL,
                  'http://127.0.0.1:5004',
                  'http://localhost:5004'
                ].filter(Boolean);

                for (const letsTrackUrl of letsTrackUrls) {
                  try {
                    await axios.post(`${letsTrackUrl}/api/external/chat-message`, {
                      tenantApiKey: bg.letsTrackApiKey || undefined,
                      tenantId: bg.letsTrackTenantId || undefined,
                      senderId,
                      senderName: `Social User (${body.object})`,
                      source: body.object === 'instagram' ? 'INSTAGRAM_DM' : 'FACEBOOK_MESSENGER',
                      message: messageText
                    }, { timeout: 3000 });
                    console.log(`[MetaWebhook] Forwarded DM to Let'sTrack livechat at ${letsTrackUrl}`);
                    break;
                  } catch (ltErr) {
                    // Ignore fallback connection warnings
                  }
                }

                console.log(`[MetaWebhook] Synced ${body.object} DM to Let'sTrack Unified Inbox for Business: ${bg.name}`);
              }
            }
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

    // Call Meta Graph API to subscribe Facebook Page to webhooks
    const subUrl = `https://graph.facebook.com/v24.0/${bg.metaPageId}/subscribed_apps`;
    const response = await axios.post(subUrl, {
      subscribed_fields: ['messages', 'messaging_postbacks', 'feed', 'comments', 'mention'],
      access_token: bg.metaAccessToken
    });

    console.log(`[MetaWebhook] Successfully subscribed Page ${bg.metaPageId} to webhooks:`, response.data);

    return res.status(200).json({
      success: true,
      message: `Successfully subscribed ${bg.metaPageName || 'Facebook Page'} & Instagram DMs to Meta Webhooks & Let'sTrack Live Chat!`,
      data: response.data
    });
  } catch (error) {
    console.error('[MetaWebhook] Subscribe webhooks error:', error.response?.data || error.message);
    const errDetail = error.response?.data?.error?.message || 'Failed to subscribe Page to Meta webhooks.';
    return res.status(400).json({ error: errDetail });
  }
};

