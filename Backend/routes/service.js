const express = require("express");
const router = express.Router();
const serviceController = require("../controller/servicesUpload");

router.post("/create", serviceController.createService); // Route to create a new service
router.get("/getService", serviceController.getAllServices); // Route to get all services
router.get("/:id", serviceController.getServiceById); // Route to get a service by ID
router.delete("/:id", serviceController.deleteService); // Route to delete a service by ID
router.put("/:id", serviceController.updateService); // Route to update a service by ID

module.exports = router;
