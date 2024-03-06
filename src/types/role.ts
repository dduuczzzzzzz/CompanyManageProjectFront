export interface Role {
  id: number
  role_name: string
  role_permissions: string[]
  description: string
  created_at: string
}

export interface ParamsRole {
  name?: string
  page?: number
  limit?: number
  sortType?: number
}
