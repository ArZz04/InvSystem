"use client"

import Link from "next/link"
import { type ReactNode, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/AuthProvider"
import { Role } from "@/app/types"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isAuthLoaded } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Proteger rutas
  useEffect(() => {
    if (isAuthLoaded && !user) {
      router.replace("/login")
    }
  }, [user, isAuthLoaded, router])

  // No renderizar hasta que sepamos si hay sesión
  if (!isAuthLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (!user) return null // Evita mostrar el dashboard antes de redirigir

  const links = [
    {
      href: "/dashboard",
      label: "Inicio",
      roles: [Role.Administrador, Role.Almacenista, Role.Auxiliar, Role.Vendedor],
    },
    {
      href: "/dashboard/orders",
      label: "Pedidos",
      roles: [Role.Administrador, Role.Vendedor],
    },
    {
      href: "/dashboard/inventory",
      label: "Almacén",
      roles: [Role.Administrador, Role.Almacenista],
    },
    {
      href: "/dashboard/warehouses",
      label: "Bodegas",
      roles: [Role.Administrador],
    },
    {
      href: "/dashboard/picker",
      label: "Auxiliar",
      roles: [Role.Administrador, Role.Auxiliar],
    },
    {
      href: "/dashboard/pos",
      label: "Caja / POS",
      roles: [Role.Administrador, Role.Vendedor],
    },
    {
      href: "/dashboard/employees",
      label: "Usuarios",
      roles: [Role.Administrador],
    },
    {
      href: "/dashboard/suppliers",
      label: "Proveedores",
      roles: [Role.Administrador, Role.Almacenista],
    },
  ]

  const visibleLinks = user ? links.filter((link) => link.roles.includes(user.role)) : []

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
        {!isAuthLoaded ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-600 text-lg">Cargando...</div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
