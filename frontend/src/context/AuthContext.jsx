import { userData } from "@/fake/user";
import useClasse from "@/hooks/useClasse";
import { createContext, useEffect, useState } from "react";

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

    // 1. Recherche de la classe
    const myClasse = classes.find(
      (cl) => cl.code_invitation === userData.code_invitation,
    );

    // 2. Condition inversée correctement (erreur si la classe N'EXISTE PAS)
    if (!myClasse) {
      throw new Error("Aucune classe trouvée");
    }

    // 3. Modèle de l'utilisateur avec les bonnes propriétés assignées
    const newUser = {
      id: crypto.randomUUID(),
      first_name: userData.first_name,
      email: userData.email,
      password_hash: userData.password, // Assurez-vous de hacher le mot de passe !
      classe_id: myClasse.id,
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
