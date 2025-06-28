const User = require("../models/user.model");
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
        const countResult =
            await Maintenance.countMaintenanceAppointments(filter);

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
 * @route   PATCH /api/maintenance/:id
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

        // // Check if already completed
        // if (
        //     getResult.data.status === "Completed" &&
        //     req.body.status === "Cancelled"
        // ) {
        //     throwError(
        //         "FAILED",
        //         400,
        //         "Cannot cancel a completed maintenance appointment",
        //         "COMPLETED_CANCELLATION_ERROR"
        //     );
        // }

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

        // // Check if already completed
        // if (getResult.data.status === "Completed") {
        //     throwError(
        //         "FAILED",
        //         400,
        //         "Cannot cancel a completed maintenance appointment",
        //         "COMPLETED_CANCELLATION_ERROR"
        //     );
        // }

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
        const {
            status = "all",
            dateFrom,
            dateTo,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        // Build filter
        const filter = {};

        // Add status filter if provided
        if (status && status !== "all") {
            filter.status = status;
        }

        // Add date range filter if provided
        if (dateFrom || dateTo) {
            filter.appointmentDate = {};
            if (dateFrom) {
                filter.appointmentDate.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter.appointmentDate.$lte = new Date(dateTo);
            }
        }

        // Add search term filter for vehicle, service, or customer
        if (search) {
            const regex = new RegExp(search, "i"); // Case-insensitive regex
            filter.$or = [
                { "vehicle.make": regex },
                { "vehicle.model": regex },
                { "vehicle.year": regex },
                { specificService: regex },
                { "customer.name": regex },
                { "customer.phone": regex },
                { "customer.email": regex },
            ];
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
        const countResult =
            await Maintenance.countMaintenanceAppointments(filter);

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

/**
 * @desc    Get admin dashboard overview statistics
 * @route   GET /api/maintenance/admin/overview
 * @access  Private/Admin
 */
const getAdminOverviewStats = async (req, res, next) => {
    try {
        // Get total maintenance appointments count
        const totalAppointmentsResult =
            await Maintenance.countMaintenanceAppointments({});

        // Get pending appointments count
        const pendingAppointmentsResult =
            await Maintenance.countMaintenanceAppointments({
                status: "Pending",
            });

        // Get today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppointmentsResult =
            await Maintenance.countMaintenanceAppointments({
                appointmentDate: { $gte: today, $lt: tomorrow },
            });

        // Get this week's appointments
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const weekAppointmentsResult =
            await Maintenance.countMaintenanceAppointments({
                appointmentDate: { $gte: startOfWeek, $lt: endOfWeek },
            });

        // Get recent appointments (limit to 5)
        const recentAppointmentsResult =
            await Maintenance.getMaintenanceAppointments({}, {}, 1, 5, {
                createdAt: -1,
            });

        // Collect all error statuses
        if (totalAppointmentsResult.status === "FAILED") {
            throwError(
                totalAppointmentsResult.status,
                totalAppointmentsResult.error.statusCode,
                totalAppointmentsResult.error.message,
                totalAppointmentsResult.error.identifier
            );
        }

        if (pendingAppointmentsResult.status === "FAILED") {
            throwError(
                pendingAppointmentsResult.status,
                pendingAppointmentsResult.error.statusCode,
                pendingAppointmentsResult.error.message,
                pendingAppointmentsResult.error.identifier
            );
        }

        if (todayAppointmentsResult.status === "FAILED") {
            throwError(
                todayAppointmentsResult.status,
                todayAppointmentsResult.error.statusCode,
                todayAppointmentsResult.error.message,
                todayAppointmentsResult.error.identifier
            );
        }

        if (weekAppointmentsResult.status === "FAILED") {
            throwError(
                weekAppointmentsResult.status,
                weekAppointmentsResult.error.statusCode,
                weekAppointmentsResult.error.message,
                weekAppointmentsResult.error.identifier
            );
        }

        if (recentAppointmentsResult.status === "FAILED") {
            throwError(
                recentAppointmentsResult.status,
                recentAppointmentsResult.error.statusCode,
                recentAppointmentsResult.error.message,
                recentAppointmentsResult.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            data: {
                totalAppointments: totalAppointmentsResult.data,
                pendingAppointments: pendingAppointmentsResult.data,
                todayAppointments: todayAppointmentsResult.data,
                weekAppointments: weekAppointmentsResult.data,
                recentAppointments: recentAppointmentsResult.data,
            },
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
    getAdminOverviewStats,
    checkAvailability,
};
