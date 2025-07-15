# Facebook-Style Service Advertisement Implementation Guide

## Overview
This document outlines the implementation of Facebook-style service advertisement interaction features for your e-commerce website. The feature includes buttons for "I'm Interested", "Is it still available?", and "Contact service provider" similar to Facebook Marketplace.

## New Files Created

### 1. `src/components/ServiceInteraction/ServiceInteractionButtons.jsx`
- **Purpose**: Main component with Facebook-style interaction buttons
- **Features**:
  - "I'm Interested" button with counter
  - "Is it still available?" button for availability check
  - "Contact Provider" button for direct contact
  - "Start Chat" button for messaging
- **Props**: 
  - `productData`: Product/service information
  - `systemSettingsData`: System settings
  - `onContactClick`: Callback for contact action
  - `onChatClick`: Callback for chat action

### 2. `src/components/ServiceInteraction/InterestedUsers.jsx`
- **Purpose**: Shows interested users to service providers
- **Features**:
  - Preview of interested users
  - Modal with full list of interested users
  - Contact options for each interested user
  - Pagination for large lists
- **Props**:
  - `productData`: Product/service information
  - `systemSettingsData`: System settings

### 3. `src/styles/ServiceInteraction.css`
- **Purpose**: CSS styles for service interaction components
- **Features**:
  - Facebook-style button designs
  - Hover effects and animations
  - Responsive design
  - Dark mode support
  - Modal styling

## Modified Files

### 1. `src/utils/api.js`
**Added new API endpoints**:
```javascript
export const TOGGLE_INTEREST = 'toggle-interest'
export const CHECK_AVAILABILITY = 'check-availability'
export const GET_INTERESTED_USERS = 'get-interested-users'

export const serviceInteractionApi = {
    toggleInterest: ({ item_id }) => { /* API call */ },
    checkAvailability: ({ item_id }) => { /* API call */ },
    getInterestedUsers: ({ item_id, page }) => { /* API call */ }
}
```

### 2. `src/components/PagesComponent/SingleProductDetail/SingleProductDetail.jsx`
**Changes**:
- Added imports for new components
- Added chat and contact handlers
- Integrated `ServiceInteractionButtons` component
- Added `InterestedUsers` component (shown only to sellers)
- Added toast notifications

### 3. `src/app/layout.js`
**Changes**:
- Added import for `ServiceInteraction.css`

## Backend API Requirements

You'll need to implement these API endpoints in your backend:

### 1. `toggle-interest` (POST)
- **Parameters**: `item_id`
- **Purpose**: Toggle user interest in a service
- **Response**: 
  - Success/error status
  - Updated interest count
  - Message

### 2. `check-availability` (POST)
- **Parameters**: `item_id`
- **Purpose**: Send availability inquiry to service provider
- **Response**:
  - Success/error status
  - Notification sent confirmation
  - Message

### 3. `get-interested-users` (GET)
- **Parameters**: `item_id`, `page`
- **Purpose**: Get list of users interested in the service
- **Response**:
  - Paginated list of interested users
  - User details (name, email, profile, etc.)
  - Timestamp of interest

## Database Schema Updates

### 1. New Table: `service_interests`
```sql
CREATE TABLE service_interests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_item (item_id, user_id)
);
```

### 2. Add fields to `items` table:
```sql
ALTER TABLE items ADD COLUMN interest_count INT DEFAULT 0;
ALTER TABLE items ADD COLUMN is_interested BOOLEAN DEFAULT FALSE;
```

## Language Keys to Add

Add these translations to your language files:

```javascript
// English translations
{
  "serviceInteraction": "Service Interaction",
  "interested": "Interested",
  "isItAvailable": "Is it available?",
  "contactProvider": "Contact Provider",
  "startChat": "Start Chat",
  "interestedUsers": "Interested Users",
  "viewAll": "View All",
  "interestMarked": "Interest marked successfully",
  "interestRemoved": "Interest removed successfully",
  "availabilityInquirySent": "Availability inquiry sent",
  "loginToShowInterest": "Please login to show interest",
  "loginToCheckAvailability": "Please login to check availability",
  "loginToContactProvider": "Please login to contact provider",
  "cannotInteractWithOwnListing": "Cannot interact with your own listing",
  "contactDetailsNotAvailable": "Contact details not available",
  "interestedOn": "Interested on",
  "emailNotAvailable": "Email not available",
  "errorFetchingInterestedUsers": "Error fetching interested users",
  "more": "more",
  "contact": "Contact",
  "email": "Email",
  "loading": "Loading",
  "loadMore": "Load More"
}
```

## Implementation Flow

### 1. For Buyers/Users:
1. User views a service listing
2. Sees interaction buttons below product details
3. Can click "I'm Interested" to show interest
4. Can click "Is it available?" to inquire about availability
5. Can click "Contact Provider" to call directly
6. Can click "Start Chat" to message the provider

### 2. For Sellers/Service Providers:
1. Views their own listing
2. Sees list of interested users (if any)
3. Can view all interested users in a modal
4. Can contact interested users directly
5. Receives notifications when users show interest or inquire

### 3. Notification System:
- When user shows interest → Notify seller
- When user checks availability → Notify seller + auto-message
- When user contacts → Log interaction

## Testing Checklist

- [ ] Interest button toggles correctly
- [ ] Interest count updates in real-time
- [ ] Availability check sends notification
- [ ] Contact button works with phone numbers
- [ ] Chat integration works properly
- [ ] Interested users list displays correctly
- [ ] Modal functionality works
- [ ] API endpoints respond correctly
- [ ] Database operations work
- [ ] Responsive design works on mobile
- [ ] Error handling works properly
- [ ] User authentication checks work

## Additional Features to Consider

1. **Push Notifications**: Real-time notifications for interest/availability
2. **Email Notifications**: Send email alerts to service providers
3. **Analytics**: Track interaction metrics
4. **Auto-responses**: Set up automated responses for common inquiries
5. **Interest Expiry**: Auto-remove old interests after certain time
6. **Bulk Actions**: Allow sellers to contact multiple interested users

## Security Considerations

- Validate user authentication for all actions
- Prevent spam by rate limiting interactions
- Sanitize all user inputs
- Implement proper authorization checks
- Log all interactions for audit purposes

## Performance Optimization

- Use pagination for interested users list
- Implement caching for frequently accessed data
- Optimize database queries with proper indexes
- Use debouncing for rapid button clicks
- Implement lazy loading for large lists

This implementation provides a complete Facebook-style service advertisement interaction system that enhances user engagement and facilitates better communication between service providers and potential customers.










<!-- refrral -->
•  ReferralCodeGenerator: Better API response handling
•  Wallet: Updated to show referral data properly
•  Added proper error handling and loading states

4. Test API (src/api/test-referral/route.js)
•  Added for testing the referral system
•  Can verify if the API is working correctly

How to Test:

1. Test the API directly: 
•  Visit /api/test-referral?action=status to see current data
•  Visit /api/test-referral?action=generate to test code generation
2. Use the Wallet page: 
•  Go to the wallet page
•  Click on the "Generate Code" tab
•  Click "Generate" button to create a referral code