const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name:       { type: String, required: true, unique: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String, required: true },
  password:   { type: String, required: true },
  address:    { type: String, required: true },
  city:       { type: String, required: true },
  doctors:    [{ type: String }],
  isVerified: { type: Boolean, default: false },

  // ── Hospital display fields ─────────────────────────────
  image:       { type: String, default: null },   // ✅ image field add kiya
  description: { type: String, default: "" },
  speciality:  { type: String, default: "" },
  openingTime: { type: String, default: "09:00 AM" },
  closingTime: { type: String, default: "06:00 PM" },
  rating:      { type: Number, default: 4.0 },

  // ── Forgot Password OTP fields ──────────────────────────
  resetOtp:       { type: String, default: null },
  resetOtpExpiry: { type: Date,   default: null },

}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema);
