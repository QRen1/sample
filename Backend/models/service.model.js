const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },
    serviceDescription: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    servicePrice: {
      type: Number,
      required: [true, "Service price is required"],
      min: [0, "Price must be a positive value"],
    },
    serviceCategory: {
      type: String,
      required: [true, "Service category is required"],
    },
    serviceFile: {
      name: { type: String, required: false },
      size: { type: Number, required: false },
      type: { type: String, required: false },
      url: {
        type: String,
        required: false,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: (props) => `${props.value} is not a valid URL!`,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
