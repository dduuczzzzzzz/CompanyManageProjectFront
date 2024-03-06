import { User } from './user'

// data get from attendance to display on add/edit form (follow the event type in fullcalendar)
export interface AttendanceFormData {
  id?: number
  title?: string
  start?: string
  end?: string
  startTime?: string
  endTime?: string
  created_by_id?: string
  type_id?: number
  reason?: string
  img?: any
  result?: string
  managers?: Array<User>
  status?: any
  extendedProps?: any
}

export interface AttendanceType {
  id?: number
  name?: string
}

export interface AttendanceFormRequest {
  id?: number
  start_date?: Date
  end_date?: Date
  start_time?: string
  end_time?: string
  img?: File
  ids?: Array<number>
  reason?: string
}
