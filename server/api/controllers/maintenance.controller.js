const Maintenance = require("../services/maintenance.service");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Create a new maintenance appointment
 * @route   POST /api/maintenance
 * @access  Private/User
 */
const createMaintenanceAppointment = async (req, res, next) => {
    try {
        // Associate the maintenance with the authenticated user
        req.body.userId = req.user._id;

        // Create new maintenance appointment
        const result = await Maintenance.createMaintenanceAppointment(req.body);

        if (result.status === "FAILED") {
            throwError(
                result.status,
                result.error.statusCode,
                result.error.message,
                result.error.identifier
            );
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Maintenance appointment booked successfully",
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get maintenance appointment by ID
 * @route   GET /api/maintenance/:id
 * @access  Private/User
 */
const getMaintenanceById = async (req, res, next) => {
    try {
        const result = await Maintenance.getMaintenanceById(req.params.id);

        if (result.status === "FAILED") {
            throwError(
                result.status,
                result.error.statusCode,
                result.error.message,
                result.error.identifier
            );
        }

        // Check if user is authorized to view this maintenance
        if (
            result.data.userId.toString() !== req.user._id.toString() &&
            req.user.role !== "ADMIN"
        ) {
            throwError(
                "FAILED",
                403,
                "You are not authorized to access this maintenance record",
                "UNAUTHORIZED_ACCESS"
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get maintenance history for current user
 * @route   GET /api/maintenance/history
 * @access  Private/User
 */
const getMaintenanceHistory = async (req, res, next) => {
    try {
        const { status = "all", page = 1, limit = 10 } = req.query;

        // Filter for current user's maintenance records
        const filter = { userId: req.user._id };

        // Add status filter if not 'all'
        if (status !== "all") {
            filter.status = status;
        }

        const result = await Maintenance.getMaintenanceAppointments(
            filter,
            {}, // All fields
            parseInt(page),
            parseInt(limit)
        );

        if (result.status === "FAILED") {
            throwError(
                result.status,
                result.error.statusCode,
                result.error.message,
                result.error.identifier
            );
        }

        // Get total count
        const countResult = await Maintenance.countMaintenanceAppointments(
            filter
        );

        if (countResult.status === "FAILED") {
            throwError(
                countResult.status,
                countResult.error.statusCode,
                countResult.error.message,
                countResult.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            meta: {
                hasNextPage: page < Math.ceil(countResult.data / limit),
                hasPreviousPage: page > 1,
                itemCount: countResult.data,
                page: page,
                pageCount: Math.ceil(countResult.data / limit),
                limit,
            },
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update maintenance appointment
 * @route   PUT /api/maintenance/:id
 * @access  Private/User
 */
const updateMaintenance = async (req, res, next) => {
    try {
        // First, get the maintenance record
        const getResult = await Maintenance.getMaintenanceById(req.params.id);

        if (getResult.status === "FAILED") {
            throwError(
                getResult.status,
                getResult.error.statusCode,
                getResult.error.message,
                getResult.error.identifier
            );
        } // Check authorization
        if (req.user.role !== "ADMIN") {
            if (getResult.data.userId.toString() !== req.user._id.toString()) {
                throwError(
                    "FAILED",
                    403,
                    "You are not authorized to update this maintenance record",
                    "UNAUTHORIZED_UPDATE"
                );
            }

            // Regular users can only cancel their appointments
            if (req.body.status && req.body.status !== "Cancelled") {
                throwError(
                    "FAILED",
                    403,
                    "You can only cancel your appointments",
                    "UNAUTHORIZED_STATUS_CHANGE"
                );
            }
        }

        // Check if already completed
        if (
            getResult.data.status === "Completed" &&
            req.body.status === "Cancelled"
        ) {
            throwError(
                "FAILED",
                400,
                "Cannot cancel a completed maintenance appointment",
                "COMPLETED_CANCELLATION_ERROR"
            );
        }

        // Update the maintenance record
        const result = await Maintenance.updateMaintenance(
            req.params.id,
            req.body
        );

        if (result.status === "FAILED") {
            throwError(
                result.status,
                result.error.statusCode,
                result.error.message,
                result.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Maintenance appointment updated successfully",
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cancel maintenance appointment
 * @route   DELETE /api/maintenance/:id/cancel
 * @access  Private/User
 */
const cancelMaintenance = async (req, res, next) => {
    try {
        // First, get the maintenance record
        const getResult = await Maintenance.getMaintenanceById(req.params.id);

        if (getResult.status === "FAILED") {
            throwError(
                getResult.status,
                getResult.error.statusCode,
                getResult.error.message,
                getResult.error.identifier
            );
        }

        // Check authorization
        if (
            getResult.data.userId.toString() !== req.user._id.toString() &&
            req.user.role !== "ADMIN"
        ) {
            throwError(
                "FAILED",
                403,
                "You are not authorized to cancel this maintenance appointment",
                "UNAUTHORIZED_CANCELLATION"
            );
        }

        // Check if already completed
        if (getResult.data.status === "Completed") {
            throwError(
                "FAILED",
                400,
                "Cannot cancel a completed maintenance appointment",
                "COMPLETED_CANCELLATION_ERROR"
            );
        }

        // Cancel the maintenance record
        const result = await Maintenance.cancelMaintenance(req.params.id);

        if (result.status === "FAILED") {
            throwError(
                result.status,
                result.error.statusCode,
                result.error.message,
                result.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Maintenance appointment cancelled successfully",
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all maintenance appointments with filters (Admin only)
 * @route   GET /api/maintenance/admin/all
 * @access  Private/Admin
 */
const getAllMaintenanceAppointments = async (req, res, next) => {
    try {
        // Check if user is admin
        if (req.user.role !== "ADMIN") {
            throwError(
                "FAILED",
                403,
                "Access denied. Admin privileges required",
                "UNAUTHORIZED_ACCESS"
            );
        }

        const { status = "all", date, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter = {};

        // Add status filter if provided
        if (status && status !== "all") {
            filter.status = status;
        }

        // Add date filter if provided
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            filter.appointmentDate = { $gte: startDate, $lte: endDate };
        }

        // Get appointments with pagination
        const result = await Maintenance.getMaintenanceAppointments(
            filter,
            {},
            parseInt(page),
            parseInt(limit)
        );

        if (result.status === "FAILED") {
            throwError(
                result.status,
                result.error.statusCode,
                result.error.message,
                result.error.identifier
            );
        }

        // Get total count
        const countResult = await Maintenance.countMaintenanceAppointments(
            filter
        );

        if (countResult.status === "FAILED") {
            throwError(
                countResult.status,
                countResult.error.statusCode,
                countResult.error.message,
                countResult.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            meta: {
                hasNextPage: page < Math.ceil(countResult.data / limit),
                hasPreviousPage: page > 1,
                itemCount: countResult.data,
                page: page,
                pageCount: Math.ceil(countResult.data / limit),
                limit,
            },
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Check availability for appointment slots
 * @route   GET /api/maintenance/availability
 * @access  Public
 */
const checkAvailability = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            throwError(
                "FAILED",
                400,
                "Date parameter is required",
                "MISSING_DATE_PARAMETER"
            );
        }

        const result = await Maintenance.checkAppointmentAvailability(date);

        if (result.status === "FAILED") {
            throwError(
                result.status,
                result.error.statusCode,
                result.error.message,
                result.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMaintenanceAppointment,
    getMaintenanceById,
    getMaintenanceHistory,
    updateMaintenance,
    cancelMaintenance,
    getAllMaintenanceAppointments,
    checkAvailability,
};
