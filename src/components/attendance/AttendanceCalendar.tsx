import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Form } from 'antd';
import { formatDateTime, formatEndDate } from '../../libs/helpers/DateFormat';
import { AttendanceFormData } from '../../types/attendance';
import AddAttendanceModal from './AddAttendanceModal';
import EditAttendanceModal from './EditAttendanceModal';
import ReviewAttendanceModal from './ReviewAttendanceModal';
import { useCollapsedProvider } from '../../libs/contexts/CollapsedContext';

interface Props {
  attendanceList?: any,
  manageMode?: boolean,
  getNewAttendanceList?: any,
  searchParams?: URLSearchParams,
  setStart?: any,
  setEnd?: any,
  setLoading: Dispatch<SetStateAction<boolean>>,
  initDate?: Date,
  initView?: string,
  setInitview: Dispatch<SetStateAction<any>>
}

const AttendanceCalendar = ({ attendanceList, manageMode, getNewAttendanceList, searchParams, setStart, setEnd, setLoading, initDate, initView, setInitview}: Props) => {
  const context = useCollapsedProvider();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AttendanceFormData>();
  const [isDateClick, setIsDateClick] = useState<boolean>();
  const [form] = Form.useForm();

  const handleOk = () => {
    setIsModalOpen(false);
    setIsDateClick(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDateClick(false);
    form.resetFields()
  };

  useEffect(() => {
    setTimeout(() => {
      if (calendarRef.current) {
        // Trigger FullCalendar resize when the sidebar is expanded
        calendarRef.current.getApi().updateSize();
      }
    }, 200);
  }, [context.collapsed]);

  const handleDateClick = (info: DateSelectArg) => {
    setIsDateClick(true);
    form.resetFields()
    const data: AttendanceFormData = {
      start: formatDateTime(info.start).dateStr,
    };
    data.end = (info.view.type === "dayGridMonth" || info.view.type === "dayGridYear") ? formatEndDate(formatDateTime(info.end).dateStr) : formatDateTime(info.end).dateStr;
    data.startTime = (info.view.type === "dayGridMonth" || info.view.type === "dayGridYear") ? "08:00:00" : formatDateTime(info.start).timeStr;
    data.endTime = (info.view.type === "dayGridMonth" || info.view.type === "dayGridYear") ? "12:00:00" : formatDateTime(info.end).timeStr;
    setFormData(data);
    if(manageMode) return setIsModalOpen(false);
    return setIsModalOpen(true);
  }

  const handleEventClick = (info: any) => {
    form.resetFields()
    const data: AttendanceFormData = {
      id: info.event.id,
      title: info.event.title,
      start: formatDateTime(info.event.start).dateStr,
      end: formatDateTime(info.event.end).dateStr,
      extendedProps: info.event.extendedProps,
    };
    setFormData(data);
    setIsDateClick(false);
    return setIsModalOpen(true);
  }

  const handleDateRender = (info: any) => {
    setStart(info.startStr);
    setEnd(info.endStr);
    setInitview(info.view.type)
  }

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin ]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        }}
        businessHours= {{
          daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Thursday
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
      />
        {isDateClick && !manageMode &&
          <AddAttendanceModal 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel} 
            users={attendanceList.users} 
            data={formData}
            attendanceType={attendanceList.attendance_types} 
            form={form}
            getNewAttendanceList={getNewAttendanceList}
            searchParams={searchParams}
            setLoading={setLoading}
          />
        }
        {!isDateClick && !manageMode &&
          <EditAttendanceModal 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel} 
            users={attendanceList.users} 
            data={formData}
            attendanceType={attendanceList.attendance_types} 
            form={form}
            getNewAttendanceList={getNewAttendanceList}
            searchParams={searchParams}
            setLoading={setLoading}
          />
        }
        {!isDateClick && manageMode &&
          <ReviewAttendanceModal 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel} 
            users={attendanceList.users} 
            data={formData}
            attendanceType={attendanceList.attendance_types} 
            form={form}
            getNewAttendanceList={getNewAttendanceList}
            searchParams={searchParams}
            setLoading={setLoading}
          />
        }
    </>
  )
}

export default AttendanceCalendar;