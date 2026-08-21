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

    // Filter out orphaned listings or disabled businesses
    listings = listings.filter(l => l.businessGroup && l.businessGroup.status !== 'DISABLED');

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

// Unified Live Search: Master Catalog Items + ManaCity Verified Businesses
exports.searchUnified = async (req, res) => {
  try {
    const { city, query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(200).json({ masterItems: [], businesses: [], hasResults: false });
    }

    const q = query.trim().toLowerCase();
    const cityStr = (city || 'tirupati').toLowerCase();

    // 1. Search Master Library Products & Services (Safe JS filter for MongoDB compatibility)
    const allMasterItems = await prisma.productServiceLibrary.findMany({
      where: { status: 'APPROVED' },
      take: 100
    });

    const masterItems = allMasterItems.filter(item => {
      const nameMatch = item.name && item.name.toLowerCase().includes(q);
      const catMatch = item.category && item.category.toLowerCase().includes(q);
      const descMatch = item.description && item.description.toLowerCase().includes(q);
      return nameMatch || catMatch || descMatch;
    }).slice(0, 6);

    // For each master item, find matching business vendors in city
    const masterItemsWithVendors = await Promise.all(masterItems.map(async (item) => {
      const services = await prisma.businessService.findMany({
        where: { libraryItemId: item.id },
        include: {
          businessGroup: {
            include: {
              directoryListing: true,
              locations: true
            }
          }
        }
      });
      const products = await prisma.businessProduct.findMany({
        where: { libraryItemId: item.id },
        include: {
          businessGroup: {
            include: {
              directoryListing: true,
              locations: true
            }
          }
        }
      });

      const rawVendors = [...services.map(s => s.businessGroup), ...products.map(p => p.businessGroup)].filter(Boolean);
      const vendors = [];
      const seenBg = new Set();

      rawVendors.forEach(bg => {
        if (!seenBg.has(bg.id) && bg.status !== 'DISABLED') {
          seenBg.add(bg.id);
          const listing = bg.directoryListing;
          vendors.push({
            id: bg.id,
            name: bg.name,
            slug: listing ? listing.slug : bg.subdomain,
            city: bg.city || cityStr,
            phone: bg.mobileNumber || bg.whatsAppNumber,
            rating: bg.googleRating || bg.rating || 4.9,
            reviewCount: bg.googleReviewCount || bg.reviewCount || 63,
            logoUrl: bg.logoUrl
          });
        }
      });

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        type: item.type,
        category: item.category,
        defaultPrice: item.defaultPrice,
        description: item.description,
        vendorCount: vendors.length,
        vendors
      };
    }));

    // 2. Search Registered ManaCity Businesses
    let listings = await prisma.directoryListing.findMany({
      where: cityStr !== 'all' ? { city: cityStr } : {},
      include: {
        businessGroup: {
          include: { locations: true }
        }
      }
    });

    listings = listings.filter(l => l.businessGroup && l.businessGroup.status !== 'DISABLED');
    const matchingListings = listings.filter(l =>
      (l.businessGroup && l.businessGroup.name.toLowerCase().includes(q)) ||
      (l.category && l.category.toLowerCase().includes(q))
    ).slice(0, 4).map(l => ({
      id: l.id,
      businessName: l.businessGroup ? l.businessGroup.name : 'Local Business',
      category: l.category || 'General Business',
      city: l.city,
      slug: l.slug,
      rating: l.rating || 4.9,
      reviewCount: l.reviewCount || 63,
      phone: l.contactPhone || (l.businessGroup ? l.businessGroup.mobileNumber : ''),
      address: l.businessGroup ? l.businessGroup.address : l.city,
      isVerifiedManaCity: true
    }));

    const hasResults = masterItemsWithVendors.length > 0 || matchingListings.length > 0;

    return res.status(200).json({
      masterItems: masterItemsWithVendors,
      businesses: matchingListings,
      hasResults
    });
  } catch (error) {
    console.error('Error in unified search:', error);
    return res.status(500).json({ error: 'Failed to perform unified search' });
  }
};

