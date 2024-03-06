export interface Team {
  id: number
  name: string
  leader: {
    name: string
    id: string
  }
  details: string
  created_at: string
  member: number
}

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  address: string
  phone_number: string
  dob: string
  details: string
  gender: number
  role_id: number
  status: number
}
