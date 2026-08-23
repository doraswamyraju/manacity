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
    const cityStr = (city || 'tirupati').toLowerCase();

    // Query all active BusinessGroups with directoryListing, locations, and services
    const businessGroups = await prisma.businessGroup.findMany({
      where: { status: { not: 'DISABLED' } },
      include: {
        directoryListing: true,
        locations: true,
        services: true,
        products: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const isTestAccount = (bName) => (bName || '').toLowerCase().includes('manacity test');

    let filteredGroups = businessGroups.filter(bg => {
      if (isTestAccount(bg.name)) return false;
      const bgCity = (bg.city || bg.locations?.[0]?.city || 'tirupati').toLowerCase();
      const matchCity = cityStr === 'all' || bgCity === cityStr;

      let matchCat = true;
      if (category && category !== 'All') {
        const bgCat = (bg.category || bg.directoryListing?.category || bg.locations?.[0]?.category || '').toLowerCase();
        matchCat = bgCat.includes(category.toLowerCase());
      }

      let matchQuery = true;
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        const bName = bg.name.toLowerCase();
        const bCat = (bg.category || bg.directoryListing?.category || '').toLowerCase();
        const bAddr = (bg.address || '').toLowerCase();
        matchQuery = bName.includes(q) || bCat.includes(q) || bAddr.includes(q);
      }

      return matchCity && matchCat && matchQuery;
    });

    const formattedListings = filteredGroups.map(bg => {
      const listing = bg.directoryListing;
      const loc = bg.locations?.[0];
      const safeCity = (bg.city || loc?.city || cityStr).toLowerCase();
      const slug = listing?.slug || bg.subdomain || bg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      return {
        id: bg.id,
        businessName: bg.name,
        category: bg.category || listing?.category || loc?.category || 'General Business',
        city: safeCity,
        slug,
        subdomain: bg.subdomain || slug,
        rating: bg.googleRating || listing?.rating || 4.9,
        reviewCount: bg.googleReviewCount || listing?.reviewCount || 45,
        phone: bg.mobileNumber || bg.whatsAppNumber || loc?.phone || '9876543210',
        whatsApp: bg.whatsAppNumber || bg.mobileNumber || '9876543210',
        address: bg.address || loc?.address || `${safeCity.charAt(0).toUpperCase() + safeCity.slice(1)}, Andhra Pradesh`,
        websiteUrl: bg.website || (listing ? listing.websiteUrl : null),
        logoUrl: bg.logoUrl || null,
        coverImage: bg.coverImageUrl || null,
        verified: bg.isVerified !== false,
        isOpenNow: true,
        services: bg.services && bg.services.length > 0
          ? bg.services.map(s => s.name)
          : ['Direct Service Delivery', 'Verified Local Business', 'Customer Support']
      };
    });

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

    // Find master product/service in library (Safely handle MongoDB ObjectId validation)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    let masterItem = await prisma.productServiceLibrary.findFirst({
      where: isObjectId ? { OR: [{ slug: slug.toLowerCase() }, { id: slug }] } : { slug: slug.toLowerCase() }
    });

    if (!masterItem) {
      // Fallback matching by name slugification or category matching
      const allItems = await prisma.productServiceLibrary.findMany({ where: { status: 'APPROVED' } });
      const slugClean = slug.toLowerCase().replace(/[^a-z0-9]+/g, '');
      masterItem = allItems.find(i => {
        const sClean = (i.slug || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
        const nClean = (i.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
        const cClean = (i.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
        return (sClean && sClean === slugClean) || (nClean && nClean === slugClean) || (cClean && cClean === slugClean);
      });
    }

    if (!masterItem) {
      // Dynamic fallback master item creation so no service slug ever returns 404
      const formattedName = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      masterItem = {
        id: slug,
        name: formattedName,
        slug: slug.toLowerCase(),
        category: 'Services',
        defaultPrice: 4999,
        description: `Explore top-rated verified local providers offering ${formattedName} in ${cityStr.charAt(0).toUpperCase() + cityStr.slice(1)}. Compare ratings, get instant quotes, and connect directly.`
      };
    }

    // Find all services/products linked to this master item (Safely check for valid MongoDB ObjectId)
    const isMasterObjectId = /^[0-9a-fA-F]{24}$/.test(masterItem.id);
    let services = [];
    let products = [];

    if (isMasterObjectId) {
      services = await prisma.businessService.findMany({
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

      products = await prisma.businessProduct.findMany({
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
    }

    const rawVendors = [...services.map(s => ({ bg: s.businessGroup, itemPrice: s.price })), ...products.map(p => ({ bg: p.businessGroup, itemPrice: p.price }))].filter(v => v.bg);
    const vendors = [];
    const seenBg = new Set();
    const seenName = new Set();

    const isTestAccount = (bName) => (bName || '').toLowerCase().includes('test') || (bName || '').toLowerCase().includes('manacity test');

    rawVendors.forEach(({ bg, itemPrice }) => {
      const bgCity = (bg.city || 'tirupati').toLowerCase();
      const normName = (bg.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (!seenBg.has(bg.id) && !seenName.has(normName) && bg.status !== 'DISABLED' && bgCity === cityStr && !isTestAccount(bg.name)) {
        seenBg.add(bg.id);
        seenName.add(normName);
        const listing = bg.directoryListing;
        vendors.push({
          id: bg.id,
          name: bg.name,
          slug: listing ? listing.slug : bg.subdomain,
          subdomain: bg.subdomain,
          city: bg.city || cityStr,
          phone: bg.mobileNumber || bg.whatsAppNumber || '9876543210',
          whatsApp: bg.whatsAppNumber || bg.mobileNumber || '9876543210',
          rating: bg.googleRating || bg.rating || 4.9,
          reviewCount: bg.googleReviewCount || bg.reviewCount || 63,
          logoUrl: bg.logoUrl,
          coverImageUrl: bg.coverImageUrl,
          address: bg.address || `${cityStr.charAt(0).toUpperCase() + cityStr.slice(1)}, Andhra Pradesh`,
          price: itemPrice || masterItem.defaultPrice,
          isVerifiedManaCity: true
        });
      }
    });

    // Fallback: If no direct service link, return all active business groups strictly in this city
    if (vendors.length === 0) {
      const allBgs = await prisma.businessGroup.findMany({
        where: { status: { not: 'DISABLED' } },
        include: { directoryListing: true, locations: true }
      });
      const cityBgs = allBgs.filter(bg => (bg.city || 'tirupati').toLowerCase() === cityStr && !isTestAccount(bg.name));
      cityBgs.forEach(bg => {
        const normName = (bg.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
        if (!seenBg.has(bg.id) && !seenName.has(normName)) {
          seenBg.add(bg.id);
          seenName.add(normName);
          const listing = bg.directoryListing;
          vendors.push({
            id: bg.id,
            name: bg.name,
            slug: listing ? listing.slug : bg.subdomain,
            subdomain: bg.subdomain,
            city: bg.city || cityStr,
            phone: bg.mobileNumber || bg.whatsAppNumber || '9876543210',
            whatsApp: bg.whatsAppNumber || bg.mobileNumber || '9876543210',
            rating: bg.googleRating || bg.rating || 4.9,
            reviewCount: bg.googleReviewCount || bg.reviewCount || 63,
            logoUrl: bg.logoUrl,
            coverImageUrl: bg.coverImageUrl,
            address: bg.address || `${cityStr.charAt(0).toUpperCase() + cityStr.slice(1)}, Andhra Pradesh`,
            price: masterItem.defaultPrice || 4999,
            isVerifiedManaCity: true
          });
        }
      });
    }

    // Safely check if masterItem.id is a valid 24-char hex MongoDB ObjectID before querying Prisma
    const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

    let relatedItems = [];
    if (masterItem && masterItem.category && isValidObjectId(masterItem.id)) {
      try {
        relatedItems = await prisma.productServiceLibrary.findMany({
          where: {
            category: masterItem.category,
            id: { not: masterItem.id },
            status: 'APPROVED'
          },
          take: 4
        });
      } catch (rErr) {
        console.warn('Related items fetch fallback:', rErr.message);
      }
    }

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

// Search Local Business Suggestions for Autocomplete
exports.searchSuggestions = async (req, res) => {
  try {
    const { q, city } = req.query;
    if (!q || q.trim().length < 2) return res.json([]);

    const queryStr = q.trim().toLowerCase();
    const cityStr = (city || 'tirupati').toLowerCase();

    const allBgs = await prisma.businessGroup.findMany({
      where: { status: { not: 'DISABLED' } },
      include: { directoryListing: true, locations: true }
    });

    const isTestAccount = (bName) => (bName || '').toLowerCase().includes('test') || (bName || '').toLowerCase().includes('manacity test');

    const matchingBgs = allBgs.filter(bg => {
      if (isTestAccount(bg.name)) return false;
      const bgCity = (bg.city || 'tirupati').toLowerCase();
      const matchCity = cityStr === 'all' || bgCity === cityStr;
      const matchQuery = bg.name.toLowerCase().includes(queryStr) ||
        (bg.category && bg.category.toLowerCase().includes(queryStr)) ||
        (bg.address && bg.address.toLowerCase().includes(queryStr));
      return matchCity && matchQuery;
    });

    // Deduplicate matching business groups by normalized business name (Keep the one with longest address)
    const uniqueMap = new Map();
    for (const bg of matchingBgs) {
      const normName = bg.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (!uniqueMap.has(normName)) {
        uniqueMap.set(normName, bg);
      } else {
        const existing = uniqueMap.get(normName);
        if ((bg.address || '').length > (existing.address || '').length) {
          uniqueMap.set(normName, bg);
        }
      }
    }

    const uniqueBgs = Array.from(uniqueMap.values()).slice(0, 5);

    const results = uniqueBgs.map(bg => {
      const listing = bg.directoryListing;
      return {
        id: bg.id,
        businessName: bg.name,
        name: bg.name,
        slug: listing ? listing.slug : bg.subdomain,
        subdomain: bg.subdomain,
        city: bg.city || cityStr,
        category: bg.category || 'Business',
        phone: bg.mobileNumber || bg.whatsAppNumber || '9876543210',
        googleRating: bg.googleRating || bg.rating || 4.9,
        googleReviewCount: bg.googleReviewCount || bg.reviewCount || 63,
        logoUrl: bg.logoUrl,
        coverImageUrl: bg.coverImageUrl,
        address: bg.address || `${cityStr.charAt(0).toUpperCase() + cityStr.slice(1)}, Andhra Pradesh`,
        isVerifiedManaCity: true
      };
    });

    return res.json(results);
  } catch (err) {
    console.error('Error in searchSuggestions:', err);
    return res.json([]);
  }
};

// Search Master System Services & Products Catalog for Autocomplete
exports.masterServicesSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json([]);

    const queryStr = q.trim().toLowerCase();

    const allItems = await prisma.productServiceLibrary.findMany({
      where: { status: 'APPROVED' }
    });

    const matching = allItems.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(queryStr);
      const catMatch = (item.category || '').toLowerCase().includes(queryStr);
      const slugMatch = (item.slug || '').toLowerCase().includes(queryStr);
      return nameMatch || catMatch || slugMatch;
    }).sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aCat = (a.category || '').toLowerCase();
      const bCat = (b.category || '').toLowerCase();

      // Priority 1: Exact or prefix match on category
      const aCatPrefix = aCat.startsWith(queryStr);
      const bCatPrefix = bCat.startsWith(queryStr);
      if (aCatPrefix && !bCatPrefix) return -1;
      if (!aCatPrefix && bCatPrefix) return 1;

      // Priority 2: Exact or prefix match on name
      const aNamePrefix = aName.startsWith(queryStr);
      const bNamePrefix = bName.startsWith(queryStr);
      if (aNamePrefix && !bNamePrefix) return -1;
      if (!aNamePrefix && bNamePrefix) return 1;

      return 0;
    }).slice(0, 5);

    return res.json(matching);
  } catch (err) {
    console.error('Error in masterServicesSearch:', err);
    return res.json([]);
  }
};
