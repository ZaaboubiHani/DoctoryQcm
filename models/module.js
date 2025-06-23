const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    years: {
      type: [
        {
          type: String,
          enum: ["Residency", "Fourth", "Fifth", "Sixth", "Constantine"],
          default: ["Residency"],
        },
      ],
    },
  },
  { versionKey: false, timestamps: true }
);

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
