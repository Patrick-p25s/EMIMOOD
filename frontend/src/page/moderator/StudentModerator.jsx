import useAuth from "@/hooks/useAuth";
import useStudent from "@/hooks/useStudent";
import React from "react";

export default function StudentModerator() {
  const { students } = useStudent();
  const { user } = useAuth();
  return <div>ModeratorStudent</div>;
}
