const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  },
  { versionKey: false, timestamps: true }
);

const Version = mongoose.model("Version", versionSchema);

module.exports = Version;
