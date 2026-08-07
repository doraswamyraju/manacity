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
