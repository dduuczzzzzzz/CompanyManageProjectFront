import AtendanceListPage from '../../../pages/attendance'
import ImportAttendance from '../../../pages/attendance/ImportAttendance'
import { ATTENDANCE_LIST, ATTENDANCE_EXPORT_TEMPLATE } from '../Permissions'

const attendanceRouter = [
  {
    path: '/attendance',
    element: <AtendanceListPage />,
    permissions: ATTENDANCE_LIST,
  },
  {
    path: '/attendance/import',
    element: <ImportAttendance />,
    permissions: ATTENDANCE_EXPORT_TEMPLATE,
  },
]
export default attendanceRouter
