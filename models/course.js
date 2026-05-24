const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
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
    yearIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Year",
      }
    ],
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

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
