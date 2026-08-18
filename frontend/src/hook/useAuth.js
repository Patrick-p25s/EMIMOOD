import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Utiliser useAuth seulement dans AuthProvider");
  }
  return context;
}
