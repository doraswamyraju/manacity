const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Tier mapping containing limits
const TIER_LIMITS = {
  FREE: { locationLimit: 1, websiteLimit: 1, price: 0 },
  STARTER: { locationLimit: 3, websiteLimit: 2, price: 29 },
  GROWTH: { locationLimit: 10, websiteLimit: 5, price: 79 },
  PREMIUM: { locationLimit: 25, websiteLimit: 15, price: 149 },
  AGENCY: { locationLimit: 100, websiteLimit: 50, price: 299 },
  ENTERPRISE: { locationLimit: 999, websiteLimit: 999, price: 999 }
};

// 1. Get current subscription status
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!businessGroup) {
      return res.status(404).json({ error: 'Business details not found.' });
    }

    const currentSub = businessGroup.subscriptions?.[0] || {
      tier: 'FREE',
      status: 'ACTIVE',
      locationLimit: 1,
      websiteLimit: 1
    };

    res.json({
      status: 'success',
      subscription: currentSub,
      availableTiers: TIER_LIMITS
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to retrieve subscription details.' });
  }
};

// 2. Create mock Checkout upgrade session
exports.createCheckoutSession = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { tier } = req.body;

    if (!tier || !TIER_LIMITS[tier]) {
      return res.status(400).json({ error: 'Invalid subscription tier selected.' });
    }

    const businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId }
    });

    if (!businessGroup) {
      return res.status(404).json({ error: 'Business details not found.' });
    }

    // Mocking Stripe session creation, returning a redirect URL
    const mockSessionId = `mock_stripe_session_${Math.random().toString(36).substring(7)}`;

    res.json({
      status: 'success',
      checkoutUrl: `/api/subscription/mock-checkout-success?groupId=${businessGroup.id}&tier=${tier}&session=${mockSessionId}`
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to initialize plan checkout.' });
  }
};

// 3. Mock checkout completion success handler (acting like a stripe webhook)
exports.mockCheckoutSuccess = async (req, res) => {
  try {
    const { groupId, tier } = req.query;

    if (!groupId || !tier || !TIER_LIMITS[tier]) {
      return res.status(400).send('Malformed request parameters.');
    }

    const limits = TIER_LIMITS[tier];

    // Find and update or create subscription
    await prisma.subscription.create({
      data: {
        businessGroupId: groupId,
        tier,
        status: 'ACTIVE',
        locationLimit: limits.locationLimit,
        websiteLimit: limits.websiteLimit,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days active validity
      }
    });

    // Redirect user to frontend billing page showing active status
    res.send(`
      <html>
        <head>
          <title>Billing Setup Success</title>
          <style>
            body { font-family: sans-serif; background-color: #0b0f19; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; }
            .card { background: rgba(19,23,45,0.7); border: 1px solid rgba(255,255,255,0.08); padding: 2rem; border-radius: 12px; max-width: 400px; }
            h2 { color: #10b981; }
            a { display: inline-block; margin-top: 1.5rem; background: #1976D2; color: #fff; padding: 0.5rem 1.5rem; text-decoration: none; border-radius: 6px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Payment Successful!</h2>
            <p>Your subscription has been upgraded to <strong>${tier}</strong>.</p>
            <p>Locations limit: ${limits.locationLimit} | Website limit: ${limits.websiteLimit}</p>
            <a href="http://manacity.in">Back to Dashboard</a>
          </div>
          <script>
            setTimeout(() => { window.location.href = "http://manacity.in"; }, 3000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Stripe mock webhook failure:', error);
    res.status(500).send('Failed to register subscription update.');
  }
};
