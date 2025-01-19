const Appointment = require("../models/appointment.models");
const User = require("../models/user.model");

// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { user, service, date, time, price } = req.body;

    // Ensure the user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create the new appointment
    const appointment = new Appointment({
      user,
      service,
      date,
      time,
      price,
    });

    // Save the appointment to the database
    await appointment.save();

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// Get All Appointments (with optional filters)
exports.getAppointments = async (req, res) => {
  try {
    const { user, service, date } = req.query;

    // Build query dynamically
    const query = {};
    if (user) query.user = user;
    if (service) query.service = service;
    if (date) query.date = new Date(date);

    const appointments = await Appointment.find(query).populate(
      "user",
      "name email"
    );

    if (appointments.length === 0) {
      return res
        .status(200)
        .json({ message: "No appointments found", appointments: [] });
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// Get Appointments by User
exports.getAppointmentsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const appointments = await Appointment.find({ user: userId }).populate(
      "user",
      "name email"
    );

    if (appointments.length === 0) {
      return res
        .status(200)
        .json({ message: "No appointments found", appointments: [] });
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return res.status(500).json({
      message: "Error fetching user appointments",
      error: error.message,
    });
  }
};
// Edit Appointment
exports.editAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent invalid date modifications
    if (updates.date && new Date(updates.date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Appointment date must be in the future" });
    }

    const appointment = await Appointment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// Update Appointment Status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointment: newStatus } = req.body;

    // Validate appointment status
    const validStatuses = ["waiting", "currently in", "done"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { appointment: newStatus },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// Get All Appointments (Admin View)
exports.getAdminAllAppointments = async (req, res) => {
  try {
    const { date, userId, status } = req.query;

    const query = {};
    if (date) query.date = new Date(date);
    if (userId) query.user = userId;
    if (status) query.status = status;

    const appointments = await Appointment.find(query).populate(
      "user",
      "name email"
    );

    if (appointments.length === 0) {
      return res
        .status(200)
        .json({ message: "No appointments found", appointments: [] });
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
