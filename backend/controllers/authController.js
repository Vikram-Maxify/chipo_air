const User = require("../models/userModel");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");

// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otp_expiry = otpExpiry;
    } else {
      user = new User({
        email,
        otp,
        otp_expiry: otpExpiry,
      });
    }

    await user.save();

    await sendMail(email, "OTP Verification", `Your OTP is ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, firstname, lastname } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otp_expiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.firstname = firstname;
    user.lastname = lastname;
    user.verified = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SET PASSWORD =================
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);


    const user = await User.findOne({ email });
    console.log(user);


    if (!user || !user.verified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.points = 500;

    await user.save();

    await sendMail(
      email,
      "Welcome 🎉",
      "Welcome! You got 500 bonus points 🚀"
    );

    res.status(200).json({
      success: true,
      message: "Password set & reward given",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};