const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

async function processScheduledPosts() {
  try {
    const now = new Date();
    const pendingPosts = await prisma.scheduledPost.findMany({

      where: {
        status: 'PENDING',
        scheduledTime: { lte: now }
      },
      include: {
        businessGroup: true
      }
    });

    if (pendingPosts.length === 0) return;

    console.log(`[ScheduledPostWorker] Found ${pendingPosts.length} pending posts to publish.`);

    for (const post of pendingPosts) {
      const bg = post.businessGroup;
      if (!bg || !bg.metaAccessToken) {
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'FAILED', errorMessage: 'No valid Meta Access Token found for Business Group.' }
        });
        continue;
      }

      let publishedCount = 0;
      let lastError = null;

      // 1. Publish to Facebook Page if requested
      if (post.targetPlatforms.includes('FACEBOOK') && bg.metaPageId) {
        try {
          const fbUrl = `https://graph.facebook.com/v24.0/${bg.metaPageId}/feed`;
          const params = {
            message: post.caption,
            access_token: bg.metaAccessToken
          };
          if (post.mediaUrl) {
            params.link = post.mediaUrl;
          }
          const fbRes = await axios.post(fbUrl, params);
          if (fbRes.data && fbRes.data.id) {
            publishedCount++;
          }
        } catch (fbErr) {
          console.error(`[ScheduledPostWorker] FB Post Error for ${post.id}:`, fbErr.response?.data || fbErr.message);
          lastError = fbErr.response?.data?.error?.message || fbErr.message;
        }
      }

      // 2. Publish to Instagram if requested
      if (post.targetPlatforms.includes('INSTAGRAM') && bg.metaInstagramId) {
        try {
          // Step 1: Create Media Container
          const containerUrl = `https://graph.facebook.com/v24.0/${bg.metaInstagramId}/media`;
          const containerRes = await axios.post(containerUrl, {
            image_url: post.mediaUrl,
            caption: post.caption,
            access_token: bg.metaAccessToken
          });

          if (containerRes.data && containerRes.data.id) {
            const creationId = containerRes.data.id;
            // Step 2: Publish Container
            const publishUrl = `https://graph.facebook.com/v24.0/${bg.metaInstagramId}/media_publish`;
            const pubRes = await axios.post(publishUrl, {
              creation_id: creationId,
              access_token: bg.metaAccessToken
            });

            if (pubRes.data && pubRes.data.id) {
              publishedCount++;
            }
          }
        } catch (igErr) {
          console.error(`[ScheduledPostWorker] IG Post Error for ${post.id}:`, igErr.response?.data || igErr.message);
          lastError = igErr.response?.data?.error?.message || igErr.message;
        }
      }

      // Update Post Status
      if (publishedCount > 0) {
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'PUBLISHED', publishedPostId: `pub_${Date.now()}` }
        });
        console.log(`[ScheduledPostWorker] Successfully published post ID: ${post.id}`);
      } else {
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'FAILED', errorMessage: lastError || 'Failed to publish to selected Meta platforms.' }
        });
      }
    }
  } catch (error) {
    console.error('[ScheduledPostWorker] Error processing scheduled posts:', error);
  }
}

function startScheduledPostCron(intervalMs = 60000) {
  console.log(`[ScheduledPostWorker] Initialized background scheduler worker (Interval: ${intervalMs}ms).`);
  setInterval(processScheduledPosts, intervalMs);
}

module.exports = {
  processScheduledPosts,
  startScheduledPostCron
};
