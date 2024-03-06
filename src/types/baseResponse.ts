export interface BaseResponse<T = any> {
  status: boolean
  data: T
  message: string
}
