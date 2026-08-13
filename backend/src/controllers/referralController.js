const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to get or create referral program configuration
async function getOrCreateConfig() {
  let config = await prisma.referralProgramConfig.findFirst();
  if (!config) {
    config = await prisma.referralProgramConfig.create({
      data: {
        isEnabled: true,
        commissionType: 'PERCENTAGE',
        commissionValue: 10.0,
        minimumPayoutAmount: 500.0,
        holdingPeriodDays: 14,
        cookieValidityDays: 30
      }
    });
  }
  return config;
}

// ----------------------------------------------------
// USER / REFERRER ENDPOINTS
// ----------------------------------------------------

// 1. Get or Generate Referral Code & Link for current user
exports.getOrCreateReferralCode = async (req, res) => {
  try {
    const userId = req.user.id;

    let referralCode = await prisma.referralCode.findFirst({
      where: { userId }
    });

    if (!referralCode) {
      // Generate clean unique code e.g. REF-6CHARS
      const shortId = userId.substring(userId.length - 6).toUpperCase();
      const code = `REF-${shortId}`;

      referralCode = await prisma.referralCode.create({
        data: {
          userId,
          code
        }
      });
    }

    res.json({ status: 'success', data: referralCode });
  } catch (error) {
    console.error('Error in getOrCreateReferralCode:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve referral code.' });
  }
};

// 2. Get Referrer Dashboard Stats & Ledger
exports.getMyReferralStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const config = await getOrCreateConfig();

    // Ensure referral code exists
    let referralCode = await prisma.referralCode.findFirst({
      where: { userId }
    });

    if (!referralCode) {
      const shortId = userId.substring(userId.length - 6).toUpperCase();
      referralCode = await prisma.referralCode.create({
        data: { userId, code: `REF-${shortId}` }
      });
    }

    // Get all commissions for user
    const commissions = await prisma.referralCommission.findMany({
      where: { userId },
      include: {
        referral: true,
        payout: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate totals
    let totalEarned = 0;
    let pendingVerification = 0;
    let approvedBalance = 0;
    let paidOutAmount = 0;

    commissions.forEach(c => {
      if (c.status === 'PAID') {
        paidOutAmount += c.earnedAmount;
        totalEarned += c.earnedAmount;
      } else if (c.status === 'APPROVED') {
        approvedBalance += c.earnedAmount;
        totalEarned += c.earnedAmount;
      } else if (c.status === 'PENDING_VERIFICATION') {
        pendingVerification += c.earnedAmount;
        totalEarned += c.earnedAmount;
      } else if (c.status === 'PAYOUT_REQUESTED') {
        totalEarned += c.earnedAmount;
      }
    });

    // Fetch user payout profile
    const payoutProfile = await prisma.referrerPayoutProfile.findUnique({
      where: { userId }
    });

    // Fetch recent payout requests
    const payouts = await prisma.referralPayout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: {
        referralCode: referralCode.code,
        totalClicks: referralCode.totalClicks,
        totalReferrals: commissions.length,
        totalEarned,
        pendingVerification,
        approvedBalance,
        paidOutAmount,
        minimumPayoutAmount: config.minimumPayoutAmount,
        canRequestPayout: approvedBalance >= config.minimumPayoutAmount,
        payoutProfile,
        payouts,
        commissions: commissions.map(c => ({
          id: c.id,
          itemName: c.referral?.itemName || 'Product/Service Purchase',
          itemType: c.referral?.itemType || 'SALE',
          saleAmount: c.saleAmount,
          commissionRate: c.commissionRate,
          earnedAmount: c.earnedAmount,
          status: c.status,
          eligibleAt: c.eligibleAt,
          createdAt: c.createdAt,
          buyerEmailObfuscated: c.referral?.referredEmail
            ? c.referral.referredEmail.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + '*'.repeat(gp3.length))
            : 'Anonymous Buyer'
        }))
      }
    });
  } catch (error) {
    console.error('Error in getMyReferralStats:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch referral statistics.' });
  }
};

