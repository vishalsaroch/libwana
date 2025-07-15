'use client';

import { useState } from 'react';
import { detectVPN, isVPN, checkCurrentVPNStatus, logVPNAttempt } from '@/utils/vpnDetector';

export default function VPNTestPage() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [testIP, setTestIP] = useState('');

    const runVPNTest = async () => {
        setLoading(true);
        try {
            const vpnResult = await checkCurrentVPNStatus();
            setResult(vpnResult);
            
            if (vpnResult.isVPN) {
                logVPNAttempt(vpnResult, navigator.userAgent);
                alert('⚠️ VPN DETECTED! Login would be blocked.');
            } else {
                alert('✅ No VPN detected. Login would proceed.');
            }
        } catch (error) {
            console.error('VPN test failed:', error);
            alert('❌ VPN test failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const testSpecificIP = async () => {
        if (!testIP) {
            alert('Please enter an IP address to test');
            return;
        }
        
        setLoading(true);
        try {
            const vpnResult = await detectVPN(testIP);
            setResult(vpnResult);
            
            if (vpnResult.isVPN) {
                alert(`⚠️ VPN DETECTED for IP ${testIP}! This IP would be blocked.`);
            } else {
                alert(`✅ No VPN detected for IP ${testIP}. This IP would be allowed.`);
            }
        } catch (error) {
            console.error('VPN test failed:', error);
            alert('❌ VPN test failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333', textAlign: 'center' }}>🛡️ VPN Detection Test</h1>
            
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>
                    Test the VPN detection system to see if it can identify VPN connections.
                </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={runVPNTest}
                    disabled={loading}
                    style={{
                        padding: '15px 30px',
                        fontSize: '16px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginRight: '10px'
                    }}
                >
                    {loading ? '🔄 Testing...' : '🔍 Test Current IP'}
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Test Specific IP:</h3>
                <input
                    type="text"
                    value={testIP}
                    onChange={(e) => setTestIP(e.target.value)}
                    placeholder="Enter IP address (e.g., 8.8.8.8)"
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        width: '200px',
                        marginRight: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
                <button 
                    onClick={testSpecificIP}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        backgroundColor: loading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Test IP'}
                </button>
            </div>

            {result && (
                <div style={{ 
                    marginTop: '30px',
                    padding: '20px',
                    backgroundColor: result.isVPN ? '#ffebee' : '#e8f5e8',
                    border: `2px solid ${result.isVPN ? '#f44336' : '#4caf50'}`,
                    borderRadius: '8px'
                }}>
                    <h3 style={{ 
                        color: result.isVPN ? '#d32f2f' : '#388e3c',
                        margin: '0 0 15px 0'
                    }}>
                        {result.isVPN ? '⚠️ VPN DETECTED' : '✅ NO VPN DETECTED'}
                    </h3>
                    
                    <div style={{ fontSize: '14px', color: '#333' }}>
                        <p><strong>IP Address:</strong> {result.ip}</p>
                        <p><strong>Confidence:</strong> {result.confidence}%</p>
                        <p><strong>Reason:</strong> {result.reason}</p>
                        
                        {result.ipInfo && (
                            <div style={{ marginTop: '15px' }}>
                                <h4>IP Information:</h4>
                                <p><strong>Country:</strong> {result.ipInfo.country}</p>
                                <p><strong>Region:</strong> {result.ipInfo.region}</p>
                                <p><strong>City:</strong> {result.ipInfo.city}</p>
                                <p><strong>Organization:</strong> {result.ipInfo.org}</p>
                                <p><strong>ASN:</strong> {result.ipInfo.asn}</p>
                                <p><strong>Proxy:</strong> {result.ipInfo.proxy ? 'Yes' : 'No'}</p>
                                <p><strong>Hosting:</strong> {result.ipInfo.hosting ? 'Yes' : 'No'}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ 
                marginTop: '40px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <h3>How to Test:</h3>
                <ol style={{ lineHeight: '1.6' }}>
                    <li>First, click "Test Current IP" without VPN - should show "No VPN detected"</li>
                    <li>Connect to a VPN service (NordVPN, ExpressVPN, etc.)</li>
                    <li>Click "Test Current IP" again - should show "VPN detected"</li>
                    <li>Try testing specific IPs like 8.8.8.8 (Google DNS) - should show "No VPN"</li>
                </ol>
                
                <h3>Expected Results:</h3>
                <ul style={{ lineHeight: '1.6' }}>
                    <li>✅ Normal home/office IPs: No VPN detected</li>
                    <li>⚠️ VPN service IPs: VPN detected with high confidence</li>
                    <li>⚠️ Cloud/hosting IPs: May be detected as VPN</li>
                    <li>✅ Public DNS IPs (8.8.8.8): No VPN detected</li>
                </ul>
            </div>
        </div>
    );
}
