import { BaseResponse } from './baseResponse'

export interface TypeEvent {
  id: number
  name: string
  type: string
  start_time: number
  end_time: number
  description: string
  location: string
  image: Array<string>
  link: string
  created_at: string
  created_by: {
    address: string
    avatar: string
    details: string
    dob: string
    email: string
    gender: number
    name: string
    phone_number: string
    role: string
    status: number
  }
}

export interface TypeParamsEvent {
  name?: string
  type?: number
  date?: string
  page?: number
  limit?: number
}

export interface TypeOptionsEvent
  extends BaseResponse<Array<{ id: number; name: string }>> {}
