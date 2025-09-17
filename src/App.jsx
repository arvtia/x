// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import axios from "axios";
import "./App.css";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import DhomeAll from "./components/HomePageComponent/DhomeAll";
import MainMemmories from "./components/memmoriesComponent/MainMemmories";
import MainCreatePost from "./components/PostComponents/MainCreatePost";
import ProfileDash from "./components/ProfileDashboardComponenets/ProfileDash";

const BASE_URL = "http://localhost:5000";

// ─────────────────────────────────────────────────────────────────────────────
// 1) ProtectedRoute: Checks JWT, then coupleId, then renders child routes.
// ─────────────────────────────────────────────────────────────────────────────
function ProtectedRoute() {
  const [status, setStatus] = useState({
    loading: true,
    isAuth: false,
    hasConnection: false,
  });

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus({ loading: false, isAuth: false, hasConnection: false });
        return;
      }

      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // handle { coupleId } vs { user: { coupleId } }
        const coupleId = data.coupleId ?? data.user?.coupleId;
        setStatus({
          loading: false,
          isAuth: true,
          hasConnection: Boolean(coupleId),
        });
      } catch (err) {
        console.error("Auth check failed:", err);
        setStatus({ loading: false, isAuth: false, hasConnection: false });
      }
    };

    verify();
  }, []);

  // While we’re checking token/coupleId…
  if (status.loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Checking authentication…
      </div>
    );
  }

  // No token? → /login
  if (!status.isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated, but no coupleId? → /createConnection
  if (!status.hasConnection) {
    return <Navigate to="/createConnection" replace />;
  }

  // All checks passed → render nested routes
  return <Outlet />;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) CreateConnection placeholder
// ─────────────────────────────────────────────────────────────────────────────
function CreateConnection() {
  return (
    <div className="h-screen flex items-center justify-center text-gray-700">
      <h1 className="text-2xl">Create Your Connection</h1>
      <p className="mt-2 text-gray-500">[CreateConnection page goes here]</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3) App: Defines all routes with guards
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected: / and all nested routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<DhomeAll />} />
            <Route path="chat" element={<MainMemmories />} />
            <Route path="settings" element={<div className="p-4">Settings</div>} />
            <Route path="memmories" element={<div className="p-4">Memories</div>} />
            <Route path="add" element={<MainCreatePost />} />
            <Route path="stats" element={<ProfileDash />} />
            {/* 404 fallback for unknown nested */}
            <Route path="*" element={<div className="p-4">Not Found</div>} />
          </Route>
        </Route>

        {/* Unauthenticated users who must first create a connection */}
        <Route path="/createConnection" element={<CreateConnection />} />

        {/* Catch-all: redirect unknown routes to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;