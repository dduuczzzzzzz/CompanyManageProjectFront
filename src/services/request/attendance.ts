import axiosInstance from './base'
import { AttendanceFormRequest } from '../../types/attendance'

export const attendanceListAPI = (
  searchParams: URLSearchParams | undefined,
) => {
  return axiosInstance.get('/attendance', {
    params: searchParams,
  })
}

export const addAttendanceAPI = (data: AttendanceFormRequest) => {
  return axiosInstance.post('/attendance/store', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getAttendanceDetailsAPI = (id: number | undefined) => {
  return axiosInstance.get(`/attendance/show/${id}`)
}

export const editAttendanceAPI = (
  id: number | undefined,
  data: AttendanceFormRequest,
) => {
  return axiosInstance.post(`/attendance/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteAttendanceAPI = (id: number) => {
  return axiosInstance.delete(`/attendance/delete/${id}`)
}

export const approveAttendanceAPI = (
  id: number | undefined,
  result: string,
) => {
  return axiosInstance.put(`/attendance/accept/${id}`, result)
}

export const rejectAttendanceAPI = (id: number | undefined, result: string) => {
  return axiosInstance.put(`/attendance/reject/${id}`, result)
}

export const exportAttendanceAPI = (searchParams: URLSearchParams) => {
  return axiosInstance
    .get(`/attendance/export`, {
      params: searchParams,
      responseType: 'blob',
    })
    .then((value: any) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(value.data)

      // Create an <a> element to trigger the download
      const a = document.createElement('a')
      a.href = url
      a.download = 'attendance.xlsx'

      // Trigger a click event to download the file
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
    })
}
