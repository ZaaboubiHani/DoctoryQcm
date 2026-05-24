require('dotenv').config();
const mongoose = require('mongoose');
const ResidencyQuestion = require('../models/residencyQuestion'); // adjust path if needed

async function fixGlobalIndexes() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Fetch all residencyQuestions (sorted for stable order)
    const residencyQuestions = await ResidencyQuestion.find().sort({ createdAt: 1 });

    console.log(`📚 Found ${residencyQuestions.length} residencyQuestions`);

    // 3️⃣ Assign unique indexes globally (1, 2, 3, ...)
    for (let i = 0; i < residencyQuestions.length; i++) {
      const residencyQuestion = residencyQuestions[i];
      const newIndex = i + 1;

      if (residencyQuestion.index !== newIndex) {
        await ResidencyQuestion.updateOne(
          { _id: residencyQuestion._id },
          { $set: { index: newIndex } }
        );
        console.log(`   🔧 Updated ${residencyQuestion._id} index from ${residencyQuestion.index} → ${newIndex}`);
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
