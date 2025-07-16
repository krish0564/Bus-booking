const express = require("express");
const router = express.Router();
const { getAvailableSeats } = require("../controllers/AvailabilityController");
const protectedRoutes = require("../middleware/protectedRoutes");

router.get("/", protectedRoutes, getAvailableSeats);

module.exports = router;
