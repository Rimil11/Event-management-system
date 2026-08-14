const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { authenticate, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/:eventId", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can register for events" });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: event._id
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    const count = await Registration.countDocuments({ event: event._id });

    if (count >= event.maximumCapacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    await Registration.create({
      user: req.user.id,
      event: event._id
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not register for event" });
  }
});

router.get("/my", authenticate, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Could not load registrations" });
  }
});

router.get("/event/:eventId", authenticate, adminOnly, async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate("user", "name email")
      .populate("event", "name")
      .sort({ createdAt: 1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Could not load registered users" });
  }
});

module.exports = router;
