const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "college-project-secret";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No authentication token" });
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return res.status(401).json({ message: "No authentication token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

module.exports = { authenticate, adminOnly };
