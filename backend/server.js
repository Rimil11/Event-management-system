require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const User = require("./models/User");

const app = express();

// Safe defaults make the project work even if .env has not been created yet.
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/event_management";
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "college-project-secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Make the JWT secret available to the route files through process.env.
process.env.JWT_SECRET = JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Event Management API is running" });
});

async function createDefaultAdmin() {
  const email = ADMIN_EMAIL.toLowerCase();
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existingAdmin = await User.findOne({ email });

  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });
    console.log(`Admin created: ${email}`);
  } else {
    // Keep the demo admin credentials predictable for the college project.
    existingAdmin.name = "Admin";
    existingAdmin.password = hashedPassword;
    existingAdmin.role = "admin";
    await existingAdmin.save();
    console.log(`Admin credentials ready: ${email}`);
  }
}

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`JWT secret loaded: ${JWT_SECRET ? "yes" : "no"}`);

    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
  }
}

startServer();
