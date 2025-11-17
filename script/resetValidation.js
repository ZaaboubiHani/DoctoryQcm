require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user'); // adjust path if needed

async function resetValidation() {
  try {
    // 1️⃣ Connect using the same connection setup as your app
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'doctoryQcm',
    });
    console.log('✅ Connected to MongoDB');

    // 2️⃣ Update all users
    const result = await User.updateMany({}, { $set: { isValidated: false } });
    console.log(`🔄 Updated ${result.modifiedCount} users — all set to isValidated: false`);

    // 3️⃣ Disconnect
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetValidation();
