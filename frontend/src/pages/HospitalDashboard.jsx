import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext.jsx";

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState({});
  const [hospitalName, setHospitalName] = useState(user?.name || "");

  useEffect(() => {
    if (!user) {
      navigate("/hospital-login", { replace: true });
      return;
    }
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [navigate, user]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings);
        if (data.hospitalName) setHospitalName(data.hospitalName);
      } else {
        setError(data.message || "Bookings fetch karne mein error!");
        if (res.status === 401 || res.status === 403) handleLogout();
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept: time ke saath
  const handleAccept = async (bookingId, appointmentTime) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: "accept" }));
    try {
      const res = await fetch(`https://healthtech-backend-m2dv.onrender.com/api/bookings/${bookingId}/accept`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentTime }), // ✅ Time backend ko bhej rahe hain
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId
              ? { ...b, status: "accepted", appointmentTime }
              : b
          )
        );
      } else {
        setError(data.message || "Accept karne mein error!");
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: null }));
    }
  };

  // ✅ Reject: same as before
  const handleReject = async (bookingId) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: "reject" }));
    try {
      const res = await fetch(`https://healthtech-backend-m2dv.onrender.com/api/bookings/${bookingId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "rejected" } : b
          )
        );
      } else {
        setError(data.message || "Reject karne mein error!");
      }
    } catch {
      setError("Server se connect nahi ho pa raha!");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: null }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/hospital-login");
  };

  const isDatePassed = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(dateStr);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  };

  const pendingBookings   = bookings.filter((b) => b.status === "pending");
  const acceptedBookings  = bookings.filter((b) => b.status === "accepted" && !isDatePassed(b.date));
  const completedBookings = bookings.filter((b) => b.status === "accepted" && isDatePassed(b.date));
  const rejectedBookings  = bookings.filter((b) => b.status === "rejected");

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const tabs = [
    { key: "pending",   label: "⏳ Pending",   count: pendingBookings.length,   color: "yellow" },
    { key: "accepted",  label: "✅ Accepted",   count: acceptedBookings.length,  color: "green"  },
    { key: "completed", label: "🎉 Completed",  count: completedBookings.length, color: "blue"   },
    { key: "rejected",  label: "❌ Rejected",   count: rejectedBookings.length,  color: "red"    },
  ];

  const activeBookings =
    activeTab === "pending"   ? pendingBookings   :
    activeTab === "accepted"  ? acceptedBookings  :
    activeTab === "completed" ? completedBookings :
    rejectedBookings;

  return (
    <div className="min-h-screen bg-gray-50 text-lg font-sans pt-17">
      <Navbar />

      <div className="bg-blue-600 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">🏥 {hospitalName}</h1>
          <div className="flex gap-2">
            <button onClick={fetchBookings}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              🔄 Refresh
            </button>
            <button onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              Logout →
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto mt-4 px-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            ❌ {error}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center mt-16 text-blue-500 font-medium animate-pulse">
          Loading bookings...
        </div>
      )}

      {!loading && (
        <div className="max-w-5xl mx-auto mt-6 px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</p>
              <p className="text-yellow-700 text-sm mt-1 font-medium">⏳ Pending</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{acceptedBookings.length}</p>
              <p className="text-green-700 text-sm mt-1 font-medium">✅ Accepted</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{completedBookings.length}</p>
              <p className="text-blue-700 text-sm mt-1 font-medium">🎉 Completed</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{rejectedBookings.length}</p>
              <p className="text-red-700 text-sm mt-1 font-medium">❌ Rejected</p>
            </div>
          </div>

          <div className="flex gap-2 mb-5 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab.key
                    ? tab.color === "yellow" ? "bg-yellow-500 text-white shadow"
                    : tab.color === "green"  ? "bg-green-600 text-white shadow"
                    : tab.color === "blue"   ? "bg-blue-600 text-white shadow"
                    : "bg-red-500 text-white shadow"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {activeBookings.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 bg-white rounded-xl p-10 shadow">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium">Koi {activeTab} do not booking</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((b) => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  type={activeTab}
                  formatDate={formatDate}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  actionLoading={actionLoading[b._id]}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// BookingCard 
function BookingCard({ booking, type, formatDate, onAccept, onReject, actionLoading }) {
  const [selectedTime, setSelectedTime] = useState(""); // 
  const [timeError, setTimeError] = useState("");

  const styles = {
    pending:   { border: "border-yellow-400", badge: "bg-yellow-100 text-yellow-700", label: "⏳ Pending"   },
    accepted:  { border: "border-green-500",  badge: "bg-green-100 text-green-700",   label: "✅ Accepted"  },
    completed: { border: "border-blue-500",   badge: "bg-blue-100 text-blue-700",     label: "🎉 Completed" },
    rejected:  { border: "border-red-400",    badge: "bg-red-100 text-red-700",       label: "❌ Rejected"  },
  };

  const s = styles[type];

  const handleAcceptClick = () => {
    if (!selectedTime) {
      setTimeError("⚠️ Pehle appointment time select karein!");
      return;
    }
    setTimeError("");
    onAccept(booking._id, selectedTime);
  };

  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${s.border} ${
      type === "completed" ? "opacity-90" : ""
    }`}>
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{booking.name}</h3>
          <p className="text-sm text-gray-500">{booking.phone} · {booking.email}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.badge}`}>
          {s.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Appointment Date</p>
          <p className="font-medium text-gray-700">{formatDate(booking.date)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Booked On</p>
          <p className="font-medium text-gray-700">{formatDate(booking.createdAt)}</p>
        </div>
        {/* Accepted/Completed cards me time */}
        {(type === "accepted" || type === "completed") && booking.appointmentTime && (
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">⏰ Appointment Time</p>
            <p className="font-semibold text-blue-600">{booking.appointmentTime}</p>
          </div>
        )}
      </div>

      <div className="mt-3 bg-blue-50 rounded-lg p-3 text-sm">
        <p className="text-gray-400 text-xs mb-1">Reason / Complaint</p>
        <p className="text-gray-700">{booking.reason || "—"}</p>
      </div>

      {type === "completed" && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700 font-medium text-center">
          🎉 Appointment successfully completed!
        </div>
      )}

      {/*Pending cards time and picker buton */}
      {type === "pending" && (
        <div className="mt-4 space-y-3">
          {/* Time Picker */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              ⏰ Appointment Time assign karein
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
                setTimeError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {timeError && (
              <p className="text-red-500 text-xs mt-1">{timeError}</p>
            )}
          </div>

          {/* Accept/Reject Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAcceptClick}
              disabled={!!actionLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition">
              {actionLoading === "accept" ? "⏳ Accepting..." : "✅ Accept"}
            </button>
            <button
              onClick={() => onReject(booking._id)}
              disabled={!!actionLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition">
              {actionLoading === "reject" ? "⏳ Rejecting..." : "❌ Reject"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
