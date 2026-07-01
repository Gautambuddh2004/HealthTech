import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "", username: "", email: "", phone: "", password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
  login(
    { username: formData.username, email: formData.email }, // ✅ email add kiya
    data.token
  );
  navigate("/");
}
    } catch (err) {
      setMessage("Server error, try again later");
    }
  };

  return (
    <div className="font-semibold min-h-screen bg-gray-100 px-4">

      {/* Back Button */}
      <div className="pt-5">
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white text-[14px] md:text-[15px] px-4 py-2 rounded-2xl"
        >
          Back To Home
        </Link>
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-amber-700">
            Sign Up
          </h2>

          {["name", "username", "email", "phone", "password"].map(
            (field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 font-medium text-gray-700 text-sm md:text-base">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>

                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )
          )}

          <button
            type="submit"
            className="w-full bg-amber-700 text-white py-2 rounded hover:bg-amber-800 transition"
          >
            Sign Up
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
