import useAuth from "@/hook/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const { loading, role, isAuthenticated } = useAuth();
  if (loading) return <h1>Chargement ...</h1>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
