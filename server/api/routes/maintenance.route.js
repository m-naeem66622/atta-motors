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
    validate(CommonValidation.mogooseIdSchema, "PARAMS"),
    Controller.getMaintenanceById
);

// Update maintenance appointment
router.put(
    "/:id",
    validate(CommonValidation.mogooseIdSchema, "PARAMS"),
    validate(MaintenanceValidation.updateMaintenanceSchema, "BODY"),
    Controller.updateMaintenance
);

// Cancel maintenance appointment
router.delete(
    "/:id/cancel",
    validate(CommonValidation.mogooseIdSchema, "PARAMS"),
    Controller.cancelMaintenance
);

// Admin routes - get all maintenance appointments
router.get(
    "/admin/all",
    validate(MaintenanceValidation.maintenanceFilterSchema, "QUERY"),
    Controller.getAllMaintenanceAppointments
);

module.exports = router;
