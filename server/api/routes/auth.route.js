const express = require("express");
const router = express.Router();

const Controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validateReq.middleware");
const UserValidation = require("../validators/user.validator");
const { uploadImage } = require("../middlewares/image.middleware");

// Route for logging in user
router.post(
  "/login",
  validate(UserValidation.loginSchema, "BODY"),
  Controller.loginUser
);

// Route for registering user
router.post(
  "/register",
  uploadImage,
  validate(UserValidation.registerSchema, "BODY"),
  Controller.registerUser
);

module.exports = router;
