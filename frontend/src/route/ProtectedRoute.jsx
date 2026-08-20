import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return <h1>Chargement</h1>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role !== "student") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
