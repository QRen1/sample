const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    weeklyAvailability: {
      monday: {
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        },
        start: String,
        end: String,
      },
      tuesday: {
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        },
        start: String,
        end: String,
      },
      wednesday: {
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        },
        start: String,
        end: String,
      },
      thursday: {
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        },
        start: String,
        end: String,
      },
      friday: {
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        },
        start: String,
        end: String,
      },
      saturday: {
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        },
        start: String,
        end: String,
      },
      sunday: {
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        },
        start: String,
        end: String,
      },
    },
  },
  { timestamps: true }
);
const specificDateAvailabilitySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true }, // store the date as a Date type
    slots: {
      type: Map,
      of: {
        start: { type: String, required: true }, // start time as a string
        end: { type: String, required: true }, // end time as a string
        status: {
          type: String,
          enum: ["available", "unavailable"],
          required: true,
        }, // status of the slot
      },
      required: true,
    },
    availabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
      required: true,
    },
  },
  { timestamps: true }
);

const SpecificAvailability = mongoose.model(
  "SpecificAvailability",
  specificDateAvailabilitySchema
);
const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = SpecificAvailability;
module.exports = Availability;
