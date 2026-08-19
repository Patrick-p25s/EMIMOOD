import { userData } from "@/fake/user";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : userData;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        const user = users.find((user) => user.id === userId);
        setUser(user || null);
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const foundUser = users.find(
      (u) => u.email === email && u.password_hash === password,
    );

    console.log(users);

    if (!foundUser) {
      throw new Error("Email et mot de passe incorrecte");
    }

    localStorage.setItem("user_id", foundUser.id);
    setUser(foundUser);

    return foundUser;
  };

  const register = async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const exists = users.some((u) => u.email === userData.email);
    if (exists) {
      throw new Error("Cet email est déjà utilisé");
    }

    const newUser = {
      id: Date.now(),
      first_name: userData.first_name,
      email: userData.first_name,
      password_hash: userData.first_name,
      classe_id: userData.first_name,
      role: "student",
    };
    setUsers([...users, newUser]);

    setUser(newUser);
    localStorage.setItem("users_id", newUser.id);

    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_id");
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
