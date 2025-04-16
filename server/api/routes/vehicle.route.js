const express = require("express");
const router = express.Router();

const Controller = require("../controllers/vehicle.controller");
const validate = require("../middlewares/validateReq.middleware");
const VehicleValidation = require("../validators/vehicle.validator");
const CommonValidation = require("../validators/common.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");
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

// Create new vehicle listing
router.post(
    "/",
    authenticate,
    Authorize.isAdmin,
    uploadImages,
    validate(VehicleValidation.createVehicleSchema, "BODY"),
    Controller.createVehicle
);

// // Get current user's vehicle listings
// router.get("/user/me", Controller.getUserVehicles);

// // Get specific user's vehicle listings
// router.get(
//     "/user/:userId",
//     validate(CommonValidation.mogooseIdSchema, "PARAMS"),
//     Controller.getUserVehicles
// );

// Update vehicle listing
router.put(
    "/:id",
    authenticate,
    Authorize.isAdmin,
    uploadImages,
    validate(VehicleValidation.updateVehicleSchema, "BODY"),
    Controller.updateVehicle
);

// Delete vehicle listing
router.delete(
    "/:id",
    authenticate,
    Authorize.isAdmin,
    validate(CommonValidation.mogooseIdSchema, "PARAMS"),
    Controller.deleteVehicle
);

module.exports = router;
