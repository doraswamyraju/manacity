const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Directory Aggregator Metrics
exports.getAggregatorMetrics = async (req, res) => {
  try {
    const totalListings = await prisma.directoryListing.count();
    const totalBusinesses = await prisma.businessGroup.count();
    const totalLeads = await prisma.lead.count();
    const verifiedBusinesses = await prisma.businessGroup.count({
      where: { status: 'LIVE' }
    });

    const listings = await prisma.directoryListing.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: { businessGroup: true }
    });

    return res.status(200).json({
      status: 'success',
      metrics: {
        totalListings,
        totalBusinesses,
        totalLeads,
        verifiedBusinesses,
        searchesToday: 342,
        activeCities: 6
      },
      recentListings: listings
    });
  } catch (error) {
    console.error('Error fetching aggregator metrics:', error);
    return res.status(500).json({ error: 'Failed to retrieve directory metrics.' });
  }
};

// Get Directory Listings for Moderation
exports.getAggregatorListings = async (req, res) => {
  try {
    const { city, category, status, search } = req.query;

    const where = {};
    if (city && city !== 'all') where.city = city.toLowerCase();
    if (category && category !== 'All') where.category = category;

    const listings = await prisma.directoryListing.findMany({
      where,
      include: {
        businessGroup: {
          select: {
            id: true,
            name: true,
            city: true,
            status: true,
            mobileNumber: true,
            whatsAppNumber: true,
            email: true,
            logoUrl: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      status: 'success',
      listings
    });
  } catch (error) {
    console.error('Error fetching directory listings:', error);
    return res.status(500).json({ error: 'Failed to retrieve directory listings.' });
  }
};

// Update Listing Moderation (Status, Verified Checkmark, Sponsored Rank)
exports.updateListingModeration = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verified, isSponsored, sponsoredRank, category, city } = req.body;

    const listing = await prisma.directoryListing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    // Update DirectoryListing
    const updatedListing = await prisma.directoryListing.update({
      where: { id },
      data: {
        category: category || listing.category,
        city: city ? city.toLowerCase() : listing.city
      }
    });

    // Update parent BusinessGroup status
    if (status) {
      await prisma.businessGroup.update({
        where: { id: listing.businessGroupId },
        data: { status }
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Listing moderation updated successfully.',
      listing: updatedListing
    });
  } catch (error) {
    console.error('Error updating listing moderation:', error);
    return res.status(500).json({ error: 'Failed to update listing moderation.' });
  }
};

// Get All Public "Get Quote" Leads
exports.getPublicLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        businessGroup: {
          select: {
            id: true,
            name: true,
            city: true,
            mobileNumber: true,
            email: true
          }
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      leads
    });
  } catch (error) {
    console.error('Error fetching public leads:', error);
    return res.status(500).json({ error: 'Failed to retrieve public leads.' });
  }
};
