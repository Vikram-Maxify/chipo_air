const TravelOffer = require("../models/TravelOffer");
const uploadToImgBB = require("../utils/uploadToImgBB");

// ================= CREATE OFFER =================

exports.createTravelOffer = async (req, res) => {
    try {
        let imageUrl = "";

        // ✅ Upload image to ImgBB
        if (req.file) {
            imageUrl = await uploadToImgBB(req.file.buffer);
        }

        const offer = await TravelOffer.create({
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            image: imageUrl,
            redirectUrl: req.body.redirectUrl,
            validTill: req.body.validTill,
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

// ================= UPDATE OFFER =================

exports.updateTravelOffer = async (req, res) => {
    try {
        const offer = await TravelOffer.findById(req.params.id);

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found",
            });
        }

        // ✅ New image upload
        if (req.file) {
            const imageUrl = await uploadToImgBB(
                req.file.buffer
            );

            offer.image = imageUrl;
        }

        // ✅ Direct update
        if (req.body.title !== undefined) {
            offer.title = req.body.title;
        }

        if (req.body.category !== undefined) {
            offer.category = req.body.category;
        }

        if (req.body.description !== undefined) {
            offer.description =
                req.body.description;
        }

        if (req.body.redirectUrl !== undefined) {
            offer.redirectUrl =
                req.body.redirectUrl;
        }

        if (req.body.validTill !== undefined) {
            offer.validTill =
                req.body.validTill;
        }

        await offer.save();

        return res.status(200).json({
            success: true,
            message:
                "Offer updated successfully",
            data: offer,
        });
    } catch (error) {
        console.log(
            "UPDATE OFFER ERROR =>",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update offer",
            error: error.message,
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