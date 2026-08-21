import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Route pour eviter la login et register pour ce qui est connecté
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
