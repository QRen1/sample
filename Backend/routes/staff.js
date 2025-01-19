const express = require("express");
const router = express.Router();
const staffController = require("../controller/staff");
const authenticateUser = require("../middleware/admin");

// Public Routes
router.post("/register", staffController.register); // Register a new staff member
router.post("/login", staffController.login); // Login for staff members

// Protected Routes (require authentication)
router.get("/profile", authenticateUser, staffController.getProfile); // Get profile of authenticated user
router.get("/staff", authenticateUser, staffController.getAllUsers); // Get all staff members
router.put("/staff/:id", authenticateUser, staffController.updateStaff); // Update staff details
router.delete("/staff/:id", authenticateUser, staffController.deleteStaff); // Delete a staff member

module.exports = router;
