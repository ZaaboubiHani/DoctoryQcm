require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/course');
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

    // 3️⃣ Fetch all courses
    const courses = await Course.find();
    console.log(`📦 Found ${courses.length} courses`);

    // 4️⃣ Update each course
    for (const course of courses) {
      const newYearIds = [];

      // course.years is like ["Residency", "Fourth", "Fifth"]
      for (const enumYear of course.years || []) {
        const id = enumToIdMap[enumYear];
        if (id) {
          newYearIds.push(id);
        }
      }

      console.log(`🔧 Updating course: ${course.name}`);
      console.log(`   Old years: ${course.years}`);
      console.log(`   New yearIds: ${newYearIds}`);

      await Course.updateOne(
        { _id: course._id },
        {
          $set: {
            yearIds: newYearIds,
          },
         
        }
      );
    }

    console.log("✅ Migration completed! All courses now use yearIds.");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

migrateYears();
