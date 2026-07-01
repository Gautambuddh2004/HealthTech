const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userEmail:       { type: String, required: true }, // Kis user ko
  title:           { type: String, required: true },
  message:         { type: String, required: true },
  isRead:          { type: Boolean, default: false },
  bookingDate:     { type: String, required: true }, // Jis din appointment hai — usi din raat auto-delete
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
