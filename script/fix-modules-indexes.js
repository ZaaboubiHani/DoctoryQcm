require('dotenv').config();
const mongoose = require('mongoose');
const Module = require('../models/module'); // adjust path if needed

async function fixGlobalIndexes() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Fetch all modules (sorted for stable order)
    const modules = await Module.find().sort({ createdAt: 1 });

    console.log(`📚 Found ${modules.length} modules`);

    // 3️⃣ Assign unique indexes globally (1, 2, 3, ...)
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const newIndex = i + 1;

      if (module.index !== newIndex) {
        await Module.updateOne(
          { _id: module._id },
          { $set: { index: newIndex } }
        );
        console.log(`   🔧 Updated ${module._id} index from ${module.index} → ${newIndex}`);
      }
    }

    // 4️⃣ Disconnect
    await mongoose.disconnect();
    console.log("✅ Done. All indexes globally unique.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

fixGlobalIndexes();
