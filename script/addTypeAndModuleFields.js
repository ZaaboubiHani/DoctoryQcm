require('dotenv').config();
const mongoose = require('mongoose');
const Residency = require('../models/residency'); // adjust path if needed

async function addTypeAndModuleFields() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // Update all residencies that don't have a type field or have no type set
    const result = await Residency.updateMany(
      { 
        $or: [
          { type: { $exists: false } },  // type field doesn't exist
          { type: null },                // type field is null
          { type: "" }                   // type field is empty string
        ]
      },
      { 
        $set: { type: "exam" }          // set type to "exam"
      }
    );

    console.log(`📊 Migration Results:`);
    console.log(`   - Matched: ${result.matchedCount} documents`);
    console.log(`   - Modified: ${result.modifiedCount} documents`);

    // Verify all documents now have type field
    const withoutType = await Residency.countDocuments({ type: { $exists: false } });
    const nullType = await Residency.countDocuments({ type: null });
    const emptyType = await Residency.countDocuments({ type: "" });
    const examType = await Residency.countDocuments({ type: "exam" });

    console.log(`\n📈 Final State:`);
    console.log(`   - Without type field: ${withoutType}`);
    console.log(`   - Null type: ${nullType}`);
    console.log(`   - Empty type: ${emptyType}`);
    console.log(`   - Type "exam": ${examType}`);

    // Disconnect
    await mongoose.disconnect();
    console.log("\n✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

addTypeAndModuleFields();