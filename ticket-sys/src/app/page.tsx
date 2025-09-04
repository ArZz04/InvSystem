import React from "react";
import Image from "next/image";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 sm:px-12 py-20 gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Gestiona tu inventario de autopartes de manera eficiente
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mb-8">
            Controla tus repuestos, órdenes y ventas desde un solo lugar, con
            información clara y actualizada al instante.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="px-8 py-4 rounded-lg bg-blue-600 text-white text-lg sm:text-xl hover:bg-blue-700 transition">
              Comenzar ahora
            </button>
            <button className="px-8 py-4 rounded-lg border border-gray-300 dark:border-gray-600 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Ver características
            </button>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/main.png"
            alt="AutoParts dashboard illustration"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>
      </main>

      {/* Feature Cards */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h2 className="text-4xl font-bold text-center mb-12">
            Características principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-2xl transition text-center">
              <div className="text-5xl mb-6">📦</div>
              <h3 className="text-2xl font-semibold mb-3">
                Inventario completo
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                Mantén un control detallado de todos tus repuestos y stock
                disponible, optimizando tu almacén.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-2xl transition text-center">
              <div className="text-5xl mb-6">📈</div>
              <h3 className="text-2xl font-semibold mb-3">
                Ventas inteligentes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                Analiza tus ventas y mejora la reposición de productos en tiempo
                real para aumentar tu rentabilidad.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-2xl transition text-center">
              <div className="text-5xl mb-6">⚙️</div>
              <h3 className="text-2xl font-semibold mb-3">Control total</h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                Configura permisos, usuarios y ajustes de manera sencilla y
                segura, manteniendo tu operación bajo control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Clients */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "AutoParts Pro nos ha ayudado a organizar todo el inventario y
                aumentar nuestras ventas."
              </p>
              <h4 className="font-semibold">Juan Pérez</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Dueño de Taller
              </span>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "La gestión de repuestos nunca fue tan sencilla y visual."
              </p>
              <h4 className="font-semibold">María López</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Gerente de Inventario
              </span>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Excelente plataforma para monitorear el stock y las ventas en
                tiempo real."
              </p>
              <h4 className="font-semibold">Carlos Martínez</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Administrador de Taller
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Empieza hoy mismo</h2>
        <p className="max-w-xl mx-auto mb-8">
          Regístrate y lleva el control total de tu inventario de autopartes.
        </p>
        <button className="px-8 py-4 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition">
          Comenzar ahora
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400 text-lg">
          © {new Date().getFullYear()} AutoParts Pro. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
};

export default Home;
