import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.status === 200) {
  login(
    { username: data.username, email: data.email }, // ✅ email add kiya
    data.token
  );
  navigate("/");
}
  

    } catch (err) {
      setMessage("Server error, try again later");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4">

      {/* Back Button */}
      <div className="pt-5">
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white text-[14px] md:text-[15px] px-4 py-2 rounded-2xl"
        >
          Back To Home
        </Link>
      </div>

      {/* Login Form */}
      <div className="flex justify-center items-center py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-amber-700">
            Login
          </h2>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            className="w-full bg-amber-700 text-white py-2 rounded hover:bg-amber-800 transition"
          >
            Login
          </button>

          {message && (
            <p className="mt-4 text-center text-red-500 text-sm md:text-base">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
