import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "@/api/authService";
import { tokenStorage } from "@/api/tokenStorage";
import { userData } from "@/fake/user";
import useClasse from "@/hooks/useClasse";
import { createContext, use, useEffect, useState } from "react";

export const AuthContext = createContext(null);
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { classes } = useClasse();
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : userData;
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          tokenStorage.clear();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    tokenStorage.set(data.accessToken);

    const foundUser = await getCurrentUser();
    setUser(foundUser);
  };

  const register = async (userData) => {
    await registerApi(userData);
    await loginApi(userData.email, userData.password_hash);
  };

  const logout = async () => {
    const token = tokenStorage.get();
    console.log(token);
    await logoutApi(token);
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
