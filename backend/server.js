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


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Flixora backend is running!",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Flixora backend running on http://localhost:${PORT}`);
});
