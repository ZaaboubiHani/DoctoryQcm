require('dotenv').config();
const mongoose = require('mongoose');
const Module = require('../models/module');
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

    // 3️⃣ Fetch all modules
    const modules = await Module.find();
    console.log(`📦 Found ${modules.length} modules`);

    // 4️⃣ Update each module
    for (const module of modules) {
      const newYearIds = [];

      // module.years is like ["Residency", "Fourth", "Fifth"]
      for (const enumYear of module.years || []) {
        const id = enumToIdMap[enumYear];
        if (id) {
          newYearIds.push(id);
        }
      }

      console.log(`🔧 Updating module: ${module.name}`);
      console.log(`   Old years: ${module.years}`);
      console.log(`   New yearIds: ${newYearIds}`);

      await Module.updateOne(
        { _id: module._id },
        {
          $set: {
            yearIds: newYearIds,
          },
         
        }
      );
    }

    console.log("✅ Migration completed! All modules now use yearIds.");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

migrateYears();
