// app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-lg">ArZzCorp</div>
      <div className="space-x-4">
        {!user && (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
        {user && (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/profile" className="hover:underline">
              Perfil
            </Link>
            <button onClick={logout} className="hover:underline">
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
