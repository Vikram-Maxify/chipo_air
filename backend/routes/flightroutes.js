// ======================================================
// routes/flightRoutes.js
// ======================================================

const express = require("express");

const router = express.Router();

const {
  searchFlights,
  getSeatMap,
  bookFlight,
  getBookings,
  getSingleBooking,
} = require("../controllers/flightController");

// ============================================
// SEARCH FLIGHTS
// ============================================

router.get(
  "/search",
  searchFlights
);

// ============================================
// GET SEAT MAP
// ============================================

router.post(
  "/seat-map",
  getSeatMap
);

// ============================================
// BOOK FLIGHT
// ============================================

router.post(
  "/book",
  bookFlight
);

// ============================================
// BOOKINGS
// ============================================

router.get(
  "/bookings",
  getBookings
);

router.get(
  "/booking/:id",
  getSingleBooking
);

module.exports = router;