import { useState, useEffect } from 'react';

/**
 * Custom hook to get client IP address and check VPN status
 * @returns {object} - Contains clientIP, loading, error, isVpn, vpnBlocked
 */
export const useClientIP = () => {
    const [clientIP, setClientIP] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVpn, setIsVpn] = useState(false);
    const [vpnBlocked, setVpnBlocked] = useState(false);

    useEffect(() => {
        const getClientIPAndCheckVPN = async () => {
            try {
                setLoading(true);
                
                // First, try to get IP from our own API (more reliable)
                try {
                    const vpnCheckResponse = await fetch('https://ipapi.co/json/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (vpnCheckResponse.ok) {
                        const vpnData = await vpnCheckResponse.json();
                        if (!vpnData.error) {
                            setClientIP(vpnData.data.ip);
                            setIsVpn(vpnData.data.isVpn);
                            setVpnBlocked(vpnData.data.blocked);
                            setError(null);
                            return;
                        }
                    }
                } catch (apiError) {
                    console.warn('Failed to get IP from API:', apiError);
                }
                
                // Fallback to external IP services
                const ipServices = [
                    'https://api.ipify.org?format=json',
                    'https://ipapi.co/json/',
                    'https://ip.seeip.org/json',
                    'https://api.ip.sb/ip'
                ];

                let ip = null;
                
                for (const service of ipServices) {
                    try {
                        const response = await fetch(service);
                        const data = await response.json();
                        
                        // Handle different response formats
                        if (data.ip) {
                            ip = data.ip;
                            break;
                        } else if (data.query) {
                            ip = data.query;
                            break;
                        } else if (typeof data === 'string') {
                            ip = data;
                            break;
                        }
                    } catch (serviceError) {
                        console.warn(`Failed to get IP from ${service}:`, serviceError);
                        continue;
                    }
                }

                if (ip) {
                    setClientIP(ip);
                    setError(null);
                    
                    // Check VPN status with the obtained IP
                    try {
                        const vpnCheckResponse = await fetch('https://ipapi.co/json/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ ip })
                        });
                        
                        if (vpnCheckResponse.ok) {
                            const vpnData = await vpnCheckResponse.json();
                            if (!vpnData.error) {
                                setIsVpn(vpnData.data.isVpn);
                                setVpnBlocked(vpnData.data.blocked);
                            }
                        }
                    } catch (vpnError) {
                        console.warn('Failed to check VPN status:', vpnError);
                    }
                } else {
                    throw new Error('Could not determine client IP');
                }
            } catch (err) {
                console.error('Error getting client IP:', err);
                setError(err.message);
                setClientIP(''); // Fallback to empty string
            } finally {
                setLoading(false);
            }
        };

        getClientIPAndCheckVPN();
    }, []);

    return { clientIP, loading, error, isVpn, vpnBlocked };
};

export default useClientIP;
