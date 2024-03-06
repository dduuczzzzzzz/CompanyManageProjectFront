import { Form, FormInstance, Input, Typography, notification } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import * as yup from 'yup';
import { ATTENDANCE_STATUS } from "../../libs/constants/Attendance";
import AttendanceForm from './AttendanceForm';
import { AttendanceFormData, AttendanceType } from '../../types/attendance';
import { User } from '../../types/user';
import { editAttendanceAPI } from '../../services/request/attendance';
import { AttendanceListLoader } from '../../pages/attendance';
import { MAX_IMG_FILE_SIZE, VALID_IMG_FILE_EXTENSION } from '../../libs/constants/File';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  users?: Array<User>,
  data?: AttendanceFormData,
  attendanceType?: Array<AttendanceType>,
  disabled?: boolean,
  form?: FormInstance,
  onFinishHandler?: any,
  closeModal?: any,
  getNewAttendanceList?: any,
  searchParams?: URLSearchParams,
  setLoading: Dispatch<SetStateAction<boolean>>
}

const { TextArea } = Input;

function isValidFileType(fileName: string, fileType: string) {
  return !!fileName && VALID_IMG_FILE_EXTENSION[fileType].indexOf((fileName.split('.').pop() || '').toLowerCase()) > -1;
}

let schema = yup.object().shape({
  type_id: yup.number().integer().required("Attendance type is required"),
  start_date: yup.date().required("Start date id required"),
  end_date: yup.date().required("End date is required"),
  start_time: yup.mixed().required("Start time is required"),
  end_time: yup.mixed().required("End time is required"),
  img: yup
    .mixed()
    .test("is-valid-type", "Not a valid image type", (value: any) => {
      if(value === undefined) return true;
      return isValidFileType(value && value.file.name.toLowerCase(), "image")
    })
    .test("is-valid-size", "Max allowed size is 2MB", (value: any) => {
      if(value === undefined || value.file.status === "removed") return true;
      return (value && value.file.size <= MAX_IMG_FILE_SIZE)
    }),
    ids: yup.array()
      .min(1, 'Please select at least one manager')
      .required("Mangers is required"),
});

const EditAttendanceRules = {
  async validator({ field }: { field: string }, value: any) {
    await schema.validateSyncAt(field, { [field]: value });
  },
};

const EditAttendanceForm = ({users, data, attendanceType, disabled, form, closeModal, getNewAttendanceList, searchParams, setLoading}: Props) => {
  const status = data?.extendedProps?.status;
  const result = data?.extendedProps?.result;
  const editAttendanceHandler = async (result: any) => {
    try{
      setLoading(true)
      schema.validate(result, { abortEarly: false });
      closeModal();
      // config form data
      const formattedEndTime = result.end_time.format("HH:mm:ss");
      const formattedStartTime = result.start_time.format("HH:mm:ss");
      const formattedStartDate = result.start_date.format("YYYY-MM-DD");
      const formattedEndDate = result.end_date.format("YYYY-MM-DD");
      let imgName = result?.img ? result.img.file : undefined;
      let delete_img = undefined;
      if(imgName?.status === "removed"){
        imgName = undefined;
        delete_img = true;
      }
      form?.resetFields();
      const newResult = {
        ...result,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        img: imgName,
        delete_img: delete_img,
        _method: "PUT"
      }
      // Call API to edit attendance
      await editAttendanceAPI(data?.id, newResult);
      // show noti
      notification['success']({
        key: "editAttendanceSuccess",
        duration: 5,
        message: 'Edit attendance successfully',
      })
      // call API to get the latest attendance list
      AttendanceListLoader(searchParams).then(value => {
        getNewAttendanceList(value);
        setLoading(false)
      })
    } catch (err: any) {
      setLoading(false)
      let errorMessages;
      if(err.response.data.errors) {
        errorMessages = Object.values(err.response.data.errors)
        .map((message) => `- ${message}<br>`)
        .join('')
      }
      else errorMessages = "Something went wrong!"
      const key = 'updateAttendanceFail'
      notification['error']({
        key,
        duration: 5,
        message: 'Update attendance failed',
        description: (
          <div
            dangerouslySetInnerHTML={{ __html: errorMessages }}
            className="text-red-500"
          />
        ),
      })
    }
  }
  return (
    <>
      <AttendanceForm 
        users={users} 
        data={data} 
        attendanceType={attendanceType} 
        disabled={disabled} 
        form={form} 
        onFinishHandler={editAttendanceHandler}
        rules={EditAttendanceRules}
      >
        {status !== ATTENDANCE_STATUS.NOT_REVIEWED && result !== null &&
          <Form.Item label="Result" key="edit_result">
            <TextArea rows={4} value={result}/>
          </Form.Item>
        }
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

export default EditAttendanceForm