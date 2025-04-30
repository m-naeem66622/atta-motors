const bcrypt = require("bcrypt");
const User = require("../services/user.service");
const { throwError } = require("../utils/error.util");
const { imageCleanup } = require("../utils/imageCleanup.util");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private/User
 */
const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const projection = { password: 0, isDeleted: 0 };
        const user = await User.getUserById(userId, projection);

        if (user.status === "FAILED") {
            throwError(
                user.status,
                user.error.statusCode,
                user.error.message,
                user.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            data: user.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/profile
 * @access  Private/User
 */
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.getUserById(userId, { password: 1, avatar: 1 });

        if (user.status === "FAILED") {
            throwError(
                user.status,
                user.error.statusCode,
                user.error.message,
                user.error.identifier
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            req.body.oldPassword,
            user.data.password
        );

        if (!isPasswordCorrect) {
            throwError("FAILED", 401, "Incorrect Password", "0x001001");
        }

        const options = {
            new: true,
            fields: { password: 0, isDeleted: 0 },
        };
        const updatedUser = await User.updateUserById(
            userId,
            req.body,
            options
        );

        if (updatedUser.status === "FAILED") {
            throwError(
                updatedUser.status,
                updatedUser.error.statusCode,
                updatedUser.error.message,
                updatedUser.error.identifier
            );
        }

        if (updatedUser.data?.avatar !== user.data?.avatar) {
            // Delete old avatar
            imageCleanup(user.data.avatar);
        }

        res.status(200).json({
            status: "SUCCESS",
            data: updatedUser.data,
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------- ADMIN CONTROLLERS ----------------------------

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            joinedFrom,
            joinedTo,
            search,
        } = req.query;
        const filter = { isDeleted: false, role: "USER", ...restQuery };

        if (status) {
            filter.status = status;
        }

        if (joinedFrom || joinedTo) {
            filter.createdAt = {};
            if (joinedFrom) {
                filter.createdAt["$gte"] = new Date(joinedFrom);
            }
            if (joinedTo) {
                filter.createdAt["$lte"] = new Date(joinedTo);
            }
        }

        if (search) {
            filter.$or = [
                { _id: search },
                { username: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const projection = { password: 0, isDeleted: 0 };
        const count = await User.countUsers(filter);
        const users = await User.getUsers(filter, projection, page, limit);

        if (users.status === "FAILED") {
            throwError(
                users.status,
                users.error.statusCode,
                users.error.message,
                users.error.identifier
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
            data: users.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const projection = { password: 0, isDeleted: 0 };
        const user = await User.getUserById(userId, projection);

        if (user.status === "FAILED") {
            throwError(
                user.status,
                user.error.statusCode,
                user.error.message,
                user.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            data: user.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user
 * @route   PATCH /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.getUserById(userId, {
            _id: userId,
        });

        if (user.status === "FAILED") {
            throwError(
                user.status,
                user.error.statusCode,
                user.error.message,
                user.error.identifier
            );
        }

        const options = {
            new: true,
            fields: { password: 0, isDeleted: 0 },
        };
        const updatedUser = await User.updateUserById(
            userId,
            req.body, // only status and password
            options
        );

        if (updatedUser.status === "FAILED") {
            throwError(
                updatedUser.status,
                updatedUser.error.statusCode,
                updatedUser.error.message,
                updatedUser.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
            data: updatedUser.data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user profile
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const options = { new: true };
        const deletedUser = await User.deleteUserById(userId, options);

        if (deletedUser.status === "FAILED") {
            throwError(
                deletedUser.status,
                deletedUser.error.statusCode,
                deletedUser.error.message,
                deletedUser.error.identifier
            );
        }

        res.status(200).json({
            status: "SUCCESS",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
