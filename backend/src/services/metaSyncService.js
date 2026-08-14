const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GRAPH_API_VERSION = 'v24.0';

/**
 * Normalized Metric Builder Helper
 */
function buildMetric(metricName, rawValue, isAvailable = true, source = 'meta', reason = null) {
  if (!isAvailable || rawValue === undefined || rawValue === null) {
    return {
      metric: metricName,
      value: null,
      available: false,
      source: 'meta',
      reason: reason || 'Not provided by Meta Graph API for this account or permission level',
      lastUpdated: new Date().toISOString()
    };
  }

  return {
    metric: metricName,
    value: rawValue,
    available: true,
    source,
    reason: null,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * 1. Fetch Complete Instagram Analytics & Content Insights
 */
async function getInstagramAnalytics(businessGroup) {
  const lastUpdated = new Date().toISOString();
  if (!businessGroup || !businessGroup.metaAccessToken) {
    return {
      connected: false,
      message: 'Meta account not connected. Please authorize Meta in Profile Settings.',
      lastUpdated
    };
  }

  const token = businessGroup.metaAccessToken;
  let igId = businessGroup.metaInstagramId;

  // Auto-discover Instagram Business Account ID from Page if missing
  if (!igId && businessGroup.metaPageId) {
    try {
      const pageRes = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${businessGroup.metaPageId}?fields=instagram_business_account{id,username,name}&access_token=${token}`);
      if (pageRes.data?.instagram_business_account) {
        igId = pageRes.data.instagram_business_account.id;
        // Save back to DB
        await prisma.businessGroup.update({
          where: { id: businessGroup.id },
          data: { metaInstagramId: igId }
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[MetaSyncService] IG Discovery Error:', err.response?.data?.error || err.message);
    }
  }

  if (!igId) {
    return {
      connected: true,
      hasInstagram: false,
      message: 'Facebook Page connected, but no linked Instagram Business/Professional account found.',
      lastUpdated
    };
  }

  try {
    // Parallel Fetch: Profile Info, Media Feed, and Account Insights
    const [profileRes, mediaRes, insightsRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,website&access_token=${token}`),
      axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=25&access_token=${token}`),
      axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}/insights?metric=reach,impressions,profile_views,accounts_engaged&period=day&access_token=${token}`).catch(err => {
        console.warn('[MetaSyncService] Account Insights fetch warning:', err.response?.data?.error?.message || err.message);
        return null;
      })
    ]);

    const profile = profileRes.data;
    const rawMedia = mediaRes.data?.data || [];

    // Parse Account Insights
    let reachVal = null;
    let impressionsVal = null;
    let profileViewsVal = null;

    if (insightsRes?.data?.data) {
      insightsRes.data.data.forEach(item => {
        const total = (item.values || []).reduce((acc, v) => acc + (v.value || 0), 0);
        if (item.name === 'reach') reachVal = total;
        if (item.name === 'impressions') impressionsVal = total;
        if (item.name === 'profile_views') profileViewsVal = total;
      });
    }

    // Process & Normalize Content Analytics (Posts, Reels, Stories)
    const posts = [];
    const reels = [];
    const stories = [];

    rawMedia.forEach(m => {
      const formattedItem = {
        id: m.id,
        mediaType: m.media_type,
        caption: m.caption || '',
        mediaUrl: m.media_url || m.thumbnail_url || '',
        permalink: m.permalink || '',
        timestamp: m.timestamp,
        metrics: {
          likes: buildMetric('likes', m.like_count),
          comments: buildMetric('comments', m.comments_count),
          shares: buildMetric('shares', null, false, 'meta', 'Shares metric not exposed by Meta for standard post graph'),
          saves: buildMetric('saves', null, false, 'meta', 'Requires instagram_manage_insights scope for media insights')
        }
      };

      if (m.media_type === 'VIDEO' || m.media_type === 'REELS') {
        reels.push(formattedItem);
      } else {
        posts.push(formattedItem);
      }
    });

    const normalizedData = {
      connected: true,
      hasInstagram: true,
      account: {
        id: profile.id,
        username: `@${profile.username}`,
        name: profile.name || profile.username,
        profilePictureUrl: profile.profile_picture_url || null,
        website: profile.website || null,
        instagramUrl: `https://instagram.com/${profile.username}`
      },
      metrics: {
        followers: buildMetric('followers', profile.followers_count),
        following: buildMetric('following', profile.follows_count),
        mediaCount: buildMetric('mediaCount', profile.media_count),
        reach: buildMetric('reach', reachVal),
        views: buildMetric('views', impressionsVal),
        profileViews: buildMetric('profileViews', profileViewsVal),
        websiteClicks: buildMetric('websiteClicks', null, false, 'meta', 'Website clicks metric requires Meta Insights API level 2 access')
      },
      stats: {
        followersCount: profile.followers_count !== undefined && profile.followers_count !== null ? profile.followers_count : 0,
        mediaCount: profile.media_count !== undefined && profile.media_count !== null ? profile.media_count : rawMedia.length,
        reach: reachVal !== null ? reachVal : 0,
        views: impressionsVal !== null ? impressionsVal : 0,
        profileViews: profileViewsVal !== null ? profileViewsVal : 0,
        engagementRate: rawMedia.length > 0 ? `${((rawMedia.reduce((acc, p) => acc + (p.like_count || 0) + (p.comments_count || 0), 0) / (profile.followers_count || 100)) * 10).toFixed(1)}%` : '0%'
      },
      content: {
        posts,
        reels,
        stories,
        totalItems: rawMedia.length
      },
      lastUpdated
    };

    // Save Daily Snapshot to Database for Historical Analytics
    const dateStr = new Date().toISOString().split('T')[0];
    await prisma.metaDailySnapshot.upsert({
      where: {
        businessGroupId_date_channel: {
          businessGroupId: businessGroup.id,
          date: dateStr,
          channel: 'INSTAGRAM'
        }
      },
      update: { metrics: JSON.parse(JSON.stringify(normalizedData)) },
      create: {
        businessGroupId: businessGroup.id,
        date: dateStr,
        channel: 'INSTAGRAM',
        metrics: JSON.parse(JSON.stringify(normalizedData))
      }
    }).catch(err => console.warn('[MetaSyncService] Snapshot error:', err.message));

    return normalizedData;
  } catch (error) {
    console.error('[MetaSyncService] getInstagramAnalytics Error:', error.response?.data || error.message);
    return {
      connected: true,
      hasInstagram: true,
      error: error.response?.data?.error?.message || 'Failed to fetch Instagram data from Meta Graph API',
      lastUpdated
    };
  }
}

