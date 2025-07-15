/**
 * Comprehensive VPN Detection System
 * This file handles all VPN detection logic using multiple detection methods
 */

// Known VPN/Proxy providers and their identifiers
const VPN_PROVIDERS = [
    // Major VPN Services
    'nordvpn', 'expressvpn', 'surfshark', 'cyberghost', 'protonvpn', 
    'purevpn', 'windscribe', 'tunnelbear', 'hotspotshield', 'ipvanish',
    'vypr', 'privateinternetaccess', 'pia', 'hidemyass', 'zenmate',
    
    // Cloud/Hosting Providers (commonly used for VPN)
    'amazon', 'aws', 'digitalocean', 'vultr', 'linode', 'ovh', 'hetzner',
    'google cloud', 'microsoft azure', 'cloudflare', 'fastly', 'rackspace',
    
    // Common VPN Keywords
    'vpn', 'proxy', 'anonymous', 'privacy', 'shield', 'secure', 'tunnel',
    'virtual private', 'datacenter', 'hosting', 'server', 'cloud', 'vps',
    'dedicated', 'colocation', 'colo', 'hide', 'mask', 'protect'
];

// Known VPN/Proxy ASNs (Autonomous System Numbers)
const VPN_ASNS = [
    // Major cloud providers
    15169, 16509, 14618, 8075, 32934, 13335, 20940, 36183, 20473, 24940,
    16276, 63949, 43350, 60068, 41378, 36352, 36046, 36444, 27589, 25820,
    32392, 36351, 42831, 52000, 33070, 36114, 40676, 54455, 54489, 54540,
    54600, 54825, 55293, 55720, 55803, 55960, 393406, 399629, 20454, 395092,
    397702, 32098, 19281, 36444, 36046, 36352, 41378, 60068, 43350, 63949,
    
    // Known VPN service ASNs
    201133, 200350, 39351, 46844, 63023, 51167, 62240, 57695, 60068, 
    208046, 202422, 204957, 49505, 49544, 50613, 59729, 60068, 202422
];

// Suspicious IP ranges (common VPN/proxy ranges)
const SUSPICIOUS_IP_RANGES = [
    // Common VPN ranges
    '185.', '188.', '192.', '194.', '195.', '37.', '46.', '77.', '78.', '79.',
    '80.', '81.', '82.', '83.', '84.', '85.', '86.', '87.', '88.', '89.',
    '90.', '91.', '92.', '93.', '94.', '95.', '109.', '176.', '178.', '185.',
    '188.', '193.', '194.', '195.', '31.', '5.', '2.', '95.', '46.', '37.'
];

/**
 * Check if IP is from a private/local network
 * @param {string} ip - IP address to check
 * @returns {boolean} - True if private/local IP
 */
function isPrivateIP(ip) {
    if (!ip) return false;
    
    const privateRanges = [
        /^10\./,                           // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12
        /^192\.168\./,                     // 192.168.0.0/16
        /^127\./,                          // 127.0.0.0/8 (loopback)
        /^169\.254\./,                     // 169.254.0.0/16 (link-local)
        /^::1$/,                           // IPv6 loopback
        /^fe80:/,                          // IPv6 link-local
        /^fc00:/,                          // IPv6 private
        /^localhost$/i
    ];
    
    return privateRanges.some(range => range.test(ip));
}

/**
 * Check if IP matches suspicious patterns
 * @param {string} ip - IP address to check
 * @returns {boolean} - True if suspicious
 */
function isSuspiciousIP(ip) {
    if (!ip) return false;
    
    // Check against known suspicious IP ranges
    return SUSPICIOUS_IP_RANGES.some(range => ip.startsWith(range));
}

/**
 * Get IP information from multiple services
 * @param {string} ip - IP address to check
 * @returns {Promise<object>} - IP information
 */
async function getIPInfo(ip) {
    const services = [
        `https://ipapi.co/${ip}/json/`,
        `https://ip-api.com/json/${ip}`,
        `https://ipinfo.io/${ip}/json`,
        `https://api.iplocation.net/?ip=${ip}`
    ];
    
    for (const service of services) {
        try {
            const response = await fetch(service);
            if (response.ok) {
                const data = await response.json();
                return {
                    ip: data.ip || ip,
                    country: data.country || data.country_name,
                    region: data.region || data.region_name,
                    city: data.city,
                    org: data.org || data.isp || data.organization,
                    asn: data.asn || data.as,
                    timezone: data.timezone,
                    proxy: data.proxy || false,
                    hosting: data.hosting || false,
                    mobile: data.mobile || false
                };
            }
        } catch (error) {
            console.warn(`Failed to get IP info from ${service}:`, error);
        }
    }
    
    return null;
}

/**
 * Check if organization name indicates VPN/proxy
 * @param {string} org - Organization name
 * @returns {boolean} - True if VPN/proxy detected
 */
