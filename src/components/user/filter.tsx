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
    setFilter((filter: any) => ({ ...filter, [name]: value, page: 1 }))
  }
  const handleReset = () => {
    setFilter((filter: any) => ({
      page: 1,
    }))
  }
  return (
    <>
      <div className={'mb-12'}>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Gender
          </label>
          <Select
            onChange={(event) => handleSearch('gender', event)}
            value={filterValue?.gender}
            className={'w-28'}
            options={[
              { value: '2', label: 'Female' },
              { value: '1', label: 'Male', checked: true },
            ]}
          />
        </div>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Status
          </label>
          <Select
            onChange={(event) => handleSearch('status', event)}
            value={filterValue?.status}
            className={'w-28'}
            options={[
              { value: '1', label: 'Actice' },
              { value: '0', label: 'Block' },
            ]}
          />
        </div>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Role
          </label>
          <RoleSelect
            className=""
            handleCHange={handleSearch}
            setRole=""
            valueInput=""
          />
        </div>
        <div className={'mr-6 inline'}>
          <Button type="primary" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <div className={'mb-4 w-1/3 float-right'}>
          <Search
            name="searchInput"
            onSearch={(event) => handleSearch('search', event)}
            placeholder="Search for name or email"
            enterButton="Search"
            size="large"
            className={' float-right'}
          />
        </div>
      </div>
    </>
  )
}

export default Filter
