import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Switch, Form, Select, Button, notification, Spin } from 'antd'
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar'
import MainLayout from '../../components/layouts/main'
import {
  attendanceListAPI,
  exportAttendanceAPI,
} from '../../services/request/attendance'
import { ATTENDANCE_STATUS } from '../../libs/constants/Attendance'
import { DownloadOutlined } from '@ant-design/icons'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import { ATTENDANCE_EXPORT } from '../../libs/constants/Permissions'
import { getUser } from '../../libs/helpers/getLocalStorage'
import { ROLES } from '../../libs/constants/roles'

export const AttendanceListLoader = async (
  searchParams: URLSearchParams | undefined,
) => {
  try {
    const response = await attendanceListAPI(searchParams)
    return response.data.data
  } catch (e) {
    notification['error']({
      duration: 5,
      message: 'Fail to load attendance list!',
    })
  }
}

const AtendanceListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [attendance, setAttendance] = useState<Object>([])
  const [manageMode, setManageMode] = useState<boolean>()
  const [startDateRender, setStartDateRender] = useState()
  const [endDateRender, setEndDateRender] = useState()
  const [middate, setMidDate] = useState<Date>()
  const [initView, setInitView] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<number>()
  const [form] = Form.useForm()
  const user_info = getUser()
  useEffect(() => {
    setLoading(true)
    setManageMode(JSON.parse(searchParams.get('manageMode') || 'false'))
    setStatus(JSON.parse(searchParams.get('status') || '3'))
    AttendanceListLoader(searchParams).then((value) => {
      setAttendance(value)
      setLoading(false)
    })
  }, [searchParams])
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (endDateRender && startDateRender) {
      params.set('start', endDateRender)
      params.set('end', startDateRender)
      const start = new Date(startDateRender).getTime()
      const end = new Date(endDateRender).getTime()
      const mid = new Date((start + end) / 2)
      if(mid) setMidDate(mid)
    } 
    setSearchParams(params)
  }, [startDateRender, endDateRender])

  const handleManageMode = () => {
    form.submit()
  }

  const statusHandler = () => {
    form.submit()
  }

  const handleFormSubmit = (event: any) => {
    const params = new URLSearchParams(searchParams)

    if (event.manageMode) {
      params.set('manageMode', event.manageMode)
    } else {
      params.delete('manageMode')
    }

    if (event.status !== null && event.status !== undefined) {
      params.set('status', event.status)
    }
    else {
      params.delete('status')
    }

    setSearchParams(params)
  }

  const exportAttendanceHandler = async () => {
    return await exportAttendanceAPI(searchParams)
  }
  const permissionsInfo = getPermissions()
  return (
    <MainLayout>
      <Form
        form={form}
        onFinish={handleFormSubmit}
        className="flex justify-between"
      >
        <Form.Item name="status">
          <Select placeholder="Select attendance type" onChange={statusHandler}>
            <Select.Option value="">Select attendance type</Select.Option>
            <Select.Option value={ATTENDANCE_STATUS.NOT_REVIEWED}>
              Not reviewed
            </Select.Option>
            <Select.Option value={ATTENDANCE_STATUS.ATTENDANCE_ACCEPT}>
              Accepted
            </Select.Option>
            <Select.Option value={ATTENDANCE_STATUS.ATTENDANCE_REJECT}>
              Rejected
            </Select.Option>
          </Select>
        </Form.Item>
        {permissionsInfo &&
          ATTENDANCE_EXPORT.every((element: string) =>
            permissionsInfo.includes(element),
          ) && (
            <Button className="ml-2" onClick={exportAttendanceHandler}>
              <DownloadOutlined />
            </Button>
          )}
        {(user_info?.role === ROLES.ADMIN ||
          user_info?.role === ROLES.MANAGER) && (
          <Form.Item name={'manageMode'} className="ml-auto">
            <Switch
              checkedChildren="Manage mode"
              unCheckedChildren="Personal mode"
              onClick={handleManageMode}
              checked={manageMode}
            />
          </Form.Item>
        )}
      </Form>
      {loading ? 
        (<Spin className='flex justify-center'/>)
        : (
          <AttendanceCalendar
            attendanceList={attendance}
            manageMode={manageMode}
            getNewAttendanceList={setAttendance}
            searchParams={searchParams}
            setStart={setStartDateRender}
            setEnd={setEndDateRender}
            setLoading={setLoading}
            initDate={middate}
            initView={initView}
            setInitview={setInitView}
          />
        )
      } 
    </MainLayout>
  )
}

export default AtendanceListPage
