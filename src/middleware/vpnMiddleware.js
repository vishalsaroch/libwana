import { NextResponse } from 'next/server';
import { isVpnIp, getClientIp, logVpnAttempt } from '@/utils/vpnDetection';

/**
 * VPN Detection Middleware
 * Checks incoming requests for VPN usage and blocks if detected
 */
export function vpnMiddleware(request) {
    try {
        // Get client IP
        const clientIp = getClientIp(request);
        
        if (!clientIp) {
            console.warn('Unable to determine client IP');
            return NextResponse.next();
        }
        
        // Check if IP is from VPN
        const isVpn = isVpnIp(clientIp);
        
        // Log the attempt
        const userAgent = request.headers.get('user-agent') || '';
        logVpnAttempt(clientIp, isVpn, userAgent);
        
        if (isVpn) {
            // Block VPN requests
            return NextResponse.json({
                error: true,
                message: 'VPN detected. Access blocked for security reasons.',
                blocked: true,
                statusCode: 403
            }, { status: 403 });
        }
        
        // Allow non-VPN requests
        return NextResponse.next();
        
    } catch (error) {
        console.error('VPN middleware error:', error);
        // In case of error, allow request to continue (fail open)
        return NextResponse.next();
    }
}

/**
 * Check if a pathname should be protected by VPN detection
 */
export function shouldCheckVpn(pathname) {
    const protectedPaths = [
        '/api/auth',
        '/api/user-signup',
        '/api/login',
        '/api/register',
        '/profile',
        '/dashboard',
        '/admin'
    ];
    
    return protectedPaths.some(path => pathname.startsWith(path));
}

/**
 * VPN check for specific routes
 */
export async function checkVpnForRoute(request) {
    const ip = getClientIp(request);
    
    if (!ip) {
        return {
            allowed: true,
            message: 'Unable to determine IP'
        };
    }
    
    const isVpn = isVpnIp(ip);
    
    return {
        allowed: !isVpn,
        isVpn,
        ip,
        message: isVpn ? 'VPN detected - access blocked' : 'Access allowed'
    };
}
