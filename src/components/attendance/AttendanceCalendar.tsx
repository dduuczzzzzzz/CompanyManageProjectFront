import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DateInput, DateSelectArg } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Form } from 'antd'
import { formatDateTime, formatEndDate } from '../../libs/helpers/DateFormat'
import { AttendanceFormData } from '../../types/attendance'
import AddAttendanceModal from './AddAttendanceModal'
import EditAttendanceModal from './EditAttendanceModal'
import ReviewAttendanceModal from './ReviewAttendanceModal'
import { useCollapsedProvider } from '../../libs/contexts/CollapsedContext'
import '../../styles/fullcalendar.css'
import { getAttendanceDetailsAPI } from '../../services/request/attendance'

interface Props {
  attendanceList?: any
  manageMode?: boolean
  getNewAttendanceList?: any
  searchParams?: URLSearchParams
  setStart?: any
  setEnd?: any
  setLoading: Dispatch<SetStateAction<boolean>>
  initDate?: Date
  initView?: string
  setInitview: Dispatch<SetStateAction<any>>
  date?: DateInput
  users?: any
}

const AttendanceCalendar = ({
  attendanceList,
  manageMode,
  getNewAttendanceList,
  searchParams,
  setStart,
  setEnd,
  setLoading,
  initDate,
  initView,
  setInitview,
  date,
  users,
}: Props) => {
  const context = useCollapsedProvider()
  const calendarRef = useRef<FullCalendar | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<AttendanceFormData>()
  const [isDateClick, setIsDateClick] = useState<boolean>()
  const [isEventClick, setIsEventClick] = useState<boolean>()
  const [form] = Form.useForm()

  const handleOk = () => {
    setIsModalOpen(false)
    setIsDateClick(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsDateClick(false)
    form.resetFields()
  }

  useEffect(() => {
    setTimeout(() => {
      if (calendarRef.current) {
        // Trigger FullCalendar resize when the sidebar is expanded
        calendarRef.current.getApi().updateSize()
      }
    }, 200)
  }, [context.collapsed])

  useEffect(() => {
    if (calendarRef.current) {
      if (date) calendarRef.current.getApi().gotoDate(date)
    }
  }, [date])

  const handleDateClick = (info: DateSelectArg) => {
    setIsDateClick(true)
    form.resetFields()
    const data: AttendanceFormData = {
      start: formatDateTime(info.start).dateStr,
    }
    data.end =
      info.view.type === 'dayGridMonth' || info.view.type === 'multiMonthYear'
        ? formatEndDate(formatDateTime(info.end).dateStr)
        : formatDateTime(info.end).dateStr
    data.startTime =
      info.view.type === 'dayGridMonth' || info.view.type === 'multiMonthYear'
        ? '08:00:00'
        : formatDateTime(info.start).timeStr
    data.endTime =
      info.view.type === 'dayGridMonth' || info.view.type === 'multiMonthYear'
        ? '12:00:00'
        : formatDateTime(info.end).timeStr
    setFormData(data)
    setIsEventClick(false)
    if (manageMode) return setIsModalOpen(false)
    return setIsModalOpen(true)
  }

  const handleEventClick = async (info: any) => {
    form.resetFields()
    const attendanceDetails = await getAttendanceDetails(info.event.id)
    const data: AttendanceFormData = {
      id: attendanceDetails.id,
      title: attendanceDetails.title,
      start: attendanceDetails.start,
      end: attendanceDetails.end,
      startTime: attendanceDetails.start_time,
      endTime: attendanceDetails.end_time,
      created_by_id: attendanceDetails.created_by_id,
      status: attendanceDetails.status,
      type_id: attendanceDetails.type_id,
      reason: attendanceDetails.reason,
      img: attendanceDetails.img,
      result: attendanceDetails?.result,
      managers: attendanceDetails.managers,
    }
    setFormData(data)
    setIsDateClick(false)
    setIsEventClick(true)
    return setIsModalOpen(true)
  }

  const getAttendanceDetails = async (id: number | undefined) => {
    const res = await getAttendanceDetailsAPI(id)
    return res.data.data
  }

  const handleDateRender = (info: any) => {
    setStart(info.startStr)
    setEnd(info.endStr)
    setInitview(info.view.type)
  }
  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
          listPlugin,
          multiMonthPlugin,
        ]}
        views={{
          multiMonthFourMonth: {
            type: 'multiMonth',
            duration: { months: 4 },
            buttonText: 'year',
          },
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right:
            'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday
          startTime: '08:00', // a start time (10am in this example)
          endTime: '17:00', // an end time (5pm in this example)
        }}
        initialView={initView}
        weekends={true}
        selectable={true}
        dayMaxEvents={true}
        selectMirror={true}
        handleWindowResize={true}
        events={attendanceList.data}
        select={handleDateClick}
        eventClick={handleEventClick}
        datesSet={handleDateRender}
        initialDate={initDate}
        noEventsContent="No attendances"
        showNonCurrentDates={false}
        moreLinkClick={'day'}
      />
      {isDateClick && !manageMode && (
        <AddAttendanceModal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          users={users}
          data={formData}
          attendanceType={attendanceList.attendance_types}
          form={form}
          getNewAttendanceList={getNewAttendanceList}
          searchParams={searchParams}
          setLoading={setLoading}
        />
      )}
      {isEventClick && !manageMode && (
        <EditAttendanceModal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          users={users}
          data={formData}
          attendanceType={attendanceList.attendance_types}
          form={form}
          getNewAttendanceList={getNewAttendanceList}
          searchParams={searchParams}
          setLoading={setLoading}
        />
      )}
      {!isDateClick && manageMode && (
        <ReviewAttendanceModal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          users={users}
          data={formData}
          attendanceType={attendanceList.attendance_types}
          form={form}
          getNewAttendanceList={getNewAttendanceList}
          searchParams={searchParams}
          setLoading={setLoading}
        />
      )}
    </>
  )
}

export default AttendanceCalendar
