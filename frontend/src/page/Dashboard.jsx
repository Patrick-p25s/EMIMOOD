import useAuth from "@/hook/useAuth";
import React from "react";

export default function Dashboard() {
  const { user, role } = useAuth();
  return <div>Bienvenue monsieur le {role}</div>;
}
