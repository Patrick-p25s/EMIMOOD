import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// code de protection de route pour admin
export default function AdminRoute() {
  const { loading, role, isAuthenticated } = useAuth();
  if (loading) return <h1>Chargement ...</h1>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return role === "admin" ? (
    <Outlet />
  ) : role === "moderator" ? (
    <Navigate to="/moderator" replace />
  ) : (
    <Navigate to="/dasboard" replace />
  );
}
