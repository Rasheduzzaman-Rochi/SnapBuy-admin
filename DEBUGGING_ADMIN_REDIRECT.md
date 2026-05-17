# Debugging: Admin Redirect to /register-seller Issue

## Problem Summary
When admin logs in, app redirects to `/register-seller` instead of `/dashboard`.

## Root Cause Analysis

The login flow is correct, but the issue is likely one of these:

1. **Missing `admins/{uid}` document** - The admin user exists in Firebase Auth but NOT in Firestore `admins` collection
2. **Wrong document ID** - Document ID in `admins` collection doesn't match the user's UID
3. **Firestore permission error** - Silent failure in `getDoc(doc(db, "admins", uid))`
4. **Email used instead of UID** - Document keyed by email instead of UID

## Debug Steps (Follow in Order)

### Step 1: Enable Browser Console Logs
1. Open your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Reload the page: **Cmd+R** or **Ctrl+R**

### Step 2: Attempt Admin Login
1. Go to http://localhost:3000/login
2. Enter admin email and password
3. Watch the Console for log messages

### Step 3: Read the Console Logs

You should see logs like:
```
🔑 Attempting login with: admin@snapbuy.com
✅ Firebase Auth successful! UID: abc123xyz789 Email: admin@snapbuy.com
🔍 Getting role for UID: abc123xyz789
👤 Admin doc exists? false
🏪 Seller app doc exists? false
⚠️ No role found, returning "none"
🔐 Login successful! User role: none
📍 Redirecting to appropriate page...
⚠️ No role found → Redirecting to /register-seller
```

**The key log is: `👤 Admin doc exists? false`**

If it says `false`, then the admin document doesn't exist in Firestore.

## Solution: Create Admin Document in Firestore

### Option A: Using Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **ecomerce-app-e68d0** project
3. Click **Firestore Database** (left sidebar)
4. Click **Create collection**
5. Collection name: **`admins`**
6. Click **Next**
7. Document ID: **Copy the UID from the console log above** (e.g., `abc123xyz789`)
   - **IMPORTANT**: Use the exact UID, not the email!
8. Add field:
   ```
   Field Name: uid
   Type: String
   Value: abc123xyz789 (same as document ID)
   ```
9. Click **Save**

### Option B: Using Firestore Rules (For Testing)

Temporarily update Firestore rules to allow unauthenticated reads (NOT FOR PRODUCTION):

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /admins/{adminId} {
      allow read, write: if true;  // TEMPORARY - DELETE AFTER TESTING
    }
    match /users/{userId} {
      allow read, write: if true;  // TEMPORARY - DELETE AFTER TESTING
    }
    match /sellerApplications/{sellerId} {
      allow read, write: if true;  // TEMPORARY - DELETE AFTER TESTING
    }
    match /products/{productId} {
      allow read, write: if true;  // TEMPORARY - DELETE AFTER TESTING
    }
    match /orders/{orderId} {
      allow read, write: if true;  // TEMPORARY - DELETE AFTER TESTING
    }
  }
}
```

Then test admin login again.

## Console Log Reference

### Login Successful Logs (Expected)
```
✅ Firebase Auth successful! UID: [actual-uid]
🔍 Getting role for UID: [actual-uid]
👤 Admin doc exists? true
✅ Admin role detected, admin data: {uid: '...', name: '...', ...}
🎯 Final role result: admin
🔐 Login successful! User role: admin
📍 Redirecting to appropriate page...
✅ Admin/Seller detected → Redirecting to /dashboard
```

### Expected Logs for Each Role

**Admin:**
```
👤 Admin doc exists? true
✅ Admin role detected
🎯 Final role result: admin
```

**Approved Seller:**
```
👤 Admin doc exists? false
🏪 Seller app doc exists? true
📋 Seller application status: approved
🎯 Final role result: approved
```

**Pending Seller:**
```
👤 Admin doc exists? false
🏪 Seller app doc exists? true
📋 Seller application status: pending
🎯 Final role result: pending
```

**No Role (New User):**
```
👤 Admin doc exists? false
🏪 Seller app doc exists? false
⚠️ No role found, returning "none"
🎯 Final role result: none
```

## Testing Checklist

After fixing the admin document issue:

### Test 1: Admin Login ✓
- [ ] Admin UID has `admins/{uid}` document
- [ ] Console logs show: `Admin doc exists? true`
- [ ] Redirects to `/dashboard`
- [ ] Can see admin-only pages (Sellers, Users)

### Test 2: Seller Login ✓
- [ ] Seller UID has `sellerApplications/{uid}` with `status: "approved"`
- [ ] Console logs show: `Seller app doc exists? true`, `status: approved`
- [ ] Redirects to `/dashboard`
- [ ] Can see seller pages, NOT admin pages

### Test 3: Pending Seller ✓
- [ ] Seller UID has `sellerApplications/{uid}` with `status: "pending"`
- [ ] Console logs show: `status: pending`
- [ ] Redirects to `/pending-approval`

### Test 4: New User ✓
- [ ] New user with no documents
- [ ] Console logs show: `Admin doc exists? false`, `Seller app doc exists? false`
- [ ] Redirects to `/register-seller`

## Firestore Collection Structure

### admins collection
```
admins/
├── [user-uid-1]/
│   ├── uid: string
│   ├── email: string
│   ├── name: string
│   └── createdAt: timestamp
└── [user-uid-2]/
    ├── uid: string
    ├── email: string
    ├── name: string
    └── createdAt: timestamp
```

### sellerApplications collection
```
sellerApplications/
├── [user-uid-1]/
│   ├── uid: string
│   ├── email: string
│   ├── status: "pending" | "approved" | "rejected"
│   ├── shopName: string
│   ├── ownerName: string
│   ├── createdAt: timestamp
│   ├── approvedAt: timestamp (if approved)
│   └── rejectionReason: string (if rejected)
└── [user-uid-2]/
    └── ...
```

## Key Points to Remember

1. **Document ID = User UID**, not email
2. **Admin check happens FIRST** (before seller check)
3. **No admin needs sellerApplications document**
4. **Debug logs show exact UID needed** for admin document
5. **Check Firestore Rules** if getting permission errors
6. **Refresh browser** after updating Firestore

## How to Get Your Admin UID

From the browser console after login attempt:
```
✅ Firebase Auth successful! UID: THIS-IS-YOUR-UID
```

Copy that exact UID and use it as the document ID in Firestore.

## Still Having Issues?

Check these:
1. Are you copying the full UID from logs? (usually 28 chars)
2. Did you create the `admins` collection?
3. Did you create a document with ID = exact UID?
4. Are Firestore security rules permissive enough?
5. Did you refresh the page after creating the admin document?

## Disable Debug Logs (After Testing)

Once confirmed working, you can remove the `console.log` statements from:
- `src/services/authService.ts` - `getUserAccessRole()` and `loginWithEmail()`
- `src/app/login/page.tsx` - `handleSubmit()`

Or just leave them - they don't affect performance in production.
