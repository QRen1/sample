const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");

// Route to create a new category
router.post("/create", categoryController.createCategory);

// Route to get all categories
router.get("/get", categoryController.getAllCategories);

// Route to get a category by ID
router.get("/get/:id", categoryController.getCategoryById);

// Route to delete a category by ID
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
