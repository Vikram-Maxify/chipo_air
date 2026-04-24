const express = require("express");
const router = express.Router();

const {
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBannersAdmin,
  getActiveBanners,
} = require("../controllers/bannerController");

const { adminProtect } = require("../middleware/adminAuth");
const upload = require("../middleware/upload");

// ======================
// ADMIN ROUTES
// ======================

// Create banner
router.post(
  "/",
  adminProtect,
  upload.array("images", 6), // 👈 MULTER HERE
  createBanner
);

router.put(
  "/:id",
  adminProtect,
  upload.array("images", 6), // 👈 MULTER HERE
  updateBanner
);

// Delete banner
router.delete("/:id", adminProtect, deleteBanner);

// Get all banners (admin)
router.get("/admin/all", adminProtect, getAllBannersAdmin);

// ======================
// USER ROUTE
// ======================

// Get active banners
router.get("/", getActiveBanners);

module.exports = router;