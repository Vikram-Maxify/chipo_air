const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // multer
const { adminProtect } = require("../middleware/adminAuth");

const {
  upsertPage,
  getPage,
} = require("../controllers/pageController");

// ======================
// ADMIN ROUTE
// ======================

// create/update about or privacy
router.post(
  "/admin",
  adminProtect,
  upload.single("image"),
  upsertPage
);

// ======================
// USER ROUTE
// ======================

// get about or privacy
router.get("/:type", getPage);

module.exports = router;