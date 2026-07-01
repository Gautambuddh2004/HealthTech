const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

const createBooking = async (req, res) => {
  try {
    // ✅ booking save
    const booking = await Booking.create(req.body);

    // ✅ notification auto create
    await Notification.create({
      message: `New booking by ${booking.name} for ${booking.reason}`,
      userName: booking.name,
      purpose: booking.reason
    });

    res.status(201).json({
      success: true,
      booking
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ dono export kar
module.exports = { createBooking, getNotifications };