const mongoose = require("mongoose");

const yearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const Year = mongoose.model("Year", yearSchema);

module.exports = Year;
