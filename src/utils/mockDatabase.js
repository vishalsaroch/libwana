// Mock database for referral system
// In a real application, this would be replaced with actual database calls

class MockDatabase {
  constructor() {
    this.users = new Map();
    this.referrals = new Map();
    this.wallets = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  initializeSampleData() {
    // Sample user data
    const sampleUser = {
      id: 'sample_user_123',
      name: 'John Doe',
      email: 'john@example.com',
      referral_code: 'JOH12345ABC',
      referred_by: null
    };
    
    this.users.set('sample_user_123', sampleUser);
    
    // Sample wallet data
    const sampleWallet = {
      userId: 'sample_user_123',
      balance: 40,
      escrow_balance: 0,
      total_earned: 40,
      total_spent: 0,
      referral_earnings: 40
    };
    
    this.wallets.set('sample_user_123', sampleWallet);
    
    // Sample referral data
    const sampleReferral = {
      id: 'ref_001',
      referrer_id: 'sample_user_123',
      referred_user_id: 'referred_user_456',
      referral_code: 'JOH12345ABC',
      reward_amount: 40,
      currency: 'USD',
      created_at: new Date().toISOString(),
      status: 'active'
    };
    
    this.referrals.set('ref_001', sampleReferral);
  }
  
  // Find user by ID
  findUserById(id) {
    return this.users.get(id);
  }
  
  // Find user by referral code
  findUserByReferralCode(code) {
    for (let [id, user] of this.users) {
      if (user.referral_code === code) {
        return user;
      }
    }
    return null;
  }
  
  // Update user
  updateUser(id, updates) {
    const user = this.users.get(id);
    if (user) {
      Object.assign(user, updates);
      this.users.set(id, user);
      return user;
    }
    return null;
  }
  
  // Create new user
  createUser(userData) {
    this.users.set(userData.id, userData);
    return userData;
  }
  
  // Create/update wallet
  updateWallet(userId, updates) {
    const wallet = this.wallets.get(userId) || {
      userId,
      balance: 0,
      escrow_balance: 0,
      total_earned: 0,
      total_spent: 0,
      referral_earnings: 0
    };
    
    Object.assign(wallet, updates);
    this.wallets.set(userId, wallet);
    return wallet;
  }
  
  // Get wallet by user ID
  getWallet(userId) {
    return this.wallets.get(userId) || {
      userId,
      balance: 0,
      escrow_balance: 0,
      total_earned: 0,
      total_spent: 0,
      referral_earnings: 0
    };
  }
  
  // Create referral record
  createReferral(referralData) {
    const id = 'ref_' + Date.now().toString();
    const referral = {
      id,
      ...referralData,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    this.referrals.set(id, referral);
    return referral;
  }
  
  // Get referrals by referrer ID
  getReferralsByReferrer(referrerId) {
    const referrals = [];
    for (let [id, referral] of this.referrals) {
      if (referral.referrer_id === referrerId) {
        referrals.push(referral);
      }
    }
    return referrals;
  }
  
  // Get all users (for debugging)
  getAllUsers() {
    return Array.from(this.users.values());
  }
  
  // Get all referrals (for debugging)
  getAllReferrals() {
    return Array.from(this.referrals.values());
  }
  
  // Get all wallets (for debugging)
  getAllWallets() {
    return Array.from(this.wallets.values());
  }
}

// Create a singleton instance
const mockDb = new MockDatabase();

export default mockDb;
