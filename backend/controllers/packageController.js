const Package = require("../models/Package");
const uploadToImgBB = require("../utils/uploadToImgBB");
const slugify = require("slugify");

// =========================
// CREATE PACKAGE
// =========================
const createPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      includes,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images required",
      });
    }

    if (req.files.length > 6) {
      return res.status(400).json({
        success: false,
        message: "Max 6 images allowed",
      });
    }

    // upload images
    const uploadPromises = req.files.map((file) =>
      uploadToImgBB(file.buffer)
    );

    const images = await Promise.all(uploadPromises);

    // keywords
    let keywordsArray = [];

    if (metaKeywords) {
      keywordsArray =
        typeof metaKeywords === "string"
          ? metaKeywords.split(",").map((k) => k.trim())
          : metaKeywords;
    }

    // includes parse
    let parsedIncludes = {};

    if (includes) {
      parsedIncludes =
        typeof includes === "string"
          ? JSON.parse(includes)
          : includes;
    }

    // slug generate
    let baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (await Package.findOne({ seoSlug: slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const newPackage = await Package.create({
      name,
      description,
      price,
      duration,
      images,
      includes: parsedIncludes,
      metaTitle,
      metaDescription,
      metaKeywords: keywordsArray,
      seoSlug: slug,
    });

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// =========================
// UPDATE PACKAGE
// =========================
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findById(id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    let updatedImages = pkg.images || [];

    // upload new images
    if (req.files && req.files.length > 0) {
      if (req.files.length + updatedImages.length > 6) {
        return res.status(400).json({
          success: false,
          message: "Max 6 images allowed",
        });
      }

      const uploadPromises = req.files.map((file) =>
        uploadToImgBB(file.buffer)
      );

      const newImages = await Promise.all(uploadPromises);

      updatedImages = [...updatedImages, ...newImages];
    }

    const {
      name,
      description,
      price,
      duration,
      includes,
      metaTitle,
      metaDescription,
      metaKeywords,
      isActive,
    } = req.body;

    // keywords
    let keywordsArray = pkg.metaKeywords;

    if (metaKeywords) {
      keywordsArray =
        typeof metaKeywords === "string"
          ? metaKeywords.split(",").map((k) => k.trim())
          : metaKeywords;
    }

    // includes
    let parsedIncludes = pkg.includes;

    if (includes) {
      parsedIncludes =
        typeof includes === "string"
          ? JSON.parse(includes)
          : includes;
    }

    // slug update
    if (name && name !== pkg.name) {
      let baseSlug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });

      let slug = baseSlug;
      let count = 1;

      while (
        await Package.findOne({
          seoSlug: slug,
          _id: { $ne: pkg._id },
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }

      pkg.seoSlug = slug;
    }

    // update fields
    pkg.name = name ?? pkg.name;
    pkg.description = description ?? pkg.description;
    pkg.price = price ?? pkg.price;
    pkg.duration = duration ?? pkg.duration;
    pkg.includes = parsedIncludes;
    pkg.metaTitle = metaTitle ?? pkg.metaTitle;
    pkg.metaDescription =
      metaDescription ?? pkg.metaDescription;
    pkg.metaKeywords = keywordsArray;
    pkg.isActive = isActive ?? pkg.isActive;
    pkg.images = updatedImages;

    await pkg.save();

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      package: pkg,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// =========================
// GET ALL PACKAGES
// =========================
const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// =========================
// GET SINGLE PACKAGE
// =========================
const getSinglePackage = async (req, res) => {
  try {
    const { slug } = req.params;

    const pkg = await Package.findOne({
      seoSlug: slug,
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      package: pkg,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// =========================
// DELETE PACKAGE
// =========================
const deletepackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findById(id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    await Package.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  createPackage,
  updatePackage,
  getPackages,
  getSinglePackage,
  deletepackage,
};