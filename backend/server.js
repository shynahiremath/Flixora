const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const mylistRoutes = require("./routes/mylistRoutes");

const app = express();
app.disable("etag");

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mylist", mylistRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Flixora backend is running!",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// MongoDB connection — cached so serverless functions don't reconnect on every call
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

// Connect immediately (works for both local + serverless cold start)
connectDB();

// Only start a persistent server when running locally (not on Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Flixora backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;