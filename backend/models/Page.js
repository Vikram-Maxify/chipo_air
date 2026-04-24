const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["about", "privacy"],
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    // ✅ SEO FIELDS
    metaTitle: {
      type: String,
    },

    metaDescription: {
      type: String,
    },

    metaKeywords: {
      type: [String], // 👈 array of keywords
    },

    seoSlug: {
      type: String,
    },
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;