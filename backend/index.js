const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Doctor = require("./models/Doctor");
const User = require("./models/user");
const Booking = require("./models/Booking.js");
const Hospital = require("./models/Hospital");
const Notification = require("./models/Notification");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

// ================= ENV CHECK =================
const requiredEnvVars = ["JWT_SECRET", "MONGO_URI", "EMAIL_USER", "EMAIL_PASS", "ADMIN_PASSWORD"];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= NODEMAILER =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================= SEED =================
app.get("/seed-hospitals", async (req, res) => {
  try {
    const hashed = await bcrypt.hash("123456", 10);
    await Hospital.insertMany([
      {
        name: "City Care Hospital",
        email: "citycare@gmail.com",
        password: hashed,
        city: "Delhi",
        address: "Saket, New Delhi",
        phone: "9876543210",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
        description: "Cardiology & Emergency care"
      },
      {
        name: "Apollo Spectra",
        email: "apollo@gmail.com",
        password: hashed,
        city: "Delhi",
        address: "Kailash Colony",
        phone: "9123456789",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
        description: "Advanced surgical hospital"
      }
    ]);
    res.send("Hospitals added successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= MongoDB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

app.get("/", (req, res) => res.send("Backend Working..."));

// ================= Get All Hospitals =================
app.get("/api/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= Admin Login =================
app.post("/api/admin/login", async (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ message: "Wrong admin password!" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

// ================= Admin Middleware =================
const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Admin login karein!" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Admin nahi ho!" });
    next();
  } catch {
    return res.status(403).json({ message: "Invalid ya expired token!" });
  }
};

// ================= Admin - Add Hospital =================
app.post("/api/admin/hospitals", verifyAdmin, async (req, res) => {
  try {
    const {
      name, email, phone, password,
      address, city, image, description,
      openingTime, closingTime, speciality, rating
    } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Hospital ka password daalna zaroori hai!" });
    }

    const hospitalExists = await Hospital.findOne({ email });
    if (hospitalExists) {
      return res.status(400).json({ message: "Hospital with this email already exists!" });
    }

    const hospital = new Hospital({
      name,
      email,
      phone,
      address,
      city,
      image: image && image.trim() !== "" ? image.trim() : null,
      description: description || speciality || "",
      openingTime: openingTime || "09:00 AM",
      closingTime: closingTime || "06:00 PM",
      speciality: speciality || "",
      rating: rating ? parseFloat(rating) : 4.0,
      password: await bcrypt.hash(password, 10)
    });

    await hospital.save();
    console.log("✅ Hospital saved with image:", hospital.image);
    res.status(201).json({ message: "Hospital added successfully!", hospital });
  } catch (error) {
    console.error("Admin add hospital error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Admin - Delete Hospital =================
app.delete("/api/admin/hospitals/:id", verifyAdmin, async (req, res) => {
  try {
    await Hospital.findByIdAndDelete(req.params.id);
    res.json({ message: "Hospital deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Admin - Add Doctor (protected) =================
app.post("/api/admin/doctors", verifyAdmin, async (req, res) => {
  try {
    const { name, specialty, hospital, location, experience, fees, rating, phone, image, desc } = req.body;

    if (!name || !specialty || !hospital) {
      return res.status(400).json({ message: "Name, specialty aur hospital required hai!" });
    }

    const doctor = new Doctor({
      name,
      specialty,
      hospital,
      location: location || "",
      experience: experience || "",
      fees: fees || "",
      phone: phone || "",
      rating: rating ? parseFloat(rating) : 4.5,
      image: image && image.trim() !== "" ? image.trim() : null,
      desc: desc || ""
    });

    await doctor.save();
    console.log("✅ Doctor saved:", doctor.name);
    res.status(201).json({ message: "Doctor added successfully!", doctor });
  } catch (error) {
    console.error("Admin add doctor error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Admin - Delete Doctor (protected) =================
app.delete("/api/admin/doctors/:id", verifyAdmin, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor nahi mila!" });
    }
    console.log("✅ Doctor deleted:", doctor.name);
    res.json({ message: "Doctor deleted successfully!" });
  } catch (error) {
    console.error("Admin delete doctor error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Get All Doctors (public) =================
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Doctor fetch error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= User Signup =================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already registered!" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ message: "Username already taken!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Signup successful!", user: { username } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= User Login =================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Enter both username and password!" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password!" });

    res.status(200).json({
      message: "Login successful!",
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Hospital Signup =================
app.post("/api/hospital/signup", async (req, res) => {
  try {
    const { name, email, phone, password, address, city } = req.body;
    const hospitalExists = await Hospital.findOne({ email });
    if (hospitalExists) {
      return res.status(400).json({ message: "Hospital already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hospital = new Hospital({ name, email, phone, password: hashedPassword, address, city });
    await hospital.save();

    res.status(201).json({ message: "Hospital signup successful!", hospital: { name, email } });
  } catch (error) {
    console.error("Hospital signup error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Hospital Login =================
app.post("/api/hospital/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Enter both email and password!" });

    const hospital = await Hospital.findOne({ email });
    if (!hospital)
      return res.status(400).json({ message: "Invalid email or password!" });

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password!" });

    const token = jwt.sign(
      { hospitalId: hospital._id, email: hospital.email, role: "hospital" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      hospital: { id: hospital._id, name: hospital.name, email: hospital.email }
    });
  } catch (error) {
    console.error("Hospital login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Forgot Password - OTP Bhejo =================
app.post("/api/hospital/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email daalna zaroori hai." });

    const hospital = await Hospital.findOne({ email });
    if (!hospital) return res.status(404).json({ message: "Yeh email registered nahi hai." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    hospital.resetOtp = hashedOtp;
    hospital.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await hospital.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: hospital.email,
      subject: "🔐 Password Reset OTP — HealthTech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #2563eb;">🏥 HealthTech — Password Reset</h2>
          <p style="color: #374151;">Aapne password reset request ki hai. Neeche diya gaya OTP use karein:</p>
          <div style="background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #1d4ed8;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">⏱️ Yeh OTP sirf <strong>10 minutes</strong> ke liye valid hai.</p>
          <p style="color: #6b7280; font-size: 14px;">Agar aapne yeh request nahi ki, toh is email ko ignore karein.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">HealthTech Hospital Management System</p>
        </div>
      `
    });

    res.status(200).json({ message: "OTP email par bhej diya gaya." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error. Dobara try karein." });
  }
});

// ================= Verify OTP =================
app.post("/api/hospital/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email aur OTP dono zaroori hain." });

    const hospital = await Hospital.findOne({ email });
    if (!hospital) return res.status(404).json({ message: "Hospital nahi mila." });

    if (!hospital.resetOtp || !hospital.resetOtpExpiry)
      return res.status(400).json({ message: "Pehle OTP request karein." });

    if (new Date() > hospital.resetOtpExpiry) {
      hospital.resetOtp = null;
      hospital.resetOtpExpiry = null;
      await hospital.save();
      return res.status(400).json({ message: "OTP expire ho gaya. Naya OTP mangaein." });
    }

    const isMatch = await bcrypt.compare(otp, hospital.resetOtp);
    if (!isMatch) return res.status(400).json({ message: "OTP galat hai." });

    res.status(200).json({ message: "OTP verified. Ab naya password set karein." });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error. Dobara try karein." });
  }
});

// ================= Reset Password =================
app.post("/api/hospital/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Sabhi fields zaroori hain." });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password kam se kam 6 characters ka hona chahiye." });

    const hospital = await Hospital.findOne({ email });
    if (!hospital) return res.status(404).json({ message: "Hospital nahi mila." });

    if (!hospital.resetOtp || !hospital.resetOtpExpiry)
      return res.status(400).json({ message: "Pehle OTP request karein." });

    if (new Date() > hospital.resetOtpExpiry) {
      hospital.resetOtp = null;
      hospital.resetOtpExpiry = null;
      await hospital.save();
      return res.status(400).json({ message: "OTP expire ho gaya. Naya OTP mangaein." });
    }

    const isMatch = await bcrypt.compare(otp, hospital.resetOtp);
    if (!isMatch) return res.status(400).json({ message: "OTP galat hai." });

    hospital.password = await bcrypt.hash(newPassword, 10);
    hospital.resetOtp = null;
    hospital.resetOtpExpiry = null;
    await hospital.save();

    res.status(200).json({ message: "Password successfully reset ho gaya!" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error. Dobara try karein." });
  }
});

// ================= Hospital Auth Middleware =================
const verifyHospitalToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Access denied! Login karein." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.hospital = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid ya expired token!" });
  }
};

// ================= My Bookings (Dashboard) =================
app.get("/api/bookings/my", verifyHospitalToken, async (req, res) => {
  try {
    const email = req.hospital.email;
    const hospital = await Hospital.findOne({ email });
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found!" });

    const bookings = await Booking.find({ hospitalEmail: email });
    res.status(200).json({ bookings, hospitalName: hospital.name });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Accept Booking =================

app.put("/api/bookings/:id/accept", verifyHospitalToken, async (req, res) => {
  try {
    const { appointmentTime } = req.body;

    if (!appointmentTime) {
      return res.status(400).json({ message: "Appointment time daalna zaroori hai!" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, hospitalEmail: req.hospital.email, status: "pending" },
      { status: "accepted", appointmentTime },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking nahi mili ya already update ho chuki hai!" });
    }

    // ✅ Notification DB me save karo
    await Notification.create({
      userEmail:   booking.email,
      title:       "✅ Appointment Confirmed!",
      message:     `Aapki appointment <b>${booking.hospital}</b> me confirm ho gayi hai! Date: <b>${booking.date}</b>, Time: <b>${appointmentTime}</b>. Please 10 minutes pehle pohonchein.`,
      bookingDate: booking.date,
    });

    // ✅ User ko email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "✅ Appointment Confirmed - HealthTech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #22c55e;">Your Appointment is Confirmed! ✅</h2>
          <p>Dear <b>${booking.name}</b>,</p>
          <p>Your appointment at <b>${booking.hospital}</b> has been confirmed.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><b>🏥 Hospital</b></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${booking.hospital}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><b>📅 Date</b></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${booking.date}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><b>⏰ Time</b></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><b style="color:#2563eb;">${appointmentTime}</b></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><b>📋 Reason</b></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${booking.reason || "Not provided"}</td>
            </tr>
          </table>
          <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 6px;">
            ⏱️ Please arrive <b>10 minutes before</b> your appointment time.
          </div>
          <p style="margin-top: 20px;">Thank you for using HealthTech! 💙</p>
        </div>
      `
    });

    res.status(200).json({ message: "Booking accepted, notification saved, email bheja!", booking });
  } catch (error) {
    console.error("Accept booking error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/notification", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required hai!" });

    // ✅ Auto-delete: jo notifications booking date ke baad hain unhe delete karo
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Notification.deleteMany({
      userEmail: email,
      bookingDate: {
        $lt: today.toISOString().split("T")[0] // YYYY-MM-DD format se compare
      }
    });

    const notifications = await Notification.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Notification read mark karo
app.put("/api/notification/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Hospital (for direct booking)
app.get("/api/validate-hospital", async (req, res) => {
  try {
    const { name, email } = req.query;

    if (!name || !email) {
      return res.status(400).json({ valid: false, message: "Name aur email dono required hain." });
    }

    const hospital = await Hospital.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") }, // case-insensitive
      email: email.trim().toLowerCase()
    });

    if (hospital) {
      res.status(200).json({ valid: true, message: "Hospital verified!" });
    } else {
      res.status(200).json({ valid: false, message: "Hospital name aur email match nahi karte." });
    }
  } catch (err) {
    console.error("Validate hospital error:", err);
    res.status(500).json({ valid: false, message: "Server error. Dobara try karein." });
  }
});
// Notification delete karo (manual)
app.delete("/api/notification/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Reject Booking =================
app.put("/api/bookings/:id/reject", verifyHospitalToken, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, hospitalEmail: req.hospital.email, status: "pending" },
      { status: "rejected" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking nahi mili ya already update ho chuki hai!" });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Appointment Update - HealthTech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #ef4444;">Appointment Update ❌</h2>
          <p>Dear <b>${booking.name}</b>,</p>
          <p>Unfortunately, your appointment at <b>${booking.hospital}</b> could not be accepted at this time.</p>
          <ul>
            <li><b>Hospital:</b> ${booking.hospital}</li>
            <li><b>Date:</b> ${booking.date}</li>
          </ul>
          <p>Please feel free to book another appointment or contact the hospital directly.</p>
          <p>Thank you for using HealthTech! 💙</p>
        </div>
      `
    });

    res.status(200).json({ message: "Booking rejected aur email bhej diya!", booking });
  } catch (error) {
    console.error("Reject booking error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= New Booking =================
app.post("/api/booking", async (req, res) => {
  try {
    const { name, hospital, phone, patientEmail, hospitalEmail, date, reason } = req.body;

    if (!name || !hospital || !phone || !patientEmail || !hospitalEmail || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newBooking = new Booking({
      name, hospital, phone,
      email: patientEmail,
      date, reason,
      hospitalEmail
    });
    await newBooking.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: "Appointment Request Sent - HealthTech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2563eb;">Appointment Request Sent! ⏳</h2>
          <p>Dear <b>${name}</b>,</p>
          <p>Your appointment request has been sent to <b>${hospital}</b>.</p>
          <p>You will receive a confirmation email once the hospital reviews your request.</p>
          <ul>
            <li><b>Hospital:</b> ${hospital}</li>
            <li><b>Date:</b> ${date}</li>
            <li><b>Reason:</b> ${reason || "Not provided"}</li>
          </ul>
          <p>Thank you for using HealthTech! 💙</p>
        </div>
      `
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: hospitalEmail,
      subject: "New Appointment Request - HealthTech 🏥",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2563eb;">New Booking Request! 🏥</h2>
          <p>A patient has requested an appointment. Please log in to your dashboard to accept or reject.</p>
          <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background:#f9fafb;"><b>Patient Name</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background:#f9fafb;"><b>Phone</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background:#f9fafb;"><b>Patient Email</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patientEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background:#f9fafb;"><b>Date</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background:#f9fafb;"><b>Reason</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${reason || "Not provided"}</td>
            </tr>
          </table>
          <div style="text-align:center;">
            <a href="http://localhost:5173/hospital-login"
               style="background:#2563eb; color:white; padding:12px 28px; border-radius:8px; text-decoration:none; font-size:15px; font-weight:bold;">
              🏥 Dashboard Login karein
            </a>
          </div>
          <p style="color:gray; font-size:12px; text-align:center; margin-top:20px;">HealthTech Hospital Management System</p>
        </div>
      `
    });

    res.status(201).json({ message: "Booking saved successfully!" });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Get Bookings by Hospital Name =================
app.get("/api/bookings/:hospitalName", async (req, res) => {
  try {
    const { hospitalName } = req.params;
    const bookings = await Booking.find({ hospital: hospitalName });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ================= Error Handling =================
process.on("uncaughtException", err => console.error("Uncaught Exception:", err));
process.on("unhandledRejection", (reason) => console.error("Unhandled Rejection:", reason));

// ================= Start Server =================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on("error", err => console.error("Server failed to start:", err));
