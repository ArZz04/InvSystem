"use client"
import { useEffect, useState } from "react"

type Employee = {
  id: string
  n_employee: number
  username: string
  firstName: string
  lastNameP: string
  lastNameM: string
  email: string
  role: string
  status: boolean
}

type PaginationResponse = {
  page: number
  totalPages: number
  totalUsers: number
  users: Employee[]
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      setError("")

      try {
        const token = localStorage.getItem("token")
        const params = new URLSearchParams({
          page: currentPage.toString(),
          ...(searchTerm && { search: searchTerm }),
          ...(roleFilter && { role: roleFilter }),
          ...(statusFilter && { status: statusFilter }),
        })

        const res = await fetch(`/api/auth/employees?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          setError(`Error: ${res.status}`)
          return
        }

        const data: PaginationResponse = await res.json()
        setEmployees(data.users)
        setTotalPages(data.totalPages)
        setTotalUsers(data.totalUsers)
      } catch (err) {
        console.error(err)
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [currentPage, searchTerm, roleFilter, statusFilter]) // Added dependencies for real-time filtering

  const uniqueRoles = ["Administrador", "Empleado", "Supervisor"] // Static roles for filter

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Gestión de Empleados
          </h1>
          <p className="text-gray-400">Administra y visualiza la información de tu equipo</p>
        </div>

        <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Buscar empleado</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, usuario o email..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filtrar por rol</label>
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="">Todos los roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filtrar por estado</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>

          {/* Results counter */}
          <div className="mt-4 text-sm text-gray-400">
            Mostrando {employees.length} de {totalUsers} empleados (Página {currentPage} de {totalPages})
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">Cargando empleados...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-700/50 to-gray-700/50 border-b border-gray-600/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Usuario</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Apellido P.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Apellido M.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Rol</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className="border-b border-gray-700/30 hover:bg-slate-700/30 transition-all duration-300 group"
                    >
                      <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors">
                        {emp.n_employee}
                      </td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors font-medium">
                        {emp.username}
                      </td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors">
                        {emp.firstName}
                      </td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors">
                        {emp.lastNameP}
                      </td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors">
                        {emp.lastNameM}
                      </td>
                      <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors">{emp.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            emp.status
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {emp.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {employees.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400">No se encontraron empleados con los filtros aplicados</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-700/30 bg-gradient-to-r from-slate-700/30 to-gray-700/30">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Página {currentPage} de {totalPages} ({totalUsers} empleados en total)
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPage === 1
                          ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                      }`}
                    >
                      Anterior
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPage === totalPages
                          ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
