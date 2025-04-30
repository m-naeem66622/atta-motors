const express = require("express");
const router = express.Router();
const Controller = require("../controllers/admin.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

// All admin routes require authentication and admin authorization
router.use(authenticate);
router.use(Authorize.isAdmin);

// Admin dashboard overview
router.get("/overview", Controller.getAdminOverview);

module.exports = router;
