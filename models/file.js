const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      get: (url) => {
        const baseUrl = process.env.BASE_URL;
        return baseUrl + url;
      },
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false, toJSON: { getters: true }, id: false }
);

const File = mongoose.models.File || mongoose.model("File", fileSchema);

module.exports = File;
