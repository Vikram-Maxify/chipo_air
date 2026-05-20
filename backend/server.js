require("dotenv").config();

const express = require("express");
const connectDB = require("./config/connectdb");
const cors = require("cors");
const dns = require("dns");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const path = require("path");

// ====================== EXPRESS APP ======================

const app = express();

// ====================== DNS FIX ======================

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// ====================== PASSPORT CONFIG ======================

require("./config/passport");

// ====================== ROUTES ======================

const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightroutes");
const adminRoutes = require("./routes/adminRoutes");
const pageRoutes = require("./routes/pageRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const packageRoutes = require("./routes/packageRoutes");
const flightBookingRoutes = require("./routes/flightBookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
// ====================== MIDDLEWARE ======================

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====================== CORS ======================

app.use(
  cors({
    origin: [
      "http://localhost:5173", // CLIENT
      "http://localhost:5174", // ADMIN
    ],
    credentials: true,
  })
);

// ====================== PASSPORT ======================

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
app.use("/api/travel-offers", require("./routes/travelOfferRoutes"));
app.use("/api/destination", destinationRoutes);
// ====================== BUILD PATHS ======================

// ====================== BUILD PATHS ======================

// CLIENT BUILD PATH
const clientBuildPath = path.join(
  __dirname,
  "../Client/dist"
);

// ADMIN BUILD PATH
const adminBuildPath = path.join(
  __dirname,
  "../Admin/dist"
);

// ====================== STATIC FILES ======================

// CLIENT STATIC FILES
app.use(
  express.static(clientBuildPath)
);

// ADMIN STATIC FILES
app.use(
  "/admin",
  express.static(adminBuildPath)
);

// ====================== TEST ROUTE ======================

app.get("/test", (req, res) => {
  res.send("API Running ✅");
});

// ====================== ADMIN REACT ROUTES ======================

// ADMIN PANEL ALL ROUTES
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(
    path.join(adminBuildPath, "index.html")
  );
});

// ====================== CLIENT REACT ROUTES ======================

// CLIENT ALL REACT ROUTES
app.get(/^(?!\/api|\/admin).*/, (req, res) => {
  res.sendFile(
    path.join(clientBuildPath, "index.html")
  );
});

// ====================== DATABASE CONNECTION ======================

connectDB();

// ====================== BCRYPT TEST ======================

(async () => {
  try {
    const hash = await bcrypt.hash(
      "admin@1234",
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