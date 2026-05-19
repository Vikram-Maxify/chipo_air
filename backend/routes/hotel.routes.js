// ======================================================
// FILE: routes/hotel.routes.js
// ======================================================

const express = require("express");

const router = express.Router();

// ======================================================
// IMPORT CONTROLLERS
// ======================================================

const {
  searchHotels,
  getHotelRooms,
  createHotelQuote,
  bookHotel,
  getBookingDetails,
  cancelBooking,
} = require("../controllers/hotel.controller");

// ======================================================
// STEP 1 - SEARCH HOTELS
// ======================================================

router.post(
  "/search",
  searchHotels
);

// ======================================================
// STEP 2 - GET ROOM DETAILS / ROOM VIEW
// ======================================================

router.post(
  "/rooms/:searchResultId",
  getHotelRooms
);

// ======================================================
// STEP 3 - CREATE QUOTE
// ======================================================

router.post(
  "/create-quote",
  createHotelQuote
);

// ======================================================
// STEP 4 - BOOK HOTEL
// ======================================================

router.post(
  "/book",
  bookHotel
);

// ======================================================
// STEP 5 - GET BOOKING DETAILS
// ======================================================

router.get(
  "/booking/:bookingId",
  getBookingDetails
);

// ======================================================
// STEP 6 - CANCEL BOOKING
// ======================================================

router.post(
  "/cancel/:bookingId",
  cancelBooking
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;