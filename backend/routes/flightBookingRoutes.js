const express = require("express");

const router = express.Router();

const {
    bookFlight,
    getBookings,
    getSingleBooking,
    getSeatMap,
} = require("../controllers/flightBookingController");

// ✅ Create Booking
router.post("/book", bookFlight);

// ✅ Get All Bookings
router.get("/", getBookings);

// ✅ Get Single Booking
router.get("/:id", getSingleBooking);

router.post(
  "/seat-map",
 getSeatMap
);

module.exports = router;