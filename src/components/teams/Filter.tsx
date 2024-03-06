import { Select, Input, Button } from 'antd'
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
    setFilter({
      ...valueFilter,
      sort: 'created_at',
      sortType: value,
    })
  }
  return (
    <>
      <div className="... flex items-center justify-center">
        <h1>{blog}</h1>
      </div>
      <div className={'mb-12'}>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Name
          </label>
          <Input
            name="searchInput"
            size="large"
            style={{ width: 200 }}
            value={valueFilter.name}
            onChange={(e) =>
              setFilter({
                ...valueFilter,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Details
          </label>
          <Input
            name="searchInput"
            value={valueFilter.details}
            size="large"
            style={{ width: 200 }}
            onChange={(e) =>
              setFilter({
                ...valueFilter,
                details: e.target.value,
              })
            }
          />
        </div>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Create At
          </label>
          <Select
            style={{ width: 120 }}
            defaultValue={valueFilter.sortType}
            options={[
              { value: '0', label: 'Descending' },
              { value: '1', label: 'Ascending' },
            ]}
            onChange={onChange}
          />
        </div>
        <div className={'mr-6 inline'}>
          <Button
            type="primary"
            style={{ backgroundColor: 'brown' }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  )
}
export default Filter
