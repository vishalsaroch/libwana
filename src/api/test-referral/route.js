import { NextResponse } from 'next/server';
import mockDb from '../../utils/mockDatabase.js';

export async function GET(request) {
  try {
    // Test API endpoint to verify referral system
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    
    switch (action) {
      case 'status':
        return NextResponse.json({
          error: false,
          message: 'Referral API is working',
          data: {
            totalUsers: mockDb.getAllUsers().length,
            totalReferrals: mockDb.getAllReferrals().length,
            totalWallets: mockDb.getAllWallets().length,
            users: mockDb.getAllUsers(),
            referrals: mockDb.getAllReferrals(),
            wallets: mockDb.getAllWallets()
          }
        });
        
      case 'generate':
        const testUserId = 'test_user_' + Date.now();
        const testUsername = 'TestUser';
        
        // Create test user
        const testUser = {
          id: testUserId,
          name: testUsername,
          referral_code: '',
          referred_by: null
        };
        
        mockDb.createUser(testUser);
        
        // Generate referral code
        const timestamp = Date.now().toString().slice(-4);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const userPrefix = testUsername.substring(0, 3).toUpperCase();
        const newReferralCode = `${userPrefix}${timestamp}${random}`;
        
        // Update user with referral code
        testUser.referral_code = newReferralCode;
        mockDb.updateUser(testUserId, testUser);
        
        return NextResponse.json({
          error: false,
          message: 'Test referral code generated successfully',
          data: {
            user: testUser,
            referral_code: newReferralCode
          }
        });
        
      default:
        return NextResponse.json({
          error: true,
          message: 'Invalid action'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      error: true,
      message: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
