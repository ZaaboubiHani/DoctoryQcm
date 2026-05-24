require('dotenv').config();
const mongoose = require('mongoose');
const Residency = require('../models/residency'); // adjust path if needed

async function fixGlobalIndexes() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Fetch all residencys (sorted for stable order)
    const residencys = await Residency.find().sort({ createdAt: 1 });

    console.log(`📚 Found ${residencys.length} residencys`);

    // 3️⃣ Assign unique indexes globally (1, 2, 3, ...)
    for (let i = 0; i < residencys.length; i++) {
      const residency = residencys[i];
      const newIndex = i + 1;

      if (residency.index !== newIndex) {
        await Residency.updateOne(
          { _id: residency._id },
          { $set: { index: newIndex } }
        );
        console.log(`   🔧 Updated ${residency._id} index from ${residency.index} → ${newIndex}`);
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