// 3. Get Products & Services with computed referral reward rates for referrers
exports.getReferralProductsAndServices = async (req, res) => {
  try {
    const config = await getOrCreateConfig();

    const libraryItems = await prisma.productServiceLibrary.findMany({
      where: { status: 'APPROVED' },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    const businessProducts = await prisma.businessProduct.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { businessGroup: { select: { name: true, city: true } } }
    });

    const businessServices = await prisma.businessService.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { businessGroup: { select: { name: true, city: true } } }
    });

    // Helper to calculate reward text
    const formatReward = (item) => {
      if (!item.isReferralEnabled) return { isEligible: false, rewardText: 'Not eligible' };

      const type = item.commissionType === 'GLOBAL' ? config.commissionType : item.commissionType;
      const value = item.commissionType === 'GLOBAL' ? config.commissionValue : (item.commissionValue || config.commissionValue);

      if (type === 'PERCENTAGE') {
        const estAmount = item.defaultPrice || item.price ? ((item.defaultPrice || item.price) * value) / 100 : null;
        return {
          isEligible: true,
          type: 'PERCENTAGE',
          value,
          rewardText: `${value}% per sale` + (estAmount ? ` (~₹${Math.round(estAmount)})` : '')
        };
      } else {
        return {
          isEligible: true,
          type: 'FLAT',
          value,
          rewardText: `Flat ₹${value} per sale`
        };
      }
    };

    const items = [
      ...libraryItems.map(item => ({
        id: item.id,
        itemType: item.type === 'SERVICE' ? 'SERVICE' : 'PRODUCT',
        name: item.name,
        category: item.category,
        price: item.defaultPrice,
        imageUrl: item.imageUrl || (item.photos && item.photos[0]),
        source: 'LIBRARY',
        reward: formatReward(item)
      })),
      ...businessProducts.map(p => ({
        id: p.id,
        itemType: 'PRODUCT',
        name: p.name,
        businessName: p.businessGroup?.name,
        price: p.price,
        imageUrl: p.photos && p.photos[0],
        source: 'BUSINESS_PRODUCT',
        reward: formatReward(p)
      })),
      ...businessServices.map(s => ({
        id: s.id,
        itemType: 'SERVICE',
        name: s.name,
        businessName: s.businessGroup?.name,
        price: s.price,
        imageUrl: s.photos && s.photos[0],
        source: 'BUSINESS_SERVICE',
        reward: formatReward(s)
      }))
    ];

    res.json({
      status: 'success',
      data: {
        globalDefault: {
          commissionType: config.commissionType,
          commissionValue: config.commissionValue
        },
        catalog: items
      }
    });
  } catch (error) {
    console.error('Error in getReferralProductsAndServices:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch catalog.' });
  }
};

// 4. Save/Update Payout Profile (UPI ID or Bank Details)
exports.savePayoutProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payoutMethod, upiId, accountHolder, accountNumber, ifscCode, panNumber } = req.body;

    if (payoutMethod === 'UPI' && !upiId) {
      return res.status(400).json({ status: 'error', message: 'UPI ID is required for UPI payout.' });
    }

    if (payoutMethod === 'BANK_TRANSFER' && (!accountNumber || !ifscCode || !accountHolder)) {
      return res.status(400).json({ status: 'error', message: 'Account Holder, Account Number, and IFSC Code are required.' });
    }

    const profile = await prisma.referrerPayoutProfile.upsert({
      where: { userId },
      update: {
        payoutMethod: payoutMethod || 'UPI',
        upiId: upiId || null,
        accountHolder: accountHolder || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
        panNumber: panNumber || null,
        isVerified: true
      },
      create: {
        userId,
        payoutMethod: payoutMethod || 'UPI',
        upiId: upiId || null,
        accountHolder: accountHolder || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
        panNumber: panNumber || null,
        isVerified: true
      }
    });

    res.json({ status: 'success', data: profile, message: 'Payout details saved successfully.' });
  } catch (error) {
    console.error('Error in savePayoutProfile:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save payout profile.' });
  }
};

