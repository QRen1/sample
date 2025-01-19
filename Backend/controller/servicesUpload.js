const Service = require("../models/service.model");

exports.createService = async (req, res) => {
  try {
    const {
      serviceName,
      serviceDescription,
      servicePrice,
      serviceCategory,
      serviceFile,
    } = req.body;

    // Validate fields
    if (
      !serviceName ||
      !serviceDescription ||
      !servicePrice ||
      !serviceCategory ||
      !serviceFile
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new service document
    const newService = new Service({
      serviceName,
      serviceDescription,
      servicePrice,
      serviceCategory,
      serviceFile: {
        name: serviceFile.name,
        size: serviceFile.size,
        type: serviceFile.type,
        url: serviceFile.url, // Ensure the frontend provides the file URL after upload
      },
    });

    // Save the document to the database
    await newService.save();

    return res.status(201).json({
      message: "Service created successfully!",
      service: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      message: "Error creating service",
      error: error.message,
    });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({
      success: true,
      services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: err.message,
    });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(200).json({
      success: true,
      service,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: err.message,
    });
  }
};

// Delete a service by ID
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: err.message,
    });
  }
};

// Update a service by ID
exports.updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: err.message,
    });
  }
};
