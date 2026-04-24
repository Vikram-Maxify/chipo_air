const Package = require("../models/Package");
const uploadToImgBB = require("../utils/uploadToImgBB");
const slugify = require("slugify");

// =========================
// CREATE PACKAGE (ADMIN)
// =========================
const createPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    if (req.files.length > 6) {
      return res.status(400).json({ message: "Max 6 images allowed" });
    }

    // Upload images
    const uploadPromises = req.files.map((file) =>
      uploadToImgBB(file.buffer)
    );
    const images = await Promise.all(uploadPromises);

    // keywords convert
    let keywordsArray = metaKeywords;
    if (typeof metaKeywords === "string") {
      keywordsArray = metaKeywords.split(",").map((k) => k.trim());
    }

    // ✅ slug generate
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
      metaTitle,
      metaDescription,
      metaKeywords: keywordsArray,
      seoSlug: slug,
    });

    res.status(201).json({
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// UPDATE PACKAGE (ADMIN)
// =========================
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findById(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    let updatedImages = pkg.images || [];

    // Upload new images
    if (req.files && req.files.length > 0) {
      if (req.files.length + updatedImages.length > 6) {
        return res.status(400).json({ message: "Max 6 images allowed" });
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
      metaTitle,
      metaDescription,
      metaKeywords,
      isActive,
    } = req.body;

    // keywords convert
    let keywordsArray = metaKeywords;
    if (typeof metaKeywords === "string") {
      keywordsArray = metaKeywords.split(",").map((k) => k.trim());
    }

    // ✅ SLUG AUTO UPDATE (IMPORTANT 🔥)
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
    pkg.metaTitle = metaTitle ?? pkg.metaTitle;
    pkg.metaDescription = metaDescription ?? pkg.metaDescription;
    pkg.metaKeywords = keywordsArray ?? pkg.metaKeywords;
    pkg.isActive = isActive ?? pkg.isActive;
    pkg.images = updatedImages;

    await pkg.save();

    res.json({
      message: "Package updated successfully",
      package: pkg,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =========================
// GET ALL PACKAGES (USER)
// =========================
const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// GET SINGLE PACKAGE
// =========================
const getSinglePackage = async (req, res) => {
  try {
    const { slug } = req.params;

    const pkg = await Package.findOne({ seoSlug: slug });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deletepackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findByIdAndDelete(id);
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createPackage,
  updatePackage,
  getPackages,
  getSinglePackage,
  deletepackage,

};