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

// 6. Get Onboarding State
exports.getOnboardingState = async (req, res) => {
  try {
    const ownerId = req.user.id;

    let businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId },
      include: {
        documents: true,
        services: true,
        products: true,
        paymentMethods: true,
        languages: true
      }
    });

    if (!businessGroup) {
      // Auto-create business group if missing
      businessGroup = await prisma.businessGroup.create({
        data: { name: `${req.user.name}'s Business`, ownerId },
        include: {
          documents: true,
          services: true,
          products: true,
          paymentMethods: true,
          languages: true
        }
      });
    }

    res.json({
      status: 'success',
      businessGroup
    });
  } catch (error) {
    console.error('Get onboarding state error:', error);
    res.status(500).json({ error: 'Failed to retrieve onboarding state.' });
  }
};

// 7. Save Onboarding Step
exports.saveOnboardingStep = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { step, data } = req.body;

    if (!step || !data) {
      return res.status(400).json({ error: 'Step and data are required.' });
    }

    // Find the business group
    let businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId }
    });

    if (!businessGroup) {
      businessGroup = await prisma.businessGroup.create({
        data: { name: `${req.user.name}'s Business`, ownerId }
      });
    }

    const businessGroupId = businessGroup.id;
    let updateData = { setupStep: Number(step) };

    if (step === 1) {
      // Business Info
      updateData.name = data.name || businessGroup.name;
      updateData.description = data.description !== undefined ? data.description : businessGroup.description;
      updateData.yearStarted = data.yearStarted !== undefined && data.yearStarted !== '' ? Number(data.yearStarted) : null;
      updateData.logoUrl = data.logoUrl !== undefined ? data.logoUrl : businessGroup.logoUrl;
      updateData.coverImageUrl = data.coverImageUrl !== undefined ? data.coverImageUrl : businessGroup.coverImageUrl;
    } else if (step === 2) {
      // Contact Info
      updateData.mobileNumber = data.mobileNumber !== undefined ? data.mobileNumber : businessGroup.mobileNumber;
      updateData.whatsAppNumber = data.whatsAppNumber !== undefined ? data.whatsAppNumber : businessGroup.whatsAppNumber;
      updateData.email = data.email !== undefined ? data.email : businessGroup.email;
      updateData.website = data.website !== undefined ? data.website : businessGroup.website;
      updateData.supportEmail = data.supportEmail !== undefined ? data.supportEmail : businessGroup.supportEmail;
    } else if (step === 3) {
      // Address
      updateData.country = data.country !== undefined ? data.country : businessGroup.country;
      updateData.state = data.state !== undefined ? data.state : businessGroup.state;
      updateData.city = data.city !== undefined ? data.city : businessGroup.city;
      updateData.areaLocality = data.areaLocality !== undefined ? data.areaLocality : businessGroup.areaLocality;
      updateData.address = data.address !== undefined ? data.address : businessGroup.address;
      updateData.pinCode = data.pinCode !== undefined ? data.pinCode : businessGroup.pinCode;
      updateData.googleMapsLink = data.googleMapsLink !== undefined ? data.googleMapsLink : businessGroup.googleMapsLink;
    } else if (step === 4) {
      // Business Details: Working Days, Business Hours, Languages, Services, Products, Documents (GST, etc.)
      if (data.workingDays) {
        updateData.workingDays = data.workingDays;
      }
      if (data.businessHours) {
        updateData.businessHours = data.businessHours;
      }

      // Sync normalized languages
      if (data.languagesSpoken) {
        await prisma.businessLanguage.deleteMany({ where: { businessGroupId } });
        if (data.languagesSpoken.length > 0) {
          await prisma.businessLanguage.createMany({
            data: data.languagesSpoken.map(lang => ({ businessGroupId, language: lang }))
          });
        }
      }

      // Sync normalized services
      if (data.servicesOffered) {
        await prisma.businessService.deleteMany({ where: { businessGroupId } });
        if (data.servicesOffered.length > 0) {
          await prisma.businessService.createMany({
            data: data.servicesOffered.map(service => ({ businessGroupId, name: service }))
          });
        }
      }

      // Sync normalized products
      if (data.productsOffered) {
        await prisma.businessProduct.deleteMany({ where: { businessGroupId } });
        if (data.productsOffered.length > 0) {
          await prisma.businessProduct.createMany({
            data: data.productsOffered.map(product => ({ businessGroupId, name: product }))
          });
        }
      }

      // Sync normalized payment methods
      if (data.paymentMethods) {
        await prisma.businessPaymentMethod.deleteMany({ where: { businessGroupId } });
        if (data.paymentMethods.length > 0) {
          await prisma.businessPaymentMethod.createMany({
            data: data.paymentMethods.map(method => ({ businessGroupId, methodName: method }))
          });
        }
      }

      // Sync Documents (GST, Udyam, FSSAI, Shop License)
      if (data.documents) {
        for (const doc of data.documents) {
          await prisma.businessDocument.upsert({
            where: {
              businessGroupId_type: {
                businessGroupId,
                type: doc.type
              }
            },
            update: { value: doc.value },
            create: {
              businessGroupId,
              type: doc.type,
              value: doc.value
            }
          });
        }
      }
    } else if (step === 5) {
      // Social Links
      updateData.socialFacebook = data.socialFacebook !== undefined ? data.socialFacebook : businessGroup.socialFacebook;
      updateData.socialInstagram = data.socialInstagram !== undefined ? data.socialInstagram : businessGroup.socialInstagram;
      updateData.socialYouTube = data.socialYouTube !== undefined ? data.socialYouTube : businessGroup.socialYouTube;
      updateData.socialLinkedIn = data.socialLinkedIn !== undefined ? data.socialLinkedIn : businessGroup.socialLinkedIn;
      updateData.socialTwitter = data.socialTwitter !== undefined ? data.socialTwitter : businessGroup.socialTwitter;
    }

    // Save update
    const updatedGroup = await prisma.businessGroup.update({
      where: { id: businessGroupId },
      data: updateData,
      include: {
        documents: true,
        services: true,
        products: true,
        paymentMethods: true,
        languages: true
      }
    });

    res.json({
      status: 'success',
      businessGroup: updatedGroup
    });
  } catch (error) {
    console.error('Save onboarding step error:', error);
    res.status(500).json({ error: 'Failed to save onboarding progress.' });
  }
};

// 8. Complete Onboarding
exports.completeOnboarding = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the business group
    const businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId }
    });

    if (!businessGroup) {
      return res.status(404).json({ error: 'Business profile not found.' });
    }

    const updatedGroup = await prisma.businessGroup.update({
      where: { id: businessGroup.id },
      data: {
        isSetupComplete: true,
        setupStep: 6
      }
    });

    res.json({
      status: 'success',
      businessGroup: updatedGroup
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ error: 'Failed to complete onboarding.' });
  }
};
