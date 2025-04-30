const express = require("express");
const router = express.Router();
const Controller = require("../controllers/maintenance.controller");
const validate = require("../middlewares/validateReq.middleware");
const MaintenanceValidation = require("../validators/maintenance.validator");
const CommonValidation = require("../validators/common.validator");
const authenticate = require("../middlewares/authenticate.middleware");

// Public routes
router.get(
    "/availability",
    validate(MaintenanceValidation.availabilityCheckSchema, "QUERY"),
    Controller.checkAvailability
);

// Protected routes - require authentication
router.use(authenticate);

// Create maintenance appointment
router.post(
    "/",
    validate(MaintenanceValidation.createMaintenanceSchema, "BODY"),
    Controller.createMaintenanceAppointment
);

// Get maintenance history for current user
router.get(
    "/history",
    validate(MaintenanceValidation.maintenanceFilterSchema, "QUERY"),
    Controller.getMaintenanceHistory
);

// Get maintenance appointment by ID
router.get(
    "/:id",
    validate(CommonValidation.mongooseIdSchema, "PARAMS"),
    Controller.getMaintenanceById
);

// Update maintenance appointment
router.patch(
    "/:id",
    validate(CommonValidation.mongooseIdSchema, "PARAMS"),
    validate(MaintenanceValidation.updateMaintenanceSchema, "BODY"),
    Controller.updateMaintenance
);

// Cancel maintenance appointment
router.delete(
    "/:id/cancel",
    validate(CommonValidation.mongooseIdSchema, "PARAMS"),
    Controller.cancelMaintenance
);

// Admin routes - get all maintenance appointments
router.get(
    "/admin/all",
    validate(MaintenanceValidation.maintenanceFilterSchema, "QUERY"),
    Controller.getAllMaintenanceAppointments
);

// Admin routes - get overview statistics
router.get("/admin/overview", Controller.getAdminOverviewStats);

module.exports = router;
