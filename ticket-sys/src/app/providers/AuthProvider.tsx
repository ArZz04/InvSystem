"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Role } from "@/app/types";

interface User {
  username: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthLoaded: boolean; // <-- nuevo
  error: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false); // <-- nuevo
  const [error, setError] = useState("");

  // Rehidratar sesión al iniciar la app
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsAuthLoaded(true); // <-- indicamos que la carga terminó
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text);
        return false;
      }

      const data = await res.json();
      const loggedUser = { username: data.username, role: data.role };
      setUser(loggedUser);
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      return true;
    } catch {
      setError("Error al conectar con el servidor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isLoading, isAuthLoaded, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
