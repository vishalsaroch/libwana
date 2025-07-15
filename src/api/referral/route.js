import { NextResponse } from 'next/server';
import mockDb from '../../utils/mockDatabase.js';

// Generate unique referral code
function generateReferralCode(username) {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const userPrefix = username ? username.substring(0, 3).toUpperCase() : 'USR';
  return `${userPrefix}${timestamp}${random}`;
}

// POST: Apply referral code during registration or generate new code
export async function POST(request) {
  try {
    const { user_id, referral_code, username, generate_code } = await request.json();
    
    if (!user_id) {
      return NextResponse.json({ 
        error: true, 
        message: 'User ID is required' 
      }, { status: 400 });
    }
    
    // Generate referral code for user if generate_code is true
    if (generate_code) {
      const newReferralCode = generateReferralCode(username);
      
      // Create or update user with their own referral code
      let existingUser = mockDb.findUserById(user_id);
      if (!existingUser) {
        existingUser = {
          id: user_id,
          name: username,
          referral_code: newReferralCode,
          referred_by: null
        };
        mockDb.createUser(existingUser);
      } else {
        existingUser.referral_code = newReferralCode;
        mockDb.updateUser(user_id, existingUser);
      }
      
      return NextResponse.json({
        error: false,
        message: 'Referral code generated successfully',
        data: {
          referral_code: newReferralCode,
          user: existingUser
        }
      });
    }
    
    // Generate referral code for new user if not provided
    if (!referral_code) {
      const newReferralCode = generateReferralCode(username);
      
      // Create or update user with their own referral code
      let existingUser = mockDb.findUserById(user_id);
      if (!existingUser) {
        existingUser = {
          id: user_id,
          name: username,
          referral_code: newReferralCode,
          referred_by: null
        };
        mockDb.createUser(existingUser);
      } else {
        existingUser.referral_code = newReferralCode;
        mockDb.updateUser(user_id, existingUser);
      }
      
      return NextResponse.json({
        error: false,
        message: 'Referral code generated successfully',
        data: {
          referral_code: newReferralCode,
          user: existingUser
        }
      });
    }
    
    // Check if referral code exists
    const referrer = mockDb.findUserByReferralCode(referral_code);
    
    if (!referrer) {
      return NextResponse.json({ 
        error: true, 
        message: 'Invalid referral code' 
      }, { status: 400 });
    }
    
    // Check if user is trying to use their own referral code
    if (referrer.id === user_id) {
      return NextResponse.json({ 
        error: true, 
        message: 'Cannot use your own referral code' 
      }, { status: 400 });
    }
    
    // Add $40 to new user's wallet
    const newUserWallet = mockDb.updateWallet(user_id, {
      balance: 40,
      referral_earnings: 40,
      total_earned: 40
    });
    
    // Add $40 to referrer's wallet as well
    const referrerWallet = mockDb.getWallet(referrer.id);
    const updatedReferrerWallet = mockDb.updateWallet(referrer.id, {
      balance: referrerWallet.balance + 40,
      referral_earnings: referrerWallet.referral_earnings + 40,
      total_earned: referrerWallet.total_earned + 40
    });
    
    // Create referral record
    const referralRecord = mockDb.createReferral({
      referrer_id: referrer.id,
      referred_user_id: user_id,
      referral_code: referral_code,
      reward_amount: 40,
      currency: 'USD'
    });
    
    // Update user with referral info
    const updatedUser = mockDb.updateUser(user_id, {
      referred_by: referrer.id,
      referral_code: generateReferralCode(username)
    });
    
    return NextResponse.json({
      error: false,
      message: 'Referral code applied successfully! $40 added to your wallet.',
      data: {
        user: updatedUser,
        wallet: newUserWallet,
        referrer_wallet: updatedReferrerWallet,
        referral_record: referralRecord
      }
    });
    
  } catch (error) {
    console.error('Referral API error:', error);
    return NextResponse.json({ 
      error: true, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET: Get referral information
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    
    if (!user_id) {
      return NextResponse.json({ 
        error: true, 
        message: 'User ID is required' 
      }, { status: 400 });
    }
    
    // Get user's referral code
    let user = mockDb.findUserById(user_id);
    if (!user) {
      // Create a new user entry if doesn't exist
      user = {
        id: user_id,
        name: 'User',
        referral_code: '',
        referred_by: null
      };
      mockDb.createUser(user);
    }
    
    // Get referrals made by this user
    const referrals = mockDb.getReferralsByReferrer(user_id);
    
    // Get wallet information
    const wallet = mockDb.getWallet(user_id);
    
    return NextResponse.json({
      error: false,
      message: 'Referral information retrieved successfully',
      data: {
        user_referral_code: user.referral_code,
        total_referrals: referrals.length,
        referrals: referrals,
        wallet: wallet,
        referral_earnings: wallet.referral_earnings
      }
    });
    
  } catch (error) {
    console.error('Referral GET API error:', error);
    return NextResponse.json({ 
      error: true, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
