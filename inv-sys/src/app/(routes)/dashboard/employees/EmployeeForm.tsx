"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { Role } from "@/app/types"

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

interface EmployeeFormProps {
  employee?: Employee | null
  onSubmit: (data: Partial<Employee>) => void
  onCancel: () => void
}

export default function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastNameP: "",
    lastNameM: "",
    email: "",
    role: "Empleado",
    status: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username,
        firstName: employee.firstName,
        lastNameP: employee.lastNameP,
        lastNameM: employee.lastNameM,
        email: employee.email,
        role: employee.role,
        status: employee.status,
      })
    }
  }, [employee])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = "El usuario es requerido"
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido"
    if (!formData.lastNameP.trim()) newErrors.lastNameP = "El apellido paterno es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const roles = Object.values(Role).map(
  (role) => role.charAt(0).toUpperCase() + role.slice(1)
);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Usuario *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.username
                ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                : "border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50"
            }`}
            placeholder="Ingresa el usuario"
          />
          {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.email
                ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                : "border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50"
            }`}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.firstName
                ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                : "border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50"
            }`}
            placeholder="Ingresa el nombre"
          />
          {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name P */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Apellido Paterno *</label>
          <input
            type="text"
            name="lastNameP"
            value={formData.lastNameP}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.lastNameP
                ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                : "border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50"
            }`}
            placeholder="Apellido paterno"
          />
          {errors.lastNameP && <p className="text-red-400 text-sm mt-1">{errors.lastNameP}</p>}
        </div>

        {/* Last Name M */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Apellido Materno</label>
          <input
            type="text"
            name="lastNameM"
            value={formData.lastNameM}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            placeholder="Apellido materno (opcional)"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          name="status"
          id="status"
          checked={formData.status}
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 bg-slate-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="status" className="text-sm font-medium text-gray-300">
          Usuario activo
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/50">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-600/50 text-gray-300 font-medium rounded-xl hover:bg-gray-600/70 hover:text-white transition-all duration-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
        >
          {employee ? "Actualizar" : "Crear"} Empleado
        </button>
      </div>
    </form>
  )
}
