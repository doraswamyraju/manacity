/**
 * Data Transfer Object (DTO) Serializers
 * Ensures sensitive server-side credentials and internal data are NEVER exposed to public APIs.
 */

/**
 * Serializes a BusinessGroup model for public exposure.
 * Strictly excludes: letsTrackApiKey, letsTrackTenantId, internal owner IDs, internal metadata.
 */
function toPublicBusinessDTO(businessGroup) {
  if (!businessGroup) return null;

  return {
    id: businessGroup.id,
    name: businessGroup.name,
    description: businessGroup.description,
    logoUrl: businessGroup.logoUrl,
    bannerUrl: businessGroup.bannerUrl,
    mobileNumber: businessGroup.mobileNumber,
    whatsAppNumber: businessGroup.whatsAppNumber,
    email: businessGroup.email,
    address: businessGroup.address,
    city: businessGroup.city,
    state: businessGroup.state,
    country: businessGroup.country,
    pinCode: businessGroup.pinCode,
    website: businessGroup.website,
    googleRating: businessGroup.googleRating,
    googleReviewCount: businessGroup.googleReviewCount,
    googleReviewUrl: businessGroup.googleReviewUrl,
    googlePlaceId: businessGroup.googlePlaceId,
    primaryColor: businessGroup.primaryColor,
    secondaryColor: businessGroup.secondaryColor,
    directoryListing: businessGroup.directoryListing ? {
      id: businessGroup.directoryListing.id,
      slug: businessGroup.directoryListing.slug,
      category: businessGroup.directoryListing.category,
      city: businessGroup.directoryListing.city,
      rating: businessGroup.directoryListing.rating,
      reviewCount: businessGroup.directoryListing.reviewCount
    } : null,
    locations: Array.isArray(businessGroup.locations) ? businessGroup.locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      pinCode: loc.pinCode,
      phone: loc.phone,
      googlePlaceId: loc.googlePlaceId,
      googleRating: loc.googleRating,
      googleReviewCount: loc.googleReviewCount,
      reviews: Array.isArray(loc.reviews) ? loc.reviews.map(r => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        text: r.text,
        relativeTime: r.relativeTime,
        createdAt: r.createdAt
      })) : []
    })) : [],
    services: Array.isArray(businessGroup.services) ? businessGroup.services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: s.price,
      imageUrl: s.imageUrl,
      photos: s.photos
    })) : [],
    products: Array.isArray(businessGroup.products) ? businessGroup.products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      photos: p.photos
    })) : []
  };
}

function toPublicWebsiteDTO(website, businessGroup) {
  if (!website) return null;

  return {
    id: website.id,
    subdomain: website.subdomain,
    customDomain: website.customDomain,
    theme: website.theme,
    primaryColor: website.primaryColor,
    secondaryColor: website.secondaryColor,
    font: website.font,
    metaTitle: website.metaTitle,
    metaDescription: website.metaDescription,
    keywords: website.keywords,
    googleAnalyticsId: website.googleAnalyticsId,
    isPublished: website.isPublished,
    sections: Array.isArray(website.sections) ? website.sections.map(sec => ({
      id: sec.id,
      type: sec.type,
      enabled: sec.enabled,
      order: sec.displayOrder !== undefined ? sec.displayOrder : sec.order,
      title: sec.title,
      subtitle: sec.subtitle,
      settings: sec.settings
    })) : [],
    businessGroup: toPublicBusinessDTO(businessGroup || website.businessGroup),
    letsTrackWidgetId: (businessGroup || website.businessGroup)?.letsTrackApiKey || null
  };
}

module.exports = {
  toPublicBusinessDTO,
  toPublicWebsiteDTO
};
