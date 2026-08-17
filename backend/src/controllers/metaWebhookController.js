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
