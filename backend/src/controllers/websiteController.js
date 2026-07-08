const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to slugify domain name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// 1. Get or Auto-Initialize Website configuration
exports.getWebsite = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the user's primary business group
    let businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId }
    });

    if (!businessGroup) {
      businessGroup = await prisma.businessGroup.create({
        data: { name: `${req.user.name}'s Business`, ownerId }
      });
    }

    const businessGroupId = businessGroup.id;

    // Find website settings
    let website = await prisma.website.findUnique({
      where: { businessGroupId },
      include: { sections: true }
    });

    // Auto-initialize website configuration if missing
    if (!website) {
      let slug = slugify(businessGroup.name || 'my-business');
      
      // Ensure subdomain is unique
      let isUnique = false;
      let counter = 0;
      let candidateSubdomain = slug;
      while (!isUnique) {
        const dup = await prisma.website.findUnique({ where: { subdomain: candidateSubdomain } });
        if (!dup) {
          isUnique = true;
        } else {
          counter++;
          candidateSubdomain = `${slug}-${counter}`;
        }
      }

      website = await prisma.website.create({
        data: {
          businessGroupId,
          subdomain: candidateSubdomain,
          theme: 'default',
          primaryColor: '#1976d2',
          secondaryColor: '#9c27b0',
          font: 'Outfit'
        },
        include: { sections: true }
      });

      // Define default section configs
      const defaultSections = [
        { type: 'HERO', enabled: true, displayOrder: 1, settings: { headline: 'Welcome to our business', ctaText: 'Get Started', showCta: true } },
        { type: 'ABOUT', enabled: true, displayOrder: 2, settings: { title: 'About Us', alignment: 'left' } },
        { type: 'SERVICES', enabled: true, displayOrder: 3, settings: { columns: 3 } },
        { type: 'PRODUCTS', enabled: true, displayOrder: 4, settings: { columns: 3 } },
        { type: 'GALLERY', enabled: true, displayOrder: 5, settings: { gridType: 'masonry' } },
        { type: 'REVIEWS', enabled: true, displayOrder: 6, settings: { count: 3 } },
        { type: 'CONTACT', enabled: true, displayOrder: 7, settings: { showForm: true } },
        { type: 'FAQ', enabled: true, displayOrder: 8, settings: { collapsible: true } },
        { type: 'CTA', enabled: true, displayOrder: 9, settings: { buttonColor: '#1976d2' } },
        { type: 'FOOTER', enabled: true, displayOrder: 10, settings: { copyright: `© ${new Date().getFullYear()} All rights reserved.` } }
      ];

      await prisma.websiteSection.createMany({
        data: defaultSections.map(sec => ({
          websiteId: website.id,
          type: sec.type,
          enabled: sec.enabled,
          displayOrder: sec.displayOrder,
          settings: sec.settings
        }))
      });

      // Refetch
      website = await prisma.website.findUnique({
        where: { businessGroupId },
        include: { sections: true }
      });
    }

    res.json({
      status: 'success',
      website
    });
  } catch (error) {
    console.error('Get website config error:', error);
    res.status(500).json({ error: 'Failed to retrieve website configuration.' });
  }
};

// 2. Save Website Core Configuration (settings, styles, SEO, and Analytics)
exports.saveWebsite = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { 
      theme, 
      primaryColor, 
      secondaryColor, 
      font, 
      subdomain, 
      customDomain,
      metaTitle,
      metaDescription,
      keywords,
      ogImage,
      googleAnalyticsId,
      searchConsoleId,
      metaPixelId,
      clarityId,
      isPublished
    } = req.body;

    const businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId }
    });

    if (!businessGroup) {
      return res.status(404).json({ error: 'Business profile not found.' });
    }

    const businessGroupId = businessGroup.id;

    // Check if subdomain is taken
    if (subdomain) {
      const existingSub = await prisma.website.findFirst({
        where: {
          subdomain,
          businessGroupId: { not: businessGroupId }
        }
      });
      if (existingSub) {
        return res.status(400).json({ error: 'Subdomain is already registered by another site.' });
      }
    }

    const updatedWebsite = await prisma.website.update({
      where: { businessGroupId },
      data: {
        theme,
        primaryColor,
        secondaryColor,
        font,
        subdomain: subdomain || undefined,
        customDomain: customDomain !== undefined ? customDomain : null,
        metaTitle,
        metaDescription,
        keywords,
        ogImage,
        googleAnalyticsId,
        searchConsoleId,
        metaPixelId,
        clarityId,
        isPublished: isPublished !== undefined ? isPublished : undefined
      },
      include: { sections: true }
    });

    res.json({
      status: 'success',
      website: updatedWebsite
    });
  } catch (error) {
    console.error('Save website config error:', error);
    res.status(500).json({ error: 'Failed to update website settings.' });
  }
};

