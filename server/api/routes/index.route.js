const express = require("express");
const router = express.Router();

// Import your route handlers
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const vehicleRoutes = require("./vehicle.route");
const maintenanceRoutes = require("./maintenance.route");

// Mount the route handlers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/maintenance", maintenanceRoutes);

module.exports = router;
