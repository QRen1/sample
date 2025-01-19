// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth"); // Ensure the user is authenticated
const cartController = require("../controller/cart");

// Get the logged-in user's cart data
router.get("/", verifyToken, cartController.getCartItems);

// Add an item to the cart
router.post("/", verifyToken, cartController.addToCart);

// Remove an item from the cart
router.delete("/", verifyToken, cartController.removeFromCart);

module.exports = router;
