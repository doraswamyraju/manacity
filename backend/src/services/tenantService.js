const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Resolves and verifies the authorized BusinessGroup for an incoming authenticated API request.
 * Enforces strict multi-tenant boundary: User A cannot access or modify User B's BusinessGroup.
 * 
 * @param {Object} req Express request object (must have req.user from auth middleware)
 * @param {Object} res Express response object
 * @param {string} [requestedBusinessGroupId] Optional explicit businessGroupId from body/params
 * @returns {Promise<Object|null>} Resolved BusinessGroup model or sends 403/404 response and returns null
 */
async function resolveBusinessGroupForRequest(req, res, requestedBusinessGroupId = null) {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: User authentication required.' });
    return null;
  }

  const userId = req.user.id;
  const isSuperAdmin = req.user.role === 'SUPER_ADMIN';

  // 1. Explicit businessGroupId provided in params/query/body or header
  const targetId = requestedBusinessGroupId || 
                   req.params.businessGroupId || 
                   req.body.businessGroupId || 
                   req.query.businessGroupId ||
                   req.headers['x-business-group-id'];

  if (targetId) {
    const bg = await prisma.businessGroup.findUnique({
      where: { id: targetId },
      include: {
        locations: true,
        directoryListing: true
      }
    });

    if (!bg) {
      res.status(404).json({ error: 'BusinessGroup not found.' });
      return null;
    }

    if (!isSuperAdmin && bg.ownerId !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not have permission to access this business group.' });
      return null;
    }

    return bg;
  }

  // 2. Fallback: Find the BusinessGroup owned by the authenticated user
  const userBg = await prisma.businessGroup.findFirst({
    where: { ownerId: userId },
    include: {
      locations: true,
      directoryListing: true
    }
  });

  if (!userBg) {
    res.status(404).json({ error: 'No business group found for this user.' });
    return null;
  }

  return userBg;
}

module.exports = {
  resolveBusinessGroupForRequest
};
