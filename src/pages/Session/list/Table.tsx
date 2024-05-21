import { Space, Button, notification, Spin } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { USER_UPDATE, USER_DELETE } from '../../../libs/constants/Permissions'
import { getPermissions } from '../../../libs/helpers/getLocalStorage'
import { getListSession } from '../../../services/request/session'
import { userApiDelete, userApi } from '../../../services/request/user'
import { getRole } from '../../../services/role'
import { Session, SessionFilterType } from '../../../types/session'
import { FilterType, User } from '../../../types/user'

interface SessionTableProps {
  filter: SessionFilterType
  setFilter: any
}

const getMonthName = (monthNumber: number | string) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // Subtract 1 from the month number to account for zero-based indexing
  const index = Number(monthNumber) - 1

  // Check if the index is within the valid range of month names
  if (index >= 0 && index < months.length) {
    return months[index]
  } else {
    return 'Invalid Month Number'
  }
}

const SessionTable = ({ filter, setFilter }: SessionTableProps) => {
  const [totalSession, setTotalSession] = useState()

  const [session, setSession] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState<boolean>()

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    const searchParams = new URLSearchParams(filter)
    // call api
    const fetcher = async () => {
      try {
        const res = await getListSession(searchParams)
        setSession(res.data.data.records)
        setTotalSession(res.data.data.total)
        setIsLoading(false)
      } catch (err) {
        notification['error']({
          duration: 5,
          message: 'Fail to load session list!',
        })
      }
    }
    fetcher()
  }, [])
  useEffect(() => {
    setIsLoading(true)
    const searchParams = new URLSearchParams(filter)
    // call api
    const fetcher = async () => {
      try {
        const res = await getListSession(searchParams)
        setSession(res.data.data.records)
        setIsLoading(false)
      } catch (err) {
        notification['error']({
          duration: 5,
          message: 'Fail to load session list!',
        })
      }
    }
    fetcher()
  }, [filter])

  const columns: ColumnsType<Session> = [
    {
      key: 'name',
      title: 'User name',
      dataIndex: 'user_name',
      align: 'center',
      width: '15%',
    },
    {
      key: 'year',
      title: 'Year',
      dataIndex: 'year',
      align: 'center',
      width: '15%',
    },
    {
      key: 'month',
      title: 'Month',
      dataIndex: 'month',
      align: 'center',
      width: '15%',
      render: (month: number | string) => {
        return <p>{getMonthName(month)}</p>
      },
    },
    {
      key: 'late_count',
      title: 'Late Count',
      dataIndex: 'late_count',
      align: 'center',
      width: '10%',
    },
    {
      key: 'leave_soon_count',
      title: 'Leave Soon Count',
      dataIndex: 'leave_soon_count',
      align: 'center',
      width: '10%',
    },
  ]
  return (
    <>
      {isLoading ? (
        <Spin className="flex justify-center" />
      ) : (
        <Table
          columns={columns}
          dataSource={session}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            total: totalSession,
            current: filter.page,
            onChange: (page) => {
              setFilter((filter: any) => ({ ...filter, page: page }))
            },
          }}
        />
      )}
    </>
  )
}

export default SessionTable
