"use client"

import Link from "next/link"
import { type ReactNode, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/AuthProvider"
import { Role } from "@/app/types"
import { jwtDecode } from "jwt-decode"

type JWTPayload = {
  exp: number
  role: Role
  username: string
}

const links = [
  { href: "/dashboard", label: "Inicio", roles: [Role.Administrador, Role.Compras, Role.Encargado, Role.Cajero] },
  { href: "/dashboard/tickets", label: "Reportes", roles: [Role.Administrador, Role.Cajero, Role.Encargado, Role.Compras] },
  { href: "/dashboard/employees", label: "Usuarios", roles: [Role.Administrador, Role.Encargado] },
  { href: "/dashboard/products", label: "Productos", roles: [Role.Administrador, Role.Compras, Role.Encargado] },
  { href: "/dashboard/prices", label: "Precios Compra", roles: [Role.Administrador, Role.Compras, Role.Encargado] },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isAuthLoaded, logout, token } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Validar login, expiración del token y permisos de rutas
  useEffect(() => {
    if (!isAuthLoaded) return

    // Si no hay usuario -> login
    if (!user) {
      router.replace("/login")
      return
    }

    // Validar expiración del token
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token)
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expirado, cerrando sesión")
          logout()
          router.replace("/login")
          return
        }
      } catch (err) {
        console.error("Error decodificando token:", err)
        logout()
        router.replace("/login")
        return
      }
    }

    // Validar que la ruta actual esté permitida para el rol
const allowedLinks = links.filter(link => link.roles.includes(user.role))

// Buscar coincidencia exacta o prefijo
const isAllowed = allowedLinks.some(link =>
  pathname === link.href || pathname.startsWith(link.href + "/")
)

if (!isAllowed && pathname.startsWith("/dashboard")) {
  console.warn("Ruta no permitida, redirigiendo al dashboard")
  router.replace("/dashboard")
}
  }, [isAuthLoaded, user, token, pathname, router, logout])

  if (!isAuthLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (!user) return null

  const visibleLinks = links.filter(link => link.roles.includes(user.role))

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6 flex flex-col shadow-2xl border-r border-gray-700/50">
        <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <nav className="flex flex-col gap-2">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 rounded-lg transition-all duration-300 ease-in-out transform ${
                pathname === link.href
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 font-semibold shadow-lg shadow-blue-500/25 scale-105"
                  : "hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:shadow-md hover:scale-105 hover:shadow-gray-500/20"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </main>
    </div>
  )
}