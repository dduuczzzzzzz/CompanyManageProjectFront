import { TypeEvent, TypeOptionsEvent, TypeParamsEvent } from '../types/event'
import axiosInstance from './request/base'

export const event = (params: TypeParamsEvent) => {
  return axiosInstance.get(`/event?`, { params: params })
}
export const addEvent = (data: TypeEvent) => {
  return axiosInstance.post('/event/store', data)
}

export const updateEvent = (data: TypeEvent, id: string) => {
  return axiosInstance.post(`/event/update/${id}`, data)
}

export const editEvent = (id: string) => {
  return axiosInstance.get(`/event/edit/${id}`)
}

export const deleteEvent = (id: number) => {
  return axiosInstance.delete(`/event/delete/${id}`)
}

export const getTypeEvent = () => {
  return axiosInstance.get<TypeOptionsEvent>(`/event/type`)
}
