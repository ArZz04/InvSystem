// app/types.ts
export enum Role {
  Administrador = 0,
  Compras      = 2,
  Encargado    = 1,
  Cajero       = 3
}

export type Employee = {
  id: string
  n_employee: number
  username: string
  firstName: string
  lastNameP: string
  lastNameM: string
  email: string
  role: number
  status: boolean
}

export type PaginationResponse = {
  page: number
  totalPages: number
  totalUsers: number
  users: Employee[]
}