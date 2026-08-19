import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      alert("Login Successful");

      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg w-96 shadow-lg">

        <h2 className="text-white text-3xl mb-6 text-center font-bold">
          Admin Login
        </h2>

        <input
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-6 rounded bg-gray-800 text-white outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}