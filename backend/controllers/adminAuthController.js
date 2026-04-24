const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// ADMIN LOGIN
// =======================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (!admin.password) {
      return res.status(400).json({ message: "Password not set" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admintoken", token, {
      httpOnly: true,
      secure: false, // production me true karna
      sameSite: "lax",
    });

    return res.json({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ADMIN PROFILE
// =======================
const adminProfile = async (req, res) => {
  try {
    
    const admin = await User.findById(req.user.id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ADMIN LOGOUT
// =======================
const adminLogout = async (req, res) => {
  try {
    res.clearCookie("admintoken");
    res.json({ message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otp_expiry");

    res.json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// UPDATE USER (ADMIN)
// =========================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // prevent role abuse
    if (req.body.role && req.body.role === "admin") {
      return res.status(400).json({ message: "Cannot assign admin role" });
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password -otp -otp_expiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// DELETE USER (ADMIN)
// =========================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  adminLogin,
  adminProfile,
  adminLogout,
  getAllUsers,
  updateUser,
  deleteUser,
    
};