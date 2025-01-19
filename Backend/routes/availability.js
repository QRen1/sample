const express = require("express");
const router = express.Router();
const availabilitController = require("../controller/availability");

// Route to get availability (both weekly and specific)
router.get("/availability/get", availabilitController.getAvailability);

// Route to save or update weekly availability
router.post("/availability", availabilitController.saveAvailability);

// Route to update specific availability (by specific date)
router.put(
  "/availability/specific/:id",
  availabilitController.updateSpecificAvailability
);

// Route to update weekly availability
router.put("/availability/:id", availabilitController.updateWeeklyAvailability);

module.exports = router;
