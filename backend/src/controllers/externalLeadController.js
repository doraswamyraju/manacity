const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Submit enquiry for an un-onboarded Google Places business
exports.createExternalLead = async (req, res) => {
  try {
    const {
      googlePlaceId,
      businessName,
      businessPhone,
      businessAddress,
      customerName,
      customerPhone,
      customerEmail,
      serviceRequested,
      message
    } = req.body;

    if (!googlePlaceId || !businessName || !customerName || !customerPhone) {
      return res.status(400).json({
        error: 'Required fields missing: googlePlaceId, businessName, customerName, customerPhone.'
      });
    }

    const newLead = await prisma.unonboardedLead.create({
      data: {
        googlePlaceId,
        businessName,
        businessPhone: businessPhone || null,
        businessAddress: businessAddress || null,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        serviceRequested: serviceRequested || null,
        message: message || null,
        status: 'NOTIFIED',
        notifiedAt: new Date()
      }
    });

    // Simulate/Log sending notification to the un-onboarded business phone/contact
    console.log(`[EXTERNAL LEAD NOTIFICATION] SMS/WhatsApp sent to business "${businessName}" (${businessPhone || 'No Phone Registered'}): "You have a new customer enquiry on ManaCity from ${customerName} (${customerPhone}). Claim your free business profile to respond!"`);

    return res.json({
      status: 'success',
      message: 'Your enquiry has been dispatched to the business owner. If they do not respond within 24 hours, we will recommend top verified service providers in your area.',
      lead: newLead,
      slaHours: 24
    });
  } catch (error) {
    console.error('Create external lead error:', error);
    return res.status(500).json({ error: 'Failed to record lead enquiry.' });
  }
};

// 2. Check lead status & fetch alternative recommended onboarded businesses if SLA timed out or pending
exports.getLeadStatusAndAlternatives = async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await prisma.unonboardedLead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead enquiry not found.' });
    }

    const hoursPassed = (new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60);

    // If 24h passed and still NOTIFIED/PENDING, mark TIMED_OUT
    let currentStatus = lead.status;
    if (hoursPassed >= 24 && currentStatus === 'NOTIFIED') {
      currentStatus = 'TIMED_OUT';
      await prisma.unonboardedLead.update({
        where: { id: leadId },
        data: { status: 'TIMED_OUT' }
      });
    }

    // Fetch verified active onboarded ManaCity businesses as fallback recommendations
    const alternativeBusinesses = await prisma.businessGroup.findMany({
      where: {
        status: 'LIVE',
        isSetupComplete: true
      },
      select: {
        id: true,
        name: true,
        city: true,
        areaLocality: true,
        mobileNumber: true,
        googleRating: true,
        logoUrl: true
      },
      take: 5
    });

    return res.json({
      status: 'success',
      leadStatus: currentStatus,
      isTimedOut: hoursPassed >= 24,
      alternativeBusinesses
    });
  } catch (error) {
    console.error('Get lead status error:', error);
    return res.status(500).json({ error: 'Failed to retrieve lead status.' });
  }
};
