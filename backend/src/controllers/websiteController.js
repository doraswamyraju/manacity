const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get Website details for a Location
exports.getWebsite = async (req, res) => {
  try {
    const { locationId } = req.params;

    // Check if location exists and belongs to user
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    const website = await prisma.website.findFirst({
      where: { locationId }
    });

    res.json({
      status: 'success',
      website
    });
  } catch (error) {
    console.error('Get website error:', error);
    res.status(500).json({ error: 'Failed to retrieve website settings.' });
  }
};

// 2. Create or Update Website settings for a Location
exports.saveWebsite = async (req, res) => {
  try {
    const { locationId, subdomain, template, config, pagesJson } = req.body;

    if (!locationId || !subdomain || !template) {
      return res.status(400).json({ error: 'Location, subdomain, and template are required.' });
    }

    // Verify ownership
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { businessGroup: true }
    });

    if (!location || location.businessGroup.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    // Check if subdomain is already taken by another website
    const existingSub = await prisma.website.findFirst({
      where: {
        subdomain,
        locationId: { not: locationId }
      }
    });

    if (existingSub) {
      return res.status(400).json({ error: 'Subdomain is already in use by another business.' });
    }

    // Check if website already exists
    const existingWebsite = await prisma.website.findFirst({
      where: { locationId }
    });

    let website;
    if (existingWebsite) {
      // Update
      website = await prisma.website.update({
        where: { id: existingWebsite.id },
        data: {
          subdomain,
          template,
          config: config || {},
          pagesJson: pagesJson || {}
        }
      });
    } else {
      // Create
      website = await prisma.website.create({
        data: {
          locationId,
          subdomain,
          template,
          config: config || {},
          pagesJson: pagesJson || {}
        }
      });
    }

    res.json({
      status: 'success',
      website
    });
  } catch (error) {
    console.error('Save website error:', error);
    res.status(500).json({ error: 'Failed to save website config.' });
  }
};

// 3. Render Public Website dynamically
exports.renderPublicWebsite = async (req, res) => {
  try {
    const { subdomain } = req.params;

    const website = await prisma.website.findUnique({
      where: { subdomain },
      include: {
        location: {
          include: {
            reviews: {
              where: { rating: { gte: 4 } }, // Only showcase positive reviews
              take: 3
            }
          }
        }
      }
    });

    if (!website) {
      return res.status(404).send('<h1>404 Site Not Found</h1>');
    }

    const { location } = website;
    const themeColor = website.config.themeColor || '#1976D2';
    const heroImage = website.config.heroImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200';
    const siteTitle = website.pagesJson.title || location.name;
    const siteDescription = website.pagesJson.description || 'Welcome to our official business page. Explore our services and verified reviews.';

    // Generate responsive premium HTML page based on selected template
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
          :root { --primary: ${themeColor}; --dark: #0f172a; --gray: #64748b; }
          body { font-family: 'Outfit', sans-serif; margin: 0; background-color: #f8fafc; color: var(--dark); line-height: 1.6; }
          header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
          .logo { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
          .hero { position: relative; height: 60vh; background: url('${heroImage}') center/cover no-repeat; display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; }
          .hero::after { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); }
          .hero-content { position: relative; z-index: 1; max-width: 700px; padding: 2rem; }
          .hero-content h1 { font-size: 3rem; margin: 0 0 1rem; font-weight: 800; }
          .hero-content p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }
          .btn { background: var(--primary); color: #fff; padding: 0.75rem 2rem; border-radius: 6px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
          .section { padding: 5rem 5%; max-width: 1000px; margin: 0 auto; }
          .section h2 { font-size: 2rem; font-weight: 800; text-align: center; margin-bottom: 3rem; }
          .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
          .feature-card { background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3rem; }
          .review-card { background: #fff; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #10b981; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
          .rating { color: #f59e0b; font-size: 1.25rem; margin-bottom: 0.5rem; }
          footer { text-align: center; padding: 3rem 0; background: var(--dark); color: #94a3b8; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <header>
          <div class="logo">${location.name}</div>
          <a href="#contact" class="btn" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">Contact Us</a>
        </header>

        <section class="hero">
          <div class="hero-content">
            <h1>Welcome to ${location.name}</h1>
            <p>${siteDescription}</p>
            <a href="#contact" class="btn">Book Now</a>
          </div>
        </section>

        <section class="section" id="about">
          <h2>About Us</h2>
          <div class="features">
            <div class="feature-card">
              <h3>Our Specialty</h3>
              <p>Type: ${location.category} branch operating premium setups globally.</p>
            </div>
            <div class="feature-card">
              <h3>Location details</h3>
              <p>${location.address ? `${location.address}, ${location.city}, ${location.country}` : 'Visit us at our primary branch.'}</p>
            </div>
          </div>
        </section>

        ${location.reviews.length > 0 ? `
          <section class="section" style="background-color: #f1f5f9; max-width: 100%; width: 100%; box-sizing: border-box;">
            <div style="max-width: 1000px; margin: 0 auto;">
              <h2>Customer Testimonials</h2>
              <div class="reviews-grid">
                ${location.reviews.map(rev => `
                  <div class="review-card">
                    <div class="rating">${'★'.repeat(rev.rating)}</div>
                    <p style="font-style: italic; margin-bottom: 0.5rem;">"${rev.comment || 'No comment provided.'}"</p>
                    <strong style="font-size: 0.9rem; color: var(--dark);">- ${rev.authorName}</strong>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <footer id="contact">
          <p>&copy; ${new Date().getFullYear()} ${location.name}. Powered by ManaCity.</p>
          <p>Phone: ${location.phone || 'Contact us via standard links.'}</p>
        </footer>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Render public site failure:', error);
    res.status(500).send('Failed to compile site.');
  }
};
