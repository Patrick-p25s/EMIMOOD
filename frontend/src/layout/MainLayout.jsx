import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import useAuth from "@/hooks/useAuth";

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header isAuth={isAuthenticated} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
