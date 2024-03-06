import { Select } from 'antd'
import React from 'react'
interface Props {
  handleChange: (value: number[]) => void
  blog: string
  handleSearch: (data: string) => void
  data: User[]
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
  // const  a= {mode.localeCompare("multiple") ? "multiple" : 'tags'};

  return (
    <>
      {mode == 'multiple' ? (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={blog}
          // defaultValue={1}
          // initialValue =
          value={[2]}
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
          {data.map((user) => {
            return <Option value={user.id}>{user.name}</Option>
          })}
        </Select>
      )}
    </>
  )
}

export default SelectOption
