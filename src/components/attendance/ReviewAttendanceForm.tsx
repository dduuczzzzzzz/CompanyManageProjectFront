import { Form, FormInstance, Input, notification, Typography } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ATTENDANCE_STATUS } from "../../libs/constants/Attendance";
import AttendanceForm from './AttendanceForm';
import { AttendanceFormData, AttendanceType } from '../../types/attendance';
import { User } from '../../types/user';
import { approveAttendanceAPI, rejectAttendanceAPI } from '../../services/request/attendance';
import { AttendanceListLoader } from '../../pages/attendance';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  users?: Array<User>,
  data?: AttendanceFormData,
  attendanceType?: Array<AttendanceType>,
  disabled?: boolean,
  form?: FormInstance,
  onFinishHandler?: any,
  closeModal?: any,
  attendanceStatus?: number,
  getNewAttendanceList?: any,
  searchParams?: URLSearchParams,
  disableField?: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>
}

const { TextArea } = Input;

const ReviewAttendanceForm = ({users, data, attendanceType, disabled, form, closeModal, attendanceStatus, getNewAttendanceList, searchParams, disableField, setLoading}: Props) => {
  const result = data?.extendedProps?.result;
  const status = data?.extendedProps?.status;
  const reviewAttendanceHandler = async (result: any) => {
    closeModal();
    setLoading(true)
    if(attendanceStatus === ATTENDANCE_STATUS.ATTENDANCE_ACCEPT){
      await approveAttendanceAPI(data?.id, result);
      notification['success']({
        key: "accept",
        duration: 5,
        message: 'Attendance accepted',
      })
      return AttendanceListLoader(searchParams).then(value => {
        getNewAttendanceList(value);
        setLoading(false)
      })
    }
    await rejectAttendanceAPI(data?.id, result);
    notification['success']({
      key: "reject",
      duration: 5,
      message: 'Attendance rejected',
    })
    return AttendanceListLoader(searchParams).then(value => {
      getNewAttendanceList(value);
      setLoading(false)
    })
  }
  return (
    <>
      <AttendanceForm 
        users={users} 
        data={data} 
        attendanceType={attendanceType} 
        disabled={disabled} 
        form={form}
        onFinishHandler={reviewAttendanceHandler}
        disableField={disableField}
      >
        <Form.Item label="Result" name="result" initialValue={result} key="result">
          <TextArea rows={4}/>
        </Form.Item>
        {status !== ATTENDANCE_STATUS.NOT_REVIEWED &&
          <Form.Item label="Status" key="status">
            {status === ATTENDANCE_STATUS.ATTENDANCE_ACCEPT &&
              <Typography.Text type="success">
                <CheckOutlined /> Accepted
              </Typography.Text>
            } 
            {status === ATTENDANCE_STATUS.ATTENDANCE_REJECT &&
              <Typography.Text type="danger">
                <CloseOutlined /> Rejected
              </Typography.Text>
            }
          </Form.Item>
        }
      </AttendanceForm>
    </>
  )
}

export default ReviewAttendanceForm