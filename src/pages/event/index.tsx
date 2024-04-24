import MainLayout from '../../components/layouts/main'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Input,
  List,
  Popconfirm,
  Select,
  Modal,
  notification,
  Spin,
  DatePicker,
} from 'antd'
import { deleteEvent, event, getTypeEvent } from '../../services/event'
import { TypeEvent, TypeParamsEvent } from '../../types/event'
import { getPermissions, getUser } from '../../libs/helpers/getLocalStorage'
import { Link, useNavigate } from 'react-router-dom'
import { EVENT_DELETE, EVENT_UPDATE } from '../../libs/constants/Permissions'
const { Search } = Input

const EventPage = () => {
  const [res, setRes] = useState<TypeEvent[]>()
  const [total, setTotal] = useState<number>()
  const [idDelete, setIdDelete] = useState(0)
  const [params, setParams] = useState<TypeParamsEvent>({
    page: 1,
    limit: 5,
  })
  const user = getUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const dateFormat = 'YYYY-MM-DD'
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const [options, setOptions] = useState<
    Array<{ value: number; label: string }>
  >([])
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

  useEffect(() => {
    handleGetEvent()
  }, [params])

  const handleGetEvent = async () => {
    setIsLoading(true)
    try {
      const response = await event(params)
      setRes(response.data.data.records)
      setTotal(response.data.data.total)
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
          message: 'Get Event failed',
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
          message: 'Get event failed',
          description: err.response.data.message,
        })
      }
      setIsLoading(false)
    }
  }

  const onSearch = (search: string) => {
    setParams((params) => ({ ...params, name: search, page: 1 }))
  }
  const onSelect = (type: string) => {
    if (!type) {
      setParams((params) => ({ limit: params.limit, page: 1 }))
      return
    }
    setParams((params) => ({ ...params, type: parseInt(type), page: 1 }))
  }
  const handleChangDate = (event: any) => {
    if (!event) {
      setParams((params) => ({ ...params, date: '', page: 1 }))
      return
    }
    const value = event.format('YYYY-MM-DD')
    console.log(value)
    setParams((params) => ({ ...params, date: value, page: 1 }))
  }

  const handleDeleteEvent = async () => {
    try {
      const response = await deleteEvent(idDelete)
      notification['success']({
        duration: 5,
        message: 'Delele successful',
        description: response.data.message,
      })

      handleGetEvent()
    } catch (err: any) {
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((message) => `- ${message}<br>`)
          .join('')
        const key = 'updatable'
        notification['error']({
          key,
          duration: 5,
          message: 'Delete event failed',
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
          message: 'Delete event failed',
          description: err.response.data.message,
        })
      }
    }
    setIsModalOpen(false)
  }
  const permissionsInfo = getPermissions()
  return (
    <MainLayout>
      <Button
        type="primary"
        className="mb-8 bg-green-500 float-right"
        onClick={() => {
          navigate('/event/add')
        }}
      >
        Create New Event
      </Button>
      <div className="flex mt-8">
        <Search
          placeholder="Search event name"
          className="w-[30%]"
          onSearch={onSearch}
          enterButton
        />
        <div className="w-[30%] ml-10">
          {options && (
            <Select
              options={options}
              onChange={onSelect}
              placeholder="Event type"
              className="w-[90%] ml-2"
              allowClear
            />
          )}
        </div>
        <div className="w-[30%] ml-10 flex items-center">
          {/* <Input
            className="ml-5"
            type="datetime-local"
            onChange={handleChangDate}
            allowClear
          /> */}
          <DatePicker
            className="ml-2"
            onChange={handleChangDate}
            picker="date"
            format={dateFormat}
            allowClear
          />
        </div>
      </div>
      {isLoading ? (
        <Spin className="flex justify-center" />
      ) : (
        <div>
          <List
            className="mt-2"
            itemLayout="vertical"
            size="large"
            pagination={{
              current: params.page,
              onChange: (page) => {
                setParams((params) => ({ ...params, page: page }))
              },
              pageSize: 5,
              total: total,
            }}
            dataSource={res}
            renderItem={(item) => {
              return (
                <List.Item>
                  <div className=" w-full h-full mt-10">
                    <div className="flex">
                      <div className="w-[20%] h-[10%] ">
                        <div className="flex">
                          {
                            <Avatar
                              src={item?.created_by?.avatar}
                              className="w-[40px] h-[40px]"
                            />
                          }
                          <div className="">
                            <p className="text-[15px] font-bold m-1">
                              {item?.created_by?.name}
                            </p>
                            <span className="text-[10px] m-1">
                              {item?.created_at}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-[60%] h-[10%] flex justify-center">
                        <h3>
                          <p>{item?.name}</p>
                        </h3>
                      </div>
                      <div className="w-[15%] h-[10%] flex justify-center">
                        {permissionsInfo &&
                          EVENT_UPDATE.every((element: string) =>
                            permissionsInfo.includes(element),
                          ) && (
                            <Link to={`/event/update/${item?.id}`}>
                              <Button
                                type="primary"
                                className="rounded-full m-1"
                                htmlType="submit"
                              >
                                <EditOutlined />
                              </Button>
                            </Link>
                          )}
                        {permissionsInfo &&
                          EVENT_DELETE.every((element: string) =>
                            permissionsInfo.includes(element),
                          ) && (
                            <>
                              <Button
                                danger
                                type="primary"
                                onClick={() => {
                                  showModal()
                                  setIdDelete(item?.id)
                                }}
                                className="m-1 rounded-full"
                              >
                                <DeleteOutlined />
                              </Button>
                              <Modal
                                title="Delete Event"
                                open={isModalOpen}
                                onOk={() => handleDeleteEvent()}
                                onCancel={handleCancel}
                              >
                                <p>"Are you sure to delete this event?"</p>
                              </Modal>
                            </>
                          )}
                      </div>
                    </div>
                    <div className="w-[100%] h-[90%] ">
                      <p>{item?.description}</p>
                      <p>Location: {item?.location}</p>
                      <p>
                        Tine: {item?.start_time} - {item?.end_time}
                      </p>
                      {item?.link && <a href={item?.link}>link chi tiết</a>}
                      <br />
                      {item?.image &&
                        item?.image.map((item1, index) => (
                          <img
                            key={index}
                            src={item1}
                            className="w-[20%] h-[200px] m-5"
                            alt="a của tỉnh"
                          />
                        ))}
                    </div>
                  </div>
                </List.Item>
              )
            }}
          />
        </div>
      )}
    </MainLayout>
  )
}
export default EventPage
