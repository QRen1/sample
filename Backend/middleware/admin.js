// auth.js (middleware)
const jwt = require("jsonwebtoken");
const Staff = require("../models/admin.model");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ message: "No authentication token found" });
  }

  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    console.log("Decoded Token:", decoded); // Inspect the decoded token

    // If the token has 'id' instead of '_id', search by 'id'
    const user = await Staff.findById(decoded.id); // Change to 'id' if that's the field in the token

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next handler or route
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authenticateUser;
