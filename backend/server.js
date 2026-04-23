require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectdb");
const cors = require("cors");
const dns = require("dns");

// Fix DNS issue (good for some hosting environments)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// DB Connect
connectDB();

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});