// 5. User Requests Payout for Approved Balance
exports.requestPayout = async (req, res) => {
  try {
    const userId = req.user.id;
    const config = await getOrCreateConfig();

    const payoutProfile = await prisma.referrerPayoutProfile.findUnique({
      where: { userId }
    });

    if (!payoutProfile) {
      return res.status(400).json({ status: 'error', message: 'Please set up your UPI or Bank payout profile first.' });
    }

    // Get all APPROVED commissions for user
    const approvedCommissions = await prisma.referralCommission.findMany({
      where: {
        userId,
        status: 'APPROVED'
      }
    });

    const totalAmount = approvedCommissions.reduce((sum, c) => sum + c.earnedAmount, 0);

    if (totalAmount < config.minimumPayoutAmount) {
      return res.status(400).json({
        status: 'error',
        message: `Minimum payout request amount is ₹${config.minimumPayoutAmount}. Your current approved balance is ₹${totalAmount}.`
      });
    }

    // Create ReferralPayout request
    const payout = await prisma.referralPayout.create({
      data: {
        userId,
        totalAmount,
        currency: 'INR',
        status: 'PAYOUT_REQUESTED',
        commissions: {
          connect: approvedCommissions.map(c => ({ id: c.id }))
        }
      }
    });

    // Update commissions status to PAYOUT_REQUESTED
    await prisma.referralCommission.updateMany({
      where: {
        id: { in: approvedCommissions.map(c => c.id) }
      },
      data: {
        status: 'PAYOUT_REQUESTED',
        payoutId: payout.id
      }
    });

    res.json({
      status: 'success',
      data: payout,
      message: `Payout request submitted successfully for ₹${totalAmount}!`
    });
  } catch (error) {
    console.error('Error in requestPayout:', error);
    res.status(500).json({ status: 'error', message: 'Failed to request payout.' });
  }
};

// ----------------------------------------------------
// PUBLIC TRACKING & CONVERSION ENDPOINTS
// ----------------------------------------------------

// Track Click on Referral Link
exports.trackClick = async (req, res) => {
  try {
    const { refCode } = req.body;
    if (!refCode) {
      return res.status(400).json({ status: 'error', message: 'Referral code is required.' });
    }

    const referralCode = await prisma.referralCode.findUnique({
      where: { code: refCode }
    });

    if (!referralCode) {
      return res.status(404).json({ status: 'error', message: 'Invalid referral code.' });
    }

    // Increment click counter
    await prisma.referralCode.update({
      where: { id: referralCode.id },
      data: { totalClicks: { increment: 1 } }
    });

    res.json({ status: 'success', message: 'Click recorded.' });
  } catch (error) {
    console.error('Error in trackClick:', error);
    res.status(500).json({ status: 'error', message: 'Failed to track referral click.' });
  }
};

