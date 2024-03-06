import { FormInstance, Modal } from 'antd';
import AddAttendanceForm from "./AddAttendanceForm";
import { User } from "../../types/user";
import { AttendanceFormData, AttendanceType } from "../../types/attendance";
import { Dispatch, SetStateAction } from 'react';

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

const AddAttendanceModal = ({open, onOk, onCancel, users, data, attendanceType, form, getNewAttendanceList, searchParams, setLoading}: Props) => {
  const addAttendance = () => {
    form?.submit();
  }
  return (
    <>
      <Modal title="Attendance" open={open} onOk={addAttendance} onCancel={onCancel} destroyOnClose={true}>
        <AddAttendanceForm 
          users={users} 
          data={data} 
          attendanceType={attendanceType} 
          form={form} closeModal={onOk} 
          getNewAttendanceList={getNewAttendanceList} 
          searchParams={searchParams}
          setLoading={setLoading}
        />
      </Modal>
    </>
  )
}

export default AddAttendanceModal;