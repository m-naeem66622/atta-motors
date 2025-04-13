const Vehicle = require("../models/vehicle.model");
const { throwError } = require("../utils/error.util");

// CreateVehicle
const createVehicle = async (vehicle) => {
    try {
        const newVehicle = await Vehicle.create(vehicle);

        if (newVehicle) {
            return {
                status: "SUCCESS",
                data: newVehicle,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 422,
                    identifier: "0x000B00",
                    message: "Failed to create Vehicle",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "0x000B01");
    }
};

// CountVehicles
const countVehicles = async (filter) => {
    try {
        const count = await Vehicle.countDocuments(filter);

        return {
            status: "SUCCESS",
            data: count,
        };
    } catch (error) {
        throwError("FAILED", 422, error.message, "0x000B10");
    }
};

// GetVehicles
const getVehicles = async (filter, projection, page, limit) => {
    try {
        const vehicles = await Vehicle.find(filter, projection, {
            skip: (page - 1) * limit,
            limit: limit,
        });

        if (vehicles && vehicles.length) {
            return {
                status: "SUCCESS",
                data: vehicles,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "0x000B02",
                    message: "Vehicles not found",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "0x000B03");
    }
};

// GetVehicleById
const getVehicleById = async (vehicleId, projection) => {
    try {
        const vehicle = await Vehicle.findOne(
            { _id: vehicleId, isDeleted: false },
            projection
        );

        if (vehicle) {
            return {
                status: "SUCCESS",
                data: vehicle,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "0x000B04",
                    message: "Vehicle not found",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "0x000B05");
    }
};

// GetVehiclesByUsername
const getVehiclesByUsername = async (username, projection) => {
    try {
        const vehicles = await Vehicle.find(
            { username, isDeleted: false },
            projection
        );

        if (vehicles) {
            return {
                status: "SUCCESS",
                data: vehicles,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "0x000B06",
                    message: "Vehicle not found",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "0x000B07");
    }
};

// UpdateVehicleById
const updateVehicleById = async (vehicleId, update, options = {}) => {
    try {
        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { _id: vehicleId, isDeleted: false },
            update,
            options
        );

        if (updatedVehicle) {
            return {
                status: "SUCCESS",
                data: updatedVehicle,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "0x000B0A",
                    message: "Vehicle not found",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "0x000B0B");
    }
};

// DeleteVehicleById
const deleteVehicleById = async (vehicleId, options = {}) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: vehicleId, isDeleted: false },
            {
                $set: { isDeleted: true },
            },
            options
        );

        if (vehicle.isDeleted) {
            return {
                status: "SUCCESS",
                data: vehicle,
            };
        } else {
            return {
                status: "FAILED",
                error: {
                    statusCode: 404,
                    identifier: "0x000B0C",
                    message: "Vehicle not found",
                },
            };
        }
    } catch (error) {
        throwError("FAILED", 422, error.message, "0x000B0D");
    }
};

module.exports = {
    createVehicle,
    countVehicles,
    getVehicles,
    getVehicleById,
    getVehiclesByUsername,
    updateVehicleById,
    deleteVehicleById,
};
