const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_URL_SETTINGS = {
  listingPattern: '/biz/:slug',
  categoryPattern: '/:city/:category',
  citySlugMapping: [
    { cityId: 'tirupati', name: 'Tirupati', slug: 'tirupati', active: true },
    { cityId: 'hyderabad', name: 'Hyderabad', slug: 'hyderabad', active: true },
    { cityId: 'vijayawada', name: 'Vijayawada', slug: 'vijayawada', active: true },
    { cityId: 'visakhapatnam', name: 'Visakhapatnam', slug: 'visakhapatnam', active: true },
    { cityId: 'chennai', name: 'Chennai', slug: 'chennai', active: true },
    { cityId: 'bangalore', name: 'Bangalore', slug: 'bangalore', active: true }
  ],
  seoSettings: {
    siteTitle: 'ManaCity - Local Business & Services Aggregator',
    metaDescription: 'Discover verified local businesses, services, ratings, and instant quotes across cities.',
    canonicalDomain: 'https://manacity.in'
  }
};

// Get URL & SEO Settings (Admin or Public)
exports.getUrlSettings = async (req, res) => {
  try {
    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'url_seo_settings' }
    });

    if (!setting) {
      setting = await prisma.systemSetting.create({
        data: {
          key: 'url_seo_settings',
          value: DEFAULT_URL_SETTINGS
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      settings: setting.value
    });
  } catch (error) {
    console.error('Error fetching URL settings:', error);
    return res.status(500).json({ error: 'Failed to retrieve URL structure settings.' });
  }
};

// Update URL & SEO Settings (Super Admin Only)
exports.updateUrlSettings = async (req, res) => {
  try {
    const { listingPattern, categoryPattern, citySlugMapping, seoSettings } = req.body;

    const updatedValue = {
      listingPattern: listingPattern || '/biz/:slug',
      categoryPattern: categoryPattern || '/:city/:category',
      citySlugMapping: Array.isArray(citySlugMapping) ? citySlugMapping : DEFAULT_URL_SETTINGS.citySlugMapping,
      seoSettings: {
        siteTitle: seoSettings?.siteTitle || DEFAULT_URL_SETTINGS.seoSettings.siteTitle,
        metaDescription: seoSettings?.metaDescription || DEFAULT_URL_SETTINGS.seoSettings.metaDescription,
        canonicalDomain: seoSettings?.canonicalDomain || DEFAULT_URL_SETTINGS.seoSettings.canonicalDomain
      }
    };

    const setting = await prisma.systemSetting.upsert({
      where: { key: 'url_seo_settings' },
      update: { value: updatedValue },
      create: { key: 'url_seo_settings', value: updatedValue }
    });

    return res.status(200).json({
      status: 'success',
      message: 'URL structure & SEO settings updated successfully.',
      settings: setting.value
    });
  } catch (error) {
    console.error('Error updating URL settings:', error);
    return res.status(500).json({ error: 'Failed to update URL structure settings.' });
  }
};
