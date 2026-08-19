import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    try {
      const res = await API.post("/auth/login", form);

      alert(res.data.message);

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      alert(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">

      {/* Card */}
      <div className="w-[420px] p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Login to continue your learning journey
        </p>

        {/* Inputs */}
        <div className="flex flex-col gap-4">

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
          />

          {/* Login Button */}
          <button
            onClick={loginUser}
            className="mt-2 bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-500 hover:scale-105 transition"
          >
            Login
          </button>

        </div>

        {/* Register */}
        <p className="text-center text-gray-500 text-sm mt-6">
          New user?{" "}

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline cursor-pointer"
          >
            Register
          </button>

        </p>

      </div>
    </div>
  );
}