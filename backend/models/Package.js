const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: String, // e.g. "3 Days 2 Nights"
    },

    images: {
      type: [String], // ImgBB URLs
      validate: {
        validator: (val) => val.length <= 6,
        message: "Max 6 images allowed",
      },
    },

    // ✅ INCLUDED FEATURES
    includes: {
      flight: {
        type: Boolean,
        default: false,
      },

      hotel: {
        type: Boolean,
        default: false,
      },

      meal: {
        type: Boolean,
        default: false,
      },

      vehicle: {
        type: Boolean,
        default: false,
      },

      sightseeing: {
        type: Boolean,
        default: false,
      },

      airportTransfer: {
        type: Boolean,
        default: false,
      },

      guide: {
        type: Boolean,
        default: false,
      },

      insurance: {
        type: Boolean,
        default: false,
      },

      wifi: {
        type: Boolean,
        default: false,
      },

      breakfast: {
        type: Boolean,
        default: false,
      },

      dinner: {
        type: Boolean,
        default: false,
      },

      lunch: {
        type: Boolean,
        default: false,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 🔍 SEO FIELDS
    metaTitle: String,

    metaDescription: String,

    metaKeywords: [String],

    seoSlug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;