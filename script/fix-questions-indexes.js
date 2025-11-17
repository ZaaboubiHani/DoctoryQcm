require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/question'); // adjust path if needed

async function fixGlobalIndexes() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Fetch all questions (sorted for stable order)
    const questions = await Question.find().sort({ createdAt: 1 });

    console.log(`📚 Found ${questions.length} questions`);

    // 3️⃣ Assign unique indexes globally (1, 2, 3, ...)
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const newIndex = i + 1;

      if (question.index !== newIndex) {
        await Question.updateOne(
          { _id: question._id },
          { $set: { index: newIndex } }
        );
        console.log(`   🔧 Updated ${question._id} index from ${question.index} → ${newIndex}`);
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
