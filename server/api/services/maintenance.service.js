const Maintenance = require("../models/maintenance.model");
const { throwError } = require("../utils/error.util");

// CreateMaintenanceAppointment
const createMaintenanceAppointment = async (maintenance) => {
    try {
        const newMaintenance = await Maintenance.create(maintenance);

        if (newMaintenance) {
            return {
                status: "SUCCESS",
                data: newMaintenance,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 422,
                    identifier: "MAINTENANCE_CREATION_FAILED",
                    message: "Failed to create maintenance appointment",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "MAINTENANCE_CREATION_ERROR");
    }
};

// CountMaintenanceAppointments
const countMaintenanceAppointments = async (filter) => {
    try {
        const count = await Maintenance.countDocuments(filter);

        return {
            status: "SUCCESS",
            data: count,
        };
    } catch (error) {
        throwError("FAILED", 422, error.message, "MAINTENANCE_COUNT_ERROR");
    }
};

// GetMaintenanceAppointments
const getMaintenanceAppointments = async (filter, projection, page, limit) => {
    try {
        const appointments = await Maintenance.find(filter, projection, {
            skip: (page - 1) * limit,
            limit: limit,
        }).sort({ appointmentDate: -1, appointmentTime: -1 });

        if (appointments && appointments.length) {
            return {
                status: "SUCCESS",
                data: appointments,
            };
        } else {
            return {
                status: "SUCCESS",
                data: [],
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "MAINTENANCE_FETCH_ERROR");
    }
};

// GetMaintenanceById
const getMaintenanceById = async (id) => {
    try {
        const maintenance = await Maintenance.findById(id);

        if (maintenance) {
            return {
                status: "SUCCESS",
                data: maintenance,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "MAINTENANCE_NOT_FOUND",
                    message: "Maintenance appointment not found",
                },
            };
        }
    } catch (error) {
        throwError(
            "FAILED",
            422,
            error.message,
            "MAINTENANCE_FETCH_BY_ID_ERROR"
        );
    }
};

// UpdateMaintenance
const updateMaintenance = async (id, updateData) => {
    try {
        const maintenance = await Maintenance.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (maintenance) {
            return {
                status: "SUCCESS",
                data: maintenance,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "MAINTENANCE_UPDATE_FAILED",
                    message: "Failed to update maintenance appointment",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "MAINTENANCE_UPDATE_ERROR");
    }
};

// CancelMaintenance
const cancelMaintenance = async (id) => {
    try {
        const maintenance = await Maintenance.findByIdAndUpdate(
            id,
            { status: "Cancelled" },
            { new: true }
        );

        if (maintenance) {
            return {
                status: "SUCCESS",
                data: maintenance,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "MAINTENANCE_CANCELLATION_FAILED",
                    message: "Failed to cancel maintenance appointment",
                },
            };
        }
    } catch (error) {
        throwError(
            "FAILED",
            422,
            error.message,
            "MAINTENANCE_CANCELLATION_ERROR"
        );
    }
};

// CheckAppointmentAvailability
const checkAppointmentAvailability = async (date) => {
    try {
        // Parse the requested date with proper timezone handling
        // First get the date parts (year, month, day)
        const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
        
        // Create dates using UTC to avoid timezone issues
        const requestedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        
        const nextDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);

        // Get all appointments for the requested date
        const appointments = await Maintenance.find({
            appointmentDate: { $gte: requestedDate, $lt: nextDay },
            status: "Scheduled",
        }).select("appointmentTime");

        // Generate availability data
        const timeSlots = {
            morning: [
                { time: "08:00 AM", available: true },
                { time: "09:00 AM", available: true },
                { time: "10:00 AM", available: true },
                { time: "11:00 AM", available: true },
            ],
            afternoon: [
                { time: "12:00 PM", available: true },
                { time: "01:00 PM", available: true },
                { time: "02:00 PM", available: true },
                { time: "03:00 PM", available: true },
            ],
            evening: [
                { time: "04:00 PM", available: true },
                { time: "05:00 PM", available: true },
                { time: "06:00 PM", available: true },
                { time: "07:00 PM", available: true },
            ],
        };

        // Mark booked slots as unavailable
        appointments.forEach((apt) => {
            // Find the time slot in our timeSlots object and mark it as unavailable
            for (const period in timeSlots) {
                const slot = timeSlots[period].find(
                    (s) => s.time === apt.appointmentTime
                );
                if (slot) slot.available = false;
            }
        });

        return {
            status: "SUCCESS",
            data: {
                date: requestedDate.toISOString().split("T")[0],
                availability: timeSlots,
            },
        };
    } catch (error) {
        throwError("FAILED", 422, error.message, "AVAILABILITY_CHECK_ERROR");
    }
};

module.exports = {
    createMaintenanceAppointment,
    countMaintenanceAppointments,
    getMaintenanceAppointments,
    getMaintenanceById,
    updateMaintenance,
    cancelMaintenance,
    checkAppointmentAvailability,
};
