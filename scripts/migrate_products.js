/**
 * Firebase Firestore Products Migration Script
 * 
 * This script adds seller-related fields to existing products in Firestore.
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
 * 4. Run the script with: npm run migrate:products
 * 
 * WHAT THIS SCRIPT DOES:
 * - Adds sellerId to each product
 * - Adds sellerName to each product
 * - Ensures stock field exists
 * - Ensures isActive field exists (defaults to true)
 * - Ensures isFeatured field exists (defaults to false)
 * - Ensures createdAt exists
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

async function migrateProducts() {
  console.log('\n📦 Starting Products Migration...');
  console.log(`🔍 Mode: ${DRY_RUN ? 'DRY_RUN (preview only)' : '⚠️  LIVE (updating Firestore)'})`);
  console.log(`📝 Default Seller ID: ${DEFAULT_SELLER_ID}`);
  console.log(`📝 Default Seller Name: ${DEFAULT_SELLER_NAME}`);
  console.log('─'.repeat(60));

  try {
    // Get all products
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      console.log('\n⚠️  No products found in Firestore');
      process.exit(0);
    }

    const totalProducts = snapshot.size;
    let processedCount = 0;
    let updatedCount = 0;

    console.log(`\n📊 Found ${totalProducts} product(s) to process\n`);

    // Process each product
    for (const doc of snapshot.docs) {
      processedCount++;
      const productId = doc.id;
      const productData = doc.data();

      console.log(`\n[${processedCount}/${totalProducts}] Product: ${productId}`);
      console.log(`   Current Name: ${productData.name || 'N/A'}`);

      // Build update data - only add missing fields
      const updateData = {};
      let hasChanges = false;

      // Add sellerId if missing
      if (!productData.sellerId) {
        updateData.sellerId = DEFAULT_SELLER_ID;
        console.log(`   ✓ Adding sellerId: ${DEFAULT_SELLER_ID}`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ sellerId already exists: ${productData.sellerId}`);
      }

      // Add sellerName if missing
      if (!productData.sellerName) {
        updateData.sellerName = DEFAULT_SELLER_NAME;
        console.log(`   ✓ Adding sellerName: ${DEFAULT_SELLER_NAME}`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ sellerName already exists: ${productData.sellerName}`);
      }

      // Add stock if missing
      if (productData.stock === undefined) {
        updateData.stock = 0;
        console.log(`   ✓ Adding stock: 0`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ stock already exists: ${productData.stock}`);
      }

      // Add isActive if missing (defaults to true)
      if (productData.isActive === undefined) {
        updateData.isActive = true;
        console.log(`   ✓ Adding isActive: true`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ isActive already exists: ${productData.isActive}`);
      }

      // Add isFeatured if missing (defaults to false)
      if (productData.isFeatured === undefined) {
        updateData.isFeatured = false;
        console.log(`   ✓ Adding isFeatured: false`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ isFeatured already exists: ${productData.isFeatured}`);
      }

      // Add createdAt if missing
      if (!productData.createdAt) {
        updateData.createdAt = new Date().toISOString();
        console.log(`   ✓ Adding createdAt: ${updateData.createdAt}`);
        hasChanges = true;
      } else {
        console.log(`   ⊘ createdAt already exists: ${productData.createdAt}`);
      }

      // Always add updatedAt
      updateData.updatedAt = new Date().toISOString();
      console.log(`   ✓ Adding/updating updatedAt: ${updateData.updatedAt}`);
      hasChanges = true;

      // Update document if there are changes
      if (hasChanges) {
        if (DRY_RUN) {
          console.log(`   📋 [DRY RUN] Would update with: ${JSON.stringify(updateData, null, 2)}`);
        } else {
          await productsRef.doc(productId).set(updateData, { merge: true });
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
    console.log(`   Total products processed: ${processedCount}`);
    console.log(`   Products with changes: ${updatedCount}`);
    console.log(`   Mode: ${DRY_RUN ? 'DRY_RUN (no changes made)' : 'LIVE (changes saved)'}`);

    if (DRY_RUN) {
      console.log(`\n💡 To apply these changes, set DRY_RUN = false in the script and run again`);
    } else {
      console.log(`\n✅ Products migration completed successfully!`);
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
migrateProducts();
