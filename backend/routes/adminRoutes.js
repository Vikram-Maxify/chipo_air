const express = require("express");
const router = express.Router();

const {
  adminLogin,
  adminProfile,
  adminLogout,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/adminAuthController.js");

const { adminProtect } = require("../middleware/adminAuth.js");

// =======================
// AUTH ROUTES
// =======================
router.post("/login", adminLogin);
router.get("/profile", adminProtect, adminProfile);
router.post("/logout", adminProtect, adminLogout);

// =======================
// USER MANAGEMENT
// =======================
router.get("/users", adminProtect, getAllUsers);
router.put("/users/:id", adminProtect, updateUser);
router.delete("/users/:id", adminProtect, deleteUser);

module.exports = router;