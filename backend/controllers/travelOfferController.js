// controllers/travelOfferController.js

const TravelOffer = require("../models/TravelOffer");

// ================= CREATE OFFER =================

const uploadToImgBB = require("../utils/uploadToImgBB");

exports.createTravelOffer =
    async (req, res) => {
        try {
            let imageUrl = "";

            if (req.file) {
                imageUrl =
                    await uploadToImgBB(
                        req.file.buffer
                    );
            }

            const offer =
                await TravelOffer.create({
                    title: req.body.title,
                    category: req.body.category,
                    description:
                        req.body.description,
                    image: imageUrl,
                    redirectUrl:
                        req.body.redirectUrl,
                    validTill:
                        req.body.validTill,
                });

            return res.status(201).json({
                success: true,
                data: offer,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// ================= GET ALL OFFERS =================

exports.getAllTravelOffers =
    async (req, res) => {
        try {
            const offers =
                await TravelOffer.find({
                    isActive: true,
                }).sort({
                    createdAt: -1,
                });

            return res.status(200).json({
                success: true,
                count: offers.length,
                data: offers,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch offers",
                error: error.message,
            });
        }
    };

// ================= GET SINGLE OFFER =================

exports.getTravelOfferById =
    async (req, res) => {
        try {
            const offer =
                await TravelOffer.findById(
                    req.params.id
                );

            if (!offer) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Offer not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: offer,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch offer",
                error: error.message,
            });
        }
    };

// ================= UPDATE OFFER =================

exports.updateTravelOffer =
    async (req, res) => {
        try {
            const offer =
                await TravelOffer.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!offer) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Offer not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Offer updated successfully",
                data: offer,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to update offer",
                error: error.message,
            });
        }
    };

// ================= DELETE OFFER =================

exports.deleteTravelOffer =
    async (req, res) => {
        try {
            const offer =
                await TravelOffer.findByIdAndDelete(
                    req.params.id
                );

            if (!offer) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Offer not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Offer deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete offer",
                error: error.message,
            });
        }
    };