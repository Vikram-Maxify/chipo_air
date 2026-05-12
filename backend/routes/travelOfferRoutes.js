// routes/travelOfferRoutes.js

const express = require("express");

const router =
  express.Router();

const {
  createTravelOffer,
  getAllTravelOffers,
  getTravelOfferById,
  updateTravelOffer,
  deleteTravelOffer,
} = require(
  "../controllers/travelOfferController"
);

const upload = require("../middleware/upload");


// CREATE
router.post(
  "/create",
  upload.single("image"),
  createTravelOffer
);

// GET ALL
router.get(
  "/all",
  getAllTravelOffers
);

// GET SINGLE
router.get(
  "/:id",
  getTravelOfferById
);

// UPDATE
router.put(
  "/update/:id",
  updateTravelOffer
);

// DELETE
router.delete(
  "/delete/:id",
  deleteTravelOffer
);

module.exports = router;