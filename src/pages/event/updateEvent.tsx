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
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../components/layouts/main'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { editEvent, getTypeEvent, updateEvent } from '../../services/event'
import { TypeEvent } from '../../types/event'

const RenderAvatar = ({
  fileIndex,
  filee,
  handleFileDelete,
  url,
}: {
  fileIndex: any
  filee: any
  handleFileDelete: () => void
  url?: any
}) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      key={fileIndex}
      className="flex justify-center mb-4 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Avatar
        shape="square"
        src={url ? url : URL.createObjectURL(filee)}
        alt="avatar"
        className="w-[150px] h-[150px] flex justify-center m-1"
        style={{
          filter: hovered ? 'blur(2px)' : 'none',
          transition: 'filter 0.3s',
        }}
      ></Avatar>
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '24px',
            zIndex: 1,
          }}
        >
          <DeleteOutlined onClick={handleFileDelete} />
        </div>
      )}
      {/* <Button
                icon={<CloseOutlined className="w-[10px] h-[10px]" />}
                onClick={() => handleFileDelete(fileIndex)}
              /> */}
    </div>
  )
}

const UpdateEventPage = () => {
  const [file, setFile] = useState<Array<any>>([])
  const [fileDelete, setFileDelete] = useState<Array<string>>([])
  const inputRef = useRef(null)
  const { id } = useParams<{ id: string }>()
  const [res, setRes] = useState<TypeEvent>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<
    Array<{ value: number; label: string }>
  >([])
  useEffect(() => {
    handleGetTypeEvent()
  }, [])
  const handleGetTypeEvent = async () => {
    try {
      const response = await getTypeEvent()
      const options = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }))
      setOptions(options)
    } catch (err: any) {
      notification['error']({
        duration: 5,
        message: 'Get type event failed',
        description: err.message,
      })
    }
  }
  useEffect(() => {
    const handleGetDetailEvent = async () => {
      setIsLoading(true)
      try {
        if (id) {
          const response = await editEvent(id)
          setRes(response.data.data)
          setIsLoading(false)
        }
      } catch (err: any) {
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors)
            .map((message) => `- ${message}<br>`)
            .join('')
          const key = 'updatable'
          notification['error']({
            key,
            duration: 5,
            message: 'Get detail event failed',
            description: (
              <div
                dangerouslySetInnerHTML={{ __html: errorMessages }}
                className="text-red-500"
              />
            ),
          })
        } else {
          notification['error']({
            message: 'Get detail event failed',
            duration: 5,
            description: err.response.data.message,
          })
        }
        setIsLoading(false)
      }
    }
    handleGetDetailEvent()
  }, [])

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
      if (file.length) {
        file.forEach((file1) => {
          formData.append('image[]', file1)
        })
      }
      if (fileDelete.length) {
        fileDelete.forEach((name) => {
          formData.append('delete[]', name)
        })
      }

      formData.append('name', data.name)
      formData.append('location', data.location || '')
      formData.append('description', data.details || '')
      formData.append('sendMail', data.sendMail)
      formData.append('type', data.type)
      formData.append('_method', 'PUT')
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
      if (id) {
        const res = await updateEvent(formData, id)
        notification['success']({
          message: 'Update successful',
          description: res.data.message,
        })
      }

      navigate('/event')
    } catch (err: any) {
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((message) => `- ${message}<br>`)
          .join('')
        const key = 'updatable'
        notification['error']({
          key,
          duration: 5,
          message: 'Update Event failed',
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
          message: 'Update Event failed',
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
        <div className="flex justify-start ml-10 mb-4" key={index}>
          {chunk.map((filee: any, fileIndex: number) => (
            <div key={fileIndex} className="flex justify-center ml-10 mb-4">
              <RenderAvatar
                fileIndex={fileIndex}
                filee={filee}
                handleFileDelete={() => handleFileDelete(fileIndex)}
              />
            </div>
          ))}
        </div>
      ))
    }
  }
  const renderOleFile = () => {
    const chunks: Array<any> = []
    const chunkSize = 6
    if (res?.image.length) {
      for (let i = 0; i < res?.image.length; i += chunkSize) {
        const chunk = res?.image.slice(i, i + chunkSize)
        chunks.push(chunk)
      }
      return chunks.map((chunk, index) => (
        <div className="flex justify-start ml-10 mb-4" key={index}>
          {chunk.map((url: string, index: number) => (
            <div key={index} className="flex justify-center ml-10 mb-4">
              {/* <Avatar
                src={url}
                alt="avatar"
                className="w-[150px] h-[150px] flex justify-center m-1"
              ></Avatar>
              <Button
                icon={<CloseOutlined className="w-[10px] h-[10px]" />}
                onClick={() =>
                  handleOldFileDelete(
                    url.replace(String(process.env.REACT_APP_API_STORAGE_URL), ''),
                    index,
                  )
                }
              /> */}
              <RenderAvatar
                fileIndex={index}
                filee={url}
                handleFileDelete={() =>
                  handleOldFileDelete(
                    url.replace('http://127.0.0.1:8000/storage/', ''),
                    index,
                  )
                }
                url={url}
              />
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

  const handleOldFileDelete = (name: string, index: number) => {
    res?.image.splice(index, 1)
    setFileDelete([...fileDelete, name])
  }
  return (
    <MainLayout>
      <h1 className="text-sky-500 flex justify-center">Update event </h1>
      {!res ? (
        <Spin className="flex justify-center" />
      ) : (
        <Form layout="vertical" form={antForm}>
          <Row>
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="name"
                label="Event name"
                initialValue={res?.name}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="type"
                label="Event type"
                initialValue={res?.type_id}
              >
                {options && (
                  <Select
                    options={options}
                    placeholder="Event type"
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
                label="Event time"
                initialValue={[dayjs(res?.start_time), dayjs(res?.end_time)]}
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
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="location"
                label="Location"
                initialValue={res?.location}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="details"
            className="ml-10 mr-10 "
            label="Description"
            initialValue={res?.description}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <p className="ml-10 mr-10 ">Image: </p>
          <div className="justify-start mb-4">{renderOleFile()}</div>

          <p className="ml-10 mr-10 ">Add image:</p>
          <div className="justify-center mb-4">{renderFilePreview()}</div>
          <div className="flex justify-start ml-10 mb-4">
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
            <Checkbox value="1">Send mail to all people ?</Checkbox>
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Button
              type="primary"
              className="mr-3"
              htmlType="submit"
              onClick={handleSubmit}
            >
              Update
            </Button>
            <Button
              type="primary"
              className="bg-gray-500"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </MainLayout>
  )
}
export default UpdateEventPage
