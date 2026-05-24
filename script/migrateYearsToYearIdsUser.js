require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Year = require('../models/year');

async function migrateYears() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log("✅ Connected to MongoDB");

    // 1️⃣ Load all Year documents
    const years = await Year.find();
    console.log(`📚 Loaded ${years.length} Year documents`);

    // 2️⃣ Build a mapping from enum → yearId
    const enumToIdMap = {};
    for (const year of years) {
      const name = year.name.trim();

      if (name === "Résidanat" || name === "Residency") {
        enumToIdMap["Residency"] = year._id;
      } else if (name === "4e année" || name === "Fourth") {
        enumToIdMap["Fourth"] = year._id;
      } else if (name === "5e année" || name === "Fifth") {
        enumToIdMap["Fifth"] = year._id;
      } else if (name === "6e année" || name === "Sixth") {
        enumToIdMap["Sixth"] = year._id;
      } else if (name === "Constantine") {
        enumToIdMap["Constantine"] = year._id;
      }
    }

    console.log("🔗 Mapping:");
    console.log(enumToIdMap);

    // 3️⃣ Fetch all users
    const users = await User.find();
    console.log(`📦 Found ${users.length} users`);

    // 4️⃣ Update each user
    for (const user of users) {

      const newYearId = enumToIdMap[user.year];

      console.log(`🔧 Updating user: ${user.name}`);
      console.log(`   Old year: ${user.year}`);
      console.log(`   New yearId: ${newYearId}`);

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            yearId: newYearId,
          },

        }
      );
    }

    console.log("✅ Migration completed! All users now use yearIds.");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

migrateYears();
