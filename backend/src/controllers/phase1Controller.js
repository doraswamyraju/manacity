const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Google Places Import Mock / API Integration
exports.importGooglePlaces = async (req, res) => {
  try {
    const { placeId, businessName, category, address, phone, website, hours, photos, rating, reviews } = req.body;
    const ownerId = req.user ? req.user.id : null;

    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    // Parse city from address or default
    const addressParts = (address || '').split(',');
    const city = addressParts.length >= 2 ? addressParts[addressParts.length - 2].trim().toLowerCase() : 'tirupati';
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create business group
    let businessGroup = null;
    if (ownerId) {
      businessGroup = await prisma.businessGroup.create({
        data: {
          name: businessName,
          ownerId: ownerId,
          description: `Imported Google Place listing for ${businessName}`,
          mobileNumber: phone,
          whatsAppNumber: phone,
          website: website,
          address: address,
          city: city,
          isSetupComplete: true,
          setupStep: 6
        }
      });
    }

    // Auto-create Website configuration
    let websiteConfig = null;
    if (businessGroup) {
      websiteConfig = await prisma.website.create({
        data: {
          businessGroupId: businessGroup.id,
          subdomain: slug,
          isPublished: true,
          theme: 'modern',
          primaryColor: '#1976d2',
          secondaryColor: '#9c27b0',
          metaTitle: `${businessName} - Official Website`,
          metaDescription: `Welcome to ${businessName} in ${city}. Explore our services and products.`
        }
      });

      // Auto-create Directory Listing
      await prisma.directoryListing.create({
        data: {
          businessGroupId: businessGroup.id,
          city: city,
          slug: slug,
          category: category || 'General Business',
          contactPhone: phone,
          whatsAppNumber: phone,
          websiteUrl: website
        }
      });
    }

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
