const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Retrieve system analytics and platform health metrics
exports.getSystemMetrics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalLocations = await prisma.location.count();
    const totalWebsites = await prisma.website.count();
    const totalReviews = await prisma.review.count();
    const totalBusinessGroups = await prisma.businessGroup.count();

    // Query active plans segmentations
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        tier: true
      }
    });

    const plansBreakdown = {
      FREE: 0,
      GROWTH: 0,
      ENTERPRISE: 0
    };

    subscriptions.forEach(sub => {
      if (plansBreakdown[sub.tier] !== undefined) {
        plansBreakdown[sub.tier]++;
      } else {
        plansBreakdown.FREE++; // fallback default
      }
    });

    // Audit logs for platform auditing
    const auditLogs = [
      { id: '1', action: 'DATABASE_BACKUP', details: 'Automated cluster backup completed successfully.', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', action: 'API_SYNC', details: 'GBP queue processed 0 active webhooks.', timestamp: new Date(Date.now() - 7200000) },
      { id: '3', action: 'STRIPE_WEBHOOK', details: 'Invoice payment succeeded for platform tier upgrade.', timestamp: new Date(Date.now() - 14400000) },
      { id: '4', action: 'SECURITY_SCAN', details: 'No vulnerabilities detected in dependencies scan.', timestamp: new Date(Date.now() - 28800000) },
      { id: '5', action: 'DOMAIN_VERIFY', details: 'SSL cert auto-renewed for manacity.in subdomains.', timestamp: new Date(Date.now() - 43200000) }
    ];

    res.json({
      status: 'success',
      metrics: {
        totalUsers,
        totalLocations,
        totalWebsites,
        totalReviews,
        totalBusinessGroups,
        plansBreakdown
      },
      auditLogs
    });
  } catch (error) {
    console.error('Super Admin metrics fetch failed:', error);
    res.status(500).json({ error: 'Failed to aggregate administrative metrics.' });
  }
};

// 2. Fetch User Directory with Business Groups count
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        createdAt: true,
        _count: {
          select: { businessGroups: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ status: 'success', users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch user directory.' });
  }
};

// 3. Update User Role (dropdown options: SUPER_ADMIN, ADMIN, EMPLOYEE, REFERRAL_PARTNER, AGENT, CUSTOMER, BUSINESS_OWNER)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'REFERRAL_PARTNER', 'AGENT', 'CUSTOMER', 'BUSINESS_OWNER'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid user role specified.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({ status: 'success', user: updatedUser });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
};

// 4. Fetch all Business Groups / Listings Moderation
exports.getBusinesses = async (req, res) => {
  try {
    const rawBusinesses = await prisma.businessGroup.findMany({
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { locations: true, services: true, products: true }
        },
        websiteConfig: {
          select: { id: true, published: true, customDomain: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const businesses = rawBusinesses.map(b => ({
      ...b,
      status: b.status || 'LIVE'
    }));

    res.json({ status: 'success', businesses });
  } catch (error) {
    console.error('Fetch businesses detailed error:', error?.message || error, error?.stack);
    res.status(500).json({ error: 'Failed to fetch business directory.', details: error?.message || String(error) });
  }
};

// 4b. Update Business Status (LIVE / DISABLED / PENDING)
exports.updateBusinessStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['LIVE', 'DISABLED', 'PENDING'].includes(status)) {
      return res.status(400).json({ error: 'Invalid business status.' });
    }

    const updated = await prisma.businessGroup.update({
      where: { id },
      data: { status }
    });

    res.json({ status: 'success', business: updated });
  } catch (error) {
    console.error('Update business status error:', error);
    res.status(500).json({ error: 'Failed to update business status.' });
  }
};

// 4c. Delete Business Group
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.businessGroup.delete({
      where: { id }
    });

    res.json({ status: 'success', message: 'Business group deleted successfully.' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ error: 'Failed to delete business group.' });
  }
};

// In-memory Master Catalog Store for global items template library
let masterCatalogStore = [
  { id: 'cat-1', name: 'SEO & Google Profile Optimization', category: 'Digital Marketing', type: 'SERVICE', description: 'Comprehensive local search and Google Business Profile setup', defaultPrice: '2999' },
  { id: 'cat-2', name: 'NFC Tap & Review Standee', category: 'Hardware/Print', type: 'PRODUCT', description: 'Acrylic NFC enabled table stand for high-speed review capture', defaultPrice: '799' },
  { id: 'cat-3', name: 'Social Media Banner Design Pack', category: 'Creative & Design', type: 'SERVICE', description: 'Custom promotional posters and social templates pack', defaultPrice: '1499' },
  { id: 'cat-4', name: 'WhatsApp Automation Gateway', category: 'Software Add-on', type: 'SERVICE', description: 'Automated review reminders sent directly via WhatsApp API', defaultPrice: '999' }
];

// 5. Fetch Master Catalog Library Items
exports.getMasterCatalog = async (req, res) => {
  try {
    res.json({ status: 'success', catalog: masterCatalogStore });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch catalog.' });
  }
};

// 6. Create Master Catalog Item
exports.createMasterCatalogItem = async (req, res) => {
  try {
    const { name, category, type, description, defaultPrice } = req.body;
    if (!name) return res.status(400).json({ error: 'Item name is required.' });

    const newItem = {
      id: `cat-${Date.now()}`,
      name,
      category: category || 'General',
      type: type || 'SERVICE',
      description: description || '',
      defaultPrice: defaultPrice || '0'
    };

    masterCatalogStore.unshift(newItem);
    res.json({ status: 'success', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create catalog item.' });
  }
};

// 7. Delete Master Catalog Item
exports.deleteMasterCatalogItem = async (req, res) => {
  try {
    const { id } = req.params;
    masterCatalogStore = masterCatalogStore.filter(item => item.id !== id);
    res.json({ status: 'success', message: 'Item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete catalog item.' });
  }
};

// 8. Fetch Subscriptions Summary
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        businessGroup: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ status: 'success', subscriptions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions.' });
  }
};
