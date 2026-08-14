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
 * Helper to log Meta Graph API errors safely without exposing tokens
 */
function logMetaError(endpoint, error) {
  const errData = error.response?.data?.error || {};
  console.error(`[MetaGraphAPI Error] Endpoint: ${endpoint}`, {
    message: errData.message || error.message,
    type: errData.type || 'UnknownType',
    code: errData.code || error.response?.status || 'UnknownCode',
    subcode: errData.error_subcode || null,
    fbtrace_id: errData.fbtrace_id || null,
    status: error.response?.status || 500
  });
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
        await prisma.businessGroup.update({
          where: { id: businessGroup.id },
          data: { metaInstagramId: igId }
        }).catch(() => {});
      }
    } catch (err) {
      logMetaError(`GET /${businessGroup.metaPageId}?fields=instagram_business_account`, err);
    }
  }

  if (!igId) {
    return {
      connected: true,
      hasInstagram: false,
      message: 'Facebook Page connected, but no Instagram Business/Professional account is linked to this Facebook Page.',
      lastUpdated
    };
  }

  // Query Instagram Insights metrics individually so unsupported metrics don't break remaining metrics
  const [reachRes, impressionsRes, profileViewsRes, accountRes] = await Promise.allSettled([
    axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}/insights?metric=reach&period=day&access_token=${token}`),
    axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}/insights?metric=impressions&period=day&access_token=${token}`),
    axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}/insights?metric=profile_views&period=day&access_token=${token}`),
    axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}/insights?metric=accounts_engaged&period=day&access_token=${token}`)
  ]);

  let reachVal = null;
  let reachError = null;
  if (reachRes.status === 'fulfilled') {
    const vals = reachRes.value.data?.data?.[0]?.values || [];
    reachVal = vals.reduce((acc, v) => acc + (v.value || 0), 0);
  } else {
    reachError = reachRes.reason.response?.data?.error?.message || 'Reach metric unavailable or permission restricted';
    logMetaError(`GET /${igId}/insights?metric=reach`, reachRes.reason);
  }

  let impressionsVal = null;
  let impressionsError = null;
  if (impressionsRes.status === 'fulfilled') {
    const vals = impressionsRes.value.data?.data?.[0]?.values || [];
    impressionsVal = vals.reduce((acc, v) => acc + (v.value || 0), 0);
  } else {
    impressionsError = impressionsRes.reason.response?.data?.error?.message || 'Impressions metric unavailable';
    logMetaError(`GET /${igId}/insights?metric=impressions`, impressionsRes.reason);
  }

  let profileViewsVal = null;
  let profileViewsError = null;
  if (profileViewsRes.status === 'fulfilled') {
    const vals = profileViewsRes.value.data?.data?.[0]?.values || [];
    profileViewsVal = vals.reduce((acc, v) => acc + (v.value || 0), 0);
  } else {
    profileViewsError = profileViewsRes.reason.response?.data?.error?.message || 'Profile views metric unavailable';
    logMetaError(`GET /${igId}/insights?metric=profile_views`, profileViewsRes.reason);
  }

  // Profile data
  let profile = null;
  let profileError = null;
  if (profileResult.status === 'fulfilled') {
    profile = profileResult.value.data;
  } else {
    logMetaError(`GET /${igId} profile`, profileResult.reason);
    profileError = profileResult.reason.response?.data?.error?.message || 'Failed to retrieve profile stats from Meta';
  }

  // Media data
  let rawMedia = [];
  let mediaError = null;
  if (mediaResult.status === 'fulfilled') {
    rawMedia = mediaResult.value.data?.data || [];
  } else {
    logMetaError(`GET /${igId}/media`, mediaResult.reason);
    mediaError = mediaResult.reason.response?.data?.error?.message || 'Failed to retrieve media from Meta';
  }

  // Process & Normalize Content Analytics
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
        saves: buildMetric('saves', null, false, 'meta', 'Requires instagram_manage_insights scope')
      }
    };

    if (m.media_type === 'VIDEO' || m.media_type === 'REELS') {
      reels.push(formattedItem);
    } else {
      posts.push(formattedItem);
    }
  });

  // Calculate overall syncStatus and collect diagnostic info
  let syncStatus = 'LIVE';
  let lastError = profileError || reachError || impressionsError || profileViewsError || mediaError || null;

  if (profileError && reachError && impressionsError && mediaError) {
    syncStatus = 'ERROR';
  } else if (profileError || reachError || impressionsError || profileViewsError || mediaError) {
    syncStatus = 'PARTIAL';
  }

  const maskId = (id) => (id ? `${id.substring(0, 4)}...${id.substring(id.length - 4)}` : 'Not set');

  const metaErrDetails = profileResult.status === 'rejected' ? profileResult.reason.response?.data?.error :
    (reachRes.status === 'rejected' ? reachRes.reason.response?.data?.error : null);

  const normalizedData = {
    connected: true,
    hasInstagram: true,
    syncStatus, // LIVE, PARTIAL, ERROR
    account: profile ? {
      id: profile.id,
      username: `@${profile.username}`,
      name: profile.name || profile.username,
      profilePictureUrl: profile.profile_picture_url || null,
      website: profile.website || null,
      instagramUrl: `https://instagram.com/${profile.username}`
    } : null,
    metrics: {
      followers: buildMetric('followers', profile?.followers_count, profile?.followers_count !== undefined && profile?.followers_count !== null, 'meta', profileError),
      following: buildMetric('following', profile?.follows_count, profile?.follows_count !== undefined && profile?.follows_count !== null, 'meta', profileError),
      mediaCount: buildMetric('mediaCount', profile?.media_count, profile?.media_count !== undefined && profile?.media_count !== null, 'meta', profileError),
      reach: buildMetric('reach', reachVal, reachVal !== null, 'meta', reachError),
      views: buildMetric('views', impressionsVal, impressionsVal !== null, 'meta', impressionsError),
      profileViews: buildMetric('profileViews', profileViewsVal, profileViewsVal !== null, 'meta', profileViewsError)
    },
    stats: {
      followersCount: profile?.followers_count !== undefined && profile?.followers_count !== null ? profile.followers_count : null,
      mediaCount: profile?.media_count !== undefined && profile?.media_count !== null ? profile.media_count : null,
      reach: reachVal,
      views: impressionsVal,
      profileViews: profileViewsVal
    },
    content: {
      posts,
      reels,
      stories,
      totalItems: rawMedia.length,
      error: mediaError
    },
    diagnostics: {
      apiVersion: GRAPH_API_VERSION,
      pageIdMasked: maskId(businessGroup.metaPageId),
      instagramIdMasked: maskId(igId),
      syncStatus,
      lastUpdated,
      lastError,
      errorCode: metaErrDetails?.code || null,
      errorType: metaErrDetails?.type || null,
      fbtraceId: metaErrDetails?.fbtrace_id || null
    },
    lastUpdated
  };

  return normalizedData;
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

  const [pageResult, postsResult, pageInsightsResult] = await Promise.allSettled([
    axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}?fields=id,name,link,fan_count,followers_count,talking_about_count,category,rating_count,overall_star_rating&access_token=${token}`),
    axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/published_posts?fields=id,message,created_time,permalink_url,full_picture,shares,reactions.summary(true),comments.summary(true)&limit=20&access_token=${token}`),
    axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/insights?metric=page_impressions,page_views_total&period=day&access_token=${token}`)
  ]);

  // Page basic info
  let p = null;
  let pageError = null;
  if (pageResult.status === 'fulfilled') {
    p = pageResult.value.data;
  } else {
    logMetaError(`GET /${pageId}`, pageResult.reason);
    pageError = pageResult.reason.response?.data?.error?.message || 'Failed to retrieve Facebook Page metrics';
  }

  // Posts info
  let rawPosts = [];
  if (postsResult.status === 'fulfilled') {
    rawPosts = postsResult.value.data?.data || [];
  } else {
    logMetaError(`GET /${pageId}/published_posts`, postsResult.reason);
  }

  // Page Insights (Real Reach/Impressions)
  let pageReachVal = null;
  let pageInsightsError = null;
  if (pageInsightsResult.status === 'fulfilled') {
    const insightsList = pageInsightsResult.value.data?.data || [];
    const reachMetric = insightsList.find(m => m.name === 'page_impressions' || m.name === 'page_views_total');
    if (reachMetric?.values?.length) {
      pageReachVal = reachMetric.values.reduce((acc, v) => acc + (v.value || 0), 0);
    }
  } else {
    logMetaError(`GET /${pageId}/insights`, pageInsightsResult.reason);
    pageInsightsError = pageInsightsResult.reason.response?.data?.error?.message || 'Page impressions require read_insights permission';
  }

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

  let syncStatus = 'LIVE';
  let lastError = pageError || pageInsightsError || null;
  if (pageError && pageInsightsError) {
    syncStatus = 'ERROR';
  } else if (pageError || pageInsightsError) {
    syncStatus = 'PARTIAL';
  }

  const maskId = (id) => (id ? `${id.substring(0, 4)}...${id.substring(id.length - 4)}` : 'Not set');

  const fbErrDetails = pageResult.status === 'rejected' ? pageResult.reason.response?.data?.error :
    (pageInsightsResult.status === 'rejected' ? pageInsightsResult.reason.response?.data?.error : null);

  return {
    connected: true,
    syncStatus,
    page: p ? {
      id: p.id,
      name: p.name,
      category: p.category || null,
      url: p.link || null
    } : null,
    metrics: {
      likes: buildMetric('likes', p?.fan_count, p !== null, 'meta', pageError),
      followers: buildMetric('followers', p?.followers_count, p !== null, 'meta', pageError),
      talkingAbout: buildMetric('talkingAbout', p?.talking_about_count, p !== null, 'meta', pageError),
      rating: buildMetric('rating', p?.overall_star_rating, p !== null, 'meta', pageError),
      reviewCount: buildMetric('reviewCount', p?.rating_count, p !== null, 'meta', pageError),
      pageReach: buildMetric('pageReach', pageReachVal, pageReachVal !== null, 'meta', pageInsightsError)
    },
    stats: {
      followersCount: p?.followers_count !== undefined && p?.followers_count !== null ? p.followers_count : null,
      fanCount: p?.fan_count !== undefined && p?.fan_count !== null ? p.fan_count : null,
      monthlyReach: pageReachVal,
      talkingAbout: p?.talking_about_count !== undefined && p?.talking_about_count !== null ? p.talking_about_count : null
    },
    posts,
    diagnostics: {
      apiVersion: GRAPH_API_VERSION,
      pageIdMasked: maskId(pageId),
      syncStatus,
      lastUpdated,
      lastError,
      errorCode: fbErrDetails?.code || null,
      errorType: fbErrDetails?.type || null,
      fbtraceId: fbErrDetails?.fbtrace_id || null
    },
    lastUpdated
  };
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
