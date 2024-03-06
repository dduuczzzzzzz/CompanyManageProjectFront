import { FormInstance, notification } from "antd";
import * as yup from 'yup';
import { AttendanceFormData, AttendanceType } from "../../types/attendance";
import AttendanceForm from "./AttendanceForm";
import { User } from "../../types/user";
import { addAttendanceAPI } from "../../services/request/attendance";
import { AttendanceListLoader } from "../../pages/attendance";
import { MAX_IMG_FILE_SIZE, VALID_IMG_FILE_EXTENSION } from "../../libs/constants/File";
import { Dispatch, SetStateAction } from "react";

interface Props {
  users?: Array<User>,
  data?: AttendanceFormData,
  attendanceType?: Array<AttendanceType>,
  form?: FormInstance,
  onFinishHandler?: Function,
  closeModal?: any,
  getNewAttendanceList?: any,
  searchParams?: URLSearchParams,
  setLoading: Dispatch<SetStateAction<boolean>>
}

function isValidFileType(fileName: string, fileType: string) {
  return !!fileName && VALID_IMG_FILE_EXTENSION[fileType].indexOf((fileName.split('.').pop() || '').toLowerCase()) > -1;
}

let schema = yup.object().shape({
  type_id: yup.number().integer().required("Attendance type is required"),
  start_date: yup.date().required("Start date is required"),
  end_date: yup.date().required("End date is required"),
  start_time: yup.mixed().required("Start time is required"),
  end_time: yup.mixed().required("End time is required"),
  img: yup
    .mixed()
    .test("is-valid-type", "Not a valid image type", (value: any) => {
      if(value === undefined || value.file.status === "removed") return true;
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

const addAttendanceRules = {
  async validator({ field }: { field: string }, value: any) {
    await schema.validateSyncAt(field, { [field]: value });
  },
};

const AddAttendanceForm = ({users, data, attendanceType, form, closeModal, getNewAttendanceList, searchParams, setLoading}: Props) => {

  const addAttendanceHandler = async (result: any) => {
    try{
      setLoading(true)
      schema.validate(result, { abortEarly: false });
      closeModal();
      // config form data
      const formattedEndTime = result.end_time.format("HH:mm:ss");
      const formattedStartTime = result.start_time.format("HH:mm:ss");
      const formattedStartDate = result.start_date.format("YYYY-MM-DD");
      const formattedEndDate = result.end_date.format("YYYY-MM-DD");
      let imgName = result.img ? result.img.file : undefined;
      if(imgName?.status === "removed"){
        imgName = undefined;
      }
      form?.resetFields();
      const newResult = {
        ...result,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        img: imgName
      }
      // call API to add attendance
      await addAttendanceAPI(newResult);
      // show notification
      notification['success']({
        key: "addAttendanceSuccess",
        duration: 5,
        message: 'Add attendance successfully',
      })
      // call API to get latest attendance list
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
      const key = 'addAttendanceFail'
      notification['error']({
        key,
        duration: 5,
        message: 'Add attendance failed',
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
        form={form} 
        onFinishHandler={addAttendanceHandler}
        rules={addAttendanceRules}
      />
    </>
  )
}

export default AddAttendanceForm