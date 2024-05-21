import { message, notification } from 'antd'
import axiosInstance from './base'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { AttendanceFormRequest } from '../../types/attendance'
// import { ErrorMessage } from '../../types/user'

export const getListSession = (searchParams: URLSearchParams | undefined) => {
  return axiosInstance.get('/session', {
    params: searchParams,
  })
}

export const upsertSessionAPI = (data: any) => {
  return axiosInstance.post(`/session/upsert`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const exportSessionAPI = (searchParams: URLSearchParams) => {
  return axiosInstance
    .get(`/session/export`, {
      params: searchParams,
      responseType: 'blob',
    })
    .then((value: any) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(value.data)

      // Create an <a> element to trigger the download
      const a = document.createElement('a')
      a.href = url
      a.download = 'session.xlsx'

      // Trigger a click event to download the file
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
    })
}
