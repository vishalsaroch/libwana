import { NextResponse } from 'next/server';
import { isVpnIp, getClientIp, logVpnAttempt } from '@/utils/vpnDetection';

export async function POST(request) {
    try {
        const { ip: clientProvidedIp } = await request.json();
        
        // Get IP from request headers (more reliable than client-provided IP)
        const serverDetectedIp = getClientIp(request);
        
        // Use server-detected IP for security, fall back to client-provided if needed
        const ipToCheck = serverDetectedIp || clientProvidedIp;
        
        if (!ipToCheck) {
            return NextResponse.json({
                error: true,
                message: 'Unable to determine IP address'
            }, { status: 400 });
        }
        
        // Check if IP is VPN
        const isVpn = isVpnIp(ipToCheck);
        
        // Get user agent for logging
        const userAgent = request.headers.get('user-agent') || '';
        
        // Log the VPN detection attempt
        logVpnAttempt(ipToCheck, isVpn, userAgent);
        
        return NextResponse.json({
            error: false,
            data: {
                ip: ipToCheck,
                isVpn,
                blocked: isVpn,
                message: isVpn ? 'VPN detected - access blocked' : 'Access allowed'
            }
        });
        
    } catch (error) {
        console.error('VPN check error:', error);
        
        return NextResponse.json({
            error: true,
            message: 'VPN check failed',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        // Get IP from request headers
        const ip = getClientIp(request);
        
        if (!ip) {
            return NextResponse.json({
                error: true,
                message: 'Unable to determine IP address'
            }, { status: 400 });
        }
        
        // Check if IP is VPN
        const isVpn = isVpnIp(ip);
        
        return NextResponse.json({
            error: false,
            data: {
                ip,
                isVpn,
                blocked: isVpn,
                message: isVpn ? 'VPN detected' : 'No VPN detected'
            }
        });
        
    } catch (error) {
        console.error('VPN check error:', error);
        
        return NextResponse.json({
            error: true,
            message: 'VPN check failed',
            details: error.message
        }, { status: 500 });
    }
}
