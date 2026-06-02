const RecommendTrip = require("../models/recommendTripModel");
const uploadToImgBB = require("../utils/uploadToImgBB");


// CREATE TRIP
const createRecommendTrip = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      location,
      duration,
      price,
      rating,
    } = req.body;

    let image = "";

    if (req.file) {
      image = await uploadToImgBB(
        req.file.buffer
      );
    }

    const trip =
      await RecommendTrip.create({
        image,
        title,
        description,
        location,
        duration,
        price,
        rating,
      });

    res.status(201).json({
      success: true,
      message:
        "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL TRIPS
const getAllRecommendTrips =
  async (req, res) => {
    try {
      const trips =
        await RecommendTrip.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: trips.length,
        data: trips,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// GET SINGLE TRIP
const getSingleRecommendTrip =
  async (req, res) => {
    try {
      const trip =
        await RecommendTrip.findById(
          req.params.id
        );

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      res.status(200).json({
        success: true,
        data: trip,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// UPDATE TRIP
const updateRecommendTrip =
  async (req, res) => {
    try {
      const trip =
        await RecommendTrip.findById(
          req.params.id
        );

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      if (req.file) {
        trip.image =
          await uploadToImgBB(
            req.file.buffer
          );
      }

      if (
        req.body.title !== undefined
      ) {
        trip.title = req.body.title;
      }

      if (
        req.body.description !==
        undefined
      ) {
        trip.description =
          req.body.description;
      }

      if (
        req.body.location !==
        undefined
      ) {
        trip.location =
          req.body.location;
      }

      if (
        req.body.duration !==
        undefined
      ) {
        trip.duration =
          req.body.duration;
      }

      if (
        req.body.price !== undefined
      ) {
        trip.price = req.body.price;
      }

      if (
        req.body.rating !== undefined
      ) {
        trip.rating = req.body.rating;
      }

      if (
        req.body.isActive !==
        undefined
      ) {
        trip.isActive =
          req.body.isActive;
      }

      await trip.save();

      res.status(200).json({
        success: true,
        message:
          "Trip updated successfully",
        data: trip,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// DELETE TRIP
const deleteRecommendTrip =
  async (req, res) => {
    try {
      const trip =
        await RecommendTrip.findById(
          req.params.id
        );

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      await trip.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Trip deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  createRecommendTrip,
  getAllRecommendTrips,
  getSingleRecommendTrip,
  updateRecommendTrip,
  deleteRecommendTrip,
};