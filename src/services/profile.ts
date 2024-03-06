import axiosInstance from './request/base'

export const profile = () => {
  return axiosInstance.get('/profile')
}
export type UpdateProfileRequest = {
  name: string
  email: string
  avatar: File
  address: string
  phone_number: string
  dob: Date
  gender: number
  details: string
  delete_avt: boolean
  password?: string
  password_confirmation?: string
}
export const updateProfile = (data: UpdateProfileRequest) => {
  return axiosInstance.post('/updateProfile', data)
}
