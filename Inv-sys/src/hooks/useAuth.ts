import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (username: string, password: string) => {
    setError("");
    setIsLoading(true);

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
      localStorage.setItem("token", data.token);
      router.push("/");
      return true;
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return { login, logout, isLoading, error };
}
