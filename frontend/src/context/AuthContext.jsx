import { tokenStorage } from "@/api/tokenStorage";
import { createContext, useEffect, useState } from "react";
import { loginApi, logoutApi } from "@/api/authService";
import { getProfile, register as registerApi } from "@/api/userService";
export const AuthContext = createContext(null);
export default function AuthProvider({ children }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const initAuth = async () => {
    const token = tokenStorage.get();
    if (token) {
      try {
        const currentUser = await getProfile();
        setUser(currentUser);
      } catch (err) {
        setError(err);
        tokenStorage.clear();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginApi(email, password);
      tokenStorage.set(data.accessToken);
      await initAuth();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      await registerApi(userData);
      await login(userData.email, userData.password);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = async () => {
    const token = tokenStorage.get();
    try {
      await logoutApi(token);
    } catch (err) {
      // on ignore l'erreur réseau/serveur, on déconnecte localement quand même
    } finally {
      setUser(null);
      tokenStorage.clear();
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    role: user?.role,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
