const mongoose = require("mongoose");

const styleSchema = new mongoose.Schema({
  headerImage: {
    url: { type: String, required: true },
    type: { type: String, required: true }, // Type of the image (e.g., "image/jpeg")
    size: { type: Number, required: true }, // Size of the image in bytes
    name: { type: String, required: true }, // Name of the image
  },
  logoImage: {
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    name: { type: String, required: true },
  },
  aboutDescription: [String],
  descriptions: [String],
  colors: [String],
  mapsLink: String,
  contactNumber: { type: String, required: true }, // Contact number
  email: { type: String, required: true }, // Email
  instagram: { type: String, required: false }, // Instagram link
  facebook: { type: String, required: false }, // Facebook link
});

const Style = mongoose.model("Style", styleSchema);
module.exports = Style;
