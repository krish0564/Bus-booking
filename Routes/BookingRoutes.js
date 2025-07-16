const express = require("express");
const router = express.Router();
const {
  reserveSeats,
  cancelBooking,
  getBookingById,
} = require("../controllers/BookingController");
const protectedRoutes = require("../middleware/protectedRoutes");

router.post("/reserve", protectedRoutes, reserveSeats);
router.post("/cancel/:booking_id", protectedRoutes, cancelBooking);
router.get("/:booking_id", protectedRoutes, getBookingById);

module.exports = router;
