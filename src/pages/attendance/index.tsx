import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Switch,
  Form,
  Select,
  Button,
  notification,
  Spin,
  DatePicker,
} from 'antd'
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
import { User } from '../../types/user'
import { Rule } from 'antd/es/form'
import { AttendanceType } from '../../types/attendance'
import { date } from 'yup'
import { getAllUserAPI } from '../../services/request/user'
import Spinner from '../../components/user/spin'

const { Option } = Select

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
  const [attendance, setAttendance] = useState<any>([])
  const [manageMode, setManageMode] = useState<boolean>()
  const [startDateRender, setStartDateRender] = useState()
  const [endDateRender, setEndDateRender] = useState()
  const [middate, setMidDate] = useState<Date>()
  const [initView, setInitView] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<number>()
  const [users, setUsers] = useState<any>([])
  const [date, setDate] = useState<Date>()
  const [form] = Form.useForm()
  const user_info = getUser()
  const attendanceTypeList = attendance?.attendance_types

  useEffect(() => {
    setLoading(true)
    setManageMode(JSON.parse(searchParams.get('manageMode') || 'false'))
    setStatus(JSON.parse(searchParams.get('status') || '3'))
    const getData = setTimeout(
      () =>
        AttendanceListLoader(searchParams).then((value) => {
          setAttendance(value)
          setLoading(false)
        }),
      500,
    )
    return () => clearTimeout(getData)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (endDateRender && startDateRender) {
      params.set('start', endDateRender)
      params.set('end', startDateRender)
      const start = new Date(startDateRender).getTime()
      const end = new Date(endDateRender).getTime()
      const mid = new Date((start + end) / 2)
      if (mid) setMidDate(mid)
    }
    setSearchParams(params)
  }, [startDateRender, endDateRender])

  useEffect(() => {
    getAllUsers()
  }, [])

  const getAllUsers = async () => {
    const res = await getAllUserAPI()
    setUsers(res.data.data)
  }

  const handleManageMode = () => {
    form.submit()
  }

  const statusHandler = () => {
    form.submit()
  }

  const userSelectHandler = () => {
    form.submit()
  }

  const typeSelectHandler = () => {
    form.submit()
  }

  const handleFormSubmit = (event: any) => {
    const params = new URLSearchParams(searchParams)

    if (event.manageMode) {
      params.set('manageMode', event.manageMode)
    } else {
      params.delete('manageMode')
    }

    if (
      event.status !== null &&
      event.status !== undefined &&
      event.status !== ''
    ) {
      params.set('status', event.status)
    } else {
      params.delete('status')
    }

    if (
      event.create_by_id !== null &&
      event.create_by_id !== undefined &&
      event.create_by_id !== ''
    ) {
      params.delete('created_by_id[]')
      event.create_by_id.forEach((id: string) => {
        params.append('created_by_id[]', id)
      })
    } else {
      params.delete('created_by_id[]')
    }

    if (event.type !== null && event.type !== undefined && event.type !== '') {
      params.delete('type[]')
      event.type.forEach((id: string) => {
        params.append('type[]', id)
      })
    } else {
      params.delete('type[]')
    }

    setSearchParams(params)
  }

  const userSelectClear = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('created_by_id[]')
    setSearchParams(params)
  }

  const typeSelectClear = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('type[]')
    setSearchParams(params)
  }

  const exportAttendanceHandler = async () => {
    return await exportAttendanceAPI(searchParams)
  }

  const filterUserHandler = (input: string, option: any) => {
    return (
      option.props.children
        .toString()
        .toLowerCase()
        .indexOf(input.toLowerCase()) !== -1
    )
  }

  const goToDateHandler = (value: any) => {
    if (value) {
      setDate(value.format('YYYY-MM-DD'))
    } else {
      const today = new Date()
      setDate(today)
    }
  }

  const maxUserCount = async (rule: Rule, value: any) => {
    if (value && value.length > 10) {
      throw 'Can only select upto 10 users!'
    }
  }

  const permissionsInfo = getPermissions()

  return (
    <MainLayout>
      <Form form={form} onFinish={handleFormSubmit}>
        <div className="flex justify-between">
          <Form.Item name="status">
            <Select
              placeholder="Select attendance type"
              onChange={statusHandler}
            >
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
        </div>
        <div className="flex">
          <Form.Item name="type" className="mr-2 w-1/4">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select attendance types"
              maxTagCount={4}
              onChange={typeSelectHandler}
              onClear={typeSelectClear}
            >
              {attendanceTypeList?.map((type: AttendanceType) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="create_by_id"
            className="w-1/2"
            rules={[{ validator: maxUserCount }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select users"
              filterOption={filterUserHandler}
              maxTagCount={4}
              onChange={userSelectHandler}
              onClear={userSelectClear}
              // onDeselect={userSelectHandler}
            >
              <Option key={user_info.id} value={user_info.id}>
                {`<<me>>`}
              </Option>
              {users?.map(
                (user: User) =>
                  user.id !== user_info.id && (
                    <Option key={user.id} value={user.id}>
                      {user.name}
                    </Option>
                  ),
              )}
            </Select>
          </Form.Item>
          <Form.Item className="ml-2">
            <DatePicker onChange={goToDateHandler} />
          </Form.Item>
        </div>
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
      <AttendanceCalendar
        attendanceList={attendance}
        users={users}
        manageMode={manageMode}
        getNewAttendanceList={setAttendance}
        searchParams={searchParams}
        setStart={setStartDateRender}
        setEnd={setEndDateRender}
        setLoading={setLoading}
        initDate={middate}
        initView={initView}
        setInitview={setInitView}
        date={date}
      />
      {loading && <Spinner />}
    </MainLayout>
  )
}

export default AtendanceListPage
