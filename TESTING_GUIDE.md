# Testing Guide - Firebase Integration

Complete testing guide for the SnapBuy Admin/Seller Dashboard Firebase integration.

---

## Setup Before Testing

### Prerequisites
1. Firebase project created
2. `.env.local` file with Firebase config
3. Collections created: `admins`, `users`, `sellerApplications`, `products`, `orders`
4. Security rules updated
5. Dev server running: `npm run dev`

---

## Test 1: Admin Login

**Objective**: Verify admin authentication and role determination

**Setup**:
1. In Firebase Console → Authentication → Users
2. Create user: `admin@test.com` / `password123`
3. Copy the UID
4. In Firestore → `admins` collection
5. Add document with ID = admin UID:
   ```
   uid: (same as document ID)
   email: admin@test.com
   name: Test Admin
   createdAt: (server timestamp)
   ```

**Test Steps**:
1. Go to http://localhost:3000/login
2. Enter `admin@test.com` and `password123`
3. Click "Login"

**Expected Results**:
- ✅ Should redirect to `/dashboard`
- ✅ Dashboard should show "Admin Dashboard" title
- ✅ Sidebar should show admin menu items (Sellers, Users, etc.)
- ✅ Top bar should show "Admin" badge in blue
- ✅ Logout button should work

**URL Check**: http://localhost:3000/dashboard

---

## Test 2: Seller Registration (Pending Status)

**Objective**: Verify seller registration creates pending application

**Test Steps**:
1. Go to http://localhost:3000/login
2. Click "Apply as Seller" button
3. Fill out seller registration form:
   ```
   Owner Name: John Seller
   Email: seller@test.com
   Phone: +1234567890
   Shop Name: Test Shop
   Address: 123 Main St, City
   Category: Electronics
   ```
4. Enter password: `password123`
5. Click "Submit Application"

**Expected Results**:
- ✅ Should redirect to `/pending-approval`
- ✅ Pending approval page shows message and timeline
- ✅ Firestore should have new documents:
  - `users/[uid]` with email and timestamps
  - `sellerApplications/[uid]` with status: "pending"

**URL Check**: http://localhost:3000/pending-approval

---

## Test 3: Admin Approves Seller

**Objective**: Verify admin can approve seller application

**Prerequisite**: Complete Test 2 first

**Setup**:
1. Logged in as admin (see Test 1)
2. Go to http://localhost:3000/sellers

**Test Steps**:
1. Should see the seller from Test 2 in pending status
2. Find the seller in the table
3. Click "Approve" button (you may need to implement this UI first)

**Expected Results**:
- ✅ Seller status changes from "pending" to "approved"
- ✅ Firestore document updated:
  - `sellerApplications/[uid].status` = "approved"
  - `sellerApplications/[uid].approvedAt` = timestamp
  - `sellerApplications/[uid].approvedBy` = admin uid

---

## Test 4: Approved Seller Login

**Objective**: Verify approved seller can access dashboard

**Prerequisite**: Complete Test 3 first

**Test Steps**:
1. Go to http://localhost:3000/login
2. Enter seller email from Test 2 and password `password123`
3. Click "Login"

**Expected Results**:
- ✅ Should redirect to `/dashboard`
- ✅ Dashboard should show "Seller Dashboard" or seller-specific stats
- ✅ Sidebar should show seller menu items (My Products, Add Product, My Orders)
- ✅ Top bar should show seller role badge (emerald/green color)

**URL Check**: http://localhost:3000/dashboard

---

## Test 5: Admin Rejects Seller

**Objective**: Verify admin can reject seller application

**Setup**:
1. Create new seller via Test 2 (different email)
2. Logged in as admin
3. Go to http://localhost:3000/sellers

**Test Steps**:
1. Find the pending seller
2. Click "Reject" button (you may need to implement this UI first)
3. (Optional) Enter rejection reason if form shows it

**Expected Results**:
- ✅ Seller status changes to "rejected"
- ✅ Firestore updated with rejectedAt and rejectedBy

**Test Rejected Seller Login**:
1. Logout from admin
2. Go to `/login`
3. Try to login with rejected seller credentials
4. Should show error message: "Your seller application has been rejected"

---

## Test 6: Products Page - Admin View

**Objective**: Verify admin sees all products

**Setup**:
1. Create some products in Firestore `products` collection:
   ```
   {
     name: "Test Product 1",
     description: "A test product",
     category: "Electronics",
     price: 99.99,
     stock: 10,
     sellerId: "seller-uid-1",
     sellerName: "Seller Name",
     isActive: true,
     isFeatured: false,
     imageUrl: "https://...",
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```
2. Logged in as admin
3. Go to http://localhost:3000/products

**Expected Results**:
- ✅ Page title: "All Products"
- ✅ Table shows all products (including those from different sellers)
- ✅ Can see seller names in the table

---

## Test 7: Products Page - Seller View

**Objective**: Verify seller only sees own products

**Setup**:
1. Logged in as approved seller
2. Create a product with `sellerId` = your seller uid
3. Go to http://localhost:3000/products

**Expected Results**:
- ✅ Page title: "My Products"
- ✅ Only shows products where sellerId == your uid
- ✅ Other sellers' products are not shown
- ✅ "Add Product" button is visible in sidebar

---

## Test 8: Add Product - Seller Only

**Objective**: Verify seller can add products

**Prerequisite**: Logged in as approved seller

**Test Steps**:
1. Go to http://localhost:3000/products/add
2. Fill out form:
   ```
   Product Name: New Test Product
   Description: Product description
   Category: Electronics
   Price: 49.99
   Stock: 20
   Image: (optional, upload if implemented)
   ```
3. Click "Add Product"

