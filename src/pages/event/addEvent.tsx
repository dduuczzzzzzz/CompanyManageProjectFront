import {
  Row,
  Input,
  Select,
  Form,
  DatePicker,
  Col,
  Checkbox,
  Button,
  Avatar,
  notification,
  Spin,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layouts/main'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { addEvent, getTypeEvent } from '../../services/event'
const AddEventPage = () => {
  const [file, setFile] = useState<Array<any>>([])
  const inputRef = useRef(null)

  const [options, setOptions] = useState<
    Array<{ value: number; label: string }>
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    handleGetTypeEvent()
  }, [])
  const handleGetTypeEvent = async () => {
    setIsLoading(true)
    try {
      const response = await getTypeEvent()
      const options = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }))
      setOptions(options)
      setIsLoading(false)
    } catch (err: any) {
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((message) => `- ${message}<br>`)
          .join('')
        const key = 'updatable'
        notification['error']({
          key,
          duration: 5,
          message: 'Get type event failed',
          description: (
            <div
              dangerouslySetInnerHTML={{ __html: errorMessages }}
              className="text-red-500"
            />
          ),
        })
      } else {
        notification['error']({
          message: 'Get type event failed',
          duration: 5,
          description: err.response.data.message,
        })
      }
      setIsLoading(false)
    }
  }

  function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
    const inputRef = e.target

    if (e.target.files?.length) {
      setFile([...file, e.target.files[0]])
    }
    inputRef.value = ''
  }
  const navigate = useNavigate()
  const [antForm] = Form.useForm()
  dayjs.extend(customParseFormat)
  const { RangePicker } = DatePicker
  const handleSubmit = async () => {
    const values = antForm.getFieldsValue()
    try {
      await antForm.validateFields()
      handleUpdate(values)
    } catch (err) {
      return
    }
  }
  const handleCancel = () => {
    navigate('/event')
  }
  const handleUpdate = async (data: any) => {
    try {
      const formData: any = new FormData()
      if (file) {
        file.forEach((file1) => {
          formData.append('image[]', file1)
        })
      }

      formData.append('name', data.name)
      formData.append('link', data.link || '')
      formData.append('location', data.location || '')
      formData.append('description', data.details || '')
      formData.append('sendMail', data.sendMail)
      formData.append('type', data.type)
      if (data?.time) {
        formData.append(
          'start_time',
          dayjs(data.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        )
        formData.append(
          'end_time',
          dayjs(data.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        )
      }

      const res = await addEvent(formData)
      notification['success']({
        message: 'Add event successful',
        description: res.data.message,
      })
      navigate('/event')
    } catch (err: any) {
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((message) => `- ${message}<br>`)
          .join('')
        const key = 'message'
        notification['error']({
          key,
          duration: 5,
          message: 'Add event failed',
          description: (
            <div
              dangerouslySetInnerHTML={{ __html: errorMessages }}
              className="text-red-500"
            />
          ),
        })
      } else {
        notification['error']({
          duration: 5,
          message: 'Add event failed',
          description: err.response.data.message,
        })
      }
    }
  }
  const renderFilePreview = () => {
    const chunks: Array<any> = []
    const chunkSize = 6
    if (file.length) {
      for (let i = 0; i < file.length; i += chunkSize) {
        const chunk = file.slice(i, i + chunkSize)
        chunks.push(chunk)
      }

      return chunks.map((chunk, index) => (
        <div className="flex justify-center ml-10 mb-4" key={index}>
          {chunk.map((filee: any, fileIndex: number) => (
            <div key={fileIndex}>
              <p>Tên tệp: {filee.name}</p>
              <Button
                icon={<CloseOutlined className="w-[10px] h-[10px]" />}
                onClick={() => handleFileDelete(fileIndex)}
              />
              <Avatar
                src={URL.createObjectURL(filee)}
                alt="avatar"
                className="w-[150px] h-[150px] flex justify-center m-1"
              ></Avatar>
            </div>
          ))}
        </div>
      ))
    }
  }
  const handleFileDelete = (index: number) => {
    const updatedFile = [...file]
    updatedFile.splice(index, 1)
    setFile(updatedFile)
  }
  return (
    <MainLayout>
      <h1 className="text-sky-500 flex justify-center">Thêm event </h1>
      {isLoading ? (
        <Spin className="flex justify-center" />
      ) : (
        <>
          <Form name="update-profile" layout="vertical" form={antForm}>
            <Row>
              <Col span={12}>
                <Form.Item
                  className="ml-10 mr-10"
                  name="name"
                  label="Tên event"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className="ml-10 mr-10"
                  name="type"
                  label="Loại event"
                  initialValue={1}
                >
                  {options && (
                    <Select
                      options={options}
                      placeholder="type event"
                      className="w-[70%] "
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  className=" ml-10 mr-10"
                  name="time"
                  label="Thời gian tổ chức"
                >
                  <RangePicker
                    className="w-full"
                    presets={[
                      {
                        label: (
                          <span aria-label="Current Time to End of Day"></span>
                        ),
                        value: () => [dayjs(), dayjs().endOf('day')],
                      },
                    ]}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  className="ml-10 mr-10"
                  name="location"
                  label="Địa điểm"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item className="ml-10 mr-10" name="link" label="Link">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="details"
              className="ml-10 mr-10 "
              label="Description"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <div className="justify-center ml-10 mb-4">
              {renderFilePreview()}
            </div>
            <div className="flex justify-center ml-10 mb-4">
              <input
                ref={inputRef}
                type="file"
                name="image"
                onChange={(e) => handleChangeFile(e)}
              />
            </div>
            <Form.Item
              className="ml-10 mr-10"
              name="sendMail"
              valuePropName="checked"
              initialValue="0"
            >
              <Checkbox value="1">Gửi mail cho tất cả nhân viên</Checkbox>
            </Form.Item>
            <Form.Item className="flex justify-center">
              <Button
                type="dashed"
                className="w-[110px] text-white m-5 bg-green-500 items-center rounded-full"
                htmlType="submit"
                onClick={handleSubmit}
              >
                Thêm event
              </Button>
              <Button
                type="dashed"
                className="w-[110px] text-white bg-red-500 m-5 items-center rounded-full"
                onClick={handleCancel}
              >
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </MainLayout>
  )
}
export default AddEventPage
