import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) { // ✅ adminOnly prop add kiya
  const { user, isAdmin } = useContext(AuthContext); // ✅ isAdmin add kiya

  // Login nahi hai → signup pe bhejo
  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  // ✅ Admin route hai but admin nahi hai → home pe bhejo
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}