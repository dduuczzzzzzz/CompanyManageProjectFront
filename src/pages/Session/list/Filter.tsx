import { SessionFilterType } from '../../../types/session'
import { DatePicker, Space } from 'antd'

interface SessionFilterProps {
  filter: SessionFilterType
  setFilter: any
}

const SessionFilter = ({ filter, setFilter }: SessionFilterProps) => {
  const currentDate = new Date()
  // Get the current year using the getFullYear() method
  const currentYear = currentDate.getFullYear()
  // Get the current month using the getMonth() method
  // Note: Months are zero-based, so January is 0, February is 1, etc.
  const currentMonth = currentDate.getMonth() + 1
  const handleChangeFilter = (name: any, value: any) => {
    if (!value) {
      setFilter((filter: any) => ({ ...filter, [name]: '', page: 1 }))
      return
    }
    setFilter((filter: any) => ({ ...filter, [name]: value, page: 1 }))
  }

  const handelMonthChange = (value: any) => {
    if (value) {
      console.log(value.format('M'))
      const month = value.format('M')
      setFilter((filter: any) => ({ ...filter, ['month']: month, page: 1 }))
    } else {
      setFilter((filter: any) => ({
        ...filter,
        ['month']: currentMonth,
        page: 1,
      }))
    }
  }

  const handleYearChange = (value: any) => {
    if (value) {
      console.log(value.format('Y'))
      const year = value.format('Y')
      setFilter((filter: any) => ({ ...filter, ['year']: year, page: 1 }))
    } else {
      setFilter((filter: any) => ({
        ...filter,
        ['year']: currentYear,
        page: 1,
      }))
    }
  }

  return (
    <div className="flex justify-start mb-5">
      <DatePicker
        onChange={handelMonthChange}
        picker="month"
        className="mr-2"
      />
      <DatePicker onChange={handleYearChange} picker="year" />
    </div>
  )
}

export default SessionFilter
