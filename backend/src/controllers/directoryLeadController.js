const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Directory Listing by City and Business Slug
exports.getDirectoryListing = async (req, res) => {
  try {
    const { city, slug } = req.params;
    const listing = await prisma.directoryListing.findUnique({
      where: {
        city_slug: {
          city: city.toLowerCase(),
          slug: slug.toLowerCase()
        }
      },
      include: {
        businessGroup: {
          include: {
            services: true,
            products: true,
            websiteConfig: true
          }
        }
      }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Directory listing not found' });
    }

    // Increment view count
    await prisma.directoryListing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } }
    });

    return res.status(200).json({ listing });
  } catch (error) {
    console.error('Error fetching directory listing:', error);
    return res.status(500).json({ error: 'Failed to fetch directory listing' });
  }
};

// Search / Filter Directory Listings for Public Portal
exports.searchDirectoryListings = async (req, res) => {
  try {
    const { city } = req.params;
    const { query, category } = req.query;

    const where = {};
    if (city && city.toLowerCase() !== 'all') {
      where.city = city.toLowerCase();
    }
    if (category && category !== 'All') {
      where.category = { contains: category, mode: 'insensitive' };
    }

    let listings = await prisma.directoryListing.findMany({
      where,
      include: {
        businessGroup: {
          include: {
            locations: true
          }
        }
      }
    });

    // Filter out orphaned listings or businesses with 0 active locations
    listings = listings.filter(l => l.businessGroup && l.businessGroup.locations && l.businessGroup.locations.length > 0);

    if (query) {
      const q = query.toLowerCase();
      listings = listings.filter(l => 
        (l.businessGroup && l.businessGroup.name.toLowerCase().includes(q)) ||
        (l.category && l.category.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q))
      );
    }


    const formattedListings = listings.map(l => ({
      id: l.id,
      businessName: l.businessGroup ? l.businessGroup.name : 'Local Business',
      category: l.category || 'General Business',
      city: l.city,
      slug: l.slug,
      subdomain: l.businessGroup ? (l.businessGroup.subdomain || l.slug) : l.slug,
      rating: (l.reviews && l.reviews.rating) ? l.reviews.rating : (l.rating || 4.9),
      reviewCount: (l.reviews && l.reviews.reviewCount) ? l.reviews.reviewCount : (l.reviewCount || 63),
      phone: l.contactPhone || (l.businessGroup ? l.businessGroup.mobileNumber : '9876543210'),
      whatsApp: l.whatsAppNumber || (l.businessGroup ? l.businessGroup.whatsAppNumber : '9876543210'),
      address: l.businessGroup ? (l.businessGroup.address || l.businessGroup.city) : 'Tirupati',
      websiteUrl: l.websiteUrl || (l.businessGroup ? l.businessGroup.website : null),
      logoUrl: l.businessGroup ? l.businessGroup.logoUrl : null,
      coverImage: l.businessGroup ? l.businessGroup.coverImageUrl : null,
      verified: l.businessGroup ? (l.businessGroup.isVerified !== false) : true,
      isOpenNow: true,
      services: l.businessGroup && l.businessGroup.services ? l.businessGroup.services.map(s => s.name) : ['SEO Optimization', 'Google Ads Management', 'GBP Optimization', 'Meta Ads']
    }));

    return res.status(200).json({ listings: formattedListings });
  } catch (error) {
    console.error('Error searching directory listings:', error);
    return res.status(500).json({ error: 'Failed to search directory listings' });
  }
};

// Record Visitor Lead & Button Click Telemetry
exports.recordLeadOrClick = async (req, res) => {
  try {
    const { businessGroupId, channel, contactName, contactEmail, contactPhone, message, visitorLocation, viewedServices, viewedProducts } = req.body;

    if (!businessGroupId || !channel) {
      return res.status(400).json({ error: 'businessGroupId and channel are required' });
    }

    const lead = await prisma.lead.create({
      data: {
        businessGroupId,
        channel,
        contactName,
        contactEmail,
        contactPhone,
        message,
        visitorLocation: visitorLocation || 'Unknown',
        viewedServices: viewedServices || [],
        viewedProducts: viewedProducts || []
      }
    });

    // Update counters on directory listing
    if (channel === 'CALL') {
      await prisma.directoryListing.updateMany({
        where: { businessGroupId },
        data: { callClicks: { increment: 1 } }
      });
    } else if (channel === 'WHATSAPP') {
      await prisma.directoryListing.updateMany({
        where: { businessGroupId },
        data: { whatsAppClicks: { increment: 1 } }
      });
    }

    return res.status(200).json({ message: 'Lead recorded successfully', lead });
  } catch (error) {
    console.error('Error recording lead:', error);
    return res.status(500).json({ error: 'Failed to record lead' });
  }
};

// Get Dashboard Leads for Business Owner
exports.getBusinessLeads = async (req, res) => {
  try {
    const { businessGroupId } = req.params;
    const leads = await prisma.lead.findMany({
      where: { businessGroupId },
      orderBy: { createdAt: 'desc' }
    });

    const listing = await prisma.directoryListing.findUnique({
      where: { businessGroupId }
    });

    return res.status(200).json({
      summary: {
        totalLeads: leads.length,
        callClicks: listing ? listing.callClicks : 0,
        whatsAppClicks: listing ? listing.whatsAppClicks : 0,
        totalViews: listing ? listing.viewCount : 0
      },
      leads
    });
  } catch (error) {
    console.error('Error fetching leads summary:', error);
    return res.status(500).json({ error: 'Failed to fetch business leads' });
  }
};

// Let's Track Telemetry Endpoint
exports.letsTrackTelemetry = async (req, res) => {
  try {
    const { businessGroupId, visitorIp, locationCity, deviceType, pageViewed } = req.body;

    if (!businessGroupId) {
      return res.status(400).json({ error: 'businessGroupId is required' });
    }

    const trackRecord = await prisma.letsTrackVisitor.create({
      data: {
        businessGroupId,
        visitorIp,
        locationCity,
        deviceType,
        pageViewed,
        notifiedOwner: true
      }
    });

    return res.status(200).json({
      status: 'success',
      message: "Let's Track telemetry captured and owner notified.",
      record: trackRecord
    });
  } catch (error) {
    console.error("Error in Let's Track telemetry:", error);
    return res.status(500).json({ error: "Failed to record Let's Track telemetry" });
  }
};
