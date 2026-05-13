// models/TravelOffer.js

const mongoose = require("mongoose");

const travelOfferSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: [String],
        required: true,
        default: [],
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      image: {
        type: String,
        required: true,
      },

      redirectUrl: {
        type: String,
      },

      validTill: {
        type: Date,
        required: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "TravelOffer",
  travelOfferSchema
);