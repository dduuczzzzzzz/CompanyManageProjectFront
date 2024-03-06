import axios, { AxiosRequestHeaders } from 'axios'
const REQUEST_TIMEOUT = 30000
const BASE_URL = process.env.REACT_APP_API_URL
const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken') // Todo: get access token
    if (accessToken) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        } as AxiosRequestHeaders,
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user_info')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
export default axiosInstance
