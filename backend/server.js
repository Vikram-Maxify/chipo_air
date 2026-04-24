require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectdb");
const cors = require("cors");
const dns = require("dns");
const passport = require("passport");
const bcrypt = require("bcryptjs");


// Load passport config
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightroutes");
const adminRoutes = require("./routes/adminRoutes");
const pageRoutes = require("./routes/pageRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const packageRoutes = require("./routes/packageRoutes");



// Fix DNS issue
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// 👇 Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/packages", packageRoutes);






// Test route (optional)
app.get("/", (req, res) => {
    res.send("API Running ✅");
});

// DB Connect
connectDB();

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});