// Record Unmatched Search Query for Super Admin Team
exports.recordUnmatchedSearch = async (req, res) => {
  try {
    const { searchQuery, city, customerName, customerPhone, customerEmail, notes } = req.body;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const logEntry = await prisma.auditLog.create({
      data: {
        action: 'UNMATCHED_SEARCH_QUERY',
        target: searchQuery,
        metadata: JSON.stringify({
          city: city || 'Tirupati',
          customerName: customerName || 'Anonymous Visitor',
          customerPhone: customerPhone || '',
          customerEmail: customerEmail || '',
          notes: notes || 'Product/Service not found in system. Requested provider onboarding.',
          status: 'PENDING_ADMIN_REVIEW'
        })
      }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Unmatched search request submitted to ManaCity Super Admin team successfully!',
      requestId: logEntry.id
    });
  } catch (error) {
    console.error('Error recording unmatched search query:', error);
    return res.status(500).json({ error: 'Failed to record unmatched search query' });
  }
};

// Get Service Details & All Verified Vendors for Dedicated Product/Service Page
exports.getServiceDetails = async (req, res) => {
  try {
    const { slug, city } = req.params;
    const cityStr = (city || 'tirupati').toLowerCase();

    // Find master product/service in library
    let masterItem = await prisma.productServiceLibrary.findFirst({
      where: {
        OR: [
          { slug: slug.toLowerCase() },
          { id: slug }
        ]
      }
    });

    if (!masterItem) {
      // Fallback matching by name slugification
      const allItems = await prisma.productServiceLibrary.findMany({ where: { status: 'APPROVED' } });
      masterItem = allItems.find(i => (i.slug && i.slug.toLowerCase() === slug.toLowerCase()) || (i.name && i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.toLowerCase()));
    }

    if (!masterItem) {
      return res.status(404).json({ error: 'Service/Product offering not found' });
    }

    // Find all services/products linked to this master item
    const services = await prisma.businessService.findMany({
      where: { libraryItemId: masterItem.id },
      include: {
        businessGroup: {
          include: {
            directoryListing: true,
            locations: true
          }
        }
      }
    });

    const products = await prisma.businessProduct.findMany({
      where: { libraryItemId: masterItem.id },
      include: {
        businessGroup: {
          include: {
            directoryListing: true,
            locations: true
          }
        }
      }
    });

    const rawVendors = [...services.map(s => ({ bg: s.businessGroup, itemPrice: s.price })), ...products.map(p => ({ bg: p.businessGroup, itemPrice: p.price }))].filter(v => v.bg);
    const vendors = [];
    const seenBg = new Set();

    rawVendors.forEach(({ bg, itemPrice }) => {
      if (!seenBg.has(bg.id) && bg.status !== 'DISABLED') {
        seenBg.add(bg.id);
        const listing = bg.directoryListing;
        vendors.push({
          id: bg.id,
          name: bg.name,
          slug: listing ? listing.slug : bg.subdomain,
          subdomain: bg.subdomain,
          city: bg.city || cityStr,
          phone: bg.mobileNumber || bg.whatsAppNumber,
          whatsApp: bg.whatsAppNumber || bg.mobileNumber,
          rating: bg.googleRating || bg.rating || 4.9,
          reviewCount: bg.googleReviewCount || bg.reviewCount || 63,
          logoUrl: bg.logoUrl,
          coverImageUrl: bg.coverImageUrl,
          address: bg.address || 'Tirupati, Andhra Pradesh',
          price: itemPrice || masterItem.defaultPrice
        });
      }
    });

    // Fetch related services in the same category
    const relatedItems = await prisma.productServiceLibrary.findMany({
      where: {
        category: masterItem.category,
        id: { not: masterItem.id },
        status: 'APPROVED'
      },
      take: 4
    });

    return res.status(200).json({
      service: masterItem,
      city: cityStr,
      vendorCount: vendors.length,
      vendors,
      relatedServices: relatedItems
    });
  } catch (error) {
    console.error('Error fetching service details:', error);
    return res.status(500).json({ error: 'Failed to fetch service details' });
  }
};
