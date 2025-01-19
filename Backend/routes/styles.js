const express = require("express");
const router = express.Router();
const styleController = require("../controller/styles"); // Update this path as needed

router.get("/get", styleController.getAllStyles);

// Route to fetch a single style by ID
router.get("/get/:id", styleController.getStyleById);

// Other routes (POST, PUT, DELETE)
router.post("/create", styleController.createStyle);
router.put("/update/:id", styleController.updateStyle); // Update route

module.exports = router;
