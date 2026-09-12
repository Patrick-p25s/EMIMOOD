import ProfileStudent from "@/components/special/ProfileStudent";
import useAuth from "@/hooks/useAuth";
import React, { useEffect } from "react";

export default function MyDashboard() {
  const { user } = useAuth();
  console.log(user);
  const classe = {
    id: 23,
    niveau: "DAII",
    mention: "L3",
  };
  const stats = {
    documentsCount: 0,
    savedCount: 0,
    pendingCount: 0,
  };
  useEffect(() => {
    console.log("Patrick");
  }, []);
  return (
    <div className="grid place-items-center">
      <ProfileStudent user={user} stats={stats} classe={classe} />
    </div>
  );
}
