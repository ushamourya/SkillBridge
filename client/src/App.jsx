import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import Lesson from "./pages/Lesson";
import Practice from "./pages/Practice";
import PracticeHub from "./pages/PracticeHub";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================
            HOME
        ================================= */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ================================
            USER
        ================================= */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================================
            ROADMAP
        ================================= */}
        <Route
          path="/roadmap/:id"
          element={<Roadmap />}
        />

        <Route
          path="/lesson/:topic"
          element={<Lesson />}
        />

        {/* ================================
            PRACTICE HUB
        ================================= */}
        <Route
          path="/practice"
          element={<PracticeHub />}
        />

        {/* Keep this too, so /practice-hub
            also works */}
        <Route
          path="/practice-hub"
          element={<PracticeHub />}
        />

        {/* ================================
            PRACTICE QUESTION
        ================================= */}
        <Route
          path="/practice/:topic"
          element={<Practice />}
        />

        {/* ================================
            ADMIN
        ================================= */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* ================================
            FALLBACK
        ================================= */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-400 mb-4">
                  404
                </h1>

                <p className="text-gray-400">
                  Page not found
                </p>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}