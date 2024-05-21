import { Select, Input, Button } from 'antd'
import React, { useState, createContext } from 'react'
import { FilterType } from '../../types/user'
import { SelectRole } from './selectRole'
import { RoleSelect } from './roleSelect'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import { USER_EXPORT } from '../../libs/constants/Permissions'
import { DownloadOutlined } from '@ant-design/icons'
import { exportUserAPI } from '../../services/request/user'

const { Search } = Input
const Filter = ({
  setFilter,
  filterValue,
}: {
  setFilter: any
  filterValue: FilterType
}) => {
  const permissionsInfo = getPermissions()
  const handleSearch = (name: any, value: any) => {
    if (!value) {
      setFilter((filter: any) => ({ ...filter, [name]: '', page: 1 }))
      return
    }
    setFilter((filter: any) => ({ ...filter, [name]: value, page: 1 }))
  }
  const handleReset = () => {
    setFilter((filter: any) => ({
      page: 1,
    }))
  }
  const exportUserHandler = async () => {
    const searchParams = new URLSearchParams(filterValue)
    return await exportUserAPI(searchParams)
  }
  return (
    <>
      <div className={'mb-6 w-full flex'}>
        <div className={'mb-4 mr-6 w-1/4 float-right'}>
          <Search
            name="searchInput"
            onSearch={(event) => handleSearch('search', event)}
            placeholder="Search for name or email"
            enterButton
            className={' float-right'}
          />
        </div>
        <div className={'mr-6 inline'}>
          <Select
            placeholder={'Select Gender'}
            onChange={(event) => handleSearch('gender', event)}
            // value={filterValue?.gender}
            className={'w-32'}
            allowClear
            options={[
              { value: '2', label: 'Female' },
              { value: '1', label: 'Male', checked: true },
            ]}
          />
        </div>
        <div className={'mr-6 inline'}>
          <Select
            placeholder={'Select Status'}
            onChange={(event) => handleSearch('status', event)}
            // value={filterValue?.status}
            className={'w-32'}
            allowClear
            options={[
              { value: '0', label: 'Actice' },
              { value: '1', label: 'Inactive' },
            ]}
          />
        </div>
        <div className={'mr-6 inline'}>
          <RoleSelect
            className=""
            handleCHange={handleSearch}
            setRole=""
            valueInput=""
            placeHolder="Select role"
          />
        </div>
        {permissionsInfo &&
          USER_EXPORT.every((element: string) =>
            permissionsInfo.includes(element),
          ) && (
            <Button className="ml-auto" onClick={exportUserHandler}>
              <DownloadOutlined />
            </Button>
          )}
      </div>
    </>
  )
}

export default Filter
