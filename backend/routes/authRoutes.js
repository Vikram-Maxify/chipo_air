const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  sendOtp,
  verifyOtp,
  setPassword,
  login,
  getProfile,
  logout,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// ===== OTP ROUTES =====
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);

router.get("/profile", isAuthenticated, getProfile);


router.post("/login", login);
router.get("/logout", logout);


// ===== GOOGLE OAUTH =====
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:5173/login?error=google_failed");
    }

    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 secure cookie set
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // redirect WITHOUT token
    return res.redirect("http://localhost:5173/dashboard");
  }
);

// ===== FACEBOOK OAUTH =====
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:5173/login?error=facebook_failed");
    }

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

module.exports = router;