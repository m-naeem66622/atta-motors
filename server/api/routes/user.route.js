const express = require("express");
const router = express.Router();

const Controller = require("../controllers/user.controller");
const validate = require("../middlewares/validateReq.middleware");
const UserValidation = require("../validators/user.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");
const { uploadImage } = require("../middlewares/image.middleware");

// // Route for registering user
// router.post(
//   "/register",
//   uploadImage,
//   validate(Validation.registerSchema, "BODY"),
//   Controller.registerUser
// );

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

module.exports = router;
