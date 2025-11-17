require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/course'); // adjust path if needed

async function fixGlobalIndexes() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Fetch all courses (sorted for stable order)
    const courses = await Course.find().sort({ createdAt: 1 });

    console.log(`📚 Found ${courses.length} courses`);

    // 3️⃣ Assign unique indexes globally (1, 2, 3, ...)
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const newIndex = i + 1;

      if (course.index !== newIndex) {
        await Course.updateOne(
          { _id: course._id },
          { $set: { index: newIndex } }
        );
        console.log(`   🔧 Updated ${course._id} index from ${course.index} → ${newIndex}`);
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
