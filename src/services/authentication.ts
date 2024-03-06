import axiosInstance from './request/base'

export type LoginRequest = {
  email: string
  password: string
  remember: boolean
}

export const login = (data: LoginRequest) => {
  return axiosInstance.post('/login', data)
}

export const logout = () => {
  return axiosInstance.get('/logout')
}
