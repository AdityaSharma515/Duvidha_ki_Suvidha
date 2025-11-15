import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComplaintForm from "./pages/ComplaintForm.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

// Protected route wrapper
const ProtectedRoute = ({ children, requireMaintainer = false, noMaintainer = false }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;

  // Redirect maintainers away from user-only routes
  if (noMaintainer && user?.role === 'maintainer') {
    return <Navigate to="/admin" replace />;
  }

  // Redirect non-maintainers away from admin routes
  if (requireMaintainer && user?.role !== 'maintainer') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  // If the user is authenticated we normally redirect them away from public routes.
  // However callers can:
  // - navigate with state: { forcePublic: true } (used by the brand/logo Link), or
  // - include a query param ?public=1 so the landing can be opened/bookmarked even when logged in.
  const urlForce = new URLSearchParams(location.search).get("public") === "1";
  if (token && !location.state?.forcePublic && !urlForce) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          
          <ProtectedRoute noMaintainer={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/complaint" element={
          <ProtectedRoute>
            <ComplaintForm />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireMaintainer={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Landing Page - only accessible when not logged in */}
        <Route path="/" element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
