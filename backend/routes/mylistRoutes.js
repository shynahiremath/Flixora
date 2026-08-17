const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/mylist
// Protected route — only works with a valid JWT in the Authorization header.
// This is a working example of the "protect" middleware pattern.
// Extend this later with real My List logic (e.g. an array field on User).
router.get("/", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    message: `Hello ${req.user.fullName}, this is your protected My List route.`,
    userId: req.user._id
  });
});

module.exports = router;
