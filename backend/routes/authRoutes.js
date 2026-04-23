const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  setPassword,
} = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);

module.exports = router;