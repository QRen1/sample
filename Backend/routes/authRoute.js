// routes/authRoute.js
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth");
router.post("/register", authController.register);

// Public user registration
router.post("/register-public", authController.registerPublicUser);

// Check if email exists
router.get("/check-email", authController.checkEmailExists);

router.post("/login", authController.login);

module.exports = router;
