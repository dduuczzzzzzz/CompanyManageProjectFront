import { ParamsRole, Role } from '../types/role'
import axiosInstance from './request/base'

export const role = (params: ParamsRole) => {
  return axiosInstance.get(`/role?`, { params: params })
}
export const addRole = (data: Role) => {
  return axiosInstance.post('/role/create-role', data)
}
export const getRole = (id: number) => {
  return axiosInstance.get(`/role/get-detail-role/${id}`)
}
export const updateRole = (data: Role, id: number) => {
  return axiosInstance.put(`/role/update-role/${id}`, data)
}

export const deleteRole = (id: number) => {
  return axiosInstance.delete(`/role/delete-role/${id}`)
}

export const listRoute = () => {
  return axiosInstance.get(`/role/listRoute`)
}
export const updatePermission = (data: any, id: number) => {
  return axiosInstance.post(`/role/changePermission/${id}`, data)
}
