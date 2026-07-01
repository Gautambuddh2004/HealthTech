const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  hospital:        { type: String, required: true },
  phone:           { type: String, required: true },
  email:           { type: String, required: true },
  date:            { type: String, required: true },
  reason:          { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  hospitalEmail:    String,
  rejectionReason:  String,
  appointmentTime:  { type: String, default: null }, // ✅ Hospital wala time dega accept karte waqt
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
