import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  Space,
  TimePicker,
  Row,
  Col,
  FormInstance,
} from 'antd'
import type { UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { User } from '../../types/user'
import { AttendanceFormData, AttendanceType } from '../../types/attendance'
import { useEffect, useState } from 'react'

interface Props {
  users?: Array<User>
  data?: AttendanceFormData
  children?: React.ReactNode
  attendanceType?: Array<AttendanceType>
  disabled?: boolean
  form?: FormInstance
  onFinishHandler?: any
  rules?: any
  disableField?: boolean
}

const { TextArea } = Input
const { Option } = Select

const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'

const AttendanceForm = ({
  users,
  data,
  children,
  attendanceType,
  disabled,
  form,
  onFinishHandler,
  rules,
  disableField,
}: Props) => {
  const startDate = data?.start
  const endDate = data?.end
  // if user has chosen the managers, set the selected manager, else set the default manager to 1 when create attendance
  const managerSelected = data?.managers
    ? data?.managers.map((manager: User) => manager.id)
    : [1]
  const attendanceTypeSelected = data?.type_id
  const startTime = data?.startTime
  const endTime = data?.endTime
  const reason = data?.reason ?? ''
  const imgURL = data?.img ?? null
  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (imgURL)
      setFileList([
        {
          uid: '-1',
          name: imgURL,
          url: process.env.REACT_APP_API_STORAGE_URL + imgURL,
        },
      ])
  }, [])

  const beforeUpload = (file: UploadFile) => {
    setFileList([file])
    return false
  }

  const filterManagerHandler = (input: string, option: any) => {
    return (
      option.props.children
        .toString()
        .toLowerCase()
        .indexOf(input.toLowerCase()) !== -1
    )
  }

  const removeImageHandler = () => {
    setFileList([])
  }

  const changeIMGHandler: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList)
  }

  return (
    <>
      <Form
        onFinish={onFinishHandler}
        labelCol={{ span: 10 }}
        layout="vertical"
        className="ml-2"
        disabled={disabled}
        form={form}
      >
        <Form.Item
          label="Attendance type"
          name="type_id"
          initialValue={attendanceTypeSelected}
          rules={[rules]}
          key="type"
        >
          <Select placeholder="Select attendance type" disabled={disableField}>
            {attendanceType?.map((type: AttendanceType) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Select your date">
          <Row className="flex justify-between">
            <Col span={11}>
              <Form.Item
                name="start_date"
                initialValue={dayjs(startDate, dateFormat)}
                rules={[rules]}
                key="start_date"
              >
                <DatePicker
                  className="w-full"
                  placeholder="Start date"
                  format={dateFormat}
                  picker="date"
                  disabled={disableField}
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="end_date"
                initialValue={dayjs(endDate, dateFormat)}
                rules={[rules]}
                key="end_date"
              >
                <DatePicker
                  className="w-full"
                  placeholder="End date"
                  format={dateFormat}
                  picker="date"
                  disabled={disableField}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="Select time">
          <Row className="flex justify-between">
            <Col span={11}>
              <Form.Item
                name="start_time"
                initialValue={dayjs(startTime, timeFormat)}
                rules={[rules]}
                key="start_time"
              >
                <TimePicker
                  className="w-full"
                  placeholder="Start time"
                  format={timeFormat}
                  disabled={disableField}
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="end_time"
                initialValue={dayjs(endTime, timeFormat)}
                rules={[rules]}
                key="end_time"
              >
                <TimePicker
                  className="w-full"
                  placeholder="End time"
                  format={timeFormat}
                  disabled={disableField}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="Select your managers">
          <Space className="w-full" direction="vertical">
            <Form.Item
              name="ids"
              initialValue={managerSelected}
              rules={[rules]}
              key="managers_select"
            >
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Please select"
                filterOption={filterManagerHandler}
                disabled={disableField}
              >
                {users?.map((user: User) => (
                  <Option key={user.id} value={user.id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          label="Reason"
          name="reason"
          initialValue={reason}
          key="reason"
        >
          <TextArea rows={4} disabled={disableField} />
        </Form.Item>
        <Form.Item label="Image" name="img" rules={[rules]} key="img">
          <Upload
            listType="picture-card"
            beforeUpload={beforeUpload}
            fileList={fileList}
            onRemove={removeImageHandler}
            onChange={changeIMGHandler}
            disabled={disableField}
          >
            <div>
              <PlusOutlined />
              <div>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        {children}
      </Form>
    </>
  )
}

export default AttendanceForm
