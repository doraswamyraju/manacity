const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const QRCode = require('qrcode');

// Helper: safe JSON parsing
const safeJson = (val) => {
  try {
    return typeof val === 'string' ? JSON.parse(val) : val;
  } catch (e) {
    return null;
  }
};

// ==========================================
// 1. CAMPAIGN CRUD
// ==========================================

exports.listCampaigns = async (req, res) => {
  try {
    const { locationId, search, isActive, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required.' });
    }

    const where = {
      locationId,
      location: { businessGroup: { ownerId: req.user.id } }
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [campaigns, total] = await Promise.all([
      prisma.reviewCampaign.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.reviewCampaign.count({ where })
    ]);

    res.json({
      status: 'success',
      data: campaigns,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List campaigns error:', error);
    res.status(500).json({ error: 'Failed to retrieve campaigns.' });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const { locationId, name, description, isActive } = req.body;

    if (!locationId || !name) {
      return res.status(400).json({ error: 'Location ID and name are required.' });
    }

    // Verify ownership
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Location not found or access denied.' });
    }

    const campaign = await prisma.reviewCampaign.create({
      data: {
        locationId,
        name,
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({ status: 'success', data: campaign });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign.' });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.reviewCampaign.findUnique({
      where: { id },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!campaign || campaign.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    // Clean relations reference
    delete campaign.location;

    res.json({ status: 'success', data: campaign });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Failed to retrieve campaign.' });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const campaign = await prisma.reviewCampaign.findUnique({
      where: { id },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!campaign || campaign.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    const updated = await prisma.reviewCampaign.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Failed to update campaign.' });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.reviewCampaign.findUnique({
      where: { id },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!campaign || campaign.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    await prisma.reviewCampaign.delete({ where: { id } });
    res.json({ status: 'success', message: 'Campaign deleted successfully.' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Failed to delete campaign.' });
  }
};


// ==========================================
// 2. REVIEW REQUEST CRUD & SEND
// ==========================================

exports.listRequests = async (req, res) => {
  try {
    const { campaignId, status, channel, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required.' });
    }

    // Verify campaign ownership
    const campaign = await prisma.reviewCampaign.findUnique({
      where: { id: campaignId },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!campaign || campaign.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    const where = { campaignId };
    if (status) where.status = status;
    if (channel) where.channel = channel;

    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      prisma.reviewRequest.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: { customer: true }
      }),
      prisma.reviewRequest.count({ where })
    ]);

    res.json({
      status: 'success',
      data: requests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List requests error:', error);
    res.status(500).json({ error: 'Failed to retrieve review requests.' });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { campaignId, customerId, channel } = req.body;

    if (!campaignId || !customerId || !channel) {
      return res.status(400).json({ error: 'Campaign ID, Customer ID, and Channel are required.' });
    }

    // Validate campaign ownership
    const campaign = await prisma.reviewCampaign.findUnique({
      where: { id: campaignId },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!campaign || campaign.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    // Validate customer exists and belongs to location
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer || customer.locationId !== campaign.locationId) {
      return res.status(400).json({ error: 'Customer is invalid for this campaign location.' });
    }

    const request = await prisma.reviewRequest.create({
      data: {
        campaignId,
        customerId,
        channel,
        status: 'PENDING',
        sentAt: new Date()
      }
    });

    // Mock Dispatch notification
    console.log(`[Review Request Dispatch] Channel: ${channel} sent to Customer: ${customer.name}`);

    // Update campaign cached counter
    await prisma.reviewCampaign.update({
      where: { id: campaignId },
      data: { totalSent: { increment: 1 } }
    });

    res.status(201).json({ status: 'success', data: request });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to dispatch request.' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, action } = req.body; // status: SENT, OPENED, COMPLETED, FAILED. action: open, rate, redirect, complete

    const request = await prisma.reviewRequest.findUnique({
      where: { id },
      include: { campaign: { include: { location: { include: { businessGroup: true } } } } }
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const updateData = {};
    if (status) updateData.status = status;

    const now = new Date();
    if (action === 'open') {
      updateData.openedAt = now;
      updateData.status = 'OPENED';
    } else if (action === 'rate') {
      updateData.ratedAt = now;
    } else if (action === 'redirect') {
      updateData.redirectedAt = now;
    } else if (action === 'complete') {
      updateData.completedAt = now;
      updateData.status = 'COMPLETED';
    }

    const updated = await prisma.reviewRequest.update({
      where: { id },
      data: updateData
    });

    // Update campaign aggregated cached parameters on complete
    if (action === 'open') {
      await prisma.reviewCampaign.update({
        where: { id: request.campaignId },
        data: { totalOpened: { increment: 1 } }
      });
    } else if (action === 'complete') {
      const camp = await prisma.reviewCampaign.findUnique({
        where: { id: request.campaignId },
        include: { requests: true }
      });
      const completedCount = camp.requests.filter(r => r.status === 'COMPLETED').length;
      const sentCount = camp.totalSent || 1;
      await prisma.reviewCampaign.update({
        where: { id: request.campaignId },
        data: {
          totalCompleted: completedCount,
          conversionRate: parseFloat(((completedCount / sentCount) * 100).toFixed(2))
        }
      });
    }

    res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ error: 'Failed to update request status.' });
  }
};


// ==========================================
// 3. CUSTOMER CRUD (Dedicated reviews CRM flow)
// ==========================================

exports.listCustomers = async (req, res) => {
  try {
    const { locationId, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required.' });
    }

    const where = {
      locationId,
      location: { businessGroup: { ownerId: req.user.id } }
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      status: 'success',
      data: customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List customers error:', error);
    res.status(500).json({ error: 'Failed to retrieve customers list.' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { locationId, name, email, phone, notes, pipeline } = req.body;

    if (!locationId || !name) {
      return res.status(400).json({ error: 'Location ID and name are required.' });
    }

    // Verify ownership
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Location not found or access denied.' });
    }

    const customer = await prisma.customer.create({
      data: {
        locationId,
        name,
        email,
        phone,
        notes,
        pipeline: pipeline || 'LEAD'
      }
    });

    res.status(201).json({ status: 'success', data: customer });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer record.' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, notes, pipeline } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!customer || customer.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        name: name || undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        notes: notes !== undefined ? notes : undefined,
        pipeline: pipeline !== undefined ? pipeline : undefined
      }
    });

    res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer.' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!customer || customer.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    await prisma.customer.delete({ where: { id } });
    res.json({ status: 'success', message: 'Customer deleted successfully.' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete customer.' });
  }
};


// ==========================================
// 4. QR CODE CRUD & SCANS
// ==========================================

exports.listQRs = async (req, res) => {
  try {
    const { locationId, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required.' });
    }

    const where = {
      locationId,
      location: { businessGroup: { ownerId: req.user.id } }
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [qrs, total] = await Promise.all([
      prisma.reviewQRCode.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: { campaign: true }
      }),
      prisma.reviewQRCode.count({ where })
    ]);

    // Attach real QR base64 images to profiles dynamically
    const baseUrl = process.env.REVIEW_BASE_URL || 'https://reviews.manacity.in';
    const qrsWithImages = await Promise.all(qrs.map(async qr => {
      const qrUrl = `${baseUrl}/${qr.uniqueQrId}`;
      const qrImage = await QRCode.toDataURL(qrUrl, { width: 1024, margin: 2 });
      return { ...qr, qrImage, qrUrl };
    }));

    res.json({
      status: 'success',
      data: qrsWithImages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List QRs error:', error);
    res.status(500).json({ error: 'Failed to retrieve QR codes.' });
  }
};

exports.createQR = async (req, res) => {
  try {
    const { locationId, campaignId, name, type, qrTypeClass, expiryDate } = req.body;

    if (!locationId || !name || !type) {
      return res.status(400).json({ error: 'Location ID, QR Name, and Type are required.' });
    }

    // Verify ownership
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Location not found or access denied.' });
    }

    // Ensure unique short ID generator
    let isUnique = false;
    let uniqueQrId = '';
    while (!isUnique) {
      uniqueQrId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const dup = await prisma.reviewQRCode.findUnique({ where: { uniqueQrId } });
      if (!dup) isUnique = true;
    }

    const qr = await prisma.reviewQRCode.create({
      data: {
        locationId,
        campaignId: campaignId || null,
        uniqueQrId,
        name,
        type,
        qrTypeClass: qrTypeClass || 'STATIC',
        createdBy: req.user.id,
        isActive: true,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      }
    });

    const baseUrl = process.env.REVIEW_BASE_URL || 'https://reviews.manacity.in';
    const qrUrl = `${baseUrl}/${qr.uniqueQrId}`;
    const qrImage = await QRCode.toDataURL(qrUrl, { width: 1024, margin: 2 });

    res.status(201).json({ status: 'success', data: { ...qr, qrImage, qrUrl } });
  } catch (error) {
    console.error('Create QR error:', error);
    res.status(500).json({ error: 'Failed to generate QR code profile.' });
  }
};

exports.incrementQRScan = async (req, res) => {
  try {
    const { uniqueQrId } = req.params;

    const qr = await prisma.reviewQRCode.findUnique({
      where: { uniqueQrId }
    });

    if (!qr || !qr.isActive) {
      return res.status(404).json({ error: 'QR Code is either expired or inactive.' });
    }

    // Check expiration if any
    if (qr.expiryDate && new Date(qr.expiryDate) < new Date()) {
      await prisma.reviewQRCode.update({
        where: { id: qr.id },
        data: { isActive: false }
      });
      return res.status(410).json({ error: 'QR Code has expired.' });
    }

    // Parse device details from user agent
    const userAgent = req.headers['user-agent'] || '';
    let deviceType = 'desktop';
    if (/mobile/i.test(userAgent)) deviceType = 'mobile';
    else if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet';

    let browser = 'other';
    if (/chrome|crios/i.test(userAgent)) browser = 'chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'firefox';
    else if (/safari/i.test(userAgent)) browser = 'safari';

    // Store granular analytics in separate QRScan model
    await prisma.qRScan.create({
      data: {
        qrCodeId: qr.id,
        deviceType,
        browser,
        country: req.headers['cf-ipcountry'] || 'Unknown',
        referrer: req.headers['referer'] || 'Direct'
      }
    });

    const updated = await prisma.reviewQRCode.update({
      where: { id: qr.id },
      data: {
        scanCounter: { increment: 1 },
        lastScan: new Date()
      }
    });

    const location = await prisma.location.findUnique({
      where: { id: qr.locationId },
      include: { businessGroup: true }
    });

    let landingPage = await prisma.reviewLandingPage.findUnique({
      where: { locationId: qr.locationId }
    });

    if (!landingPage) {
      landingPage = await prisma.reviewLandingPage.create({
        data: {
          locationId: qr.locationId,
          welcomeMessage: 'How was your experience with us?',
          ratingThreshold: 4,
          thankYouMessage: 'Thank you for your feedback!',
          buttonText: 'Write a Review'
        }
      });
    }

    res.json({
      status: 'success',
      qr: updated,
      location: {
        id: location.id,
        name: location.name,
        logoUrl: location.businessGroup.logoUrl
      },
      landingPage
    });
  } catch (error) {
    console.error('Increment QR scan error:', error);
    res.status(500).json({ error: 'Failed to record QR scan.' });
  }
};

exports.deleteQR = async (req, res) => {
  try {
    const { id } = req.params;

    const qr = await prisma.reviewQRCode.findUnique({
      where: { id },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!qr || qr.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'QR Code not found.' });
    }

    await prisma.reviewQRCode.delete({ where: { id } });
    res.json({ status: 'success', message: 'QR Code deleted successfully.' });
  } catch (error) {
    console.error('Delete QR error:', error);
    res.status(500).json({ error: 'Failed to delete QR code.' });
  }
};


// ==========================================
// 5. LANDING PAGE SETTINGS
// ==========================================

exports.getLandingPage = async (req, res) => {
  try {
    const { locationId } = req.params;

    let landingPage = await prisma.reviewLandingPage.findUnique({
      where: { locationId }
    });

    if (!landingPage) {
      // Auto initialize default landing page configs
      landingPage = await prisma.reviewLandingPage.create({
        data: {
          locationId,
          welcomeMessage: 'How was your experience with us?',
          ratingThreshold: 4,
          thankYouMessage: 'Thank you for your feedback!',
          buttonText: 'Write a Review'
        }
      });
    }

    res.json({ status: 'success', data: landingPage });
  } catch (error) {
    console.error('Get landing page error:', error);
    res.status(500).json({ error: 'Failed to retrieve landing page configurations.' });
  }
};

exports.saveLandingPage = async (req, res) => {
  try {
    const { locationId, logoUrl, welcomeMessage, ratingThreshold, googleReviewUrl, facebookReviewUrl, thankYouMessage, buttonText } = req.body;

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required.' });
    }

    // Verify ownership
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Location not found or access denied.' });
    }

    const landingPage = await prisma.reviewLandingPage.upsert({
      where: { locationId },
      update: {
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        welcomeMessage: welcomeMessage !== undefined ? welcomeMessage : undefined,
        ratingThreshold: ratingThreshold !== undefined ? Number(ratingThreshold) : undefined,
        googleReviewUrl: googleReviewUrl !== undefined ? googleReviewUrl : undefined,
        facebookReviewUrl: facebookReviewUrl !== undefined ? facebookReviewUrl : undefined,
        thankYouMessage: thankYouMessage !== undefined ? thankYouMessage : undefined,
        buttonText: buttonText !== undefined ? buttonText : undefined
      },
      create: {
        locationId,
        logoUrl,
        welcomeMessage: welcomeMessage || 'How was your experience with us?',
        ratingThreshold: ratingThreshold !== undefined ? Number(ratingThreshold) : 4,
        googleReviewUrl,
        facebookReviewUrl,
        thankYouMessage: thankYouMessage || 'Thank you for your feedback!',
        buttonText: buttonText || 'Write a Review'
      }
    });

    res.json({ status: 'success', data: landingPage });
  } catch (error) {
    console.error('Save landing page error:', error);
    res.status(500).json({ error: 'Failed to save landing page configurations.' });
  }
};


// ==========================================
// 6. REVIEW INBOX (CRM FLOW)
// ==========================================

exports.listInboxReviews = async (req, res) => {
  try {
    const { locationId, search, status, source, priority, assignedTo, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required.' });
    }

    const where = {
      locationId,
      location: { businessGroup: { ownerId: req.user.id } }
    };

    if (search) {
      where.OR = [
        { reviewerName: { contains: search, mode: 'insensitive' } },
        { authorName: { contains: search, mode: 'insensitive' } },
        { reviewText: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) where.status = status;
    if (source) where.source = source;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.review.count({ where })
    ]);

    res.json({
      status: 'success',
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List inbox reviews error:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews inbox.' });
  }
};

exports.updateInboxReviewCRM = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, followUpDate, internalNotes, tags } = req.body;

    const review = await prisma.review.findUnique({
      where: { id },
      include: { location: { include: { businessGroup: true } } }
    });

    if (!review || review.location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        priority: priority !== undefined ? priority : undefined,
        assignedTo: assignedTo !== undefined ? assignedTo : undefined,
        followUpDate: followUpDate !== undefined ? (followUpDate ? new Date(followUpDate) : null) : undefined,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined,
        tags: tags !== undefined ? tags : undefined
      }
    });

    res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update inbox CRM error:', error);
    res.status(500).json({ error: 'Failed to update review metadata.' });
  }
};

exports.submitPublicReview = async (req, res) => {
  try {
    const { locationId, source, reviewerName, rating, reviewText, metadata } = req.body;

    if (!locationId || !reviewerName || !rating || !reviewText) {
      return res.status(400).json({ error: 'Location ID, reviewer name, rating, and feedback text are required.' });
    }

    // Default evaluate sentiment
    let sentiment = 'NEUTRAL';
    if (Number(rating) >= 4) sentiment = 'POSITIVE';
    else if (Number(rating) <= 2) sentiment = 'NEGATIVE';

    // Submit landing page flow
    const review = await prisma.review.create({
      data: {
        locationId,
        source: source || 'INTERNAL',
        rating: Number(rating),
        reviewerName,
        // Sync backward compatibility variables
        authorName: reviewerName,
        comment: reviewText,
        reviewText,
        sentiment,
        status: 'NEW',
        metadata: metadata ? safeJson(metadata) : null
      }
    });

    res.status(201).json({ status: 'success', data: review });
  } catch (error) {
    console.error('Submit public review error:', error);
    res.status(500).json({ error: 'Failed to record feedback.' });
  }
};


// ==========================================
// 7. ANALYTICS API (Aggregations only)
// ==========================================

exports.getAnalytics = async (req, res) => {
  try {
    const { locationId, timeline = 'monthly', startDate, endDate } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required.' });
    }

    // Verify ownership
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Location not found or access denied.' });
    }

    // Date filters mapping
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }

    // 1. KPIs
    const [
      totalReviews,
      googleReviews,
      internalReviews,
      totalQrScansObj,
      requestsSent,
      requestsOpened,
      reviewsSubmitted,
      activeCampaigns,
      activeQrs,
      averageRatingObj
    ] = await Promise.all([
      // Total reviews
      prisma.review.count({ where: { locationId, ...dateFilter } }),
      // Google reviews
      prisma.review.count({ where: { locationId, source: 'GOOGLE', ...dateFilter } }),
      // Internal reviews
      prisma.review.count({ where: { locationId, source: 'INTERNAL', ...dateFilter } }),
      // Total QR scans
      prisma.qRScan.count({ where: { qrCode: { locationId }, ...dateFilter } }),
      // Requests sent
      prisma.reviewRequest.count({ where: { campaign: { locationId }, status: 'SENT', ...dateFilter } }),
      // Requests opened
      prisma.reviewRequest.count({ where: { campaign: { locationId }, status: 'OPENED', ...dateFilter } }),
      // Reviews submitted via campaign link
      prisma.reviewRequest.count({ where: { campaign: { locationId }, status: 'COMPLETED', ...dateFilter } }),
      // Active campaigns
      prisma.reviewCampaign.count({ where: { locationId, isActive: true } }),
      // Active QR codes
      prisma.reviewQRCode.count({ where: { locationId, isActive: true } }),
      // Average rating
      prisma.review.aggregate({
        where: { locationId, ...dateFilter },
        _avg: { rating: true }
      })
    ]);

    const averageRating = parseFloat((averageRatingObj._avg.rating || 0).toFixed(2));
    const totalRequests = requestsSent + requestsOpened + reviewsSubmitted;
    const conversionRate = totalRequests > 0 ? parseFloat(((reviewsSubmitted / totalRequests) * 100).toFixed(2)) : 0;

    // 2. Chart: Rating Distribution (1★–5★)
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const ratingsGroup = await prisma.review.groupBy({
      by: ['rating'],
      where: { locationId, ...dateFilter },
      _count: { id: true }
    });
    ratingsGroup.forEach(g => {
      ratingDistribution[g.rating] = g._count.id;
    });

    // 3. Chart: Review Sources Distribution
    const reviewSources = { GOOGLE: 0, INTERNAL: 0, FACEBOOK: 0, WEBSITE: 0, MANUAL: 0 };
    const sourcesGroup = await prisma.review.groupBy({
      by: ['source'],
      where: { locationId, ...dateFilter },
      _count: { id: true }
    });
    sourcesGroup.forEach(g => {
      reviewSources[g.source] = g._count.id;
    });

    // 4. Chart: Conversion Funnel
    const conversionFunnel = {
      sent: requestsSent + requestsOpened + reviewsSubmitted,
      opened: requestsOpened + reviewsSubmitted,
      completed: reviewsSubmitted
    };

    // 5. Chart: Top QR Codes
    const topQrs = await prisma.reviewQRCode.findMany({
      where: { locationId },
      orderBy: { scanCounter: 'desc' },
      take: 5,
      select: { name: true, type: true, scanCounter: true, lastScan: true }
    });

    // 6. Chart: Top Campaigns
    const topCampaigns = await prisma.reviewCampaign.findMany({
      where: { locationId },
      orderBy: { conversionRate: 'desc' },
      take: 5,
      select: { name: true, totalSent: true, totalCompleted: true, conversionRate: true, averageRating: true }
    });

    // 7. Timeline aggregates (Growth and Trends)
    const reviews = await prisma.review.findMany({
      where: { locationId, ...dateFilter },
      select: { createdAt: true, rating: true },
      orderBy: { createdAt: 'asc' }
    });

    const timelineData = [];
    const groups = {};

    reviews.forEach(rev => {
      let bucket = '';
      const date = new Date(rev.createdAt);
      if (timeline === 'daily') {
        bucket = date.toISOString().split('T')[0];
      } else if (timeline === 'weekly') {
        const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
        bucket = firstDay.toISOString().split('T')[0];
      } else if (timeline === 'yearly') {
        bucket = `${date.getFullYear()}`;
      } else {
        bucket = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!groups[bucket]) {
        groups[bucket] = { count: 0, sumRating: 0 };
      }
      groups[bucket].count += 1;
      groups[bucket].sumRating += rev.rating;
    });

    let cumulativeCount = 0;
    Object.keys(groups).sort().forEach(bucket => {
      cumulativeCount += groups[bucket].count;
      timelineData.push({
        bucket,
        reviewsCount: groups[bucket].count,
        cumulativeCount,
        averageRating: parseFloat((groups[bucket].sumRating / groups[bucket].count).toFixed(2))
      });
    });

    // 8. Scheduled Reports Config Interface placeholder response
    const scheduledReportsConfig = {
      dailyEnabled: true,
      weeklyEnabled: true,
      monthlyEnabled: true,
      recipients: [req.user.email]
    };

    res.json({
      status: 'success',
      summary: {
        totalReviews,
        googleReviews,
        internalReviews,
        averageRating,
        totalQrScans: totalQrScansObj,
        conversionRate,
        requestsSent,
        requestsOpened,
        reviewsSubmitted,
        activeCampaigns,
        activeQrs
      },
      ratingDistribution,
      reviewSources,
      conversionFunnel,
      topQrs,
      topCampaigns,
      timeline: timelineData,
      scheduledReportsConfig
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to load review performance metrics.' });
  }
};
