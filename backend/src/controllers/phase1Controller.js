const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const { provisionLetsTrackTenant } = require('../services/letsTrackService');

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
      rating: 4.9,
      reviewCount: 63,
      category: 'General Business'
    };

    let resolvedPlaceId = placeId || null;

    // If specific Place ID is selected by user from predictions dropdown
    if (apiKey && placeId) {
      try {
        const placeDetailsRes = await axios.get(
          `https://places.googleapis.com/v1/places/${placeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,types,nationalPhoneNumber,websiteUri'
            }
          }
        );
        if (placeDetailsRes.data) {
          const pd = placeDetailsRes.data;
          fetchedData.name = pd.displayName?.text || fetchedData.name;
          fetchedData.address = pd.formattedAddress || fetchedData.address;
          fetchedData.rating = pd.rating || fetchedData.rating;
          fetchedData.reviewCount = pd.userRatingCount || fetchedData.reviewCount;
          fetchedData.phone = cleanPhone(pd.nationalPhoneNumber) || fetchedData.phone;
          fetchedData.website = pd.websiteUri || fetchedData.website;
          resolvedPlaceId = pd.id || placeId;
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
            fetchedData.reviewCount = r.user_ratings_total || fetchedData.reviewCount;
            fetchedData.phone = cleanPhone(r.formatted_phone_number) || fetchedData.phone;
            fetchedData.website = r.website || fetchedData.website;
            resolvedPlaceId = r.place_id || placeId;
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
              'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.nationalPhoneNumber,places.websiteUri'
            }
          }
        );

        if (newPlacesRes.data && newPlacesRes.data.places && newPlacesRes.data.places.length > 0) {
          const topResult = newPlacesRes.data.places[0];
          fetchedData.name = topResult.displayName?.text || fetchedData.name;
          fetchedData.address = topResult.formattedAddress || fetchedData.address;
          fetchedData.rating = topResult.rating || fetchedData.rating;
          fetchedData.reviewCount = topResult.userRatingCount || fetchedData.reviewCount;
          fetchedData.phone = cleanPhone(topResult.nationalPhoneNumber) || fetchedData.phone;
          fetchedData.website = topResult.websiteUri || fetchedData.website;
          resolvedPlaceId = topResult.id || topResult.name?.split('/')?.pop() || null;
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
            fetchedData.reviewCount = topResult.user_ratings_total || fetchedData.reviewCount;
            resolvedPlaceId = topResult.place_id || null;
            if (topResult.types && topResult.types.length > 0) {
              fetchedData.category = mapGoogleTypeToCategory(topResult.types);
            }
          }
        } catch (legacyErr) {
          console.warn('Legacy Places API call warning:', legacyErr.response?.data || legacyErr.message);
        }
      }
    }

    if (resolvedPlaceId && ownerId) {
      const alreadyClaimed = await prisma.businessGroup.findFirst({
        where: {
          googlePlaceId: resolvedPlaceId,
          ownerId: { not: ownerId }
        }
      });
      if (alreadyClaimed) {
        return res.status(400).json({ error: 'This business has already been claimed and registered by another user on ManaCity.' });
      }
    }

    const parsed = parseAddressParts(fetchedData.address);
    const safeCity = (parsed.city || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'general';
    const storeSlug = fetchedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'my-business';
    
    let baseSlug = storeSlug;
    if (safeCity && safeCity !== 'general') {
      if (storeSlug === safeCity || storeSlug.endsWith(`-${safeCity}`) || storeSlug.includes(`-${safeCity}-`) || storeSlug.includes(safeCity)) {
        baseSlug = storeSlug;
      } else {
        baseSlug = `${storeSlug}-${safeCity}`;
      }
    } else if (safeCity === 'general' && !storeSlug.includes('general')) {
      baseSlug = `${storeSlug}-${safeCity}`;
    }
    if (baseSlug.length > 63) {
      baseSlug = baseSlug.substring(0, 63).replace(/-+$/, '');
    }

    const computedReviewUrl = resolvedPlaceId
      ? `https://search.google.com/local/writereview?placeid=${resolvedPlaceId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fetchedData.name + ' ' + safeCity)}`;

    fetchedData.placeId = resolvedPlaceId;
    fetchedData.googleReviewUrl = computedReviewUrl;

    const descString = fetchedData.description || `Official Google Business profile for ${fetchedData.name}.`;

    // Create or update business group using resolved tenant boundary
    let businessGroup = null;
    if (ownerId) {
      const existingGroup = await prisma.businessGroup.findFirst({
        where: { ownerId }
      });

      if (existingGroup) {
        try {
          businessGroup = await prisma.businessGroup.update({
            where: { id: existingGroup.id },
            data: {
              name: fetchedData.name,
              description: descString,
              mobileNumber: fetchedData.phone || existingGroup.mobileNumber || '',
              whatsAppNumber: fetchedData.phone || existingGroup.whatsAppNumber || '',
              website: fetchedData.website || existingGroup.website,
              address: fetchedData.address || existingGroup.address,
              city: safeCity || existingGroup.city,
              googleReviewUrl: computedReviewUrl || existingGroup.googleReviewUrl,
              googlePlaceId: resolvedPlaceId || existingGroup.googlePlaceId,
              googleRating: fetchedData.rating || existingGroup.googleRating,
              googleReviewCount: fetchedData.reviewCount || existingGroup.googleReviewCount,
              isSetupComplete: true,
              setupStep: 6
            }
          });
        } catch (updateErr) {
          console.warn('Fallback update without googleRating fields:', updateErr.message);
          businessGroup = await prisma.businessGroup.update({
            where: { id: existingGroup.id },
            data: {
              name: fetchedData.name,
              description: descString,
              mobileNumber: fetchedData.phone || existingGroup.mobileNumber || '',
              whatsAppNumber: fetchedData.phone || existingGroup.whatsAppNumber || '',
              website: fetchedData.website || existingGroup.website,
              address: fetchedData.address || existingGroup.address,
              city: safeCity || existingGroup.city,
              googleReviewUrl: computedReviewUrl || existingGroup.googleReviewUrl,
              googlePlaceId: resolvedPlaceId || existingGroup.googlePlaceId,
              isSetupComplete: true,
              setupStep: 6
            }
          });
        }
      } else {
        try {
          businessGroup = await prisma.businessGroup.create({
            data: {
              name: fetchedData.name,
              ownerId: ownerId,
              description: descString,
              mobileNumber: fetchedData.phone || '',
              whatsAppNumber: fetchedData.phone || '',
              website: fetchedData.website || null,
              address: fetchedData.address || null,
              city: safeCity,
              googleReviewUrl: computedReviewUrl,
              googlePlaceId: resolvedPlaceId || null,
              googleRating: fetchedData.rating || null,
              googleReviewCount: fetchedData.reviewCount || null,
              isSetupComplete: true,
              setupStep: 6
            }
          });
        } catch (createErr) {
          console.warn('Fallback create without googleRating fields:', createErr.message);
          businessGroup = await prisma.businessGroup.create({
            data: {
              name: fetchedData.name,
              ownerId: ownerId,
              description: descString,
              mobileNumber: fetchedData.phone || '',
              whatsAppNumber: fetchedData.phone || '',
              website: fetchedData.website || null,
              address: fetchedData.address || null,
              city: safeCity,
              googleReviewUrl: computedReviewUrl,
              googlePlaceId: resolvedPlaceId || null,
              isSetupComplete: true,
              setupStep: 6
            }
          });
        }
      }
    }

    // Auto-create/update Website configuration with unique subdomain
    let websiteConfig = null;
    if (businessGroup) {
      let uniqueSlug = baseSlug;
      let counter = 0;
      let isSubUnique = false;
      while (!isSubUnique) {
        const dup = await prisma.website.findFirst({
          where: {
            subdomain: uniqueSlug,
            businessGroupId: { not: businessGroup.id }
          }
        });
        if (!dup) {
          isSubUnique = true;
        } else {
          counter++;
          const suffix = `-${counter}`;
          uniqueSlug = baseSlug.substring(0, 63 - suffix.length).replace(/-+$/, '') + suffix;
        }
      }

      const existingWebsite = await prisma.website.findUnique({
        where: { businessGroupId: businessGroup.id }
      });

      if (existingWebsite) {
        websiteConfig = await prisma.website.update({
          where: { businessGroupId: businessGroup.id },
          data: {
            subdomain: uniqueSlug,
            metaTitle: `${fetchedData.name} - Official Website`,
            metaDescription: `Welcome to ${fetchedData.name} in ${safeCity}. Explore our services and products.`
          }
        });
      } else {
        websiteConfig = await prisma.website.create({
          data: {
            businessGroupId: businessGroup.id,
            subdomain: uniqueSlug,
            isPublished: true,
            theme: 'modern',
            primaryColor: '#1976d2',
            secondaryColor: '#9c27b0',
            metaTitle: `${fetchedData.name} - Official Website`,
            metaDescription: `Welcome to ${fetchedData.name} in ${safeCity}. Explore our services and products.`
          }
        });
      }

      // Auto-create or update Directory Listing with unique slug
      let uniqueDirSlug = baseSlug;
      let dirCounter = 0;
      let isDirUnique = false;
      while (!isDirUnique) {
        const dupDir = await prisma.directoryListing.findFirst({
          where: {
            city: safeCity,
            slug: uniqueDirSlug,
            businessGroupId: { not: businessGroup.id }
          }
        });
        if (!dupDir) {
          isDirUnique = true;
        } else {
          dirCounter++;
          const suffix = `-${dirCounter}`;
          uniqueDirSlug = baseSlug.substring(0, 63 - suffix.length).replace(/-+$/, '') + suffix;
        }
      }

      const existingListing = await prisma.directoryListing.findFirst({
        where: { businessGroupId: businessGroup.id }
      });

      if (existingListing) {
        await prisma.directoryListing.update({
          where: { id: existingListing.id },
          data: {
            city: safeCity,
            slug: uniqueDirSlug,
            category: fetchedData.category,
            contactPhone: fetchedData.phone || existingListing.contactPhone,
            whatsAppNumber: fetchedData.phone || existingListing.whatsAppNumber,
            websiteUrl: fetchedData.website || existingListing.websiteUrl,
            reviews: { rating: fetchedData.rating, reviewCount: fetchedData.reviewCount }
          }
        });
      } else {
        await prisma.directoryListing.create({
          data: {
            businessGroupId: businessGroup.id,
            city: safeCity,
            slug: uniqueDirSlug,
            category: fetchedData.category,
            contactPhone: fetchedData.phone,
            whatsAppNumber: fetchedData.phone,
            websiteUrl: fetchedData.website,
            reviews: { rating: fetchedData.rating, reviewCount: fetchedData.reviewCount }
          }
        });
      }

      // Auto-create or update Location record strictly by canonical googlePlaceId
      let targetLocation = null;
      if (resolvedPlaceId) {
        targetLocation = await prisma.location.findFirst({
          where: { businessGroupId: businessGroup.id, googlePlaceId: resolvedPlaceId }
        });
      }

      if (!targetLocation) {
        targetLocation = await prisma.location.findFirst({
          where: { businessGroupId: businessGroup.id }
        });
      }

      if (targetLocation && (targetLocation.googlePlaceId === resolvedPlaceId || !resolvedPlaceId)) {
        await prisma.location.update({
          where: { id: targetLocation.id },
          data: {
            name: fetchedData.name,
            address: fetchedData.address || targetLocation.address,
            city: safeCity || targetLocation.city,
            phone: fetchedData.phone || targetLocation.phone || '',
            category: fetchedData.category || targetLocation.category,
            googlePlaceId: resolvedPlaceId || targetLocation.googlePlaceId,
            googleRating: fetchedData.rating || targetLocation.googleRating,
            googleReviewCount: fetchedData.reviewCount || targetLocation.googleReviewCount
          }
        });
      } else {
        // Check subscription location limit before creating a new location
        const locationCount = await prisma.location.count({ where: { businessGroupId: businessGroup.id } });
        const subscription = await prisma.subscription.findFirst({ where: { businessGroupId: businessGroup.id } });
        const locationLimit = subscription?.locationLimit || 1;

        if (locationCount < locationLimit) {
          await prisma.location.create({
            data: {
              businessGroupId: businessGroup.id,
              name: fetchedData.name,
              address: fetchedData.address || null,
              city: safeCity,
              country: 'India',
              phone: fetchedData.phone || '',
              category: fetchedData.category,
              googlePlaceId: resolvedPlaceId || null,
              googleRating: fetchedData.rating || null,
              googleReviewCount: fetchedData.reviewCount || null
            }
          });
        } else if (targetLocation) {
          // If limit reached, update existing location
          await prisma.location.update({
            where: { id: targetLocation.id },
            data: {
              name: fetchedData.name,
              address: fetchedData.address || targetLocation.address,
              city: safeCity || targetLocation.city,
              phone: fetchedData.phone || targetLocation.phone || '',
              category: fetchedData.category || targetLocation.category,
              googlePlaceId: resolvedPlaceId || targetLocation.googlePlaceId,
              googleRating: fetchedData.rating || targetLocation.googleRating,
              googleReviewCount: fetchedData.reviewCount || targetLocation.googleReviewCount
            }
          });
        }
      }

      // Auto-provision LetsTrack tenant upon Google Places Import
      if (!businessGroup.letsTrackApiKey) {
        try {
          const ownerUser = ownerId ? await prisma.user.findUnique({ where: { id: ownerId } }) : null;
          const ltRes = await provisionLetsTrackTenant({
            businessName: businessGroup.name,
            domain: `${uniqueSlug}.manacity.in`,
            ownerName: ownerUser?.name || businessGroup.name,
            ownerEmail: ownerUser?.email || businessGroup.email || 'business@manacity.in'
          });
          if (ltRes && ltRes.apiKey) {
            businessGroup = await prisma.businessGroup.update({
              where: { id: businessGroup.id },
              data: {
                letsTrackApiKey: ltRes.apiKey,
                letsTrackTenantId: ltRes.tenantId
              }
            });
          }
        } catch (ltErr) {
          console.error('LetsTrack Google Places import provisioning error:', ltErr);
        }
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
