import { Select, Input, Button } from 'antd'
import React, { useState, createContext } from 'react'
import { FilterType } from '../../types/user'
import { SelectRole } from './selectRole'
import { RoleSelect } from './roleSelect'

const { Search } = Input
const Filter = ({
  setFilter,
  filterValue,
}: {
  setFilter: any
  filterValue: FilterType
}) => {
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
              { value: '1', label: 'Actice' },
              { value: '0', label: 'Block' },
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
      </div>
    </>
  )
}

export default Filter
