const dns = require('dns').promises;

/**
 * Validates domain format (e.g. rajugariventures.in, www.mycompany.com)
 */
function isValidDomainFormat(domain) {
  if (!domain || typeof domain !== 'string') return false;
  const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9-]{2,}$/i;
  return domainRegex.test(clean);
}

/**
 * Cleans raw domain string (removes protocol, path, and trailing slashes)
 */
function sanitizeDomain(domain) {
  if (!domain) return '';
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./i, '')
    .replace(/[^a-z0-9\.\-]/g, '');
}

/**
 * Checks DNS records for a given custom domain.
 * Verifies if A record matches target IP (e.g. 147.93.107.21) or CNAME matches target CNAME (domains.manacity.in).
 */
async function verifyDnsRecords(customDomain, targetIp = '147.93.107.21', targetCname = 'domains.manacity.in') {
  const domain = sanitizeDomain(customDomain);
  if (!domain) {
    return { isPointing: false, error: 'Invalid domain format' };
  }

  let aRecordMatch = false;
  let cnameMatch = false;
  let resolvedIps = [];
  let resolvedCnames = [];

  // 1. Resolve A Records
  try {
    const ips = await dns.resolve4(domain);
    resolvedIps = ips || [];
    aRecordMatch = resolvedIps.includes(targetIp);
  } catch (err) {
    // A record lookup failed or domain doesn't resolve
  }

  // 2. Resolve CNAME Records
  const cnameDomain = domain.startsWith('www.') ? domain : `www.${domain}`;
  try {
    const cnames = await dns.resolveCname(cnameDomain);
    resolvedCnames = cnames || [];
    cnameMatch = resolvedCnames.some(c => c.toLowerCase().includes('manacity.in') || c.toLowerCase() === targetCname.toLowerCase());
  } catch (err) {
    // CNAME lookup failed
  }

  const isPointing = aRecordMatch || cnameMatch;

  // 3. Discover Domain Connect Protocol Endpoint
  const domainConnectDiscovery = await discoverDomainConnect(domain);

  return {
    domain,
    isPointing,
    aRecordMatch,
    cnameMatch,
    resolvedIps,
    resolvedCnames,
    domainConnect: domainConnectDiscovery
  };
}

/**
 * Discovers Domain Connect protocol support by checking _domainconnect TXT/CNAME records.
 */
async function discoverDomainConnect(domain) {
  const rootDomain = sanitizeDomain(domain);

  let url = null;
  try {
    const discoveryHost = `_domainconnect.${rootDomain}`;
    const txtRecords = await dns.resolveTxt(discoveryHost).catch(() => []);
    if (txtRecords && txtRecords.length > 0) {
      url = txtRecords.flat().join('');
    }

    if (!url) {
      const cnames = await dns.resolveCname(discoveryHost).catch(() => []);
      if (cnames && cnames.length > 0) {
        url = cnames[0];
      }
    }
  } catch (err) {
    // DNS discovery fallback
  }

  const domainConnectUrl = `https://domainconnect.godaddy.com/v2/domainTemplates/providers/manacity.in/services/dns/apply?domain=${rootDomain}`;
  const godaddyDnsUrl = `https://dns.godaddy.com/zone/${rootDomain}`;

  return {
    supported: true,
    providerUrl: url || 'https://domainconnect.godaddy.com',
    domainConnectUrl,
    godaddyDnsUrl
  };
}

module.exports = {
  isValidDomainFormat,
  sanitizeDomain,
  verifyDnsRecords,
  discoverDomainConnect
};
