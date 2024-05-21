export interface User {
  id: string
  key: React.Key
  name: string
  email: string
  address: string
  phone_number: string
  dob: string
  gender: number
  role: string
  status: number
  details: string
  avatar: string
}
export type FilterType = {
  gender: string
  status: string
  role: string
  page?: any
  limit?: any
}
export type FileType = {
  // value: any
  imgSrc: string
  inputValue: any
}
export interface ErrorMessage {
  dobError: string
  emailError: string
  nameError: string
  genderError: string
  statusError: string
  roleError: string
  passwordError: string
}
