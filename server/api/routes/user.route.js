const express = require("express");
const router = express.Router();

const Controller = require("../controllers/user.controller");
const validate = require("../middlewares/validateReq.middleware");
const CommonValidation = require("../validators/common.validator");
const UserValidation = require("../validators/user.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");
const { uploadImage } = require("../middlewares/image.middleware");

// Route for getting user profile
router.get(
    "/profile",
    authenticate,
    Authorize.isUserOrAdmin,
    Controller.getUserProfile
);

// Route for updating user profile
router.patch(
    "/profile",
    authenticate,
    Authorize.isUserOrAdmin,
    uploadImage,
    validate(UserValidation.updateProfileSchema, "BODY"),
    Controller.updateUserProfile
);

router.get(
    "/",
    authenticate,
    Authorize.isAdmin,
    validate(UserValidation.getAllUsersSchema, "QUERY"),
    Controller.getUsers
);

router.get(
    "/:id",
    authenticate,
    Authorize.isAdmin,
    validate(CommonValidation.mongooseIdSchema, "PARAMS"),
    Controller.getUser
);

router.patch(
    "/:id",
    authenticate,
    Authorize.isAdmin,
    validate(CommonValidation.mongooseIdSchema, "PARAMS"),
    validate(UserValidation.updateUserSchema, "BODY"),
    Controller.updateUser
);

router.delete(
    "/:id",
    authenticate,
    Authorize.isAdmin,
    validate(CommonValidation.mongooseIdSchema, "PARAMS"),
    Controller.deleteUser
);

module.exports = router;
