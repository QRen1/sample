require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointment");
const staffRoutes = require("./routes/staff");
const serviceRoutes = require("./routes/service");
const stylesRoutes = require("./routes/styles");
const categoriesRoutes = require("./routes/categories");
const availabilitiesRoutes = require("./routes/availability");
const crypto = require("crypto");
require("crypto").randomBytes(64).toString("hex");
const secret = crypto.randomBytes(64).toString("hex");

console.log("Generated Refresh Token Secret:", secret);
const { verifyToken } = require("./middleware/auth"); // Import middleware

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*", // or "*" for all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure "Authorization" is listed
  })
);

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes); // Handle cart-related routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/styles", stylesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/availabilities", availabilitiesRoutes);
app.listen(8000, () => {
  console.log("Server running on port 8000");
});

module.exports = app;
