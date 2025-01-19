const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    aboutDescription: {
      type: String,
      required: true,
    },
    socialLink: {
      type: String,
      required: true,
    },
    aboutFile: {
      name: { type: String, required: true }, // File name
      size: { type: Number, required: true }, // File size in bytes
      type: { type: String, required: true }, // MIME type
      url: { type: String, required: true }, // Cloud storage URL or path
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("About", aboutSchema);
