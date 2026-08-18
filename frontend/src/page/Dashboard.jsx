import YearBlog from "@/feature/year/YearBlog";
import useAuth from "@/hook/useAuth";
import React from "react";

export default function Dashboard() {
  const { user, role } = useAuth();
  return <div>{role === "admin" && <YearBlog />}</div>;
}
