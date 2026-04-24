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

// LOGIN
router.post("/login", adminLogin);

// PROFILE
router.get("/profile", adminProtect, adminProfile);

// LOGOUT
router.post("/logout", adminProtect, adminLogout);

router.get("/", adminProtect, getAllUsers);

// Update user
router.put("/users/:id", adminProtect, updateUser);

// Delete user
router.delete("/user/:id", adminProtect, deleteUser);

module.exports = router;