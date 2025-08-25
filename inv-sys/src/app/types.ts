// app/types.ts
export enum Role {
  Administrador = "administrador",
  Almacenista = "almacenista",
  Auxiliar = "auxiliar",
  Vendedor = "vendedor",
}

export type Employee = {
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

export type PaginationResponse = {
  page: number
  totalPages: number
  totalUsers: number
  users: Employee[]
}