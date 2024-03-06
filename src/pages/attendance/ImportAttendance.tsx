import React, { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  Spin,
  Table,
  Upload,
} from 'antd'

import MainLayout from '../../components/layouts/main'
import { ColumnsType } from 'antd/es/table'
import axiosInstance from '../../services/request/base'
import TextArea from 'antd/es/input/TextArea'
import { Dayjs } from 'dayjs'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import { ATTENDANCE_EXPORT_TEMPLATE } from '../../libs/constants/Permissions'

export interface ImportAttendances {
  id: number
  created_by_id: string
  file_name: string
  success_amount: number
  fail_amount: number
  status: number
  error: string
  created_at: string
  total: number
}

const ImportAttendance = () => {
  const [listFileAttendance, setListFileAttendance] = useState<
    ImportAttendances[]
  >([])
  const permissionsInfo = getPermissions()
  const [file, setFile] = useState('')
  const [fileName, setFileName] = useState('')
  const [form] = Form.useForm()
  const [clicked, setClicked] = useState<boolean>(false)
  const { RangePicker } = DatePicker
  const [total, setTotal] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState({
    status: '',
    file_name: '',
    sort: 'created_at',
    sortType: '0',
    page: '1',
    limit: '10',
    start_time: '',
    end_time: '',
  })

  const getListAttendance = async () => {
    const url = new URLSearchParams(filter)
    const res = await axiosInstance.get(
      `/attendance/get-importAttendance?${url}`,
    )
    setListFileAttendance(res.data.data.records)
    setTotal(res.data.data.total)
    setIsLoading(false)
  }

  const resetFilter = () => {
    setFilter({
      status: '',
      file_name: '',
      sort: 'created_at',
      sortType: '0',
      page: '1',
      limit: '10',
      start_time: '',
      end_time: '',
    })
  }

  useEffect(() => {
    getListAttendance()
  }, [filter])

  useEffect(() => {
    if (clicked) {
      const returnAPI = setInterval(async () => {
        const url = new URLSearchParams(filter)
        const importData = await axiosInstance
          .get(`/attendance/get-importAttendance?${url}`)
          .then((response) => {
            setListFileAttendance(response.data.data.records)
            return response.data.data.records
          })
        if (importData[0].status === 1 || importData[0].status === 2) {
          clearInterval(returnAPI)
          setClicked(false)
        }
      }, 1000)
    }
  }, [clicked])

  const lists: ColumnsType<ImportAttendances> = [
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        if (status === 0) {
          return <span className={'text-amber-500'}>Processing...</span>
        } else if (status === 1) {
          return <span className={'text-lime-500'}>Done</span>
        } else {
          return <span className={'text-red-600'}>Fail</span>
        }
      },
    },
    {
      title: 'Success Amount',
      dataIndex: 'success_amount',
      key: 'success_amount',
    },
    {
      title: 'Fail Amount',
      dataIndex: 'fail_amount',
      key: 'fail_amount',
    },
    {
      title: 'Error',
      dataIndex: 'error',
      key: 'error',
      render: (_, data) => (
        <TextArea
          rows={4}
          style={{
            color: 'red',
          }}
          value={data.error}
        ></TextArea>
      ),
    },
    {
      title: 'Total Records',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ]

  const ImportInfor = async (data: any) => {
    try {
      await axiosInstance.post(`/attendance/importAttendance`, data)
      getListAttendance()
    } catch (errors: any) {}
  }

  const onFinish = async (values: any) => {
    const formData = new FormData()
    formData.append('import_file', file)
    await ImportInfor(formData)
    setFile('')
    setFileName('')
    setClicked(true)
  }

  const props: UploadProps = {
    beforeUpload: (file: any) => {
      const isExcel =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        message.error(`${file.name} is not a excel file`)
      }
      setFile(file)
      return isExcel || Upload.LIST_IGNORE
    },
  }

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
  ) => {
    if (dates) {
      setFilter({
        ...filter,
        start_time: dateStrings[0],
        end_time: dateStrings[1],
      })
    } else {
      resetFilter()
    }
  }

  const onChange = (page: number, pageSize: number) => {
    setFilter({
      ...filter,
      page: page.toString(),
      limit: pageSize.toString(),
    })
  }

  const downloadTemplate = async () => {
    return axiosInstance
      .get(`/attendance/export-templateImportAttendance`, {
        responseType: 'blob',
      })
      .then((value: any) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(value.data)

        // Create an <a> element to trigger the download
        const a = document.createElement('a')
        a.href = url
        a.download = 'attendance.xlsx'

        // Trigger a click event to download the file
        a.click()

        // Cleanup
        window.URL.revokeObjectURL(url)
      })
  }

  return (
    <MainLayout>
      <div className="... flex items-center justify-center">
        <h1>Import Attendance</h1>
      </div>

      <Form onFinish={(value) => onFinish(value)} form={form}>
        <Form.Item
          label="File Import"
          name={'profilePicture'}
          rules={[
            {
              required: true,
              message: 'Please upload your file',
            },
          ]}
        >
          <Upload
            {...props}
            maxCount={1}
            showUploadList={false}
            customRequest={(info: any) => {
              setFileName(info.file.name)
            }}
          >
            <Button icon={<UploadOutlined />}>Input file</Button>
            {fileName}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Upload
          </Button>
        </Form.Item>
      </Form>
      <div className={'mb-12'}>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Name
          </label>
          <Input
            name="searchInput"
            size="large"
            style={{ width: 200 }}
            value={filter.file_name}
            onChange={(e) =>
              setFilter({
                ...filter,
                file_name: e.target.value,
              })
            }
          />
        </div>
        <div className={'mr-6 inline'}>
          <label htmlFor="" className={'font-semibold mr-2'}>
            Date
          </label>
          <RangePicker
            size="large"
            format="YYYY/MM/DD"
            onChange={onRangeChange}
          />
        </div>
        <div className={'mr-6 inline'}>
          {permissionsInfo &&
            ATTENDANCE_EXPORT_TEMPLATE.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center float-right"
                onClick={downloadTemplate}
              >
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download Template Input</span>
              </button>
            )}
        </div>
      </div>
      {isLoading ? (
        <Spin className="flex justify-center" />
      ) : (
        <Table
          dataSource={listFileAttendance}
          columns={lists}
          bordered={true}
          pagination={false}
          rowKey="created_at"
        />
      )}

      <Pagination
        showQuickJumper
        defaultCurrent={1}
        total={total}
        showSizeChanger={true}
        onChange={onChange}
        style={{ marginLeft: 500, marginTop: 10 }}
      />
    </MainLayout>
  )
}

export default ImportAttendance
