const Availability = require("../models/availabilit.model");
const SpecificAvailability = require("../models/availabilit.model"); // Import SpecificAvailability model

exports.getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({});

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    // Fetch specific date availability if needed
    const specificAvailability = await SpecificAvailability.find({
      availabilityId: availability._id,
    });

    res.status(200).json({
      availability,
      specificAvailability,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching availability",
      error: err.message,
    });
  }
};

// Save or update availability for a user
exports.saveAvailability = async (req, res) => {
  try {
    const { weeklyAvailability } = req.body;

    // Create or update availability
    const availability = await Availability.findOneAndUpdate(
      {}, // Empty condition to find the first document or create a new one
      { weeklyAvailability },
      { new: true, upsert: true } // upsert will create a new document if none exists
    );

    res.status(200).json({
      message: "Availability saved successfully",
      availability,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error saving availability",
      error: err.message,
    });
  }
};

// Update availability for a specific date
exports.updateSpecificAvailability = async (req, res) => {
  try {
    const { date, slots } = req.body;
    const availabilityId = req.params.id;

    // Check if the corresponding availability exists
    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    // Create or update specific availability
    const updatedSpecificAvailability =
      await SpecificAvailability.findOneAndUpdate(
        { date, availabilityId }, // Find specific availability by date and availabilityId
        { slots },
        { new: true, upsert: true } // upsert will create a new document if none exists
      );

    res.status(200).json({
      message: "Specific availability updated successfully",
      updatedSpecificAvailability,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating specific availability",
      error: err.message,
    });
  }
};

// Update weekly availability
exports.updateWeeklyAvailability = async (req, res) => {
  try {
    const { weeklyAvailability } = req.body;
    const availabilityId = req.params.id;

    const updatedAvailability = await Availability.findByIdAndUpdate(
      availabilityId,
      { weeklyAvailability },
      { new: true, runValidators: true }
    );

    if (!updatedAvailability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    return res.status(200).json(updatedAvailability);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};
