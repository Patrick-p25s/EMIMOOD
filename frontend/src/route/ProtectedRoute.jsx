import useAuth from "@/hook/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <h1>Chargement</h1>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <div>{children}</div>;
}
