import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { getRole } from '../../services/request/user'

const { Option } = Select

export const RoleSelect = ({
  className,
  handleCHange,
  valueInput,
  setRole,
  placeHolder,
}: {
  className: string
  handleCHange: any
  valueInput: string
  setRole: any
  placeHolder?: string
}) => {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    getRoles()
  }, [])

  const getRoles = async () => {
    const response = await getRole()
    setRoles(response)
  }
  return (
    <>
      <Select
        placeholder={placeHolder}
        className={'w-28' + className}
        allowClear
        onChange={(event) => {
          handleCHange('role', event)
        }}
      >
        {roles.map((role: any, index: number) => {
          return <Option key={role.id}>{role.role_name}</Option>
        })}
      </Select>
    </>
  )
}
