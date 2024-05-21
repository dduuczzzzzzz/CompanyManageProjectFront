import { SessionFilterType } from '../../../types/session'
import { Button, DatePicker, Space } from 'antd'
import { getPermissions } from '../../../libs/helpers/getLocalStorage'
import { SESSION_EXPORT } from '../../../libs/constants/Permissions'
import { DownloadOutlined } from '@ant-design/icons'
import { exportSessionAPI } from '../../../services/request/session'
import filter from '../../../components/user/filter'

interface SessionFilterProps {
  filter: SessionFilterType
  setFilter: any
}

const SessionFilter = ({ filter, setFilter }: SessionFilterProps) => {
  const permissionsInfo = getPermissions()
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

  const exportSessionHandler = async () => {
    const searchParams = new URLSearchParams(filter)
    return await exportSessionAPI(searchParams)
  }

  return (
    <div className="flex justify-start mb-5">
      <DatePicker
        onChange={handelMonthChange}
        picker="month"
        className="mr-2"
      />
      <DatePicker onChange={handleYearChange} picker="year" />
      {permissionsInfo &&
        SESSION_EXPORT.every((element: string) =>
          permissionsInfo.includes(element),
        ) && (
          <Button className="ml-auto" onClick={exportSessionHandler}>
            <DownloadOutlined />
          </Button>
        )}
    </div>
  )
}

export default SessionFilter
