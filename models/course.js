const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
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

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
