const Joi = require("joi");
const { paginationSchema } = require("./common.validator");

const registerSchema = Joi.object({
    avatar: Joi.string().trim(),
    username: Joi.string()
        .max(30)
        .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/))
        .required(),
    name: Joi.string().trim().uppercase().required(),
    phone: Joi.string().trim().required(),
    email: Joi.string()
        .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
        .required(),
    address: Joi.string().trim(),
    password: Joi.string().required(),
});

const loginSchema = Joi.object({
    emailOrUsername: Joi.string().trim().lowercase().required(),
    password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
    avatar: Joi.string().trim(),
    name: Joi.string().trim().uppercase(),
    phone: Joi.string().trim().required(),
    address: Joi.string().trim(),
    password: Joi.string().optional(),
    oldPassword: Joi.string()
        .when("password", {
            is: Joi.exist(),
            then: Joi.invalid(Joi.ref("password")),
        })
        .messages({
            "any.invalid": "password and oldPassword must not be same",
        }),
});

const getAllUsersSchema = paginationSchema.keys({
    status: Joi.string().valid("Active", "Inactive", "Suspended").optional(),
    joinedFrom: Joi.date().optional(),
    joinedTo: Joi.date().optional(),
    search: Joi.string().optional(),
});

const updateUserSchema = Joi.object({
    status: Joi.string()
        .valid("Active", "Inactive", "Suspended")
        .default("Active")
        .optional(),
    password: Joi.string().optional(),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    getAllUsersSchema,
    updateUserSchema,
};
