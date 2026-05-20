const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createTestimonial,
  getAllTestimonials,
  getSingleTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");


// CREATE
router.post(
  "/create",
  upload.single("image"),
  createTestimonial
);


// GET ALL
router.get(
  "/all",
  getAllTestimonials
);


// GET SINGLE
router.get(
  "/:id",
  getSingleTestimonial
);


// UPDATE
router.put(
  "/update/:id",
  upload.single("image"),
  updateTestimonial
);


// DELETE
router.delete(
  "/delete/:id",
  deleteTestimonial
);

module.exports = router;