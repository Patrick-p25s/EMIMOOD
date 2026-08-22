import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function GestionRouter() {
  const { loading, isAuthenticated, user } = useAuth();
  if (loading) return <h1>Chargement ...</h1>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return user.role != "student" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
