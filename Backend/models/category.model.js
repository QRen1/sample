const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    serviceCategory: {
      type: String,
      required: true,
    },
    serviceDescription: {
      type: String,
      required: true,
      trim: true,
    },
    serviceFile: {
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

module.exports = mongoose.model("Category", categorySchema);
