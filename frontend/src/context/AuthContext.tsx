import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  refresh as refreshApi,
  getCurrentUser,
} from "../api/authService";
import { tokenStorage } from "../api/tokenStorage";
interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  matricule?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  refresh: (refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch {
          tokenStorage.clear();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []); // Fix: Exécution unique au montage

  const login = async (email: string, password: string) => {
    const response = await loginApi(email, password);
    tokenStorage.set(response.access_token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const register = async (userData: Record<string, any>) => {
    await registerApi(userData);
    await login(userData.email, userData.password);
  };

  const logout = async () => {
    try {
      const token = tokenStorage.get();
      if (token) await logoutApi(token);
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  };

  const refresh = async (refreshToken: string) => {
    const data = await refreshApi(refreshToken);
    tokenStorage.set(data.access_token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  // Fix: Mémoïsation pour éviter des re-rendus inutiles
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      refresh,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider",
    );
  }
  return context;
};
