import { Select, Input, Button } from 'antd'
import Search from 'antd/es/input/Search'
import React from 'react'

interface Props {
  setFilter: React.Dispatch<
    React.SetStateAction<{
      details: string
      name: string
      sort: string
      sortType: string
      page: string
      limit: string
    }>
  >
  valueFilter: {
    details: string
    name: string
    sort: string
    sortType: string
    page: string
    limit: string
  }
  blog: string
  handleReset: () => void
}

const Filter: React.FC<Props> = ({
  valueFilter,
  setFilter,
  blog,
  handleReset,
}) => {
  const onChange = (value: string) => {
    if (!value) {
      setFilter({
        ...valueFilter,
        sort: '',
        sortType: '',
      })
    }
    setFilter({
      ...valueFilter,
      sort: 'created_at',
      sortType: value,
    })
  }
  return (
    <>
      <div className={'mb-8'}>
        <div className={'mr-6 inline'}>
          <Search
            name="searchInput"
            onSearch={(e) => {
              setFilter({
                ...valueFilter,
                name: e,
              })
            }}
            placeholder="Search for team name"
            enterButton="Search"
            size="large"
            className={'w-[40%]'}
          />
        </div>
      </div>
    </>
  )
}
export default Filter
