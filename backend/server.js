require("dotenv").config();

const express = require("express");
const connectDB = require("./config/connectdb");
const cors = require("cors");
const dns = require("dns");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const path = require("path");

// Passport Config
require("./config/passport");

// Routes
const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightroutes");
const adminRoutes = require("./routes/adminRoutes");
const pageRoutes = require("./routes/pageRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const packageRoutes = require("./routes/packageRoutes");
const flightBookingRoutes = require("./routes/flightBookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// DNS Fix
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// ====================== MIDDLEWARE ======================

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// Passport
app.use(passport.initialize());

// ====================== API ROUTES ======================

app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/flight-bookings", flightBookingRoutes);
app.use("/api/payment", paymentRoutes);

// ====================== BUILD PATHS ======================

// Client Build
const clientBuildPath = path.join(
  __dirname,
  "../Client/dist"
);

// Admin Build
const adminBuildPath = path.join(
  __dirname,
  "../Admin/dist"
);

// ====================== STATIC FILES ======================

// Client Static Files
app.use(express.static(clientBuildPath));

// Admin Static Files
app.use(
  "/admin",
  express.static(adminBuildPath)
);

// ====================== REACT ROUTES ======================

// Admin Panel React Routes
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(
    path.join(adminBuildPath, "index.html")
  );
});

// Client React Routes
app.use((req, res) => {
  res.sendFile(
    path.join(clientBuildPath, "index.html")
  );
});

// ====================== TEST ROUTE ======================

app.get("/test", (req, res) => {
  res.send("API Running ✅");
});

// ====================== DB CONNECT ======================

connectDB();

// ====================== HASH TEST ======================

(async () => {
  try {
    const hash = await bcrypt.hash(
      "user@1234",
      10
    );

    console.log("Bcrypt Hash:", hash);
  } catch (error) {
    console.log(error);
  }
})();

// ====================== SERVER ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
====================================
🚀 Server Running Successfully
🌍 Port: ${PORT}
====================================
  `);
});