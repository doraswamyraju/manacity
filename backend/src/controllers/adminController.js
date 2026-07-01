const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Retrieve system analytics and platform health metrics
exports.getSystemMetrics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalLocations = await prisma.location.count();
    const totalWebsites = await prisma.website.count();
    const totalReviews = await prisma.review.count();

    // Query active plans segmentations
    const users = await prisma.user.findMany({
      select: {
        plan: true
      }
    });

    const plansBreakdown = {
      FREE: 0,
      GROWTH: 0,
      ENTERPRISE: 0
    };

    users.forEach(u => {
      if (plansBreakdown[u.plan] !== undefined) {
        plansBreakdown[u.plan]++;
      } else {
        plansBreakdown.FREE++; // fallback default
      }
    });

    // Mock logs for platform auditing
    const auditLogs = [
      { id: '1', action: 'DATABASE_BACKUP', details: 'Automated cluster backup completed successfully.', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', action: 'API_SYNC', details: 'GBP queue processed 0 active webhooks.', timestamp: new Date(Date.now() - 7200000) },
      { id: '3', action: 'STRIPE_WEBHOOK', details: 'Invoice payment succeeded for user: guest@manacity.in', timestamp: new Date(Date.now() - 14400000) }
    ];

    res.json({
      status: 'success',
      metrics: {
        totalUsers,
        totalLocations,
        totalWebsites,
        totalReviews,
        plansBreakdown
      },
      auditLogs
    });
  } catch (error) {
    console.error('Super Admin metrics fetch failed:', error);
    res.status(500).json({ error: 'Failed to aggregate administrative metrics.' });
  }
};
