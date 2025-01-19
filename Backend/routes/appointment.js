const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointment");

// Create a new appointment
router.post("/post", appointmentController.createAppointment);
// Get all appointments (with optional filters)
router.get("/get", appointmentController.getAppointments);
// Get appointments by user ID
router.get("/get/:userId", appointmentController.getAppointmentsByUser);
// Admin: Get all appointments (admin-specific data)
router.get("/get/admin", appointmentController.getAdminAllAppointments);
// Update appointment status
router.put(
  "/:appointmentId/status",
  appointmentController.updateAppointmentStatus
);
// Edit an appointment
router.put("/:id", appointmentController.editAppointment);
// Delete an appointment
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
