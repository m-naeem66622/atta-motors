const Joi = require("joi");

const createMaintenanceSchema = Joi.object({
    maintenanceType: Joi.string()
        .valid(
            "routine",
            "mechanical",
            "electrical",
            "computerized",
            "denting",
            "painting"
        )
        .required()
        .messages({
            "any.required": "Maintenance type is required",
            "string.base": "Maintenance type must be a string",
            "any.only": "Invalid maintenance type",
        }),
    specificService: Joi.string().required().messages({
        "any.required": "Specific service is required",
        "string.base": "Specific service must be a string",
    }),
    appointmentDate: Joi.date().iso().required().messages({
        "any.required": "Appointment date is required",
        "date.format": "Invalid appointment date format",
    }),
    appointmentTime: Joi.string().required().messages({
        "any.required": "Appointment time is required",
        "string.base": "Appointment time must be a string",
    }),
    vehicle: Joi.object({
        make: Joi.string().required().messages({
            "any.required": "Vehicle make is required",
            "string.base": "Vehicle make must be a string",
        }),
        model: Joi.string().required().messages({
            "any.required": "Vehicle model is required",
            "string.base": "Vehicle model must be a string",
        }),
        year: Joi.string().required().messages({
            "any.required": "Vehicle year is required",
            "string.base": "Vehicle year must be a string",
        }),
        registration: Joi.string().required().messages({
            "any.required": "Vehicle registration is required",
            "string.base": "Vehicle registration must be a string",
        }),
    }).required(),
    customer: Joi.object({
        name: Joi.string().required().messages({
            "any.required": "Customer name is required",
            "string.base": "Customer name must be a string",
        }),
        email: Joi.string().email().required().messages({
            "any.required": "Customer email is required",
            "string.email": "Invalid email format",
        }),
        phone: Joi.string().required().messages({
            "any.required": "Customer phone is required",
            "string.base": "Customer phone must be a string",
        }),
    }).required(),
    additionalNotes: Joi.string().allow("").optional().messages({
        "string.base": "Additional notes must be a string",
    }),
});

const updateMaintenanceSchema = Joi.object({
    status: Joi.string().valid("Scheduled", "Completed", "Cancelled").messages({
        "any.only": "Invalid status value",
    }),
    technician: Joi.string().allow(null).messages({
        "string.base": "Technician must be a string",
    }),
    cost: Joi.string().allow(null).messages({
        "string.base": "Cost must be a string",
    }),
    notes: Joi.string().allow("").messages({
        "string.base": "Notes must be a string",
    }),
    additionalNotes: Joi.string().allow("").messages({
        "string.base": "Additional notes must be a string",
    }),
}).min(1);

const maintenanceFilterSchema = Joi.object({
    status: Joi.string()
        .valid("all", "Scheduled", "Completed", "Cancelled")
        .default("all"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
});

const availabilityCheckSchema = Joi.object({
    date: Joi.date().iso().required().messages({
        "any.required": "Date parameter is required",
        "date.format": "Invalid date format",
    }),
});

module.exports = {
    createMaintenanceSchema,
    updateMaintenanceSchema,
    maintenanceFilterSchema,
    availabilityCheckSchema,
};
