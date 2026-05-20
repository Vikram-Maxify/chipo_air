const Testimonial = require("../models/testimonialModel");
const uploadToImgBB = require("../utils/uploadToImgBB");


// ==========================================
// CREATE TESTIMONIAL
// ==========================================

const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      category,
      rating,
      reviewMessage,
    } = req.body;

    let image = "";

    if (req.file) {
      image = await uploadToImgBB(req.file.buffer);
    }

    const testimonial = await Testimonial.create({
      image,
      name,
      category,
      rating,
      reviewMessage,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL TESTIMONIALS
// ==========================================

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SINGLE TESTIMONIAL
// ==========================================

const getSingleTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE TESTIMONIAL
// ==========================================

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // IMAGE UPDATE
    if (req.file) {
      const image = await uploadToImgBB(req.file.buffer);
      testimonial.image = image;
    }

    // SINGLE FIELD UPDATE
    if (req.body.name !== undefined) {
      testimonial.name = req.body.name;
    }

    if (req.body.category !== undefined) {
      testimonial.category = req.body.category;
    }

    if (req.body.rating !== undefined) {
      testimonial.rating = req.body.rating;
    }

    if (req.body.reviewMessage !== undefined) {
      testimonial.reviewMessage =
        req.body.reviewMessage;
    }

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE TESTIMONIAL
// ==========================================

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getSingleTestimonial,
  updateTestimonial,
  deleteTestimonial,
};