import geoip from 'geoip-lite';

/**
 * VPN Detection Utility
 * Uses geoip-lite to detect potential VPN/proxy IPs
 */

// Known VPN/Proxy IP ranges and providers
const knownVpnProviders = [
    'Amazon',
    'DigitalOcean',
    'Linode',
    'Vultr',
    'Hetzner',
    'OVH',
    'Google Cloud',
    'Microsoft Azure',
    'CloudFlare',
    'Fastly'
];

// Common VPN/Proxy ASN ranges
const vpnAsns = [
    15169, // Google
    16509, // Amazon
    20940, // Akamai
    13335, // Cloudflare
    14061, // DigitalOcean
    8075,  // Microsoft
    32934, // Facebook
    14618, // Amazon
    19281, // Quad9
    36183, // Linode
    20473, // Choopa (Vultr)
    24940, // Hetzner
    16276, // OVH
    63949, // Linode
    43350, // NForce Entertainment
    60068, // Datacamp
    41378, // Kirino
    36352, // HostPapa
    36046, // Webair
    36444, // Wholsale Internet
    27589, // Hostgator
    25820, // IT7 Networks
    32392, // Linode
    36351, // Softlayer
    42831, // UK Dedicated Servers
    52000, // Rackspace
    33070, // RMH-14
    36114, // Tonic
    36444, // Wholesale Internet
    40676, // Psychz Networks
    54455, // Prager
    54489, // Fiberstate
    54540, // Prager
    54600, // Prager
    54825, // Packet Host
    55293, // A2 Hosting
    55720, // Gigenet
    55803, // Prager
    55960, // Prager
    393406, // Prager
    399629, // Prager
    20454, // Secured Servers
    395092, // Prager
    397702, // Prager
    32098, // Prager
    54455, // Prager
    54489, // Prager
    54540, // Prager
    54600, // Prager
    54825, // Prager
    55293, // Prager
    55720, // Prager
    55803, // Prager
    55960, // Prager
    393406, // Prager
    399629, // Prager
    20454, // Prager
    395092, // Prager
    397702, // Prager
    32098   // Prager
];

/**
 * Check if an IP address is likely from a VPN/proxy
 * @param {string} ip - The IP address to check
 * @returns {boolean} - True if IP is detected as VPN/proxy
 */
export const isVpnIp = (ip) => {
    try {
        if (!ip) return false;
        
        // Skip localhost and private networks
        if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
            return false;
        }

        const geo = geoip.lookup(ip);
        
        if (!geo) return false;

        // Check if ISP/Organization matches known VPN providers
        if (geo.org) {
            const orgLower = geo.org.toLowerCase();
            for (const provider of knownVpnProviders) {
                if (orgLower.includes(provider.toLowerCase())) {
                    return true;
                }
            }
        }

        // Check against known VPN ASNs
        if (geo.asn && vpnAsns.includes(geo.asn)) {
            return true;
        }

        // Additional checks for common VPN/proxy indicators
        if (geo.org) {
            const suspiciousKeywords = [
                'vpn', 'proxy', 'hosting', 'server', 'datacenter', 'cloud',
                'virtual', 'dedicated', 'colocation', 'colo', 'tunnel',
                'anonymous', 'privacy', 'secure', 'shield', 'hide'
            ];
            
            const orgLower = geo.org.toLowerCase();
            for (const keyword of suspiciousKeywords) {
                if (orgLower.includes(keyword)) {
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        console.error('Error in VPN detection:', error);
        return false; // Default to allowing access if detection fails
    }
};

/**
 * Get IP geolocation information
 * @param {string} ip - The IP address to lookup
 * @returns {object|null} - Geolocation data or null
 */
export const getIpInfo = (ip) => {
    try {
        return geoip.lookup(ip);
    } catch (error) {
        console.error('Error getting IP info:', error);
        return null;
    }
};

/**
 * Get client IP from request headers (for server-side usage)
 * @param {object} req - Request object
 * @returns {string} - Client IP address
 */
export const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '127.0.0.1';
};

/**
 * Log VPN detection attempts (for monitoring purposes)
 * @param {string} ip - The IP address
 * @param {boolean} isVpn - Whether IP was detected as VPN
 * @param {string} userAgent - User agent string
 */
export const logVpnAttempt = (ip, isVpn, userAgent = '') => {
    const timestamp = new Date().toISOString();
    const logData = {
        timestamp,
        ip,
        isVpn,
        userAgent,
        geoInfo: getIpInfo(ip)
    };
    
    console.log('VPN Detection Log:', logData);
    
    // You can extend this to save to database or external logging service
    // Example: saveToDatabase(logData);
};
