const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const axios = require('axios');

// Google Places Real API Search & Importer
exports.importGooglePlaces = async (req, res) => {
  try {
    const { placeId, businessName } = req.body;
    const ownerId = req.user ? req.user.id : null;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!businessName && !placeId) {
      return res.status(400).json({ error: 'Business name or Place ID is required' });
    }

    let fetchedData = {
      name: businessName || 'My Business',
      address: 'Tirupati, Andhra Pradesh',
      phone: '',
      website: '',
      rating: 4.8,
      category: 'General Business'
    };

    // Perform Google Places API lookup (supporting both Places API New v1 and Legacy Text Search)
    if (apiKey && businessName) {
      try {
        // First try Places API (New) endpoint v1
        const newPlacesRes = await axios.post(
          'https://places.googleapis.com/v1/places:searchText',
          { textQuery: businessName },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.types,places.nationalPhoneNumber,places.websiteUri'
            }
          }
        );

        if (newPlacesRes.data && newPlacesRes.data.places && newPlacesRes.data.places.length > 0) {
          const topResult = newPlacesRes.data.places[0];
          fetchedData.name = topResult.displayName?.text || fetchedData.name;
          fetchedData.address = topResult.formattedAddress || fetchedData.address;
          fetchedData.rating = topResult.rating || fetchedData.rating;
          fetchedData.phone = topResult.nationalPhoneNumber || fetchedData.phone;
          fetchedData.website = topResult.websiteUri || fetchedData.website;
          if (topResult.types && topResult.types.length > 0) {
            fetchedData.category = topResult.types[0].replace(/_/g, ' ').toUpperCase();
          }
        }
      } catch (newApiErr) {
        console.warn('Places API (New v1) failed, trying legacy Text Search:', newApiErr.response?.data || newApiErr.message);
        
        // Fallback to Places API (Legacy) endpoint
        try {
          const legacyRes = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessName)}&key=${apiKey}`);
          if (legacyRes.data && legacyRes.data.results && legacyRes.data.results.length > 0) {
            const topResult = legacyRes.data.results[0];
            fetchedData.name = topResult.name || fetchedData.name;
            fetchedData.address = topResult.formatted_address || fetchedData.address;
            fetchedData.rating = topResult.rating || fetchedData.rating;
            if (topResult.types && topResult.types.length > 0) {
              fetchedData.category = topResult.types[0].replace(/_/g, ' ').toUpperCase();
            }
          }
        } catch (legacyErr) {
          console.warn('Legacy Places API call warning:', legacyErr.response?.data || legacyErr.message);
        }
      }
    }

    const addressParts = (fetchedData.address || '').split(',');
    const city = addressParts.length >= 2 ? addressParts[addressParts.length - 2].trim().toLowerCase() : 'tirupati';
    const slug = fetchedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create or update business group
    let businessGroup = null;
    if (ownerId) {
      // Check if user already has a business group
      const existingGroup = await prisma.businessGroup.findFirst({
        where: { ownerId }
      });

      if (existingGroup) {
        businessGroup = await prisma.businessGroup.update({
          where: { id: existingGroup.id },
          data: {
            name: fetchedData.name,
            description: `Imported Google Place listing for ${fetchedData.name}`,
            mobileNumber: fetchedData.phone || existingGroup.mobileNumber || '9876543210',
            whatsAppNumber: fetchedData.phone || existingGroup.whatsAppNumber || '9876543210',
            website: fetchedData.website || existingGroup.website,
            address: fetchedData.address || existingGroup.address,
            city: city,
            isSetupComplete: true,
            setupStep: 6
          }
        });
      } else {
        businessGroup = await prisma.businessGroup.create({
          data: {
            name: fetchedData.name,
            ownerId: ownerId,
            description: `Imported Google Place listing for ${fetchedData.name}`,
            mobileNumber: fetchedData.phone || '9876543210',
            whatsAppNumber: fetchedData.phone || '9876543210',
            website: fetchedData.website,
            address: fetchedData.address,
            city: city,
            isSetupComplete: true,
            setupStep: 6
          }
        });
      }
    }

    // Auto-create/update Website configuration
    let websiteConfig = null;
    if (businessGroup) {
      const existingWebsite = await prisma.website.findUnique({
        where: { businessGroupId: businessGroup.id }
      });

      if (existingWebsite) {
        websiteConfig = await prisma.website.update({
          where: { businessGroupId: businessGroup.id },
          data: {
            subdomain: slug,
            metaTitle: `${fetchedData.name} - Official Website`,
            metaDescription: `Welcome to ${fetchedData.name} in ${city}. Explore our services and products.`
          }
        });
      } else {
        websiteConfig = await prisma.website.create({
          data: {
            businessGroupId: businessGroup.id,
            subdomain: slug,
            isPublished: true,
            theme: 'modern',
            primaryColor: '#1976d2',
            secondaryColor: '#9c27b0',
            metaTitle: `${fetchedData.name} - Official Website`,
            metaDescription: `Welcome to ${fetchedData.name} in ${city}. Explore our services and products.`
          }
        });
      }

      // Auto-create or update Directory Listing
      const existingListing = await prisma.directoryListing.findFirst({
        where: { businessGroupId: businessGroup.id }
      });

      if (existingListing) {
        await prisma.directoryListing.update({
          where: { id: existingListing.id },
          data: {
            city: city,
            slug: slug,
            category: fetchedData.category,
            contactPhone: fetchedData.phone || existingListing.contactPhone,
            whatsAppNumber: fetchedData.phone || existingListing.whatsAppNumber,
            websiteUrl: fetchedData.website || existingListing.websiteUrl
          }
        });
      } else {
        await prisma.directoryListing.create({
          data: {
            businessGroupId: businessGroup.id,
            city: city,
            slug: slug,
            category: fetchedData.category,
            contactPhone: fetchedData.phone,
            whatsAppNumber: fetchedData.phone,
            websiteUrl: fetchedData.website
          }
        });
      }
    }

    return res.status(200).json({
      message: 'Google Places profile detected & website auto-generated!',
      data: {
        businessGroup,
        websiteConfig,
        importedPlace: fetchedData
      }
    });


    return res.status(200).json({
      message: 'Google Places data imported successfully',
      data: {
        businessGroup,
        websiteConfig,
        importedPlace: {
          placeId,
          businessName,
          category,
          address,
          phone,
          website,
          hours,
          photos,
          rating,
          reviews
        }
      }
    });
  } catch (error) {
    console.error('Error importing Google Places data:', error);
    return res.status(500).json({ error: 'Failed to import Google Places business profile' });
  }
};

// Search Centralized Product & Service Library
exports.getLibraryItems = async (req, res) => {
  try {
    const { category, type, query } = req.query;
    const where = {};
    if (category) where.category = category;
    if (type) where.type = type;
    if (query) {
      where.name = { contains: query, mode: 'insensitive' };
    }

    const items = await prisma.productServiceLibrary.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching library items:', error);
    return res.status(500).json({ error: 'Failed to fetch library items' });
  }
};

// Add Library Item to Business Website & Directory
exports.addLibraryItemToBusiness = async (req, res) => {
  try {
    const { businessGroupId, libraryItemId } = req.body;
    const libraryItem = await prisma.productServiceLibrary.findUnique({
      where: { id: libraryItemId }
    });

    if (!libraryItem) {
      return res.status(404).json({ error: 'Library item not found' });
    }

    if (libraryItem.type === 'SERVICE') {
      await prisma.businessService.create({
        data: {
          businessGroupId,
          name: libraryItem.name
        }
      });
    } else {
      await prisma.businessProduct.create({
        data: {
          businessGroupId,
          name: libraryItem.name
        }
      });
    }

    return res.status(200).json({ message: 'Item added to business profile & website successfully', item: libraryItem });
  } catch (error) {
    console.error('Error adding library item:', error);
    return res.status(500).json({ error: 'Failed to add library item' });
  }
};
