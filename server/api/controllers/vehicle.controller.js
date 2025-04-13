const Vehicle = require("../services/vehicle.service");
const { throwError } = require("../utils/error.util");
const { imageCleanup } = require("../utils/imageCleanup.util");

/**
 * @desc    Create a new vehicle listing
 * @route   POST /api/vehicles
 * @access  Private/User
 */
const createVehicle = async (req, res, next) => {
    try {
        // Associate the vehicle with the authenticated user
        req.body.owner = req.user._id;

        // Create new vehicle document
        const newVehicle = await Vehicle.createVehicle(req.body);

        if (newVehicle.status === "FAILED") {
            throwError(
                newVehicle.status,
                newVehicle.error.statusCode,
                newVehicle.error.message,
                newVehicle.error.identifier
            );
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Vehicle listing created successfully",
            data: newVehicle.data,
        });
    } catch (error) {
        // If there was an error and images were uploaded, clean them up
        if (req.body.images && req.body.images.length > 0) {
            await imageCleanup(req.body.images);
        }

        next(error);
    }
};

/**
 * @desc    Get all vehicle listings
 * @route   GET /api/vehicles
 * @access  Public
 */
const getVehicles = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            status = "ACTIVE",
            ...restQuery
        } = req.query;
        const filter = { isDeleted: false, ...restQuery };
        const projection = { isDeleted: 0 };
        const count = await Vehicle.countVehicles(filter);
        const vehicles = await Vehicle.getVehicles(
            filter,
            projection,
            parseInt(page),
            parseInt(limit)
        );

        if (vehicles.status === "FAILED") {
            throwError(
                vehicles.status,
                vehicles.error.statusCode,
                vehicles.error.message,
                vehicles.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            meta: {
                hasNextPage: page < Math.ceil(count.data / limit),
                hasPreviousPage: page > 1,
                itemCount: count.data,
                page: page,
                pageCount: Math.ceil(count.data / limit),
                limit,
            },
            data: vehicles.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a vehicle listing by ID
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
const getVehicleById = async (req, res, next) => {
    try {
        const vehicleId = req.params.id;

        const projection = { isDeleted: 0 };
        const vehicle = await Vehicle.getVehicleById(vehicleId, projection);

        if (vehicle.status === "FAILED") {
            throwError(
                vehicle.status,
                vehicle.error.statusCode,
                vehicle.error.message,
                vehicle.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Vehicle retrieved successfully",
            data: vehicle.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a vehicle listing
 * @route   PATCH /api/vehicles/:id
 * @access  Private/User
 */
const updateVehicle = async (req, res, next) => {
    try {
        const vehicleId = req.params.id;

        const existingVehicle = await Vehicle.getVehicleById(vehicleId);

        if (existingVehicle.status === "FAILED") {
            throwError(
                existingVehicle.status,
                existingVehicle.error.statusCode,
                existingVehicle.error.message,
                existingVehicle.error.identifier
            );
        }

        // Check if the user is the owner of the vehicle
        if (existingVehicle.data.owner.toString() !== req.user._id) {
            throwError(
                "FAILED",
                403,
                "You are not authorized to update this vehicle listing",
                "0x000B08"
            );
        }

        const options = { new: true, fields: { isDeleted: 0 } };
        const updatedVehicle = await Vehicle.updateVehicleById(
            vehicleId,
            req.body,
            options
        );

        if (updatedVehicle.status === "FAILED") {
            throwError(
                updatedVehicle.status,
                updatedVehicle.error.statusCode,
                updatedVehicle.error.message,
                updatedVehicle.error.identifier
            );
        }

        // If images are being updated, clean up old ones
        if (req.body?.images && existingVehicle.images.length > 0) {
            const imagesToRemove = existingVehicle.images.filter(
                (img) => !req.body.images.includes(img)
            );
            if (imagesToRemove.length > 0) {
                await imageCleanup(imagesToRemove);
            }
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Vehicle updated successfully",
            data: updatedVehicle.data,
        });
    } catch (error) {
        // If there was an error and images were uploaded, clean them up
        if (req.body.images && req.body.images.length > 0) {
            await imageCleanup(req.body.images);
        }

        next(error);
    }
};

/**
 * @desc    Delete a vehicle listing
 * @route   DELETE /api/vehicles/:id
 * @access  Private/User
 */
const deleteVehicle = async (req, res, next) => {
    try {
        const vehicleId = req.params.id;

        const existingVehicle = await Vehicle.getVehicleById(vehicleId);
        if (existingVehicle.status === "FAILED") {
            throwError(
                existingVehicle.status,
                existingVehicle.error.statusCode,
                existingVehicle.error.message,
                existingVehicle.error.identifier
            );
        }

        // Check if the user is the owner of the vehicle
        if (existingVehicle.data.owner.toString() !== req.user._id) {
            throwError(
                "FAILED",
                403,
                "You are not authorized to delete this vehicle listing",
                "0x000B09"
            );
        }

        const options = { new: true };
        const deletedVehicle = await Vehicle.deleteVehicleById(
            vehicleId,
            options
        );

        // Clean up images
        if (
            deletedVehicle.data.images &&
            deletedVehicle.data.images.length > 0
        ) {
            await imageCleanup(deletedVehicle.data.images);
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Vehicle deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all vehicles for a specific user or the authenticated user
 * @route   GET /api/vehicles/user/:userId or /api/vehicles/user/me
 * @access  Private/User
 */
const getUserVehicles = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id;

        const { page = 1, limit = 20, ...restQuery } = req.query;
        const filter = {
            isDeleted: false,
            owner: userId,
            status: "active",
            ...restQuery,
        };
        const projection = { isDeleted: 0 };
        const count = await Vehicle.countVehicles(filter);
        const vehicles = await Vehicle.getVehicles(
            filter,
            projection,
            parseInt(page),
            parseInt(limit)
        );

        if (vehicles.status === "FAILED") {
            throwError(
                vehicles.status,
                vehicles.error.statusCode,
                vehicles.error.message,
                vehicles.error.identifier
            );
        }

        return res.status(200).json({
            status: "SUCCESS",
            meta: {
                hasNextPage: page < Math.ceil(count.data / limit),
                hasPreviousPage: page > 1,
                itemCount: count.data,
                page: page,
                pageCount: Math.ceil(count.data / limit),
                limit,
            },
            data: vehicles.data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getUserVehicles,
};
