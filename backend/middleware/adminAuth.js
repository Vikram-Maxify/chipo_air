const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminProtect = async (req, res, next) => {
  try {
    let token = req.cookies.admintoken;
    console.log(token);
    
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Not authorized as admin" });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};

module.exports = { adminProtect };