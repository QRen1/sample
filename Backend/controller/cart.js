// controller/cartController.js
const User = require("../models/user.model");

// Get cart items for the logged-in user
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from the token
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.cart); // Return user's cart
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add item to the cart for the logged-in user
exports.addToCart = async (req, res) => {
  const { itemId } = req.body; // The item being added
  try {
    const userId = req.user.userId; // Get user ID from the token
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if item already exists in the cart
    const existingItem = user.cart.find(
      (item) => item.itemId.toString() === itemId
    );
    if (existingItem) {
      existingItem.quantity += 1; // Increment the quantity if item already in the cart
    } else {
      user.cart.push({ itemId, quantity: 1 }); // Add new item to the cart
    }

    await user.save();
    res.status(200).json(user.cart); // Return updated cart
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

// Remove item from the cart for the logged-in user
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.body; // The item to remove
  try {
    const userId = req.user.userId; // Get user ID from the token
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((item) => item.itemId.toString() !== itemId); // Remove item from the cart

    await user.save();
    res.status(200).json(user.cart); // Return updated cart
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};
