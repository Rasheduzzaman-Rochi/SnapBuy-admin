/**
 * Firebase Firestore Products Stock Update Script
 * 
 * This script updates products with stock = 0 to random values between 2-10.
 * 
 * IMPORTANT INSTRUCTIONS:
 * 1. serviceAccountKey.json should already be in place from previous migration
 * 
 * 2. Set DRY_RUN = true to preview changes WITHOUT modifying Firestore
 *    Set DRY_RUN = false to actually update Firestore
 * 
 * 3. Run the script with: npm run update:stock
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// ============================================
// CONFIGURATION - CHANGE THESE VALUES
// ============================================

// SET TO FALSE TO ACTUALLY UPDATE FIRESTORE
const DRY_RUN = false;

// ============================================
// HELPER FUNCTIONS
// ============================================

function getRandomStock() {
  return Math.floor(Math.random() * 9) + 2; // Random between 2-10
}

// ============================================
// INITIALIZATION
// ============================================

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found at project root');
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

async function updateProductStock() {
  console.log('\n📦 Starting Product Stock Update...');
  console.log(`🔍 Mode: ${DRY_RUN ? 'DRY_RUN (preview only)' : '⚠️  LIVE (updating Firestore)'})`);
  console.log('─'.repeat(60));

  try {
    // Get all products with stock = 0
    const productsRef = db.collection('products');
    const snapshot = await productsRef.where('stock', '==', 0).get();

    if (snapshot.empty) {
      console.log('\n✓ No products with stock = 0 found');
      await admin.app().delete();
      process.exit(0);
    }

    const totalProducts = snapshot.size;
    let updatedCount = 0;

    console.log(`\n📊 Found ${totalProducts} product(s) with stock = 0\n`);

    // Process each product
    for (const doc of snapshot.docs) {
      updatedCount++;
      const productId = doc.id;
      const productData = doc.data();
      const newStock = getRandomStock();

      console.log(`[${updatedCount}/${totalProducts}] Product: ${productData.name || productId}`);
      console.log(`   Current Stock: 0 → New Stock: ${newStock}`);

      if (DRY_RUN) {
        console.log(`   📋 [DRY RUN] Would update stock to: ${newStock}`);
      } else {
        await productsRef.doc(productId).update({
          stock: newStock,
          updatedAt: new Date().toISOString()
        });
        console.log(`   ✅ Updated in Firestore`);
      }
    }

    // Summary
    console.log('\n' + '─'.repeat(60));
    console.log(`\n📊 Stock Update Summary:`);
    console.log(`   Total products updated: ${updatedCount}`);
    console.log(`   Mode: ${DRY_RUN ? 'DRY_RUN (no changes made)' : 'LIVE (changes saved)'}`);

    if (DRY_RUN) {
      console.log(`\n💡 To apply these changes, set DRY_RUN = false and run again`);
    } else {
      console.log(`\n✅ Stock update completed successfully!`);
    }

    console.log();
    await admin.app().delete();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
    console.error(error);
    await admin.app().delete();
    process.exit(1);
  }
}

// Run update
updateProductStock();
