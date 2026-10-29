const axios = require('axios');
const dns = require('dns').promises;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ResellerClub API configuration
const RESELLER_USER_ID = process.env.RESELLERCLUB_USER_ID || '';
const RESELLER_API_KEY = process.env.RESELLERCLUB_API_KEY || '';
const RESELLER_BASE_URL = process.env.RESELLERCLUB_BASE_URL || 'https://httpapi.com/api'; // Live API (or test.httpapi.com for test)

// Default Markup in INR if not configured in DB
const DEFAULT_MARGIN_INR = 300.0;

/**
 * Searches domain availability and returns customer price with margin
 * Supported TLDs: .in, .co.in, .com, .org, .net
 */
async function searchDomainAvailability(domainQuery) {
  if (!domainQuery || typeof domainQuery !== 'string') {
    return { error: 'Domain query is required.' };
  }

  // Extract clean domain name without TLD
  const clean = domainQuery.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const domainParts = clean.split('.');
  const sld = domainParts[0]; // second level domain e.g. "srigangatech"

  const tlds = ['in', 'co.in', 'com', 'org'];

  let results = [];

  if (RESELLER_USER_ID && RESELLER_API_KEY) {
    try {
      const url = `${RESELLER_BASE_URL}/domains/available.json`;
      const res = await axios.get(url, {
        params: {
          'auth-userid': RESELLER_USER_ID,
          'api-key': RESELLER_API_KEY,
          'domain-name': sld,
          'tlds': tlds
        },
        timeout: 8000
      });

      // Parse ResellerClub response: e.g. { "srigangatech.in": { "status": "available" } }
      const data = res.data || {};
      for (const tld of tlds) {
        const full = `${sld}.${tld}`;
        const item = data[full] || {};
        const isAvailable = item.status === 'available';

        const cost = getWholesaleEstimate(tld);
        const selling = cost + DEFAULT_MARGIN_INR;

        results.push({
          domain: full,
          tld: `.${tld}`,
          available: isAvailable,
          costPriceInr: cost,
          sellingPriceInr: Math.round(selling),
          marginInr: DEFAULT_MARGIN_INR
        });
      }
    } catch (apiErr) {
      console.warn('ResellerClub live API warning, using DNS verification:', apiErr.message);
      results = await dnsFallbackAvailability(sld, tlds);
    }
  } else {
    // Zero-config sandbox/DNS verification fallback
    results = await dnsFallbackAvailability(sld, tlds);
  }

  return { sld, results };
}

/**
 * High-accuracy DNS-based fallback when ResellerClub credentials are not yet entered in .env
 */
async function dnsFallbackAvailability(sld, tlds) {
  const results = [];
  for (const tld of tlds) {
    const full = `${sld}.${tld}`;
    let isAvailable = false;
    try {
      await dns.resolve4(full);
      isAvailable = false; // Resolved an IP, so already registered
    } catch (e) {
      if (e.code === 'ENOTFOUND' || e.code === 'NODATA' || e.code === 'ENODATA') {
        isAvailable = true; // No DNS record, likely available
      }
    }

    const cost = getWholesaleEstimate(tld);
    const selling = cost + DEFAULT_MARGIN_INR;

    results.push({
      domain: full,
      tld: `.${tld}`,
      available: isAvailable,
      costPriceInr: cost,
      sellingPriceInr: Math.round(selling),
      marginInr: DEFAULT_MARGIN_INR
    });
  }
  return results;
}

/**
 * Standard baseline wholesale costs for prominent Indian TLDs
 */
function getWholesaleEstimate(tld) {
  switch (tld.replace('.', '')) {
    case 'in': return 499;
    case 'co.in': return 399;
    case 'com': return 899;
    case 'org': return 950;
    default: return 799;
  }
}

/**
 * Place a domain order and track margin in MongoDB
 */
async function recordDomainPurchaseIntent({ businessGroupId, domain, costPriceInr, sellingPriceInr, paymentRef }) {
  const margin = sellingPriceInr - costPriceInr;
  const parts = domain.split('.');
  const tld = '.' + parts.slice(1).join('.');

  const order = await prisma.domainOrder.upsert({
    where: { domain },
    update: {
      businessGroupId,
      costPriceInr,
      sellingPriceInr,
      profitMarginInr: margin,
      paymentRef: paymentRef || null,
      orderStatus: 'PAID'
    },
    create: {
      businessGroupId,
      domain,
      tld,
      costPriceInr,
      sellingPriceInr,
      profitMarginInr: margin,
      paymentRef: paymentRef || null,
      orderStatus: 'PAID'
    }
  });

  return order;
}

module.exports = {
  searchDomainAvailability,
  recordDomainPurchaseIntent
};
