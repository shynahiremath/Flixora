const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Prevent the browser from caching responses to protected routes
    // (fixes the 304 Not Modified bug that was blocking the /me session check)
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    let token;

    // Expect header: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password since select: false on schema)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists."
      });
    }

    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid or expired token."
    });
  }
};

module.exports = protect;