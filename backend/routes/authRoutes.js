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
    failureRedirect:
      "http://localhost:5173/login?error=google_failed",
    session: false,
  }),

  async (req, res) => {
    try {

      if (!req.user) {
        return res.redirect(
          "http://localhost:5173/login?error=google_failed"
        );
      }

      // =========================
      // JWT TOKEN
      // =========================
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // =========================
      // COOKIE SET
      // =========================
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // =========================
      // REDIRECT FRONTEND
      // =========================
      return res.redirect(
        "http://localhost:5173/dashboard"
      );

    } catch (error) {

      console.log("Google Auth Error:", error);

      return res.redirect(
        "http://localhost:5173/login?error=server_error"
      );
    }
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