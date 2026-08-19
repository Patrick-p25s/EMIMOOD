import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
  const { loading, isAuthenticated, role } = useAuth();
  if (loading) {
    return <h1>Chargement ...</h1>;
  }
  if (isAuthenticated) {
    return role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }
  return <Outlet />;
}
