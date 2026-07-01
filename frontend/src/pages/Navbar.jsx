import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout, isAdmin,hospital  } = useAuth(); // 
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full font-sans text-lg bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img className="w-8 md:w-12" src={logo} alt="logo" />
          <h1 className="text-lg md:text-2xl font-bold text-blue-600">
            HEALTH TECH
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-600 font-semibold text-base">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>

          {/* ✅ Sirf admin ko dikhega */}
          {isAdmin && (
            <li><Link to="/admin">Admin</Link></li>
          )}

         

          {/* User Login/Signup — sirf tab dikhao jab hospital logged in NA ho */}
{!user && !hospital && (
  <>
    <li><Link to="/login">Login</Link></li>
    <li className="bg-blue-500 px-4 py-2 text-white rounded">
      <Link to="/signup">User Signup</Link>
    </li>
  </>
)}

{user && (
  <>
    <li className="text-sm">👤 {user.username}</li>
    <li>
      <button onClick={logout} className="bg-red-500 px-4 py-2 text-white rounded">
        Logout
      </button>
    </li>
  </>
)}

{/* Hospital Login — sirf tab dikhao jab user logged in NA ho */}
{!user && (
  <li className="bg-red-500 px-4 py-2 text-white rounded">
    <Link to="/hospitaldashboard">Hospital Login</Link>
  </li>
)}
        </ul>

        {/* Mobile Button */}
        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-4 text-gray-700 text-base bg-white shadow-md">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>

          {/* ✅ Mobile mein bhi sirf admin ko dikhega */}
          {!user && !hospital && (
  <>
    <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
    <li className="bg-blue-500 px-4 py-2 text-white rounded w-fit">
      <Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
    </li>
  </>
)}

{/* Mobile mein bhi Hospital Login conditionally */}
{!user && (
  <li className="bg-red-500 px-4 py-2 text-white rounded w-fit">
    <Link to="/hospitaldashboard" onClick={() => setMenuOpen(false)}>Hospital Login</Link>
  </li>
)}

          {user && (
            <>
              <li className="text-sm">👤 {user.username}</li>
              <li>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="bg-red-500 px-4 py-2 text-white rounded">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}