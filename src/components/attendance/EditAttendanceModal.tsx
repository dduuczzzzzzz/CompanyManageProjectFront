import {
  Button,
  FormInstance,
  Modal,
  Popconfirm,
  notification,
} from 'antd'
import EditAttendanceForm from './EditAttendanceForm'
import { User } from '../../types/user'
import { AttendanceFormData, AttendanceType } from '../../types/attendance'
import { ATTENDANCE_STATUS } from '../../libs/constants/Attendance'
import { deleteAttendanceAPI } from '../../services/request/attendance'
import { AttendanceListLoader } from '../../pages/attendance'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import {
  ATTENDANCE_DELETE,
  ATTENDANCE_UPDATE,
} from '../../libs/constants/Permissions'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  open?: boolean
  onOk?: any
  onCancel?: any
  users?: Array<User>
  data?: AttendanceFormData
  attendanceType?: Array<AttendanceType>
  form?: FormInstance
  closeModal?: any
  getNewAttendanceList?: any
  searchParams?: URLSearchParams
  setLoading: Dispatch<SetStateAction<boolean>>
}

const EditAttendanceModal = ({
  open,
  onOk,
  onCancel,
  users,
  data,
  attendanceType,
  form,
  getNewAttendanceList,
  searchParams,
  setLoading
}: Props) => {
  const notReviewed =
    data?.extendedProps?.status === ATTENDANCE_STATUS.NOT_REVIEWED
  const editAttendance = () => {
    form?.submit()
  }
  const deleteAttendance = async () => {
    try {
      setLoading(true)
      // call delete attendance API
      if (data?.id) await deleteAttendanceAPI(data.id)
      // if cussess, show notification
      notification['success']({
        duration: 5,
        message: 'Delete attendance successfully',
      })
      // close modal
      onCancel()
      // get the latest attendance list
      AttendanceListLoader(searchParams).then((value) => {
        getNewAttendanceList(value)
        setLoading(false)
      })
    } catch (err: any) {
      setLoading(false)
      onCancel()
      const errorMessages = Object.values(err.response.data.errors)
        .map((message) => `- ${message}<br>`)
        .join('')
      const key = 'deleteAttendanceFail'
      notification['error']({
        key,
        duration: 5,
        message: 'Delete attendance failed',
        description: (
          <div
            dangerouslySetInnerHTML={{ __html: errorMessages }}
            className="text-red-500"
          />
        ),
      })
    }
  }
  const permissionsInfo = getPermissions()
  return (
    <>
      {notReviewed && (
        <Modal
          title="Attendance"
          open={open}
          onCancel={onCancel}
          destroyOnClose={true}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>,
            permissionsInfo &&
              ATTENDANCE_DELETE.every((element: string) =>
                permissionsInfo.includes(element),
              ) && (
                <Popconfirm
                  title="Delete this attendance"
                  description="Are you sure to delete this attendance?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={deleteAttendance}
                  key="pop_confirm"
                >
                  <Button key="delete" type="primary" danger>
                    Delete
                  </Button>
                </Popconfirm>
              ),
            permissionsInfo &&
              ATTENDANCE_UPDATE.every((element: string) =>
                permissionsInfo.includes(element),
              ) && (
                <Button key="update" type="primary" onClick={editAttendance}>
                  Update
                </Button>
              ),
          ]}
        >
          <EditAttendanceForm
            users={users}
            data={data}
            attendanceType={attendanceType}
            form={form}
            closeModal={onOk}
            getNewAttendanceList={getNewAttendanceList}
            searchParams={searchParams}
            setLoading={setLoading}
          />
        </Modal>
      )}
      {!notReviewed && (
        <Modal
          title="Attendance"
          open={open}
          onOk={editAttendance}
          onCancel={onCancel}
          destroyOnClose={true}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              Close
            </Button>,
          ]}
        >
          <EditAttendanceForm
            users={users}
            data={data}
            attendanceType={attendanceType}
            disabled={true}
            closeModal={onOk}
            setLoading={setLoading}
          />
        </Modal>
      )}
    </>
  )
}

export default EditAttendanceModal
