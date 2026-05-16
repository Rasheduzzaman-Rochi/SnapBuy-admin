/**
 * Firestore Migration Scripts - Usage Guide
 * 
 * Two migration scripts have been created to update your Firestore database
 * with seller-related fields needed for the new admin/seller dashboard system.
 */

// ============================================================================
// SETUP INSTRUCTIONS
// ============================================================================

/*

### Step 1: Install Firebase Admin SDK
Run in your project root:
  npm install firebase-admin

### Step 2: Get Your Firebase Service Account Key
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your SnapBuy project
3. Click Settings (gear icon) → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Save the downloaded JSON file as `serviceAccountKey.json` in your project root

⚠️  IMPORTANT: DO NOT commit serviceAccountKey.json to Git!
   It's already added to .gitignore

### Step 3: Update Default Seller ID
Edit both scripts and replace:
  const DEFAULT_SELLER_ID = "REPLACE_WITH_SELLER_UID";
  
With your actual seller UID from Firebase Authentication.
To find it:
  - Firebase Console → Authentication → Users
  - Copy the Seller user's UID

### Step 4: Test with DRY_RUN = true
Before actually modifying your Firestore database, preview the changes:

  npm run migrate:products
  npm run migrate:orders

Look at the console output to verify the changes look correct.

### Step 5: Run Actual Migration
Once you're confident, edit both scripts and change:
  const DRY_RUN = true;
to:
  const DRY_RUN = false;

Then run:
  npm run migrate:products
  npm run migrate:orders

Or run both at once:
  npm run migrate:all

*/

// ============================================================================
// AVAILABLE NPM SCRIPTS
// ============================================================================

/*

npm run migrate:products
  - Updates all products in Firestore
  - Adds: sellerId, sellerName, stock, isActive, isFeatured, createdAt, updatedAt
  - Preserves existing values (doesn't overwrite)

npm run migrate:orders
  - Updates all orders in Firestore
  - Adds order-level fields: orderStatus, paymentStatus, paymentGateway, updatedAt, sellerIds
  - Enriches items with seller data: sellerId, sellerName, imageUrl
  - Creates sellerIds array from all unique seller IDs in order items

npm run migrate:all
  - Runs both product and order migrations sequentially

*/

// ============================================================================
// WHAT EACH SCRIPT DOES
// ============================================================================

/*

### migrate_products.js
Iterates through all products and:
✓ Adds sellerId (from DEFAULT_SELLER_ID if missing)
✓ Adds sellerName (from DEFAULT_SELLER_NAME if missing)
✓ Adds stock field (defaults to 0 if missing)
✓ Adds isActive (defaults to true if missing)
✓ Adds isFeatured (defaults to false if missing)
✓ Adds createdAt (current timestamp if missing)
✓ Adds updatedAt (current timestamp)

Preserves existing values - only adds missing fields.
Uses merge: true so other fields are not affected.

### migrate_orders.js
Iterates through all orders and:
✓ Adds orderStatus (defaults to "placed" if missing)
✓ Adds paymentStatus (defaults to "paid_test" if missing)
✓ Adds paymentGateway (defaults to "sslcommerz_plugin_test" if missing)
✓ Enriches each order item with seller info from products:
  - sellerId
  - sellerName
  - imageUrl
✓ Creates sellerIds array (unique seller IDs from all items)
✓ Adds convenience sellerId field (if only one seller in order)
✓ Adds updatedAt (current timestamp)

*/

// ============================================================================
// EXPECTED OUTPUT EXAMPLE
// ============================================================================

/*

$ npm run migrate:products

📦 Starting Products Migration...
🔍 Mode: DRY_RUN (preview only)
📝 Default Seller ID: seller_001
📝 Default Seller Name: SnapBuy Store
────────────────────────────────────────────────────────

📊 Found 5 product(s) to process

[1/5] Product: prod_001
   Current Name: Wireless Headphones
   ✓ Adding sellerId: seller_001
   ✓ Adding sellerName: SnapBuy Store
   ⊘ stock already exists: 50
   ⊘ isActive already exists: true
   ⊘ isFeatured already exists: false
   ⊘ createdAt already exists: 2024-01-15T10:30:00Z
   ✓ Adding/updating updatedAt: 2024-01-20T15:45:30.123Z
   📋 [DRY RUN] Would update with: {...}

[2/5] Product: prod_002
   ...

────────────────────────────────────────────────────────

📊 Migration Summary:
   Total products processed: 5
   Products with changes: 4
   Mode: DRY_RUN (no changes made)

💡 To apply these changes, set DRY_RUN = false in the script and run again

*/

// ============================================================================
// IMPORTANT: FLUTTER APP UPDATES NEEDED
// ============================================================================

/*

After running these migrations, you need to update your Flutter app to include
these new fields when creating products and orders.

### For Products Creation (Flutter)
When a seller creates a product via Flutter app, include:
  - sellerId: seller.uid
  - sellerName: seller.shopName
  - stock: user input
  - isActive: true (by default)
  - isFeatured: false (by default)
  - createdAt: Timestamp.now()
  - updatedAt: Timestamp.now()

### For Orders Creation (Flutter)
When placing an order via Flutter app, include:
  - orderStatus: "placed"
  - paymentStatus: "paid" or "pending" (based on payment result)
  - paymentGateway: the payment gateway used
  - sellerIds: [unique seller IDs from items]
  - sellerId: (if single seller) the seller ID
  - updatedAt: Timestamp.now()

Each order item should include:
  - productId: product.id
  - productName: product.name
  - price: product.price
  - quantity: user input
  - total: price * quantity
  - imageUrl: product.imageUrl
  - sellerId: product.sellerId
  - sellerName: product.sellerName

*/

// ============================================================================
// TROUBLESHOOTING
// ============================================================================

/*

❌ "serviceAccountKey.json not found"
   → Download from Firebase Console (see Step 2 above)
   → Save to project root as "serviceAccountKey.json"
   → Make sure it's not in .gitignore (it is, so don't worry)

❌ "Permission denied" errors
   → Make sure your Firebase security rules allow these operations
   → Or use a service account with proper Firestore permissions
   → Firebase Console → Firestore → Rules

❌ Migration is slow
   → Normal if you have thousands of documents
   → Each document is processed individually
   → Firestore has rate limits (~60k writes per minute)

❌ "REPLACE_WITH_SELLER_UID still appears in data"
   → You didn't update the DEFAULT_SELLER_ID constant
   → Edit the script and replace it with actual seller UID
   → Re-run migration with DRY_RUN = false

✓ How to verify migration worked
   → Go to Firestore Console
   → Open "products" collection
   → Click a document to see if new fields were added
   → Open "orders" collection
   → Check if sellerIds, orderStatus, etc. were added

*/

// ============================================================================
// NEXT STEPS
// ============================================================================

/*

1. ✅ Scripts created: migrate_products.js, migrate_orders.js
2. ✅ npm scripts added to package.json
3. ✅ .gitignore updated for serviceAccountKey.json

4. TODO: Download serviceAccountKey.json from Firebase
5. TODO: Update DEFAULT_SELLER_ID in both scripts
6. TODO: Run migrations with DRY_RUN = true to preview
7. TODO: Review the output and check Firestore
8. TODO: Set DRY_RUN = false and run again for actual migration
9. TODO: Update Flutter app to include new fields when creating products/orders
10. TODO: Update any backend API endpoints to handle new fields

*/