**Expected Results**:
- ✅ Should create document in `products` collection with:
  - `sellerId`: your seller uid
  - `sellerName`: your shop name
  - `createdAt`: timestamp
  - `updatedAt`: timestamp
- ✅ Redirect to `/products` or show success message
- ✅ New product appears in your products list

---

## Test 9: Orders Page - Admin View

**Objective**: Verify admin sees all orders

**Setup**:
1. Create some orders in Firestore `orders` collection:
   ```
   {
     customerName: "John Buyer",
     customerEmail: "buyer@test.com",
     customerPhone: "+1234567890",
     customerAddress: "456 Oak St",
     items: [
       {
         productId: "prod-123",
         productName: "Product Name",
         quantity: 2,
         price: 49.99,
         total: 99.98,
         sellerId: "seller-uid",
         sellerName: "Seller Name"
       }
     ],
     total: 99.98,
     orderStatus: "placed",
     paymentStatus: "paid",
     paymentGateway: "stripe",
     sellerIds: ["seller-uid"],
     createdAt: timestamp
   }
   ```
2. Logged in as admin
3. Go to http://localhost:3000/orders

**Expected Results**:
- ✅ Page title: "All Orders"
- ✅ Table shows all orders
- ✅ Sorted by createdAt (newest first)

---

## Test 10: Orders Page - Seller View

**Objective**: Verify seller only sees own orders

**Setup**:
1. Create orders with your seller uid in sellerIds array
2. Logged in as approved seller
3. Go to http://localhost:3000/orders

**Expected Results**:
- ✅ Page title: "My Orders"
- ✅ Only shows orders where your uid is in sellerIds array
- ✅ Can see items in orders with correct seller info

---

## Test 11: Access Control - Seller Denied

**Objective**: Verify sellers cannot access admin-only pages

**Setup**: Logged in as seller

**Test Steps**:
1. Try to access http://localhost:3000/sellers
2. Try to access http://localhost:3000/users

**Expected Results**:
- ✅ Both pages should show "Access Denied" message
- ✅ Option to "Go to Dashboard" button

---

## Test 12: Access Control - Logout and Login Required

**Objective**: Verify unauthenticated users are redirected

**Test Steps**:
1. Logout (click logout button or clear auth)
2. Try to access http://localhost:3000/dashboard
3. Try to access http://localhost:3000/products

**Expected Results**:
- ✅ Both redirect to `/login`
- ✅ Login page is displayed

---

## Test 13: Settings Page - Admin

**Objective**: Verify admin settings show admin profile

**Setup**: Logged in as admin

**Test Steps**:
1. Go to http://localhost:3000/settings

**Expected Results**:
- ✅ Page title: "Admin Settings"
- ✅ Shows admin profile information
- ✅ Shows admin permissions

---

## Test 14: Settings Page - Seller

**Objective**: Verify seller settings show seller profile

**Setup**: Logged in as approved seller

**Test Steps**:
1. Go to http://localhost:3000/settings

**Expected Results**:
- ✅ Page title: "Seller Settings"
- ✅ Shows seller profile information (shop name, owner, etc.)
- ✅ Shows seller permissions
- ✅ Shows shop status as "approved"

---

## Test 15: Pending Seller Access

**Objective**: Verify pending seller is restricted to pending approval page

**Setup**:
1. Create pending seller (via registration, don't approve yet)
2. Logout and login with pending seller account

**Test Steps**:
1. Should redirect to http://localhost:3000/pending-approval
2. Try to access http://localhost:3000/dashboard
3. Should redirect back to pending-approval
4. Try to access http://localhost:3000/products
5. Should redirect back to pending-approval

**Expected Results**:
- ✅ Pending seller can only access `/pending-approval`
- ✅ All other dashboard routes redirect to pending-approval

---

## Performance Testing

### Check Network Traffic
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform login → dashboard navigation
4. Check that Firebase calls are efficient:
   - One getDoc() for role check
   - One collection query for data

### Check Build Size
```bash
npm run build
# Check .next/static/chunks/app size
```

---

## Error Scenarios

### Invalid Email/Password
- Login with wrong password
- Expected: "Login failed" error message

### Email Already Registered
- Register with existing email
- Expected: Error message about email in use

### Missing Required Fields
- Register without filling all fields
- Expected: Form validation errors

### Network Error (Offline)
- Disconnect internet while logging in
- Expected: Timeout or connection error message

---

## Checklist Before Production

- [ ] All tests pass locally
- [ ] Firebase security rules configured
- [ ] Environment variables set correctly
- [ ] Images upload properly (if implemented)
- [ ] Error messages are user-friendly
- [ ] Loading states show while fetching data
- [ ] Logout clears all user data
- [ ] URLs are correct (no hardcoded paths)
- [ ] Mobile responsive design works
- [ ] No console errors or warnings
- [ ] TypeScript build passes: `npm run build`

---

## Debugging Tips

### Check Auth State
In browser console:
```javascript
import { getCurrentUser } from '@/services/authService';
await getCurrentUser().then(user => console.log(user));
```

### Check Firestore Documents
In Firebase Console:
1. Navigate to Firestore Database
2. Click on collections (users, admins, sellerApplications)
3. View documents to verify structure

### Check Environment Variables
In Next.js app, log in page component:
```javascript
console.log('Firebase Config:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
```

### View Network Requests
1. DevTools → Network
2. Filter by "fetch"
3. Look for firestore API calls
4. Check response status and data

---

## Useful Firebase Console Tools

1. **Authentication** - View users and sign-in providers
2. **Firestore** - View/edit collections and documents
3. **Storage** - View uploaded files
4. **Functions** (if using) - View logs
5. **Rules Playground** - Test security rules

---

End of Testing Guide
