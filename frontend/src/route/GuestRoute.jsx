import useAuth from "@/hook/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) {
    return <h1>Chargement ...</h1>;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}
