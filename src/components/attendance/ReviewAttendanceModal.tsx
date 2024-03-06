import { Button, FormInstance, Modal } from 'antd';
import { User } from "../../types/user";
import { AttendanceFormData, AttendanceType } from "../../types/attendance";
import { ATTENDANCE_STATUS } from '../../libs/constants/Attendance';
import ReviewAttendanceForm from './ReviewAttendanceForm';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  open?: boolean,
  onOk?: any,
  onCancel?: any,
  users?: Array<User>,
  data?: AttendanceFormData,
  attendanceType?: Array<AttendanceType>,
  form?: FormInstance,
  getNewAttendanceList?: any,
  searchParams?: URLSearchParams,
  setLoading: Dispatch<SetStateAction<boolean>>
}

const ReviewAttendanceModal = ({open, onOk, onCancel, users, data, attendanceType, form, getNewAttendanceList, searchParams, setLoading}: Props) => {
  const notReviewed = data?.extendedProps?.status === ATTENDANCE_STATUS.NOT_REVIEWED;
  const [attendanceStatus, setAttendanceStatus] = useState<number>();
  const title = data?.title;
  const approveAttendance = () => {
    setAttendanceStatus(ATTENDANCE_STATUS.ATTENDANCE_ACCEPT);
    form?.submit();
  }
  const rejectAttendance = () => {
    setAttendanceStatus(ATTENDANCE_STATUS.ATTENDANCE_REJECT);
    form?.submit();
  }
  return (
    <>
      {notReviewed && 
        <Modal 
          title={title} 
          open={open} 
          onOk={onOk} 
          onCancel={onCancel} 
          destroyOnClose={true}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>,
            <Button
              key="delete"
              type="primary"
              danger
              onClick={rejectAttendance}
            >
              Reject
            </Button>,
            <Button key="update" type="primary" onClick={approveAttendance}>
              Approve
            </Button>,
          ]}
        >
          <ReviewAttendanceForm 
            users={users} 
            data={data} 
            attendanceType={attendanceType} 
            form={form} 
            closeModal={onOk} 
            attendanceStatus={attendanceStatus} 
            getNewAttendanceList={getNewAttendanceList} 
            searchParams={searchParams}
            disableField={true}
            setLoading={setLoading}
          />
        </Modal>
      }
      {!notReviewed && 
        <Modal 
          title={title} 
          open={open} 
          onOk={onOk} 
          onCancel={onCancel} 
          destroyOnClose={true}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              Close
            </Button>,
          ]}
        >
          <ReviewAttendanceForm 
            users={users} 
            data={data} 
            attendanceType={attendanceType} 
            disabled={true}
            setLoading={setLoading}
          />
        </Modal>
      }
    </>
  )
}

export default ReviewAttendanceModal;