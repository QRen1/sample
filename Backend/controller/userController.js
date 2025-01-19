const User = require("../models/user.model");

// userController.js
exports.getUserProfile = async (req, res) => {
  try {
    // Extract userId from the decoded JWT token
    const userId = req.user.userId;

    // Find the user in the database by userId (excluding the password field for security)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data to the client
    return res.status(200).json({
      userId: user._id, // Ensure userId is included in the response
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      createdOn: user.createdOn,
      cart: user.cart, // Optionally include cart data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile (e.g., fullName, email)
exports.updateUserProfile = async (req, res) => {
  const { fullName, email } = req.body;

  try {
    const userId = req.user.userId; // Get userId from JWT token (populated by authenticateToken middleware)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
