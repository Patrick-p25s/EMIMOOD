import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// code qui assure la protection de moderateur
export default function ModeratorRoute() {
  const { loading, role, isAuthenticated } = useAuth();
  if (loading) return <h1>Chargement ...</h1>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return role === "moderator" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