// 3. Save Website Section configurations (toggles, layouts, display orders)
exports.saveWebsiteSections = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { sections } = req.body; // array of sections

    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({ error: 'Sections array is required.' });
    }

    const businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId }
    });

    if (!businessGroup) {
      return res.status(404).json({ error: 'Business profile not found.' });
    }

    const website = await prisma.website.findUnique({
      where: { businessGroupId: businessGroup.id }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website profile not found.' });
    }

    // Save each section using upsert
    for (const sec of sections) {
      await prisma.websiteSection.upsert({
        where: {
          websiteId_type: {
            websiteId: website.id,
            type: sec.type
          }
        },
        update: {
          enabled: sec.enabled !== undefined ? sec.enabled : true,
          displayOrder: sec.displayOrder !== undefined ? Number(sec.displayOrder) : 0,
          settings: sec.settings || {}
        },
        create: {
          websiteId: website.id,
          type: sec.type,
          enabled: sec.enabled !== undefined ? sec.enabled : true,
          displayOrder: sec.displayOrder !== undefined ? Number(sec.displayOrder) : 0,
          settings: sec.settings || {}
        }
      });
    }

    const updatedWebsite = await prisma.website.findUnique({
      where: { id: website.id },
      include: { sections: true }
    });

    res.json({
      status: 'success',
      website: updatedWebsite
    });
  } catch (error) {
    console.error('Save website sections error:', error);
    res.status(500).json({ error: 'Failed to update section settings.' });
  }
};

// 4. Public Site API Endpoint (used by Nginx dynamically)
exports.renderPublicWebsite = async (req, res) => {
  try {
    const { subdomain } = req.params;

    const website = await prisma.website.findUnique({
      where: { subdomain },
      include: {
        sections: true,
        businessGroup: {
          include: {
            documents: true,
            services: true,
            products: true,
            paymentMethods: true,
            languages: true
          }
        }
      }
    });

    if (!website || !website.isPublished) {
      return res.status(404).json({ error: 'Website is either unpublished or not found.' });
    }

    res.json({
      status: 'success',
      website
    });
  } catch (error) {
    console.error('Render public site error:', error);
    res.status(500).json({ error: 'Failed to query dynamic site specifications.' });
  }
};

// 5. Dynamic Sitemap Generation
exports.getSitemap = async (req, res) => {
  try {
    const { subdomain } = req.params;
    const website = await prisma.website.findUnique({ where: { subdomain } });

    if (!website) {
      return res.status(404).send('Not Found');
    }

    const domain = website.customDomain || `${subdomain}.manacity.in`;
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${domain}/</loc>
    <lastmod>${website.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemapXml);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

// 6. Dynamic robots.txt
exports.getRobots = async (req, res) => {
  try {
    const { subdomain } = req.params;
    const website = await prisma.website.findUnique({ where: { subdomain } });

    if (!website) {
      return res.status(404).send('Not Found');
    }

    const domain = website.customDomain || `${subdomain}.manacity.in`;
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://${domain}/sitemap.xml
`;

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

// 7. Dynamic Web Manifest
exports.getManifest = async (req, res) => {
  try {
    const { subdomain } = req.params;
    const website = await prisma.website.findUnique({ 
      where: { subdomain },
      include: { businessGroup: true }
    });

    if (!website) {
      return res.status(404).send('Not Found');
    }

    const manifestJson = {
      name: website.businessGroup.name,
      short_name: website.businessGroup.name.substring(0, 12),
      start_url: "/",
      display: "standalone",
      background_color: website.primaryColor,
      theme_color: website.primaryColor,
      icons: [
        {
          src: website.businessGroup.logoUrl || "/logo.svg",
          sizes: "192x192",
          type: "image/png"
        }
      ]
    };

    res.json(manifestJson);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
