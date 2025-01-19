const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value >= new Date(),
      message: "Appointment date must be in the future",
    },
  },
  time: {
    type: String,
    required: true,
    match: [/^([0-9]{1,2}:[0-9]{2}\s?(AM|PM))$/, "Invalid time format"],
  },
  status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "unavailable",
  },
  appointment: {
    type: String,
    enum: ["waiting", "currently in", "done"],
    default: "waiting",
  },
  price: { type: Number, required: true, min: 0 },
});

appointmentSchema.index({ date: 1, time: 1, service: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
