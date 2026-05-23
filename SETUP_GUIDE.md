# Firebase Setup Guide - SnapBuy Admin Dashboard

This guide will help you set up Firebase for the SnapBuy Admin/Seller Dashboard.

## Step 1: Create .env.local File

Copy the example file and create your actual configuration:

```bash
cp .env.local.example .env.local
```

## Step 2: Get Firebase Config from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your SnapBuy project (or create one)
3. Click Settings (gear icon) → Project Settings
4. Go to "Your apps" section
5. Click on your web app or create one if it doesn't exist
6. You'll see Firebase configuration. Copy these values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

7. Paste these into your `.env.local` file

## Step 3: Enable Firebase Services

In Firebase Console:

### Authentication
1. Go to Build → Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Save

### Firestore Database
1. Go to Build → Firestore Database
2. Click "Create database"
3. Start in "Production mode"
4. Choose a region (closest to you)
5. Create

### Cloud Storage
1. Go to Build → Storage
2. Click "Get started"
3. Start in "Production mode"
4. Choose the same region as Firestore
5. Create

## Step 4: Create Firestore Collections

In Firestore, create these collections (you can add documents via the UI or via code):

1. **admins/** - For admin users
2. **users/** - For regular users
3. **sellerApplications/** - For seller signups
4. **products/** - For product listings
5. **orders/** - For orders

You'll add documents to these as you use the app.

## Step 5: Create Test Admin Account

You'll need at least one admin account to manage the system.

### Via Firebase Console:
1. Authentication → Users → Add User
2. Email: `admin@snapbuy.com`
3. Password: Choose a strong password
4. Create user

### Via Firestore (Important!):
1. Go to Firestore → admins collection
2. Click "Add document"
3. Document ID: Paste the UID from the user created above
4. Add these fields:
   ```
   uid: (same as document ID)
   email: admin@snapbuy.com
   name: Your Admin Name
   createdAt: (set to server timestamp)
   ```

## Step 6: Create Test Seller Account (Optional)

To test the seller flow:

### Via Firebase Console:
1. Authentication → Users → Add User
2. Email: `seller@snapbuy.com`
3. Password: Choose a strong password
4. Create user

### Via Firestore:
1. Go to Firestore → sellerApplications collection
2. Click "Add document"
3. Document ID: Paste the seller's UID from above
4. Add these fields:
   ```
   uid: (same as document ID)
   ownerName: Test Seller
   shopName: Test Shop
   email: seller@snapbuy.com
   phone: +1234567890
   address: 123 Main St
   category: Electronics
   status: approved
   createdAt: (server timestamp)
   approvedAt: (server timestamp)
   approvedBy: (admin uid from step 5)
   rejectedAt: null
   rejectedBy: null
   ```

## Step 7: Set Firestore Security Rules (Important!)

Default rules are very restrictive. You need to update them for the dashboard to work.

1. Go to Firestore → Rules
2. Replace the rules with this (adjust as needed for production):

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read their own user doc
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if get(/databases/$(database)/documents/admins/$(request.auth.uid)).exists();
    }
    
    // Admin operations
    match /admins/{adminId} {
      allow read, write: if request.auth.uid == adminId;
      allow read: if get(/databases/$(database)/documents/admins/$(request.auth.uid)).exists();
    }
    
    // Seller applications - sellers can read own, admins can manage all
    match /sellerApplications/{sellerId} {
      allow read: if request.auth.uid == sellerId;
      allow read, write: if get(/databases/$(database)/documents/admins/$(request.auth.uid)).exists();
      allow create: if request.auth.uid != null;
    }
    
    // Products - anyone can read, sellers can create/update own
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.resource.data.sellerId == request.auth.uid || 
                              get(/databases/$(database)/documents/admins/$(request.auth.uid)).exists();
    }
    
    // Orders - sellers can read their own, admins can read all
    match /orders/{orderId} {
      allow read: if request.auth.uid in resource.data.sellerIds ||
                     get(/databases/$(database)/documents/admins/$(request.auth.uid)).exists();
      allow write: if get(/databases/$(database)/documents/admins/$(request.auth.uid)).exists();
    }
  }
}
```

3. Publish the rules

## Step 8: Configure Storage Rules

1. Go to Storage → Rules
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Publish

## Step 9: Test the Setup

To run the web app while developing, start the dev server:

```bash
npm run dev
```

This uses Webpack for development to avoid the Turbopack panic error:

```text
FATAL: An unexpected Turbopack error occurred
```

Then open:

```text
http://localhost:3000
```

To check that the project can build successfully for production, run:

```bash
npm run build
```

If the build finishes without errors, the web app is ready to run in production mode:

```bash
npm start
```

### Test Admin Login:
1. Go to http://localhost:3000/login
2. Enter admin email and password
3. Should redirect to /dashboard (admin dashboard)

### Test Seller Registration:
1. Go to /register-seller
2. Fill in form with test data
3. Submit
4. Should redirect to /pending-approval

### Test Seller Approval:
1. Login as admin
2. Go to /sellers
3. Find the pending seller
4. Click approve
5. Seller should now be able to login

## Step 10: Troubleshooting

**"auth/invalid-email"**: Check email format is correct

**"auth/weak-password"**: Password must be at least 6 characters

**"auth/email-already-in-use"**: Email already registered, try different one

**"Permission denied"**: Check Firestore security rules and make sure admin/user doc exists

**"File upload fails"**: Check Storage rules allow write for authenticated users

**Environment variables not loading**: 
- Make sure file is named `.env.local` (not `.env`)
- Restart dev server after changing `.env.local`
- Check variables start with `NEXT_PUBLIC_`

## Next Steps

Once Firebase is set up:

1. Update the Dashboard page to load real data
2. Update Products page to show real products
3. Update Orders page to show real orders
4. Connect product add/edit forms
5. Set up seller approval workflow
6. Add more test data
7. Test complete end-to-end flows

See [FIREBASE_INTEGRATION.md](./FIREBASE_INTEGRATION.md) for technical details about the integration.
