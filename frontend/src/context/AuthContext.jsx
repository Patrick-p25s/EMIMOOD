import { tokenStorage } from "@/api/tokenStorage";
import useClasse from "@/hooks/useClasse";
import { createContext, use, useEffect, useState } from "react";
import useStudent from "@/hooks/useStudent";

export const AuthContext = createContext(null);
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { students, createStudent, getMyProfile } = useStudent();
  const { getClasseByCodeInvitation } = useClasse();

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      if (token) {
        try {
          const currentUser = await getMyProfile(token);
          setUser(currentUser);
        } catch (error) {
          tokenStorage.clear();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const user = students.find(
      (user) => user.email === email && user.password_hash === password,
    );
    if (!user) {
      throw new Error("Mot de passe incorrecte");
    }
    tokenStorage.set(user.id);
    setUser(user);
  };

  const register = async (userData) => {
    const classe = await getClasseByCodeInvitation(userData.codeInvitation);
    const data = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
    };
    const user = await createStudent(data, classe.id, "student");
    setUser(user);
    tokenStorage.set(user.id);
  };

  const logout = async () => {
    setUser(null);
    tokenStorage.clear();
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    role: user?.role,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
