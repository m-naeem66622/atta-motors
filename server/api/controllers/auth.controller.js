const bcrypt = require("bcrypt");
const User = require("../services/user.service");
const { throwError } = require("../utils/error.util");
const { isEmailOrUsername } = require("../utils/isEmailOrUsername.util");
const { generateToken } = require("../utils/jwt.util");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        const userExists = await User.checkUsernameAndEmailAvailability(
            username,
            email
        );

        if (userExists.status === "FAILED") {
            throwError(
                userExists.status,
                userExists.error.statusCode,
                userExists.error.message,
                userExists.error.identifier
            );
        }

        const newUser = await User.createUser(req.body);

        if (newUser.status === "FAILED") {
            throwError(
                newUser.status,
                newUser.error.statusCode,
                newUser.error.message,
                newUser.error.identifier
            );
        }

        const signedToken = await generateToken(newUser.data._id, "USER");

        // Soft delete properties
        newUser.data.password = undefined;
        newUser.data.isDeleted = undefined;

        res.status(201).json({
            status: "SUCCESS",
            data: newUser.data,
            tokens: { accessToken: signedToken },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    try {
        const { emailOrUsername, password } = req.body;

        const isEmailOrUsernameProvided = isEmailOrUsername(emailOrUsername);

        let userExists;
        const projection = { password: 1, role: 1 };
        if (isEmailOrUsernameProvided === "email") {
            userExists = await User.getUserByEmail(emailOrUsername, projection);
        } else {
            userExists = await User.getUserByUsername(
                emailOrUsername,
                projection
            );
        }

        if (userExists.status === "FAILED") {
            throwError(
                userExists.status,
                401,
                "Incorrect Credentials",
                userExists.error.identifier
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            userExists.data.password
        );

        if (!isPasswordCorrect) {
            throwError("FAILED", 401, "Incorrect Credentials", "0x001000");
        }

        const signedToken = await generateToken(
            userExists.data._id,
            userExists.data.role
        );

        const user = await User.getUserById(userExists.data._id, {
            password: 0,
            isDeleted: 0,
        });

        res.status(200).json({
            status: "SUCCESS",
            data: user.data,
            tokens: { accessToken: signedToken },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
};
