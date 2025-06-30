const Joi = require("joi");
const { paginationSchema } = require("./common.validator");

const createVehicleSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        "string.empty": "Title is required",
        "any.required": "Title is required",
    }),
    make: Joi.string().trim().required().messages({
        "string.empty": "Make is required",
        "any.required": "Make is required",
    }),
    model: Joi.string().trim().required().messages({
        "string.empty": "Model is required",
        "any.required": "Model is required",
    }),
    year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear() + 1)
        .required()
        .messages({
            "number.base": "Year must be a number",
            "number.integer": "Year must be an integer",
            "number.min": "Year must be valid (1886 or later)",
            "number.max": "Year cannot be in the future",
            "any.required": "Year is required",
        }),
    price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required",
    }),
    description: Joi.string().trim().allow("").optional(),
    images: Joi.array().items(Joi.string().trim()).optional(),
    mileage: Joi.number().min(0).optional().messages({
        "number.base": "Mileage must be a number",
        "number.min": "Mileage cannot be negative",
    }),
    transmission: Joi.string().valid("Automatic", "Manual", "CVT").optional(),
    fuelType: Joi.string()
        .valid("Petrol", "Diesel", "Hybrid", "Electric", "CNG")
        .optional(),
    condition: Joi.string()
        .valid("New", "Like New", "Excellent", "Good", "Fair", "Salvage")
        .default("New"),
    interiorColor: Joi.string().trim().optional(),
    exteriorColor: Joi.string().trim().optional(),
    location: Joi.string().trim().optional(),
    contactPhone: Joi.string().trim().optional(),
    contactEmail: Joi.string().email().trim().optional(),
});

const updateVehicleSchema = Joi.object({
    title: Joi.string().trim().optional(),
    make: Joi.string().trim().optional(),
    model: Joi.string().trim().optional(),
    year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear() + 1)
        .optional(),
    price: Joi.number().min(0).optional(),
    description: Joi.string().trim().allow("").optional(),
    images: Joi.array().items(Joi.string().trim()).optional(),
    existingImages: Joi.array().items(Joi.string().trim()).optional(),
    mileage: Joi.number().min(0).optional(),
    transmission: Joi.string().valid("Automatic", "Manual", "CVT").optional(),
    fuelType: Joi.string()
        .valid("Petrol", "Diesel", "Hybrid", "Electric", "CNG")
        .optional(),
    condition: Joi.string()
        .valid("New", "Like New", "Excellent", "Good", "Fair", "Salvage")
        .optional(),
    interiorColor: Joi.string().trim().optional(),
    exteriorColor: Joi.string().trim().optional(),
    location: Joi.string().trim().optional(),
    contactPhone: Joi.string().trim().optional(),
    contactEmail: Joi.string().email().trim().optional(),
    status: Joi.string()
        .uppercase()
        .valid("ACTIVE", "SOLD", "PENDING", "DRAFT")
        .optional(),
});

const getVehiclesSchema = paginationSchema.keys({
    status: Joi.string()
        .uppercase()
        .valid("ACTIVE", "SOLD", "PENDING", "DRAFT")
        .default("ACTIVE"),
    sort: Joi.string(),
    search: Joi.string().trim().optional(),
    make: Joi.string().trim().optional(),
    model: Joi.string().trim().optional(),
    year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear() + 1)
        .optional(),
    min_price: Joi.number().min(0).optional(),
    max_price: Joi.number().min(0).optional(),
    mileage_min: Joi.number().min(0).optional(),
    mileage_max: Joi.number().min(0).optional(),
    min_year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear() + 1)
        .optional(),
    max_year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear() + 1)
        .optional(),
    fuelType: Joi.string().valid(
        "Petrol",
        "Diesel",
        "Hybrid",
        "Electric",
        "CNG"
    ),
});

module.exports = {
    createVehicleSchema,
    updateVehicleSchema,
    getVehiclesSchema,
};
