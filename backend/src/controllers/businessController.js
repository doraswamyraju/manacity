const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get user's Business Groups and Locations
exports.getLocations = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the user's Business Groups
    const businessGroups = await prisma.businessGroup.findMany({
      where: { ownerId },
      include: {
        locations: true,
        subscriptions: true
      }
    });

    res.json({
      status: 'success',
      businessGroups
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to retrieve location profiles.' });
  }
};

// 2. Create a new Location under the active Business Group
exports.createLocation = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, address, city, country, phone, category, hours, socialLinks } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Location name is required.' });
    }

    // Find the primary BusinessGroup for this owner
    let businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId },
      include: {
        locations: true,
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!businessGroup) {
      // Auto-create business group if missing
      businessGroup = await prisma.businessGroup.create({
        data: { name: `${req.user.name}'s Business`, ownerId },
        include: { locations: true, subscriptions: true }
      });
    }

    // Enforce location limit based on active subscription
    const activeSub = businessGroup.subscriptions?.[0];
    const locationLimit = activeSub ? activeSub.locationLimit : 1;
    const currentLocationCount = businessGroup.locations.length;

    if (currentLocationCount >= locationLimit) {
      return res.status(403).json({
        error: `Location limit reached. Your active plan allows up to ${locationLimit} location(s). Please upgrade your subscription.`
      });
    }

    // Create the location
    const location = await prisma.location.create({
      data: {
        businessGroupId: businessGroup.id,
        name,
        address,
        city,
        country,
        phone,
        category,
        hours: hours || {},
        socialLinks: socialLinks || {}
      }
    });

    res.status(201).json({
      status: 'success',
      location
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: 'Failed to create location profile.' });
  }
};

// 3. Update an existing Location
exports.updateLocation = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;
    const { name, address, city, country, phone, category, hours, socialLinks } = req.body;

    // Check if location exists and belongs to the user
    const location = await prisma.location.findUnique({
      where: { id },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== ownerId) {
      return res.status(404).json({ error: 'Location profile not found.' });
    }

    // Update location
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name: name || location.name,
        address: address !== undefined ? address : location.address,
        city: city !== undefined ? city : location.city,
        country: country !== undefined ? country : location.country,
        phone: phone !== undefined ? phone : location.phone,
        category: category !== undefined ? category : location.category,
        hours: hours !== undefined ? hours : location.hours,
        socialLinks: socialLinks !== undefined ? socialLinks : location.socialLinks
      }
    });

    res.json({
      status: 'success',
      location: updatedLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location profile.' });
  }
};

// 4. Delete Location
exports.deleteLocation = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const location = await prisma.location.findUnique({
      where: { id },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== ownerId) {
      return res.status(404).json({ error: 'Location profile not found.' });
    }

    await prisma.location.delete({ where: { id } });

    res.json({
      status: 'success',
      message: 'Location profile deleted successfully.'
    });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ error: 'Failed to delete location profile.' });
  }
};

// 5. Mock Asset Upload Endpoint
exports.uploadMedia = async (req, res) => {
  // Since we are running on local/mock systems before cloud configuration, we return a mock URL
  res.json({
    status: 'success',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600'
  });
};
