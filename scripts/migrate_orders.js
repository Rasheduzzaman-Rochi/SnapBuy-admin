/**
 * Firebase Firestore Orders Migration Script
 * 
 * This script adds seller-related fields to existing orders in Firestore.
 * 
 * IMPORTANT INSTRUCTIONS:
 * 1. Place your Firebase service account key file at project root as: serviceAccountKey.json
 *    Download from: Firebase Console > Project Settings > Service Accounts > Generate new private key
 * 
 * 2. Replace DEFAULT_SELLER_ID with your actual seller UID from Firebase Authentication
 * 
 * 3. Set DRY_RUN = true to preview changes WITHOUT modifying Firestore
 *    Set DRY_RUN = false to actually update Firestore (after testing with DRY_RUN = true)
 * 
 * 4. Run the script with: npm run migrate:orders
 * 
 * WHAT THIS SCRIPT DOES:
 * - Adds orderStatus if missing (defaults to "placed")
 * - Adds paymentStatus if missing (defaults to "paid_test")
 * - Adds paymentGateway if missing (defaults to "sslcommerz_plugin_test")
 * - Enriches order items with seller information from products
 * - Adds sellerIds array (unique seller IDs from all items)
 * - If only one seller, also adds convenience sellerId field
 * - Adds updatedAt timestamp
 * - Does NOT overwrite existing values
 * - Uses merge: true to preserve other fields
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// ============================================
// CONFIGURATION - CHANGE THESE VALUES
// ============================================

// SET TO FALSE TO ACTUALLY UPDATE FIRESTORE
// Keep at TRUE for testing/preview
const DRY_RUN = false;

// Replace with actual seller UID from Firebase Authentication
const DEFAULT_SELLER_ID = "5rNEnpiFE6fy9fJSMSENJEfJmrG3";
const DEFAULT_SELLER_NAME = "SnapBuy Store";

// ============================================
// INITIALIZATION
// ============================================

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found at project root');
  console.error('   Download from: Firebase Console > Project Settings > Service Accounts > Generate new private key');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ============================================
// MIGRATION LOGIC
// ============================================

async function loadProductsMap() {
  console.log('\n📦 Loading products...');
  const productsMap = {};
  const snapshot = await db.collection('products').get();

  snapshot.forEach(doc => {
    productsMap[doc.id] = doc.data();
  });

  console.log(`   ✓ Loaded ${Object.keys(productsMap).length} products`);
  return productsMap;
}

async function migrateOrders() {
  console.log('\n📋 Starting Orders Migration...');
  console.log(`🔍 Mode: ${DRY_RUN ? 'DRY_RUN (preview only)' : '⚠️  LIVE (updating Firestore)'})`);
  console.log(`📝 Default Seller ID: ${DEFAULT_SELLER_ID}`);
  console.log(`📝 Default Seller Name: ${DEFAULT_SELLER_NAME}`);
  console.log('─'.repeat(60));

  try {
    // Load all products first
    const productsMap = await loadProductsMap();

    // Get all orders
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.get();

    if (snapshot.empty) {
      console.log('\n⚠️  No orders found in Firestore');
      process.exit(0);
    }

    const totalOrders = snapshot.size;
    let processedCount = 0;
    let updatedCount = 0;

    console.log(`\n📊 Found ${totalOrders} order(s) to process\n`);

    // Process each order
    for (const doc of snapshot.docs) {
      processedCount++;
      const orderId = doc.id;
      const orderData = doc.data();

      console.log(`\n[${processedCount}/${totalOrders}] Order: ${orderId}`);
      console.log(`   Customer: ${orderData.customerName || 'N/A'}`);

      // Build update data
      const updateData = {};
      let hasChanges = false;

      // Handle orderStatus
      if (!orderData.orderStatus) {
        // Try to use old status field if it exists
        if (orderData.status) {
          console.log(`   ⊘ orderStatus missing, using old 'status' field: ${orderData.status}`);
        } else {
          updateData.orderStatus = 'placed';
          console.log(`   ✓ Adding orderStatus: "placed"`);
          hasChanges = true;
        }
      } else {
        console.log(`   ⊘ orderStatus already exists: ${orderData.orderStatus}`);
      }

      // Handle paymentStatus
      if (!orderData.paymentStatus) {
        updateData.paymentStatus = 'paid_test';
        console.log(`   ✓ Adding paymentStatus: "paid_test"`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ paymentStatus already exists: ${orderData.paymentStatus}`);
      }

      // Handle paymentGateway
      if (!orderData.paymentGateway) {
        updateData.paymentGateway = 'sslcommerz_plugin_test';
        console.log(`   ✓ Adding paymentGateway: "sslcommerz_plugin_test"`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ paymentGateway already exists: ${orderData.paymentGateway}`);
      }

      // Process order items
      if (orderData.items && Array.isArray(orderData.items)) {
        console.log(`   📦 Processing ${orderData.items.length} item(s)...`);
        const enrichedItems = [];
        const sellerIds = new Set();

        orderData.items.forEach((item, index) => {
          const enrichedItem = { ...item };

          // Try to find product by productId or name
          let product = null;
          if (item.productId) {
            product = productsMap[item.productId];
          } else if (item.name) {
            // Try to find by name
            product = Object.values(productsMap).find(p => p.name === item.name);
          }

          // Add seller info from product or use defaults
          if (!enrichedItem.sellerId) {
            enrichedItem.sellerId = product?.sellerId || DEFAULT_SELLER_ID;
            console.log(`      ✓ Item ${index + 1}: Added sellerId: ${enrichedItem.sellerId}`);
            hasChanges = true;
          }

          if (!enrichedItem.sellerName) {
            enrichedItem.sellerName = product?.sellerName || DEFAULT_SELLER_NAME;
            console.log(`      ✓ Item ${index + 1}: Added sellerName: ${enrichedItem.sellerName}`);
            hasChanges = true;
          }

          // Add imageUrl if available
          if (!enrichedItem.imageUrl && product?.imageUrl) {
            enrichedItem.imageUrl = product.imageUrl;
            console.log(`      ✓ Item ${index + 1}: Added imageUrl from product`);
            hasChanges = true;
          }

          enrichedItems.push(enrichedItem);
          sellerIds.add(enrichedItem.sellerId);
        });

        if (hasChanges || enrichedItems.length > 0) {
          updateData.items = enrichedItems;
        }

        // Add sellerIds array
        const sellerIdsArray = Array.from(sellerIds);
        if (!orderData.sellerIds || JSON.stringify(orderData.sellerIds) !== JSON.stringify(sellerIdsArray)) {
          updateData.sellerIds = sellerIdsArray;
          console.log(`   ✓ Adding sellerIds: [${sellerIdsArray.join(', ')}]`);
          hasChanges = true;
        }

        // If only one seller, also add sellerId convenience field
        if (sellerIdsArray.length === 1 && !orderData.sellerId) {
          updateData.sellerId = sellerIdsArray[0];
          console.log(`   ✓ Single seller detected, adding sellerId: ${sellerIdsArray[0]}`);
          hasChanges = true;
        }
      } else {
        console.log(`   ⚠️  No items array found`);
      }

      // Always add updatedAt
      updateData.updatedAt = new Date().toISOString();
      console.log(`   ✓ Adding/updating updatedAt: ${updateData.updatedAt}`);
      hasChanges = true;

      // Update document if there are changes
      if (hasChanges) {
        if (DRY_RUN) {
          console.log(`   📋 [DRY RUN] Would update order`);
        } else {
          await ordersRef.doc(orderId).set(updateData, { merge: true });
          console.log(`   ✅ Updated in Firestore`);
        }
        updatedCount++;
      } else {
        console.log(`   ⊘ No changes needed`);
      }
    }

    // Summary
    console.log('\n' + '─'.repeat(60));
    console.log(`\n📊 Migration Summary:`);
    console.log(`   Total orders processed: ${processedCount}`);
    console.log(`   Orders with changes: ${updatedCount}`);
    console.log(`   Mode: ${DRY_RUN ? 'DRY_RUN (no changes made)' : 'LIVE (changes saved)'}`);

    if (DRY_RUN) {
      console.log(`\n💡 To apply these changes, set DRY_RUN = false in the script and run again`);
    } else {
      console.log(`\n✅ Orders migration completed successfully!`);
    }

    console.log();
    await admin.app().delete();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    await admin.app().delete();
    process.exit(1);
  }
}

// Run migration
migrateOrders();
