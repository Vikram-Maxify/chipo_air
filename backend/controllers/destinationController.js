const Destination = require("../models/destinationModel");
const uploadToImgBB = require("../utils/uploadToImgBB");


// ==========================================
// CREATE DESTINATION
// ==========================================

const createDestination = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      cityName,
      countryName,
      startDate,
      endDate,
    } = req.body;

    let image = "";

    if (req.file) {
      image = await uploadToImgBB(req.file.path);
    }

    const destination = await Destination.create({
      image,
      name,
      description,
      price,
      cityName,
      countryName,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Destination created successfully",
      data: destination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL DESTINATIONS
// ==========================================

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SINGLE DESTINATION
// ==========================================

const getSingleDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE DESTINATION
// ==========================================

const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    // IMAGE UPDATE
    if (req.file) {
      const image = await uploadToImgBB(req.file.path);
      destination.image = image;
    }

    // SINGLE FIELD UPDATE
    if (req.body.name !== undefined) {
      destination.name = req.body.name;
    }

    if (req.body.description !== undefined) {
      destination.description = req.body.description;
    }

    if (req.body.price !== undefined) {
      destination.price = req.body.price;
    }

    if (req.body.cityName !== undefined) {
      destination.cityName = req.body.cityName;
    }

    if (req.body.countryName !== undefined) {
      destination.countryName = req.body.countryName;
    }

    if (req.body.startDate !== undefined) {
      destination.startDate = req.body.startDate;
    }

    if (req.body.endDate !== undefined) {
      destination.endDate = req.body.endDate;
    }

    await destination.save();

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: destination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE DESTINATION
// ==========================================

const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    await destination.deleteOne();

    res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createDestination,
  getAllDestinations,
  getSingleDestination,
  updateDestination,
  deleteDestination,
};