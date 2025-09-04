// app/components/Navbar.tsx
"use client"
import Link from "next/link"
import { useAuth } from "../providers/AuthProvider"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            ArZzCorp
          </div>

          <div className="flex items-center space-x-8">
            {!user && (
              <>
              <Link
                  href="/"
                  className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Register
                </Link>
              </>
            )}
            {user && (
              <>
              <Link
                  href="/"
                  className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
