const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkSubscriptionLimit = (feature) => {
  return async (req, res, next) => {
    try {
      const ownerId = req.user.id;

      // Find primary BusinessGroup and subscriptions
      const businessGroup = await prisma.businessGroup.findFirst({
        where: { ownerId },
        include: {
          locations: true,
          websites: {
            // Find all websites associated with the locations under this group
            where: {
              location: {
                businessGroupId: { not: '' }
              }
            }
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!businessGroup) {
        return res.status(404).json({ error: 'Business group details not found.' });
      }

      const activeSub = businessGroup.subscriptions?.[0];
      
      // Default limits for Free Tier
      let locationLimit = 1;
      let websiteLimit = 1;

      if (activeSub) {
        locationLimit = activeSub.locationLimit;
        websiteLimit = activeSub.websiteLimit;
      }

      if (feature === 'location') {
        const count = businessGroup.locations.length;
        if (count >= locationLimit) {
          return res.status(403).json({
            error: `Upgrade required. Your current active plan allows up to ${locationLimit} location(s).`
          });
        }
      }

      if (feature === 'website') {
        // Find total websites for all locations under this group
        const locations = businessGroup.locations.map(loc => loc.id);
        const count = await prisma.website.count({
          where: { locationId: { in: locations } }
        });
        
        if (count >= websiteLimit) {
          return res.status(403).json({
            error: `Upgrade required. Your current active plan allows up to ${websiteLimit} website(s).`
          });
        }
      }

      next();
    } catch (error) {
      console.error('Subscription limit check error:', error);
      res.status(500).json({ error: 'Internal system error checking plan limitations.' });
    }
  };
};

module.exports = checkSubscriptionLimit;
