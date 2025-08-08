const mongoose = require("mongoose");

const residencyQuestionSchema = new mongoose.Schema(
  {
    residency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "residency",
      },
      text: {
        type: String,
        required: true,
      },
      choices: [
        {
          letter: {
            type: String,
            enum: ["A", "B", "C", "D", "E", "F","G","H"],
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
        },
      ],
      
  },
  { versionKey: false, timestamps: true }
);

const ResidencyQuestion = mongoose.model("ResidencyQuestion", residencyQuestionSchema);

module.exports = ResidencyQuestion;
