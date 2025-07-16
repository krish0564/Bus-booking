const express = require("express");
const router = express.Router();
const protectRoutes = require("../middleware/protectedRoutes");
const authorizeAdmin = require("../middleware/AutharizeAdmin");
const adminController = require("../controllers/AdminController");

router.post("/bus", protectRoutes, authorizeAdmin, adminController.createBus);
router.post(
  "/route",
  protectRoutes,
  authorizeAdmin,
  adminController.createRoute
);
router.post(
  "/departure",
  protectRoutes,
  authorizeAdmin,
  adminController.createDeparture
);

module.exports = router;
