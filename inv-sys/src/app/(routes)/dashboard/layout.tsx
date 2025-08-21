"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Role } from "@/app/types";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isAuthLoaded } = useAuth(); 
  const pathname = usePathname();
  const router = useRouter();

  // Proteger rutas
  useEffect(() => {
    if (isAuthLoaded && !user) {
      router.replace("/login");
    }
  }, [user, isAuthLoaded, router]);

  // No renderizar hasta que sepamos si hay sesión
  if (!isAuthLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  if (!user) return null; // Evita mostrar el dashboard antes de redirigir

  const links = [
    { href: "/dashboard", label: "Inicio", roles: [Role.Administrador, Role.Almacenista, Role.Auxiliar, Role.Vendedor] },
    { href: "/dashboard/orders", label: "Pedidos", roles: [Role.Administrador, Role.Vendedor] },
    { href: "/dashboard/inventory", label: "Almacén", roles: [Role.Administrador, Role.Almacenista] },
    { href: "/dashboard/warehouses", label: "Bodegas", roles: [Role.Administrador] },
    { href: "/dashboard/picker", label: "Auxiliar", roles: [Role.Administrador, Role.Auxiliar] },
    { href: "/dashboard/pos", label: "Caja / POS", roles: [Role.Administrador, Role.Vendedor] },
    { href: "/dashboard/employees", label: "Usuarios", roles: [Role.Administrador] },
    { href: "/dashboard/suppliers", label: "Proveedores", roles: [Role.Administrador, Role.Almacenista] },
  ];

  const visibleLinks = user
    ? links.filter(link => link.roles.includes(user.role))
    : [];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <nav className="flex flex-col gap-4">
          {visibleLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-1 rounded ${pathname === link.href ? "bg-gray-700 font-semibold" : "hover:underline"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        {!isAuthLoaded ? (
          <div className="flex justify-center items-center min-h-screen">Cargando...</div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}