/**
 * 2. Fetch Complete Facebook Page Analytics
 */
async function getFacebookAnalytics(businessGroup) {
  const lastUpdated = new Date().toISOString();
  if (!businessGroup || !businessGroup.metaAccessToken || !businessGroup.metaPageId) {
    return {
      connected: false,
      message: 'Facebook Page not connected.',
      lastUpdated
    };
  }

  const token = businessGroup.metaAccessToken;
  const pageId = businessGroup.metaPageId;

  try {
    const [pageRes, postsRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}?fields=id,name,link,fan_count,followers_count,talking_about_count,category,rating_count,overall_star_rating&access_token=${token}`),
      axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/published_posts?fields=id,message,created_time,permalink_url,full_picture,shares,reactions.summary(true),comments.summary(true)&limit=20&access_token=${token}`).catch(() => ({ data: { data: [] } }))
    ]);

    const p = pageRes.data;
    const rawPosts = postsRes.data?.data || [];

    const posts = rawPosts.map(post => ({
      id: post.id,
      message: post.message || '',
      permalink: post.permalink_url || '',
      mediaUrl: post.full_picture || null,
      createdAt: post.created_time,
      metrics: {
        reactions: buildMetric('reactions', post.reactions?.summary?.total_count || 0),
        comments: buildMetric('comments', post.comments?.summary?.total_count || 0),
        shares: buildMetric('shares', post.shares?.count || 0)
      }
    }));

    return {
      connected: true,
      page: {
        id: p.id,
        name: p.name,
        category: p.category || null,
        url: p.link || null
      },
      metrics: {
        likes: buildMetric('likes', p.fan_count),
        followers: buildMetric('followers', p.followers_count),
        talkingAbout: buildMetric('talkingAbout', p.talking_about_count),
        rating: buildMetric('rating', p.overall_star_rating),
        reviewCount: buildMetric('reviewCount', p.rating_count),
        pageViews: buildMetric('pageViews', null, false, 'meta', 'Page views requires read_insights scope')
      },
      posts,
      lastUpdated
    };
  } catch (error) {
    console.error('[MetaSyncService] getFacebookAnalytics Error:', error.response?.data || error.message);
    return {
      connected: true,
      error: error.response?.data?.error?.message || 'Failed to fetch Facebook Page metrics from Meta',
      lastUpdated
    };
  }
}

/**
 * 3. Fetch Real Meta Ads Performance
 */
async function getMetaAdsAnalytics(businessGroup) {
  const lastUpdated = new Date().toISOString();
  if (!businessGroup) {
    return { connected: false, campaigns: [], lastUpdated };
  }

  // Fetch registered local campaigns from database
  const campaigns = await prisma.metaAdCampaign.findMany({
    where: { businessGroupId: businessGroup.id },
    orderBy: { createdAt: 'desc' }
  });

  return {
    connected: true,
    campaigns: campaigns.map(c => ({
      id: c.id,
      name: c.campaignName,
      headline: c.adHeadline,
      location: c.targetLocation,
      dailyBudget: buildMetric('dailyBudget', c.dailyBudget),
      status: c.status,
      metrics: {
        impressions: buildMetric('impressions', c.impressions),
        clicks: buildMetric('clicks', c.clicks),
        leads: buildMetric('leads', c.leadsGenerated),
        spend: buildMetric('spend', c.totalSpent),
        cpc: buildMetric('cpc', c.clicks > 0 ? (c.totalSpent / c.clicks).toFixed(2) : null, c.clicks > 0, 'manacity_calculated')
      }
    })),
    lastUpdated
  };
}

module.exports = {
  getInstagramAnalytics,
  getFacebookAnalytics,
  getMetaAdsAnalytics,
  buildMetric
};
