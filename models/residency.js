const mongoose = require("mongoose");

const residencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    index: {
      type: Number,
    },
    type: {
      type: String,
      enum: ["exam", "module"],
      default: "exam",
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  },
  { versionKey: false, timestamps: true }
);

const Residency = mongoose.model("Residency", residencySchema);

module.exports = Residency;