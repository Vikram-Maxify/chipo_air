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