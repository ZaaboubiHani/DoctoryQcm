const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    years: {
      type: [
        {
          type: String,
          enum: ["Residency", "Fourth", "Fifth", "Sixth"],
          default: ["Residency"],
        },
      ],
    },
  },
  { versionKey: false, timestamps: true }
);

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
