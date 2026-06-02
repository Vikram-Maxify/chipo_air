const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createRecommendTrip,
  getAllRecommendTrips,
  getSingleRecommendTrip,
  updateRecommendTrip,
  deleteRecommendTrip,
} = require("../controllers/recommendTripController");

router.post(
  "/create",
  upload.single("image"),
  createRecommendTrip
);

router.get(
  "/all",
  getAllRecommendTrips
);

router.get(
  "/:id",
  getSingleRecommendTrip
);

router.put(
  "/update/:id",
  upload.single("image"),
  updateRecommendTrip
);

router.delete(
  "/delete/:id",
  deleteRecommendTrip
);

module.exports = router;