// Public/Internal Conversion Hook to trigger referral reward on Sale
exports.attributeConversion = async (req, res) => {
  try {
    const { refCode, orderId, saleAmount, itemType, itemId, itemName, buyerEmail, buyerPhone } = req.body;

    if (!refCode || !saleAmount) {
      return res.status(400).json({ status: 'error', message: 'Referral code and sale amount are required.' });
    }

    const referralCodeObj = await prisma.referralCode.findUnique({
      where: { code: refCode },
      include: { user: true }
    });

    if (!referralCodeObj) {
      return res.status(404).json({ status: 'error', message: 'Referral code not found.' });
    }

    const config = await getOrCreateConfig();
    if (!config.isEnabled) {
      return res.json({ status: 'ignored', message: 'Referral program currently disabled.' });
    }

    // Prevent self-referral
    if (buyerEmail && referralCodeObj.user?.email === buyerEmail) {
      return res.status(400).json({ status: 'error', message: 'Self-referral is not allowed.' });
    }

    // Determine Commission Rate & Value based on item or global fallback
    let commissionType = config.commissionType;
    let commissionValue = config.commissionValue;

    if (itemId && itemType === 'PRODUCT') {
      const prod = await prisma.businessProduct.findUnique({ where: { id: itemId } });
      if (prod && prod.isReferralEnabled && prod.commissionType !== 'GLOBAL') {
        commissionType = prod.commissionType;
        commissionValue = prod.commissionValue || config.commissionValue;
      }
    } else if (itemId && itemType === 'SERVICE') {
      const srv = await prisma.businessService.findUnique({ where: { id: itemId } });
      if (srv && srv.isReferralEnabled && srv.commissionType !== 'GLOBAL') {
        commissionType = srv.commissionType;
        commissionValue = srv.commissionValue || config.commissionValue;
      }
    }

    let earnedAmount = 0;
    let commissionRateText = 0;

    if (commissionType === 'PERCENTAGE') {
      earnedAmount = (parseFloat(saleAmount) * commissionValue) / 100;
      commissionRateText = commissionValue;
    } else {
      earnedAmount = commissionValue;
      commissionRateText = commissionValue;
    }

    // Create Referral record
    const referral = await prisma.referral.create({
      data: {
        referralCodeId: referralCodeObj.id,
        referrerUserId: referralCodeObj.userId,
        referredEmail: buyerEmail || null,
        referredPhone: buyerPhone || null,
        status: 'CONVERTED',
        itemType: itemType || 'PRODUCT',
        itemId: itemId || null,
        itemName: itemName || 'Sale Conversion',
        orderId: orderId || `ORD-${Date.now()}`,
        saleAmount: parseFloat(saleAmount)
      }
    });

    // Calculate holding period eligibility date
    const eligibleAt = new Date();
    eligibleAt.setDate(eligibleAt.getDate() + (config.holdingPeriodDays || 14));

    // Create Commission record
    const commission = await prisma.referralCommission.create({
      data: {
        referralId: referral.id,
        userId: referralCodeObj.userId,
        saleAmount: parseFloat(saleAmount),
        commissionRate: commissionRateText,
        earnedAmount,
        currency: 'INR',
        status: 'PENDING_VERIFICATION',
        eligibleAt
      }
    });

    res.json({
      status: 'success',
      data: { referral, commission },
      message: `Referral attributed successfully! Earned ₹${earnedAmount}.`
    });
  } catch (error) {
    console.error('Error in attributeConversion:', error);
    res.status(500).json({ status: 'error', message: 'Failed to attribute referral.' });
  }
};

// ----------------------------------------------------
// ADMIN MANAGEMENT ENDPOINTS
// ----------------------------------------------------

// 1. Admin Referral Program Overview
exports.getAdminReferralOverview = async (req, res) => {
  try {
    const config = await getOrCreateConfig();

    const totalReferrals = await prisma.referral.count({ where: { status: 'CONVERTED' } });
    const totalCommissions = await prisma.referralCommission.findMany();
    
    let totalSalesRevenue = 0;
    let totalCommissionEarned = 0;
    let totalPaidOut = 0;

    totalCommissions.forEach(c => {
      totalSalesRevenue += c.saleAmount;
      totalCommissionEarned += c.earnedAmount;
      if (c.status === 'PAID') {
        totalPaidOut += c.earnedAmount;
      }
    });

    const pendingPayoutRequestsCount = await prisma.referralPayout.count({
      where: { status: 'PAYOUT_REQUESTED' }
    });

    res.json({
      status: 'success',
      data: {
        config,
        stats: {
          totalReferrals,
          totalSalesRevenue,
          totalCommissionEarned,
          totalPaidOut,
          pendingPayoutRequestsCount
        }
      }
    });
  } catch (error) {
    console.error('Error in getAdminReferralOverview:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch admin overview.' });
  }
};

// 2. Admin Update Program Settings
exports.updateAdminProgramConfig = async (req, res) => {
  try {
    const { isEnabled, commissionType, commissionValue, minimumPayoutAmount, holdingPeriodDays, cookieValidityDays } = req.body;

    let config = await getOrCreateConfig();

    config = await prisma.referralProgramConfig.update({
      where: { id: config.id },
      data: {
        isEnabled: isEnabled !== undefined ? isEnabled : config.isEnabled,
        commissionType: commissionType || config.commissionType,
        commissionValue: commissionValue !== undefined ? parseFloat(commissionValue) : config.commissionValue,
        minimumPayoutAmount: minimumPayoutAmount !== undefined ? parseFloat(minimumPayoutAmount) : config.minimumPayoutAmount,
        holdingPeriodDays: holdingPeriodDays !== undefined ? parseInt(holdingPeriodDays) : config.holdingPeriodDays,
        cookieValidityDays: cookieValidityDays !== undefined ? parseInt(cookieValidityDays) : config.cookieValidityDays
      }
    });

    res.json({ status: 'success', data: config, message: 'Referral program settings updated.' });
  } catch (error) {
    console.error('Error in updateAdminProgramConfig:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update program config.' });
  }
};

