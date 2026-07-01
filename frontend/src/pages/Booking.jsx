import { useState, useContext } from "react";
import booking from "../assets/booking.jpg";
import Navbar from "./navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { hospitalName = "", hospitalEmail = "" } = location.state || {};

  // Agar hospital ke through aaya hai to isDirectBooking false hoga
  const isDirectBooking = !hospitalName && !hospitalEmail;

  const [formData, setFormData] = useState({
    name: "",
    hospital: hospitalName,
    phone: "",
    patientEmail: user?.email || "",
    hospitalEmail: hospitalEmail,
    date: "",
    complaint: ""
  });

  const [hospitalValidation, setHospitalValidation] = useState({
    status: "", // "valid", "invalid", "checking", ""
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation reset karo jab bhi hospital name ya email change ho
    if (name === "hospital" || name === "hospitalEmail") {
      setHospitalValidation({ status: "", message: "" });
    }
  };

  // Hospital name + email validate karne ka function
  const validateHospital = async () => {
    if (!formData.hospital || !formData.hospitalEmail) {
      setHospitalValidation({
        status: "invalid",
        message: "Hospital name aur email dono bharo pehle."
      });
      return false;
    }

    setHospitalValidation({ status: "checking", message: "Checking..." });

    try {
      const res = await fetch(
        `http://localhost:5000/api/validate-hospital?name=${encodeURIComponent(formData.hospital)}&email=${encodeURIComponent(formData.hospitalEmail)}`
      );
      const data = await res.json();

      if (res.ok && data.valid) {
        setHospitalValidation({
          status: "valid",
          message: "✅ Hospital verified!"
        });
        return true;
      } else {
        setHospitalValidation({
          status: "invalid",
          message: "❌ Hospital name aur email match nahi karte. Dobara check karo."
        });
        return false;
      }
    } catch (err) {
      setHospitalValidation({
        status: "invalid",
        message: "Server se connect nahi ho paa raha. Try again."
      });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Direct booking hai to validate karo
    if (isDirectBooking) {
      const isValid = await validateHospital();
      if (!isValid) return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          hospital: formData.hospital,
          phone: formData.phone,
          patientEmail: formData.patientEmail,
          hospitalEmail: formData.hospitalEmail,
          date: formData.date,
          reason: formData.complaint
        })
      });
      const data = await res.json();
      if (res.ok) {
        window.alert("✅ Your appointment request has been sent! Hospital will confirm soon.");
        navigate("/");
      } else {
        alert(data.message || "Booking failed!");
      }
    } catch (error) {
      alert("Booking failed! Server se connect nahi ho pa raha.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full flex flex-col items-center bg-gray-100 pt-6 pb-10 px-4">

        <div className="flex flex-col md:flex-row max-w-5xl w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img src={booking} alt="Booking" className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">
              Book Your Appointment
            </h1>
            {hospitalName && (
              <p className="text-sm text-blue-500 font-medium mb-2">
                Booking at: {hospitalName}
              </p>
            )}
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Fill in your details below. The hospital will receive your request and confirm via email.
              {isDirectBooking && (
                <div className="text-red-500 mt-1">
                  ⚠️ Please enter the correct hospital name and email — we will verify it before sending.
                </div>
              )}
              {!isDirectBooking && (
                <div className="text-red-500 mt-1">Please Fill This booking through Hospital not directly</div>
              )}
            </p>
          </div>
        </div>

        <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6 mt-6">
          <h2 className="text-xl md:text-2xl text-blue-600 mb-4">Fill Your Details</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <div>
              <label className="block text-gray-700 mb-1">Patient Name</label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg p-2" required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text" name="hospital" value={formData.hospital}
                onChange={handleChange} placeholder="Hospital name"
                className={`w-full border rounded-lg p-2 ${
                  !isDirectBooking ? "bg-blue-50" : "bg-white"
                } ${hospitalValidation.status === "invalid" ? "border-red-400" : "border-gray-300"}`}
                readOnly={!isDirectBooking}
                required
              />
            </div>

            {/* ✅ Direct booking pe hospital email input dikhao */}
            {isDirectBooking ? (
              <div>
                <label className="block text-gray-700 mb-1">Hospital Email</label>
                <div className="flex gap-2">
                  <input
                    type="email" name="hospitalEmail" value={formData.hospitalEmail}
                    onChange={handleChange} placeholder="Enter hospital's email"
                    className={`w-full border rounded-lg p-2 ${
                      hospitalValidation.status === "invalid" ? "border-red-400" : "border-gray-300"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={validateHospital}
                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg border border-blue-300 hover:bg-blue-200 transition text-sm whitespace-nowrap"
                  >
                    Verify
                  </button>
                </div>

                {/* Validation message */}
                {hospitalValidation.message && (
                  <p className={`text-sm mt-1 ${
                    hospitalValidation.status === "valid" ? "text-green-600" :
                    hospitalValidation.status === "checking" ? "text-blue-500" : "text-red-500"
                  }`}>
                    {hospitalValidation.message}
                  </p>
                )}
              </div>
            ) : (
              // Hospital ke through aaya hai to sirf show karo, edit nahi
              hospitalEmail && (
                <div>
                  <label className="block text-gray-700 mb-1">Hospital Email</label>
                  <input
                    type="email" value={hospitalEmail} disabled
                    className="w-full border border-gray-300 rounded-lg p-2 bg-blue-50 text-gray-500"
                  />
                </div>
              )
            )}

            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-lg p-2" required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Your Email</label>
              <input
                type="email" name="patientEmail" value={formData.patientEmail}
                onChange={handleChange} placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-lg p-2 bg-blue-50 text-gray-500"
                readOnly
                required
              />
            </div>

            <input
              type="date" name="date" value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg p-2" required
            />

            <div>
              <label className="block text-gray-700 mb-1">Reason for Booking</label>
              <textarea
                name="complaint" value={formData.complaint}
                onChange={handleChange}
                placeholder="Describe your symptoms or medical concern..."
                className="w-full border border-gray-300 rounded-lg p-3 h-28 md:h-32 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Booking Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}