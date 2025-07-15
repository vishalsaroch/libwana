/**
 * Client-side VPN Detection Utility
 * Uses API calls to check VPN status (doesn't import geoip-lite directly)
 */

/**
 * Check if an IP address is from a VPN using the API
 * @param {string} ip - The IP address to check
 * @returns {Promise<boolean>} - True if IP is detected as VPN/proxy
 */
export const checkVpnStatus = async (ip) => {
    try {
        if (!ip) return false;
        
        const response = await fetch('https://ipapi.co/json/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ip })
        });
        
        if (!response.ok) {
            console.warn('VPN check API failed:', response.status);
            return false; // Fail open - allow access if API fails
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.warn('VPN check API error:', data.message);
            return false; // Fail open
        }
        
        return data.data.isVpn || false;
    } catch (error) {
        console.error('Error checking VPN status:', error);
        return false; // Fail open - allow access if check fails
    }
};

/**
 * Check VPN status for current client IP
 * @returns {Promise<object>} - VPN check result
 */
export const checkCurrentIpVpnStatus = async () => {
    try {
        const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.warn('VPN check API failed:', response.status);
            return { isVpn: false, error: true, message: 'API failed' };
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.warn('VPN check API error:', data.message);
            return { isVpn: false, error: true, message: data.message };
        }
        
        return {
            isVpn: data.data.isVpn,
            blocked: data.data.blocked,
            ip: data.data.ip,
            error: false,
            message: data.data.message
        };
    } catch (error) {
        console.error('Error checking current IP VPN status:', error);
        return { isVpn: false, error: true, message: error.message };
    }
};

/**
 * Log VPN attempt (client-side version)
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
        source: 'client'
    };
    
    console.log('VPN Detection Log (Client):', logData);
    
    // You can extend this to send to analytics or logging service
    // Example: sendToAnalytics(logData);
};

/**
 * Simple client-side validation for private/local IPs
 * @param {string} ip - The IP address to check
 * @returns {boolean} - True if IP is private/local
 */
export const isPrivateIP = (ip) => {
    if (!ip) return false;
    
    // Check for localhost
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
        return true;
    }
    
    // Check for private IP ranges
    const privateRanges = [
        /^10\./,                    // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12
        /^192\.168\./,              // 192.168.0.0/16
        /^169\.254\./,              // 169.254.0.0/16 (link-local)
        /^fc00:/,                   // IPv6 private
        /^fe80:/                    // IPv6 link-local
    ];
    
    return privateRanges.some(range => range.test(ip));
};

/**
 * Get multiple IP addresses from different services
 * @returns {Promise<string[]>} - Array of detected IP addresses
 */
export const getMultipleIPs = async () => {
    const ipServices = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://ip.seeip.org/json',
        'https://ipinfo.io/json'
    ];
    
    const ips = [];
    
    for (const service of ipServices) {
        try {
            const response = await fetch(service);
            const data = await response.json();
            
            let ip = null;
            if (data.ip) {
                ip = data.ip;
            } else if (data.query) {
                ip = data.query;
            } else if (typeof data === 'string') {
                ip = data;
            }
            
            if (ip && !ips.includes(ip)) {
                ips.push(ip);
            }
        } catch (error) {
            console.warn(`Failed to get IP from ${service}:`, error);
        }
    }
    
    return ips;
};

/**
 * Validate IP address format
 * @param {string} ip - The IP address to validate
 * @returns {boolean} - True if valid IP format
 */
export const isValidIP = (ip) => {
    if (!ip) return false;
    
    // IPv4 regex
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 regex (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};
