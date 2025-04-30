const User = require("../models/user.model");
const Vehicle = require("../models/vehicle.model");
const Maintenance = require("../services/maintenance.service");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Get admin dashboard overview statistics
 * @route   GET /api/admin/overview
 * @access  Private/Admin
 */
const getAdminOverview = async (req, res, next) => {
    try {
        // Get total vehicles count
        const totalVehiclesCount = await Vehicle.countDocuments({
            isDeleted: false,
        });

        // Get maintenance requests count (scheduled/pending)
        const maintenanceRequestsResult =
            await Maintenance.countMaintenanceAppointments({
                status: "Scheduled",
                isDeleted: false,
            });

        if (maintenanceRequestsResult.status === "FAILED") {
            throwError(
                maintenanceRequestsResult.status,
                maintenanceRequestsResult.error.statusCode,
                maintenanceRequestsResult.error.message,
                maintenanceRequestsResult.error.identifier
            );
        }

        // Get active users count
        const activeUsersCount = await User.countDocuments({
            active: true,
            isDeleted: false,
        });

        // Get pending approval maintenance requests
        const pendingApprovalsResult =
            await Maintenance.countMaintenanceAppointments({
                status: "Pending", // Assuming you have a "Pending" status for maintenance requests
                isDeleted: false,
            });

        if (pendingApprovalsResult.status === "FAILED") {
            throwError(
                pendingApprovalsResult.status,
                pendingApprovalsResult.error.statusCode,
                pendingApprovalsResult.error.message,
                pendingApprovalsResult.error.identifier
            );
        }

        // Get recent maintenance appointments (limit to 5)
        const recentAppointmentsResult =
            await Maintenance.getMaintenanceAppointments(
                { isDeleted: false },
                {},
                1,
                5,
                {
                    createdAt: -1,
                }
            );

        if (recentAppointmentsResult.status === "FAILED") {
            throwError(
                recentAppointmentsResult.status,
                recentAppointmentsResult.error.statusCode,
                recentAppointmentsResult.error.message,
                recentAppointmentsResult.error.identifier
            );
        }

        // Get recent vehicles (limit to 4)
        const recentVehicles = await Vehicle.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(4)
            .populate("owner", "name email");

        // Get recent users (limit to 4)
        const recentUsers = await User.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(4)
            .select("_id name email createdAt active");

        res.status(200).json({
            status: "SUCCESS",
            data: {
                totalVehicles: totalVehiclesCount,
                maintenanceRequests: maintenanceRequestsResult.data,
                activeUsers: activeUsersCount,
                pendingApprovals: pendingApprovalsResult.data,
                recentAppointments: recentAppointmentsResult.data,
                recentVehicles: recentVehicles,
                recentUsers: recentUsers,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminOverview,
};
