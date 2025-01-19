const Staff = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/admin.model");

exports.register = async (req, res) => {
  const { fullName, email, password, status } = req.body;

  try {
    // Check if the staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res
        .status(400)
        .json({ message: "Staff with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new staff member
    const newStaff = new Staff({
      fullName,
      email,
      password: hashedPassword,
      status: status || "admin", // Default to "admin" if no status provided
    });

    await newStaff.save();

    // Generate a JWT
    const token = jwt.sign(
      { id: newStaff._id, status: newStaff.status },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Staff member registered successfully",
      staff: {
        id: newStaff._id,
        fullName: newStaff.fullName,
        email: newStaff.email,
        status: newStaff.status,
      },
      AdminToken: token, // Return the token as "AdminToken"
    });
  } catch (error) {
    console.error("Error during staff registration:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
// Staff login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the staff exists
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT (AdminToken)
    const token = jwt.sign(
      { id: staff._id, status: staff.status },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      AdminToken: token, // Send the token as AdminToken
      staff: {
        id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        status: staff.status,
      },
    });
  } catch (error) {
    console.error("Error during staff login:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID

    // Fetch the user profile from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      createdOn: user.createdOn,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const staff = await Staff.find(); // Fetch all staff members from the database
    res.status(200).json(staff); // Send the staff list in the response
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};
exports.deleteStaff = async (req, res) => {
  const { id } = req.params; // Get the staff ID from the request parameters

  try {
    // Check if the staff member exists
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Delete the staff member
    await Staff.findByIdAndDelete(id);

    res.status(200).json({
      message: "Staff member deleted successfully",
      deletedStaff: {
        id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        status: staff.status,
      },
    });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.updateStaff = async (req, res) => {
  const { id } = req.params; // Get the staff ID from the request parameters
  const { fullName, email, password, status } = req.body; // Get the fields to update from the request body

  try {
    // Find the staff member by ID
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Update the fields if they are provided
    if (fullName) staff.fullName = fullName;
    if (email) staff.email = email;
    if (password) {
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(password, 10);
      staff.password = hashedPassword;
    }
    if (status) staff.status = status;

    // Save the updated staff details
    const updatedStaff = await staff.save();

    res.status(200).json({
      message: "Staff member updated successfully",
      staff: {
        id: updatedStaff._id,
        fullName: updatedStaff.fullName,
        email: updatedStaff.email,
        status: updatedStaff.status,
      },
    });
  } catch (error) {
    console.error("Error updating staff member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
