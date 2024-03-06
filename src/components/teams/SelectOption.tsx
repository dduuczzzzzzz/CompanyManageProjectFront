import { Select } from 'antd'
import React from 'react'
// import { User } from '../../components/teams/Filter'
interface Props {
  handleChange: (value: number[]) => void
  blog: string
  handleSearch: (data: string) => void
  data: User[] // dung import USer thi bi loi
  mode: string
}

interface User {
  id: number
  name: string
  email: string
  avatar: string
  address: string
  phone_number: string
  dob: string
  details: string
  gender: number
  role_id: number
  status: number
}
const SelectOption: React.FC<Props> = ({
  blog,
  handleChange,
  handleSearch,
  data,
  mode,
}) => {
  const { Option } = Select

  return (
    <>
      {mode === 'multiple' ? (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={blog}
          onChange={handleChange}
          onSearch={(e) => handleSearch(e)}
          filterOption={() => true}
        >
          {data.map((user) => {
            return <Option value={user.id}>{user.name}</Option>
          })}
        </Select>
      ) : (
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder={blog}
          onChange={handleChange}
          onSearch={(e) => handleSearch(e)}
          filterOption={() => true}
        >
          {data.map((user: User) => (
            <Option key={user.id} value={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>
      )}
    </>
  )
}

export default SelectOption
