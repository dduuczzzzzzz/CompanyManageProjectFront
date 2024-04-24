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