// 3. Admin Get All Commissions Ledger
exports.getAdminCommissions = async (req, res) => {
  try {
    const commissions = await prisma.referralCommission.findMany({
      include: {
        user: { select: { name: true, email: true } },
        referral: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ status: 'success', data: commissions });
  } catch (error) {
    console.error('Error in getAdminCommissions:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch commissions.' });
  }
};

// 4. Admin Update Commission Status (Approve / Reject)
exports.updateCommissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED, REJECTED, PENDING_VERIFICATION

    const commission = await prisma.referralCommission.update({
      where: { id },
      data: { status }
    });

    res.json({ status: 'success', data: commission, message: `Commission status updated to ${status}.` });
  } catch (error) {
    console.error('Error in updateCommissionStatus:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update commission status.' });
  }
};

// 5. Admin Get All Payout Requests
exports.getAdminPayoutRequests = async (req, res) => {
  try {
    const payouts = await prisma.referralPayout.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        commissions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch user payout profiles for details
    const userIds = payouts.map(p => p.userId);
    const profiles = await prisma.referrerPayoutProfile.findMany({
      where: { userId: { in: userIds } }
    });

    const profileMap = {};
    profiles.forEach(p => { profileMap[p.userId] = p; });

    const enrichedPayouts = payouts.map(p => ({
      ...p,
      payoutProfile: profileMap[p.userId] || null
    }));

    res.json({ status: 'success', data: enrichedPayouts });
  } catch (error) {
    console.error('Error in getAdminPayoutRequests:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch payout requests.' });
  }
};

// 6. Admin Process Payout (Mark as PAID or REJECTED)
exports.processAdminPayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentRef, proofReceiptUrl, adminNotes } = req.body; // PAID or REJECTED
    const adminUserId = req.user.id;

    const existingPayout = await prisma.referralPayout.findUnique({
      where: { id },
      include: { commissions: true }
    });

    if (!existingPayout) {
      return res.status(404).json({ status: 'error', message: 'Payout request not found.' });
    }

    const payout = await prisma.referralPayout.update({
      where: { id },
      data: {
        status,
        paymentRef: paymentRef || null,
        proofReceiptUrl: proofReceiptUrl || null,
        adminNotes: adminNotes || null,
        processedBy: adminUserId,
        processedAt: new Date()
      }
    });

    // Update attached commissions status
    await prisma.referralCommission.updateMany({
      where: { payoutId: id },
      data: { status: status === 'PAID' ? 'PAID' : 'APPROVED' }
    });

    res.json({
      status: 'success',
      data: payout,
      message: `Payout marked as ${status}.`
    });
  } catch (error) {
    console.error('Error in processAdminPayout:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process payout.' });
  }
};

// 7. Admin Update Item-Specific Commission (Product / Service / Library)
exports.updateItemCommissionSettings = async (req, res) => {
  try {
    const { itemType, itemId, isReferralEnabled, commissionType, commissionValue } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({ status: 'error', message: 'itemType and itemId are required.' });
    }

    let updatedItem = null;
    const data = {
      isReferralEnabled: isReferralEnabled !== undefined ? isReferralEnabled : true,
      commissionType: commissionType || 'GLOBAL',
      commissionValue: commissionValue ? parseFloat(commissionValue) : null
    };

    if (itemType === 'PRODUCT') {
      updatedItem = await prisma.businessProduct.update({
        where: { id: itemId },
        data
      });
    } else if (itemType === 'SERVICE') {
      updatedItem = await prisma.businessService.update({
        where: { id: itemId },
        data
      });
    } else if (itemType === 'LIBRARY') {
      updatedItem = await prisma.productServiceLibrary.update({
        where: { id: itemId },
        data
      });
    }

    res.json({ status: 'success', data: updatedItem, message: 'Item referral commission settings updated.' });
  } catch (error) {
    console.error('Error in updateItemCommissionSettings:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update item commission settings.' });
  }
};
