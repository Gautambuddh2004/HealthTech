import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "./Navbar";

export default function Notification() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://healthtech-backend-m2dv.onrender.com/api/notification?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications);
    } catch (err) {
      console.error("Notifications fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await fetch(`https://healthtech-backend-m2dv.onrender.com/api/notification/${id}/read`, { method: "PUT" });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = async (id) => {
    await fetch(`https://healthtech-backend-m2dv.onrender.com/api/notification/${id}`, { method: "DELETE" });
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-17">
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          <div className="text-center text-gray-400">
            <p className="text-5xl mb-4">🔒</p>
            <p className="font-medium text-lg">Pehle login karein notifications dekhne ke liye</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-17 font-sans">
      <Navbar />

      {/* Header */}
      <div className="bg-blue-600 text-white py-7 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🔔 Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-blue-100 text-sm mt-1">{unreadCount} unread notification{unreadCount > 1 ? "s" : ""}</p>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={() => notifications.forEach((n) => !n.isRead && markAsRead(n._id))}
              className="bg-white text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              ✅ Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center mt-16 text-blue-500 animate-pulse font-medium">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow p-12 mt-6">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 font-medium text-lg">You don't have any bookings</p>
            <p className="text-gray-400 text-sm mt-1"></p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={`relative bg-white rounded-xl shadow-sm p-5 border-l-4 cursor-pointer transition hover:shadow-md ${
                  n.isRead ? "border-gray-200 opacity-80" : "border-blue-500"
                }`}
              >
                {/* Unread dot */}
                {!n.isRead && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                )}

                <div className="flex items-start justify-between gap-3 pr-4">
                  <div className="flex-1">
                    <p className={`font-semibold text-gray-800 text-sm mb-1 ${!n.isRead ? "text-blue-700" : ""}`}>
                      {n.title}
                    </p>
                    <p
                      className="text-gray-600 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: n.message }}
                    />
                    <p className="text-gray-400 text-xs mt-2">
                      🕐 {new Date(n.createdAt).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit", hour12: true
                      })}
                    </p>
                    <p className="text-gray-300 text-xs mt-0.5">
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                    className="text-gray-300 hover:text-red-400 transition text-lg leading-none mt-0.5"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
