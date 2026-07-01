const mongoose = require("mongoose");
 
const doctorSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  specialty:  { type: String, required: true },
  hospital:   { type: String, required: true },
  location:   { type: String, default: "" },
  experience: { type: String, default: "" },  
  phone:      { type: String },
  email:      { type: String },
  fees:       { type: String },
  rating:     { type: Number },
  desc:       { type: String },
  image:      { type: String },
}, { timestamps: true });
 
module.exports = mongoose.model("Doctor", doctorSchema);
 