function isVPNOrganization(org) {
    if (!org) return false;
    
    const orgLower = org.toLowerCase();
    return VPN_PROVIDERS.some(provider => 
        orgLower.includes(provider.toLowerCase())
    );
}

/**
 * Check if ASN indicates VPN/proxy
 * @param {string|number} asn - ASN number
 * @returns {boolean} - True if VPN/proxy ASN
 */
function isVPNASN(asn) {
    if (!asn) return false;
    
    const asnNumber = typeof asn === 'string' ? 
        parseInt(asn.replace(/[^\d]/g, ''), 10) : asn;
    
    return VPN_ASNS.includes(asnNumber);
}

/**
 * Get current user's IP address
 * @returns {Promise<string>} - User's IP address
 */
async function getCurrentIP() {
    const services = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://ip.seeip.org/json',
        'https://ipinfo.io/json'
    ];
    
    for (const service of services) {
        try {
            const response = await fetch(service);
            if (response.ok) {
                const data = await response.json();
                return data.ip || data.query || null;
            }
        } catch (error) {
            console.warn(`Failed to get IP from ${service}:`, error);
        }
    }
    
    return null;
}

/**
 * Comprehensive VPN detection function
 * @param {string} ip - IP address to check (optional, will detect current IP if not provided)
 * @returns {Promise<object>} - Detection result
 */
export async function detectVPN(ip = null) {
    try {
        // Get current IP if not provided
        if (!ip) {
            ip = await getCurrentIP();
        }
        
        if (!ip) {
            return {
                isVPN: false,
                confidence: 0,
                reason: 'Unable to detect IP address',
                ip: null,
                error: true
            };
        }
        
        // Skip private/local IPs
        if (isPrivateIP(ip)) {
            return {
                isVPN: false,
                confidence: 0,
                reason: 'Private/local IP address',
                ip: ip,
                error: false
            };
        }
        
        let confidence = 0;
        let reasons = [];
        
        // Check suspicious IP patterns
        if (isSuspiciousIP(ip)) {
            confidence += 20;
            reasons.push('Suspicious IP range');
        }
        
        // Get detailed IP information
        const ipInfo = await getIPInfo(ip);
        
        if (ipInfo) {
            // Check organization
            if (isVPNOrganization(ipInfo.org)) {
                confidence += 40;
                reasons.push(`VPN/Proxy organization: ${ipInfo.org}`);
            }
            
            // Check ASN
            if (isVPNASN(ipInfo.asn)) {
                confidence += 30;
                reasons.push(`VPN/Proxy ASN: ${ipInfo.asn}`);
            }
            
            // Check if marked as proxy/hosting
            if (ipInfo.proxy) {
                confidence += 35;
                reasons.push('Marked as proxy');
            }
            
            if (ipInfo.hosting) {
                confidence += 25;
                reasons.push('Hosting/datacenter IP');
            }
            
            // Additional checks for common VPN indicators
            if (ipInfo.org) {
                const orgLower = ipInfo.org.toLowerCase();
                if (orgLower.includes('datacenter') || 
                    orgLower.includes('hosting') || 
                    orgLower.includes('server') || 
                    orgLower.includes('cloud')) {
                    confidence += 20;
                    reasons.push('Datacenter/hosting service');
                }
            }
        }
        
        // Determine if VPN based on confidence score
        const isVPN = confidence >= 40; // Threshold for VPN detection
        
        return {
            isVPN: isVPN,
            confidence: confidence,
            reason: reasons.join(', ') || 'No VPN indicators found',
            ip: ip,
            ipInfo: ipInfo,
            error: false
        };
        
    } catch (error) {
        console.error('VPN detection error:', error);
        return {
            isVPN: false,
            confidence: 0,
            reason: 'Detection failed',
            ip: ip,
            error: true,
            errorMessage: error.message
        };
    }
}

/**
 * Simple VPN check function
 * @param {string} ip - IP address to check (optional)
 * @returns {Promise<boolean>} - True if VPN detected
 */
export async function isVPN(ip = null) {
    const result = await detectVPN(ip);
    return result.isVPN;
}

/**
 * Check current user's VPN status
 * @returns {Promise<object>} - VPN status
 */
export async function checkCurrentVPNStatus() {
    return await detectVPN();
}

/**
 * Log VPN detection attempt
 * @param {object} result - Detection result
 * @param {string} userAgent - User agent string
 */
export function logVPNAttempt(result, userAgent = '') {
    const logData = {
        timestamp: new Date().toISOString(),
        ip: result.ip,
        isVPN: result.isVPN,
        confidence: result.confidence,
        reason: result.reason,
        userAgent: userAgent || navigator?.userAgent || '',
        url: typeof window !== 'undefined' ? window.location.href : ''
    };
    
    console.log('VPN Detection Log:', logData);
    
    // You can extend this to send to your analytics service
    // Example: sendToAnalytics(logData);
}

// Export default function for easy usage
export default detectVPN;
