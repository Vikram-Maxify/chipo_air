const mongoose = require("mongoose");

const recommendTripSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 5,
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
  "RecommendTrip",
  recommendTripSchema
);