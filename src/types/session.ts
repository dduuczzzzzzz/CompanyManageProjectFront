export type SessionFilterType = {
  month?: string
  year?: string
  page?: any
}

export type Session = {
  user_id?: string | number
  month?: string | number
  year?: string | number
  late_count?: string | number
  leave_soon_count?: string | number
  user_name?: string
}
