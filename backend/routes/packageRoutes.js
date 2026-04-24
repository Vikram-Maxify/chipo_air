const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { adminProtect } = require("../middleware/adminAuth");

const {
  createPackage,
  updatePackage,
  getPackages,
  getSinglePackage,
} = require("../controllers/packageController");

// ======================
// ADMIN
// ======================

router.post(
  "/",
  adminProtect,
  upload.array("images", 6),
  createPackage
);

router.put(
  "/:id",
  adminProtect,
  upload.array("images", 6),
  updatePackage
);

// ======================
// USER
// ======================

router.get("/", getPackages);
router.get("/:slug", getSinglePackage);

module.exports = router;