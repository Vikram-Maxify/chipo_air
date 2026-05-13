const Banner = require("../models/Banner");
const uploadToImgBB = require("../utils/uploadToImgBB");

// =========================
// CREATE BANNER (IMGBB)
// =========================
const createBanner = async (req, res) => {
  try {
    const { title, description, link, isActive } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images required",
      });
    }

    if (req.files.length > 6) {
      return res.status(400).json({
        success: false,
        message: "Maximum 6 images allowed",
      });
    }

    // ✅ Upload all images
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToImgBB(file.buffer))
    );

    const banner = await Banner.create({
      title,
      description,
      images: uploadedImages,
      link,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.log("BANNER CREATE ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE BANNER WITH IMAGE
// =========================
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, isActive } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    let updatedImages = banner.images;

    // ✅ Agar new images aayi hain to upload karo
    if (req.files && req.files.length > 0) {
      if (req.files.length > 6) {
        return res.status(400).json({
          success: false,
          message: "Maximum 6 images allowed",
        });
      }

      updatedImages = await Promise.all(
        req.files.map((file) => uploadToImgBB(file.buffer))
      );
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;
    banner.link = link || banner.link;
    banner.isActive =
      isActive !== undefined ? isActive : banner.isActive;

    banner.images = updatedImages;

    await banner.save();

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    console.log("UPDATE BANNER ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
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