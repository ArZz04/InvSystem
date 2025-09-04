"use client"

import type React from "react"
import { useState } from "react"
import { Role } from "@/app/types"

interface InviteFormProps {
  onClose: () => void
}

export default function InviteForm({ onClose }: InviteFormProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>(Role.Cajero)
  const [loading, setLoading] = useState(false)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }), // ya es número
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const data = await response.json()
      setInviteCode(data.code)
      console.log("Generated invite code:", data.code)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando invitación")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (inviteCode) navigator.clipboard.writeText(inviteCode)
  }

  if (inviteCode) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            ¡Invitación Generada!
          </h3>
          <p className="text-gray-300 text-sm">Código de invitación para {email}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Código de Invitación:</p>
              <p className="font-mono text-lg text-white bg-gray-900 px-3 py-2 rounded border">{inviteCode}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-3 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
            >
              Copiar
            </button>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
          <p className="text-yellow-300 text-sm">
            <strong>Importante:</strong> Este código expira en 7 días.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleInviteSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Generar Invitación de Empleado
        </h3>
        <p className="text-gray-400 text-sm mt-1">Crea un código de invitación para un nuevo empleado</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email del Empleado</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="empleado@empresa.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Rol a Asignar</label>
          <select
            value={role}
            onChange={(e) => setRole(Number(e.target.value) as Role)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(Role)
              .filter((r) => typeof r === "number")
              .map((roleOption) => (
                <option key={roleOption} value={roleOption} className="bg-gray-800">
                  {Role[roleOption as Role]} (ID: {roleOption})
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
        >
          {loading ? "Generando..." : "Generar Invitación"}
        </button>
      </div>
    </form>
  )
}