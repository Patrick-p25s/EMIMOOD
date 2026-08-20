import useAuth from "@/hooks/useAuth";
import React from "react";

export default function Dashboard() {
  const { user, role } = useAuth();
  return <div>Dashboard de l'utilistaeur</div>;
}
