import ClasseBlog from "@/feature/classe/ClasseBlog";
import YearBlog from "@/feature/year/YearBlog";
import React from "react";

export default function DashboardAdmin() {
  return (
    <div className="flex justify-between">
      <YearBlog />
      <ClasseBlog />
    </div>
  );
}
