const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createDestination,
  getAllDestinations,
  getSingleDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");


// CREATE
router.post(
  "/create",
  upload.single("image"),
  createDestination
);


// GET ALL
router.get(
  "/all",
  getAllDestinations
);


// GET SINGLE
router.get(
  "/:id",
  getSingleDestination
);


// UPDATE
router.put(
  "/update/:id",
  upload.single("image"),
  updateDestination
);


// DELETE
router.delete(
  "/delete/:id",
  deleteDestination
);

module.exports = router;