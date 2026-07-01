import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import { AuthContext } from "../context/AuthContext";

// Step Constants 
const STEP_LOGIN = "login";
const STEP_FORGOT = "forgot";
const STEP_OTP = "otp";
const STEP_RESET = "reset";
const STEP_SUCCESS = "success";

//Helper: email mask karo (abc***@gmail.com) 
function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  return `${user.slice(0, 3)}${"*".repeat(Math.max(user.length - 3, 2))}@${domain}`;
}

export default function HospitalLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const params = new URLSearchParams(location.search);
  const msg = params.get("msg");

  //  Current step
  const [step, setStep] = useState(STEP_LOGIN);

  //  Login form 
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Forgot password state 
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  //  UI state 
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // OTP countdown timer 
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const resetErrors = () => { setError(""); setSuccessMsg(""); };

  
  //  Login handlers
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetErrors();
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/hospital/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("FULL DATA:", data);
        console.log("TOKEN:", data.token);
        login({ name: data.hospital.name, email: data.hospital.email }, data.token);
        navigate("/hospitaldashboard");
      } else {
        setError(data.message || "Login failed!");
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };


  //  OTP send karo registered email par
 
  const handleSendOtp = async (e) => {
    e.preventDefault();
    resetErrors();
    if (!forgotEmail) { setError("Hospital email daalna zaroori hai."); return; }
    setLoading(true);
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/hospital/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setTimer(60);
        setOtpValues(["", "", "", "", "", ""]);
        setStep(STEP_OTP);
        setSuccessMsg(`OTP bhej diya gaya: ${maskEmail(forgotEmail)}`);
      } else {
        setError(data.message || "Email registered nahi hai.");
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };


  //  OTP box handlers

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpValues];
    next[idx] = val;
    setOtpValues(next);
    if (val && idx < 5) document.getElementById(`otp-box-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpValues[idx] && idx > 0)
      document.getElementById(`otp-box-${idx - 1}`)?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtpValues(pasted.split(""));
      document.getElementById("otp-box-5")?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    resetErrors();
    const code = otpValues.join("");
    if (code.length < 6) { setError("6 digit OTP pura bharein."); return; }
    setLoading(true);
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/hospital/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: code }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(STEP_RESET);
        resetErrors();
      } else {
        setError(data.message || "OTP galat hai ya expire ho gaya.");
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    resetErrors();
    setLoading(true);
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/hospital/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setTimer(60);
        setOtpValues(["", "", "", "", "", ""]);
        setSuccessMsg("OTP dobara bhej diya gaya! 📬");
      } else {
        setError(data.message || "Resend failed.");
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };

 
  //  Naya password set karo
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetErrors();
    if (newPassword.length < 6) { setError("Password kam se kam 6 characters ka hona chahiye."); return; }
    if (newPassword !== confirmPassword) { setError("Dono passwords match nahi kar rahe!"); return; }
    setLoading(true);
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/hospital/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: otpValues.join(""), newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(STEP_SUCCESS);
      } else {
        setError(data.message || "Password reset nahi ho paya.");
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };


  // RENDER
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[85vh] px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

          {/* ── URL message banners (sirf login step par dikhenge) ── */}
          {step === STEP_LOGIN && (
            <>
              {msg === "accepted" && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4 text-center">
                  Booking accept ho gayi! Dashboard dekhne ke liye login karein.
                </div>
              )}
              {msg === "rejected" && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4 text-center">
                  Booking reject ho gayi! Dashboard dekhne ke liye login karein.
                </div>
              )}
              {msg === "already_done" && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-4 py-3 text-sm mb-4 text-center">
                  ⚠️ Yeh booking pehle se process ho chuki hai!
                </div>
              )}
            </>
          )}

          {/* ── Error / Success banners ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
              ❌ {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
              ✅ {successMsg}
            </div>
          )}

          {/* STEP: LOGIN */}
          {step === STEP_LOGIN && (
            <>
              <div className="text-center mb-6">
                <p className="text-4xl mb-2">🏥</p>
                <h1 className="text-2xl font-bold text-blue-600">Hospital Login</h1>
                <p className="text-gray-500 text-sm mt-1">Sirf hospital staff ke liye</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Hospital Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hospital@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                {/* Forgot Password link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { resetErrors(); setStep(STEP_FORGOT); }}
                    className="text-sm text-blue-500 hover:text-blue-700 hover:underline transition"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login →"}
                </button>
              </form>
            </>
          )}

          {/* STEP: FORGOT – Registered email daalo*/}
          {step === STEP_FORGOT && (
            <>
              <div className="text-center mb-6">
                <p className="text-4xl mb-2">🔐</p>
                <h1 className="text-2xl font-bold text-blue-600">Forgot Password</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Apna registered hospital email daalo — OTP us email par jayega
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    Registered Hospital Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="hospital@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    ⚠️ Wohi email daalo jo hospital register karte waqt di thi
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-60"
                >
                  {loading ? "OTP bhej raha hai..." : "OTP Bhejo 📧"}
                </button>

                <button
                  type="button"
                  onClick={() => { resetErrors(); setStep(STEP_LOGIN); }}
                  className="w-full text-center text-gray-500 text-sm hover:text-gray-700 hover:underline transition"
                >
                  ← Login par wapas jayein
                </button>
              </form>
            </>
          )}

          {/* STEP: OTP VERIFY */}
          {step === STEP_OTP && (
            <>
              <div className="text-center mb-6">
                <p className="text-4xl mb-2">📩</p>
                <h1 className="text-2xl font-bold text-blue-600">OTP Verify Karein</h1>
                <p className="text-gray-500 text-sm mt-1">
                  6-digit OTP bheja gaya:{" "}
                  <span className="font-semibold text-blue-500">{maskEmail(forgotEmail)}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-3 text-sm font-medium text-center">
                    OTP Enter Karein
                  </label>
                  {/* 6-box OTP input */}
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        id={`otp-box-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    OTP copy karke yahan paste bhi kar sakte ho
                  </p>
                </div>

                {/* Resend OTP timer */}
                <div className="text-center text-sm">
                  {timer > 0 ? (
                    <span className="text-gray-400">
                      Resend ke liye wait karein:{" "}
                      <span className="font-semibold text-blue-500">{timer}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-blue-500 hover:text-blue-700 hover:underline transition disabled:opacity-50"
                    >
                      OTP dobara bhejo
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-60"
                >
                  {loading ? "Verify ho raha hai..." : "OTP Verify Karein ✓"}
                </button>

                <button
                  type="button"
                  onClick={() => { resetErrors(); setStep(STEP_FORGOT); }}
                  className="w-full text-center text-gray-500 text-sm hover:text-gray-700 hover:underline transition"
                >
                  ← Email badlein
                </button>
              </form>
            </>
          )}

          {/* STEP: RESET PASSWORD */}
          {step === STEP_RESET && (
            <>
              <div className="text-center mb-6">
                <p className="text-4xl mb-2">🔑</p>
                <h1 className="text-2xl font-bold text-blue-600">Naya Password Set Karein</h1>
                <p className="text-gray-500 text-sm mt-1">Apna naya strong password daalo</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Naya Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Naya password daalo"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showNewPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Kam se kam 6 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Password Confirm Karein</label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Password dobara daalo"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showConfirmPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {/* Live password match indicator */}
                  {confirmPassword && (
                    <p className={`text-xs mt-1 ${newPassword === confirmPassword ? "text-green-500" : "text-red-400"}`}>
                      {newPassword === confirmPassword
                        ? "✅ Passwords match kar rahe hain"
                        : "❌ Passwords match nahi kar rahe"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-60"
                >
                  {loading ? "Password reset ho raha hai..." : "Password Reset Karein 🔒"}
                </button>
              </form>
            </>
          )}

          {/* STEP: SUCCESS*/}
          {step === STEP_SUCCESS && (
            <div className="text-center py-4">
              <p className="text-5xl mb-4">🎉</p>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Password Reset Ho Gaya!</h1>
              <p className="text-gray-500 text-sm mb-6">
                Your password will we updated. Now fill new password
              </p>
              <button
                onClick={() => {
                  resetErrors();
                  setFormData({ email: forgotEmail, password: "" });
                  setNewPassword("");
                  setConfirmPassword("");
                  setStep(STEP_LOGIN);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Login Karein →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
