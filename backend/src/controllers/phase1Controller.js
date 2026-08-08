const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

// Helper Functions
const mapGoogleTypeToCategory = (types = []) => {
  const tStr = types.join(' ').toLowerCase();
  if (tStr.includes('marketing') || tStr.includes('advertising') || tStr.includes('consultant')) return 'Digital Marketing';
  if (tStr.includes('rice') || tStr.includes('mill') || tStr.includes('grain')) return 'Rice Mill';
  if (tStr.includes('health') || tStr.includes('doctor') || tStr.includes('hospital') || tStr.includes('clinic') || tStr.includes('dentist')) return 'Clinics & Health';
  if (tStr.includes('hotel') || tStr.includes('lodging') || tStr.includes('resort')) return 'Hotels & Lodging';
  if (tStr.includes('service') || tStr.includes('repair') || tStr.includes('store')) return 'Services';
  
  if (types.length > 0) {
    const raw = types[0].replace(/_/g, ' ');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return 'General Business';
};

const cleanPhone = (phoneStr) => {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

const parseAddressParts = (rawAddr) => {
  if (!rawAddr) return { city: 'Tirupati', state: 'Andhra Pradesh', pinCode: '517501', country: 'India', street: '' };
  
  const pinMatch = rawAddr.match(/\b\d{6}\b/);
  const pinCode = pinMatch ? pinMatch[0] : '517501';

  const parts = rawAddr.split(',').map(p => p.trim());
  let country = 'India';
  let state = 'Andhra Pradesh';
  let city = 'Tirupati';

  if (parts.length >= 3) {
    country = parts[parts.length - 1] || 'India';
    const statePart = parts[parts.length - 2] || '';
    state = statePart.replace(/\b\d{6}\b/, '').trim() || 'Andhra Pradesh';
    city = parts[parts.length - 3] || 'Tirupati';
  } else if (parts.length === 2) {
    city = parts[0];
    state = parts[1].replace(/\b\d{6}\b/, '').trim();
  }

  const street = parts.slice(0, Math.max(1, parts.length - 2)).join(', ');

  return { city, state, pinCode, country, street };
};

// Google Places Autocomplete API (Live Type-Ahead Predictions)
exports.autocompleteGooglePlaces = async (req, res) => {
  try {
    const { input } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!input || !input.trim()) {
      return res.status(200).json({ predictions: [] });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'Google Places API Key is missing in server configuration.' });
    }

    // Call Google Places API (New v1) Autocomplete
    try {
      const apiRes = await axios.post(
        'https://places.googleapis.com/v1/places:autocomplete',
        { input: input.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey
          }
        }
      );

      if (apiRes.data && apiRes.data.suggestions) {
        const predictions = apiRes.data.suggestions
          .filter(s => s.placePrediction)
          .map(s => ({
            placeId: s.placePrediction.placeId,
            name: s.placePrediction.structuredFormat?.mainText?.text || s.placePrediction.text?.text,
            description: s.placePrediction.text?.text
          }));
        return res.status(200).json({ predictions });
      }
    } catch (newErr) {
      const errMsg = newErr.response?.data?.error?.message || newErr.message;
      console.warn('Places API (New v1) autocomplete warning, trying legacy:', errMsg);
      
      // Fallback to Places Autocomplete Legacy
      try {
        const legacyRes = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`);
        if (legacyRes.data && legacyRes.data.status === 'OK' && legacyRes.data.predictions) {
          const predictions = legacyRes.data.predictions.map(p => ({
            placeId: p.place_id,
            name: p.structured_formatting?.main_text || p.description,
            description: p.description
          }));
          return res.status(200).json({ predictions });
        } else if (legacyRes.data && (legacyRes.data.status === 'REQUEST_DENIED' || legacyRes.data.status === 'INVALID_REQUEST')) {
          return res.status(400).json({ error: legacyRes.data.error_message || 'Google Places API Key denied by Google.' });
        }
      } catch (legacyErr) {
        console.warn('Legacy Places Autocomplete warning:', legacyErr.response?.data || legacyErr.message);
      }

      return res.status(400).json({ error: `Google Places API Error: ${errMsg}` });
    }

    return res.status(200).json({ predictions: [] });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return res.status(500).json({ error: 'Failed to fetch autocomplete suggestions' });
  }
};

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

    // If specific Place ID is selected by user from predictions dropdown
    if (apiKey && placeId) {
      try {
        const placeDetailsRes = await axios.get(
          `https://places.googleapis.com/v1/places/${placeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': 'displayName,formattedAddress,rating,types,nationalPhoneNumber,websiteUri'
            }
          }
        );
        if (placeDetailsRes.data) {
          const pd = placeDetailsRes.data;
          fetchedData.name = pd.displayName?.text || fetchedData.name;
          fetchedData.address = pd.formattedAddress || fetchedData.address;
          fetchedData.rating = pd.rating || fetchedData.rating;
          fetchedData.phone = cleanPhone(pd.nationalPhoneNumber) || fetchedData.phone;
          fetchedData.website = pd.websiteUri || fetchedData.website;
          if (pd.types && pd.types.length > 0) {
            fetchedData.category = mapGoogleTypeToCategory(pd.types);
          }
        }
      } catch (pdErr) {
        console.warn('Place Details (New v1) failed, trying legacy details:', pdErr.response?.data || pdErr.message);
        try {
          const legacyDetails = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`);
          if (legacyDetails.data && legacyDetails.data.result) {
            const r = legacyDetails.data.result;
            fetchedData.name = r.name || fetchedData.name;
            fetchedData.address = r.formatted_address || fetchedData.address;
            fetchedData.rating = r.rating || fetchedData.rating;
            fetchedData.phone = cleanPhone(r.formatted_phone_number) || fetchedData.phone;
            fetchedData.website = r.website || fetchedData.website;
            if (r.types && r.types.length > 0) {
              fetchedData.category = mapGoogleTypeToCategory(r.types);
            }
          }
        } catch (e) {
          console.warn('Legacy Place Details warning:', e.message);
        }
      }
    } else if (apiKey && businessName) {
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
          fetchedData.phone = cleanPhone(topResult.nationalPhoneNumber) || fetchedData.phone;
          fetchedData.website = topResult.websiteUri || fetchedData.website;
          if (topResult.types && topResult.types.length > 0) {
            fetchedData.category = mapGoogleTypeToCategory(topResult.types);
          }
        }
      } catch (newApiErr) {
        console.warn('Places API (New v1) failed, trying legacy Text Search:', newApiErr.response?.data || newApiErr.message);
        try {
          const legacyRes = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessName)}&key=${apiKey}`);
          if (legacyRes.data && legacyRes.data.results && legacyRes.data.results.length > 0) {
            const topResult = legacyRes.data.results[0];
            fetchedData.name = topResult.name || fetchedData.name;
            fetchedData.address = topResult.formatted_address || fetchedData.address;
            fetchedData.rating = topResult.rating || fetchedData.rating;
            if (topResult.types && topResult.types.length > 0) {
              fetchedData.category = mapGoogleTypeToCategory(topResult.types);
            }
          }
        } catch (legacyErr) {
          console.warn('Legacy Places API call warning:', legacyErr.response?.data || legacyErr.message);
        }
      }
    }

    const parsed = parseAddressParts(fetchedData.address);
    const city = parsed.city.toLowerCase();
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

      // Auto-create or update Location record for Business Locations screen
      const existingLocation = await prisma.location.findFirst({
        where: { businessGroupId: businessGroup.id }
      });

      if (existingLocation) {
        await prisma.location.update({
          where: { id: existingLocation.id },
          data: {
            name: fetchedData.name,
            address: fetchedData.address,
            city: city,
            phone: fetchedData.phone || existingLocation.phone,
            category: fetchedData.category
          }
        });
      } else {
        await prisma.location.create({
          data: {
            businessGroupId: businessGroup.id,
            name: fetchedData.name,
            address: fetchedData.address,
            city: city,
            country: 'India',
            phone: fetchedData.phone || '9876543210',
            category: fetchedData.category,
            hours: { Monday: '09:00-18:00', Tuesday: '09:00-18:00', Wednesday: '09:00-18:00', Thursday: '09:00-18:00', Friday: '09:00-18:00', Saturday: '10:00-16:00', Sunday: 'Closed' }
          }
        });
      }
    }

    return res.status(200).json({
      message: 'Google Places profile detected & website auto-generated!',
      data: {
        businessGroup,
        websiteConfig,
        importedPlace: {
          ...fetchedData,
          parsedAddress: parsed
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

    let items = await prisma.productServiceLibrary.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    // Provide rich category-tailored master items if DB returns empty
    if (!items || items.length === 0) {
      const catUpper = (category || '').toUpperCase();
      const defaultCatalog = [
        // Digital Marketing / Consulting
        { id: 'lib-1', name: 'SEO Optimization & Local Search Ranking', category: 'DIGITAL MARKETING', type: 'SERVICE', price: 4999 },
        { id: 'lib-2', name: 'Google Business Profile (GBP) Verification & Audit', category: 'DIGITAL MARKETING', type: 'SERVICE', price: 2999 },
        { id: 'lib-3', name: 'Meta & Instagram Ads Lead Generation', category: 'DIGITAL MARKETING', type: 'SERVICE', price: 6999 },
        { id: 'lib-4', name: 'High-Converting Website Development', category: 'DIGITAL MARKETING', type: 'SERVICE', price: 9999 },
        { id: 'lib-5', name: 'Social Media Management (12 Posts/Mo)', category: 'DIGITAL MARKETING', type: 'SERVICE', price: 3999 },
        { id: 'lib-6', name: 'WhatsApp Business Automation Bot', category: 'DIGITAL MARKETING', type: 'PRODUCT', price: 1499 },

        // Rice Mill / Agriculture / Food
        { id: 'lib-7', name: 'Premium Sona Masoori Rice (25kg Bag)', category: 'RICE MILL', type: 'PRODUCT', price: 1450 },
        { id: 'lib-8', name: 'HMT Raw Steam Rice (26kg Bag)', category: 'RICE MILL', type: 'PRODUCT', price: 1650 },
        { id: 'lib-9', name: 'Organic Whole Wheat Atta (10kg)', category: 'RICE MILL', type: 'PRODUCT', price: 420 },
        { id: 'lib-10', name: 'Wholesale Rice Milling & Polishing', category: 'RICE MILL', type: 'SERVICE', price: 500 },
        { id: 'lib-11', name: 'Bulk Grain Storage & Packaging', category: 'RICE MILL', type: 'SERVICE', price: 1200 },

        // Clinics & Health
        { id: 'lib-12', name: 'General Physician Consultation', category: 'CLINICS & HEALTH', type: 'SERVICE', price: 400 },
        { id: 'lib-13', name: 'Pediatric Health Checkup', category: 'CLINICS & HEALTH', type: 'SERVICE', price: 500 },
        { id: 'lib-14', name: 'Comprehensive Blood Test & Diagnostics', category: 'CLINICS & HEALTH', type: 'SERVICE', price: 999 },
        { id: 'lib-15', name: 'Dental Cleaning & Polishing', category: 'CLINICS & HEALTH', type: 'SERVICE', price: 800 },
        { id: 'lib-16', name: 'First Aid Kit & Emergency Supplies', category: 'CLINICS & HEALTH', type: 'PRODUCT', price: 350 },

        // Hotels & Lodging
        { id: 'lib-17', name: 'Deluxe Air-Conditioned Room (1 Night)', category: 'HOTELS & LODGING', type: 'PRODUCT', price: 2499 },
        { id: 'lib-18', name: 'Executive Suite Room Booking', category: 'HOTELS & LODGING', type: 'PRODUCT', price: 4499 },
        { id: 'lib-19', name: '24/7 Room Service & Dining', category: 'HOTELS & LODGING', type: 'SERVICE', price: 500 },
        { id: 'lib-20', name: 'Airport & Railway Station Pickup', category: 'HOTELS & LODGING', type: 'SERVICE', price: 600 },

        // General Business / Services
        { id: 'lib-21', name: 'Professional Consultation', category: 'GENERAL BUSINESS', type: 'SERVICE', price: 1000 },
        { id: 'lib-22', name: 'Annual Maintenance Service Contract', category: 'GENERAL BUSINESS', type: 'SERVICE', price: 2999 },
        { id: 'lib-23', name: 'Premium Business Package', category: 'GENERAL BUSINESS', type: 'PRODUCT', price: 1999 }
      ];

      items = defaultCatalog.filter(item => {
        let match = true;
        if (category && category !== 'All') {
          match = match && (item.category.includes(catUpper) || catUpper.includes(item.category) || item.category === 'GENERAL BUSINESS');
        }
        if (type) {
          match = match && item.type === type;
        }
        return match;
      });

      if (items.length === 0) {
        items = defaultCatalog.filter(item => item.category === 'GENERAL BUSINESS' || item.category === 'DIGITAL MARKETING');
      }
    }

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
