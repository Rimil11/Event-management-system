const express = require("express");
const path = require("path");
const multer = require("multer");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { authenticate, adminOnly } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed"))
});

router.get("/", authenticate, async (req, res) => {
  try { res.json(await Event.find().sort({ date: 1, time: 1 })); }
  catch { res.status(500).json({ message: "Could not load events" }); }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const registeredCount = await Registration.countDocuments({ event: event._id });
    res.json({ ...event.toObject(), registeredCount });
  } catch { res.status(500).json({ message: "Could not load event" }); }
});

router.post("/", authenticate, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, description, date, time, venue, maximumCapacity } = req.body;
    if (!name || !description || !date || !time || !venue || !maximumCapacity)
      return res.status(400).json({ message: "All event fields are required" });
    const event = await Event.create({
      name, description, date, time, venue, maximumCapacity,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });
    res.status(201).json(event);
  } catch (e) { res.status(500).json({ message: e.message || "Could not create event" }); }
});

router.put("/:id", authenticate, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    Object.assign(event, {
      name: req.body.name, description: req.body.description, date: req.body.date,
      time: req.body.time, venue: req.body.venue, maximumCapacity: req.body.maximumCapacity
    });
    if (req.file) event.imageUrl = `/uploads/${req.file.filename}`;
    await event.save();
    res.json(event);
  } catch (e) { res.status(500).json({ message: e.message || "Could not update event" }); }
});

router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await Registration.deleteMany({ event: req.params.id });
    res.json({ message: "Event deleted successfully" });
  } catch { res.status(500).json({ message: "Could not delete event" }); }
});

module.exports = router;
