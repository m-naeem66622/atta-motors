const Vehicle = require("../services/vehicle.service");
const { throwError } = require("../utils/error.util");
const { imageCleanup } = require("../utils/imageCleanup.util");

/**
 * @desc    Create a new vehicle listing
 * @route   POST /api/vehicles
 * @access  Private/Admin
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
 * @desc    Get all vehicle listings with advanced filtering, sorting, and searching
 * @route   GET /api/vehicles
 * @access  Public
 */
const getVehicles = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            status = "ACTIVE",
            sort,
            search,
            make,
            model,
            year,
            min_price,
            max_price,
            min_year,
            max_year,
            mileage_min,
            mileage_max,
            ...restQuery
        } = req.query;

        // Start with base filter
        const filter = { isDeleted: false, status };

        // Add search functionality
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { make: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } },
            ];
        }

        // Add specific filters
        if (make) filter.make = { $regex: make, $options: "i" };
        if (model) filter.model = { $regex: model, $options: "i" };
        if (year) filter.year = parseInt(year);
        if (min_year || max_year) {
            filter.year = {};
            if (min_year) filter.year.$gte = parseInt(min_year);
            if (max_year) filter.year.$lte = parseInt(max_year);
        }
        if (min_price || max_price) {
            filter.price = {};
            if (min_price) filter.price.$gte = parseInt(min_price);
            if (max_price) filter.price.$lte = parseInt(max_price);
        }
        if (mileage_min || mileage_max) {
            filter.mileage = {};
            if (mileage_min) filter.mileage.$gte = parseInt(mileage_min);
            if (mileage_max) filter.mileage.$lte = parseInt(mileage_max);
        }

        // Add remaining query params to filter
        Object.keys(restQuery).forEach((key) => {
            filter[key] = restQuery[key];
        });

        const projection = { isDeleted: 0 };

        // Prepare options with sorting
        const options = {
            populate: {
                path: "owner",
                select: "avatar name phone email createdAt",
            },
        };

        // Handle sorting
        if (sort) {
            // Parse sort parameter (e.g., "price:asc,createdAt:desc")
            const sortFields = sort.split(",").reduce((acc, field) => {
                const [key, direction] = field.split(":");
                acc[key] = direction === "desc" ? -1 : 1;
                return acc;
            }, {});

            options.sort = sortFields;
        } else {
            // Default sort by newest first
            options.sort = { createdAt: -1 };
        }

        const count = await Vehicle.countVehicles(filter);
        const vehicles = await Vehicle.getVehicles(
            filter,
            projection,
            parseInt(page),
            parseInt(limit),
            options
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
                page: parseInt(page),
                pageCount: Math.ceil(count.data / limit),
                limit: parseInt(limit),
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
        const options = {
            populate: {
                path: "owner",
                select: "avatar name phone email createdAt",
            },
        };
        const vehicle = await Vehicle.getVehicleById(
            vehicleId,
            projection,
            options
        );

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
 * @access  Private/Admin
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
 * @access  Private/Admin
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

module.exports = {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
