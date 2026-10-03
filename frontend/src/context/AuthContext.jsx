import { authMemory } from "@/api/authMemory";
import { createContext, useEffect, useState } from "react";
import { loginApi, refreshTokenApi, logoutApi } from "@/api/authService";
import {
  getProfile,
  register as registerApi,
  updateProfile,
} from "@/api/userService";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Remplace l'ancien initAuth basé sur tokenStorage.get() :
  // au démarrage on n'a plus de token à lire (il vit en mémoire, donc
  // perdu au refresh de page) — on tente un refresh silencieux via le cookie
  const initAuth = async () => {
    try {
      const { accessToken } = await refreshTokenApi();
      authMemory.set(accessToken);
      const currentUser = await getProfile();
      setUser(currentUser);
    } catch (err) {
      authMemory.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginApi(email, password);
      authMemory.set(data.accessToken);
      const currentUser = await getProfile();
      setUser(currentUser);
      return currentUser; // ← ajouté : permet au composant appelant d'avoir la valeur fraîche
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const update = async (data) => {
    setError(null);
    try {
      await updateProfile(null, data);
      setUser({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      await registerApi(userData);
      return await login(userData.email, userData.password);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // on ignore l'erreur réseau/serveur, on déconnecte localement quand même
    } finally {
      setUser(null);
      authMemory.clear();
    }
  };

  const value = {
    user,
    loading,
    error,
    update,
    isAuthenticated: Boolean(user),
    role: user?.role,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
