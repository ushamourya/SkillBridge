import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await API.post(
        "/auth/register",
        form
      );

      console.log("RESPONSE:", res.data);

      alert(
        res.data.message || "Registration successful"
      );

      // After successful registration,
      // go directly to Login page
      navigate("/login");

    } catch (err) {
      console.log(
        "ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">

      <div className="w-[400px] p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          Create Account
        </h1>

        <div className="flex flex-col gap-4">

          {/* NAME */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
          />

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
          />

          {/* PASSWORD */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
          />

          {/* REGISTER BUTTON */}
          <button
            onClick={registerUser}
            className="mt-4 bg-indigo-600 py-3 rounded-lg hover:bg-indigo-500 hover:scale-105 transition font-semibold"
          >
            Register
          </button>

        </div>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline cursor-pointer"
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}