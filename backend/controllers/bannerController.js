const Banner = require("../models/Banner");
const uploadToImgBB = require("../utils/uploadToImgBB");

// =========================
// CREATE BANNER (IMGBB)
// =========================
const createBanner = async (req, res) => {
  try {
    const { title, description, link, isActive } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    if (req.files.length > 6) {
      return res.status(400).json({ message: "Max 6 images allowed" });
    }

    // Upload all images to imgbb
    const imageUploadPromises = req.files.map((file) =>
      uploadToImgBB(file.buffer)
    );

    const images = await Promise.all(imageUploadPromises);

    const banner = await Banner.create({
      title,
      description,
      images,
      link,
      isActive,
    });

    res.status(201).json({
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// ADMIN: UPDATE BANNER
// =========================
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.images && req.body.images.length > 6) {
      return res.status(400).json({
        message: "Max 6 images allowed",
      });
    }

    const banner = await Banner.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// ADMIN: DELETE BANNER
// =========================
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// ADMIN: GET ALL BANNERS
// =========================
const getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// USER: GET ACTIVE BANNERS
// =========================
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBannersAdmin,
  getActiveBanners,
};