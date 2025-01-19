const Category = require("../models/category.model");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { serviceCategory, serviceDescription, serviceFile } = req.body;

    // Ensure serviceFile contains required fields
    if (
      !serviceFile ||
      !serviceFile.name ||
      !serviceFile.size ||
      !serviceFile.type ||
      !serviceFile.url
    ) {
      return res.status(400).json({ error: "Invalid serviceFile data" });
    }

    const category = new Category({
      serviceCategory,
      serviceDescription,
      serviceFile,
    });

    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ message: "Categories fetched successfully", categories });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category fetched successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category deleted successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
