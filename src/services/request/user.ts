import { message } from 'antd'
import axiosInstance from './base'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
// import { ErrorMessage } from '../../types/user'

export const getAllUserAPI = () => {
  return axiosInstance.get(`/user/get-all`)
}

export const userApi = async (
  // method:string,
  filter: any,
  {
    setUsers,
    setTotalUser,
    setIsLoading,
  }: { setUsers: any; setTotalUser: any; setIsLoading: any },
) => {
  const parramURL = new URLSearchParams(filter)
  try {
    setIsLoading(true)
    const userData = await axiosInstance
      .get(`/user?${parramURL}`)
      .then((response) => {
        return response.data.data
      })
    setUsers(userData.records)
    setTotalUser(userData.total)
    setIsLoading(false)
  } catch (error) {}
}

export const userApiDelete = async (
  { setIdUser, setIsLoading }: { setIdUser: any; setIsLoading: any },
  id: string,
) => {
  try {
    const userData = await axiosInstance
      .delete(`/user/delete/${id}`)
      .then((response) => {
        setIsLoading(false)
        setTimeout(() => {
          setIdUser(id)
          message.success('Delete successfully')
        }, 0)
        return true
      })
  } catch (errors: any) {}
}

export const userApiGetUser = async (
  {
    setUserData,
    setStartDate,
    setIsLoading,
  }: { setUserData: any; setStartDate: any; setIsLoading: any },
  id: string,
) => {
  try {
    const userData = await axiosInstance
      .get(`/user/show/${id}`)
      .then((response) => {
        setUserData(response.data.data)
        if (response.data.data?.dob) {
          setStartDate(new Date(response.data.data?.dob))
        }
        setIsLoading(false)
        return response.data.data
      })
  } catch (errors: any) {
    console.log('Error: ', errors)
  }
}

export const userApiCreate = async (
  { setError }: { setError: any },
  createValue: any,
) => {
  try {
    const userData = await axiosInstance
      .post(`/user/store`, createValue)
      .then((response) => {
        setTimeout(() => {
          message.success('Create successfully a new user')
        }, 0)
        return response
      })

    return [userData, undefined]
  } catch (errors: any) {
    console.log('Error: ', errors)
    setError(errors.response.data.errors)
    return [undefined, errors.response.data.errors]
  }
}

export const userApiUpdate = async (
  { setError }: { setError: any },
  error: any,
  createValue: any,
  id: string,
) => {
  try {
    const userData = await axiosInstance
      .post(`/user/update/${id}`, createValue)
      .then((response) => {
        setTimeout(() => {
          message.success('Update successfully a user')
        }, 0)
        return response
      })
    console.log(userData)
    return [userData, undefined]
  } catch (errors: any) {
    console.log('Error: ', errors)
    setError(errors.response.data.errors)
    return [undefined, errors.response.data.errors]
  }
}

export const getRole = async () => {
  try {
    const roleData = await axiosInstance.get(`/role`).then((response) => {
      if (response.data) {
        const dataset = response.data.data.records
        return dataset
      }
    })
    return roleData
  } catch (errors: any) {
    const errorApi = errors.response.data.errors
  }
}

export const GetImportInfor = async (
  {
    setDataImport,
    setLoopTime,
    setLoadings,
    setFile,
    setFileList,
  }: {
    setDataImport: any
    setLoopTime: any
    setLoadings: any
    setFile: any
    setFileList: any
  },
  id: string,
) => {
  try {
    const importData = await axiosInstance
      .get(`/user/importInfor/${id}`)
      .then((response) => {
        return response.data.data
      })
    const importStatus = (await importData[0].status) == 1
    if (importStatus) {
      setLoopTime(false)
      setLoadings(false)
      setFile('')
      setFileList([])
    } else {
      setLoopTime(true)
    }

    setDataImport(importData)
  } catch (errors: any) {
    // setLoopTime(1000)
    console.log('Error: ', errors)
  }
}

export const ImportInfor = async (
  data: any,
  { setLoopTime, setLoadings }: { setLoopTime: any; setLoadings: any },
) => {
  try {
    const importData = await axiosInstance
      .post(`/user/importUser`, data)
      .then((response) => {
        // console.log(response)
      })
  } catch (errors: any) {
    console.log('Error: ', errors?.response?.data?.errors)
    const bugs = errors?.response?.data?.errors
    for (const key in bugs) {
      message.error(bugs[key])
    }
    setLoopTime(false)
    setLoadings(false)
  }
}
