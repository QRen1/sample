const Style = require("../models/styles.model"); // Assuming the model is in the models directory

// CREATE: Create a new style
exports.createStyle = async (req, res) => {
  try {
    const {
      headerImage,
      descriptions,
      logoImage,
      colors,
      mapsLink,
      contactNumber,
      email,
      instagram,
      facebook,
      aboutDescription,
    } = req.body;

    const newStyle = new Style({
      headerImage,
      descriptions,
      logoImage,
      colors,
      mapsLink,
      contactNumber,
      email,
      instagram,
      facebook,
      aboutDescription,
    });

    await newStyle.save();
    res.status(201).json({
      message: "Style created successfully!",
      style: newStyle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create style!",
      error: err.message,
    });
  }
};

// Controller to fetch all styles
exports.getAllStyles = async (req, res) => {
  try {
    const styles = await Style.find();
    res.status(200).json(styles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch styles", error: error.message });
  }
};

// Controller to fetch a single style by ID
exports.getStyleById = async (req, res) => {
  try {
    const style = await Style.findById(req.params.id);
    if (!style) {
      return res.status(404).json({ message: "Style not found" });
    }
    res.status(200).json(style);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch style", error: error.message });
  }
};

// UPDATE: Update a style by ID
exports.updateStyle = async (req, res) => {
  try {
    const {
      headerImage,
      descriptions,
      logoImage,
      colors,
      mapsLink,
      contactNumber,
      email,
      instagram,
      facebook,
      aboutDescription,
    } = req.body;

    // Find the style by ID and update it with the new data
    const updatedStyle = await Style.findByIdAndUpdate(
      req.params.id,
      {
        headerImage,
        descriptions,
        logoImage,
        colors,
        mapsLink,
        contactNumber,
        email,
        instagram,
        facebook,
        aboutDescription,
      },
      { new: true } // Return the updated style object
    );

    if (!updatedStyle) {
      return res.status(404).json({ message: "Style not found" });
    }

    res.status(200).json({
      message: "Style updated successfully!",
      style: updatedStyle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update style!",
      error: err.message,
    });
  }
};
