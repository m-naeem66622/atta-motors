const express = require("express");
const router = express.Router();

const Controller = require("../controllers/vehicle.controller");
const validate = require("../middlewares/validateReq.middleware");
const VehicleValidation = require("../validators/vehicle.validator");
const CommonValidation = require("../validators/common.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const { uploadImages } = require("../middlewares/image.middleware");

// Public routes
router.get(
    "/",
    validate(CommonValidation.paginationSchema, "QUERY"),
    Controller.getVehicles
);
router.get(
    "/:id",
    validate(CommonValidation.mogooseIdSchema, "PARAMS"),
    Controller.getVehicleById
);

// Protected routes - require authentication
router.use(authenticate);

// Create new vehicle listing
router.post(
    "/",
    authenticate,
    uploadImages,
    validate(VehicleValidation.createVehicleSchema, "BODY"),
    Controller.createVehicle
);

// Get current user's vehicle listings
router.get("/user/me", Controller.getUserVehicles);

// Get specific user's vehicle listings
router.get(
    "/user/:userId",
    validate(CommonValidation.mogooseIdSchema, "PARAMS"),
    Controller.getUserVehicles
);

// Update vehicle listing
router.put(
    "/:id",
    uploadImages,
    validate(VehicleValidation.updateVehicleSchema, "BODY"),
    Controller.updateVehicle
);

// Delete vehicle listing
router.delete(
    "/:id",
    validate(CommonValidation.mogooseIdSchema, "PARAMS"),
    Controller.deleteVehicle
);

module.exports = router;
