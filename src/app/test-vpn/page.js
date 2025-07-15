'use client';

import { useState, useEffect } from 'react';
import { checkCurrentIpVpnStatus, checkVpnStatus } from '@/utils/clientVpnDetection';
import useClientIP from '@/hooks/useClientIP';

export default function TestVpnPage() {
    const [vpnStatus, setVpnStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { clientIP, loading: ipLoading, isVpn, vpnBlocked } = useClientIP();

    const testVpnDetection = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await checkCurrentIpVpnStatus();
            setVpnStatus(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const testSpecificIP = async (ip) => {
        setLoading(true);
        setError(null);
        
        try {
            const isVpn = await checkVpnStatus(ip);
            setVpnStatus({
                ip: ip,
                isVpn: isVpn,
                message: isVpn ? 'VPN detected' : 'Clean IP',
                source: 'manual test'
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-test on load
        testVpnDetection();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>VPN Detection Test Page</h1>
            
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>useClientIP Hook Results:</h3>
                <p><strong>Loading:</strong> {ipLoading ? 'Yes' : 'No'}</p>
                <p><strong>Client IP:</strong> {clientIP || 'Not detected'}</p>
                <p><strong>Is VPN:</strong> {isVpn ? 'Yes' : 'No'}</p>
                <p><strong>VPN Blocked:</strong> {vpnBlocked ? 'Yes' : 'No'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testVpnDetection}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Test Current IP'}
                </button>

                <button 
                    onClick={() => testSpecificIP('8.8.8.8')}
                    disabled={loading}
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    Test Google DNS (8.8.8.8)
                </button>
            </div>

            {error && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    border: '1px solid #f5c6cb', 
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {vpnStatus && (
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    border: '1px solid #c3e6cb', 
                    borderRadius: '5px'
                }}>
                    <h3>VPN Detection Results:</h3>
                    <pre>{JSON.stringify(vpnStatus, null, 2)}</pre>
                </div>
            )}

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <h3>How to Test:</h3>
                <ol>
                    <li>First, test without VPN - should show "Clean IP"</li>
                    <li>Then connect to a VPN and test again - should show "VPN detected"</li>
                    <li>The Google DNS test should always show "Clean IP" as it's not a VPN</li>
                </ol>
            </div>
        </div>
    );
}
