import MainLayout from '../../components/layouts/main'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Form,
  Input,
  Select,
  message,
  Upload,
  UploadProps,
  Table,
  Typography,
} from 'antd'
import 'react-datepicker/dist/react-datepicker.css'
import '../../styles/user/user.css'
import dayjs from 'dayjs'
import { UploadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { GetImportInfor, ImportInfor } from '../../services/request/user'
import { error } from 'console'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input
interface DataType {
  file_name: string
  status: number
  success_amount: string
  fail_amount: string
  error: {}
  total: string
  created_at: string
}

const summitButtonLayout = {
  wrapperCol: {
    sm: {
      offset: 10,
    },
  },
}
const UsersImprot = () => {
  const [dataImport, setDataImport] = useState()
  const [file, setFile] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [looptime, setLoopTime] = useState<boolean>(false)
  const [loadings, setLoadings] = useState<boolean>(false)
  const [form] = Form.useForm()
  let user_id = ''
  const user_info = localStorage.getItem('user_info')
  if (user_info) {
    user_id = JSON.parse(user_info).id
  }

  useEffect(() => {
    GetImportInfor(
      { setDataImport, setLoopTime, setLoadings, setFile, setFileList },
      user_id,
    )
  }, [])
  useEffect(() => {
    if (looptime === true) {
      const returnAPI = setInterval(() => {
        GetImportInfor(
          { setDataImport, setLoopTime, setLoadings, setFile, setFileList },
          user_id,
        )
      }, 1000)
      return () => {
        clearInterval(returnAPI)
      }
    }
  }, [looptime])

  const onFinish = async (values: any) => {
    setLoadings(true)
    setLoopTime(true)
    const formData = new FormData()
    formData.append('import_file', file)
    const resultCreate = await ImportInfor(formData, {
      setLoopTime,
      setLoadings,
    })
  }
  const props: UploadProps = {
    onRemove: (file) => {
      setFile('')
      setFileList([])
    },
    fileList,
    beforeUpload: (file: any) => {
      const isExcel =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        message.error(`${file.name} is not a excel file`)
      }
      setFileList([file])
      setFile(file)
      return false
    },
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
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
      align: 'center',
      width: '5%',
    },
    {
      title: 'Fail Amount',
      dataIndex: 'fail_amount',
      key: 'fail_amount',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Error',
      dataIndex: 'error',
      key: 'error',
      align: 'center',
      render: (error: any) => {
        return <TextArea rows={4} value={error} className="text-red-600" />
      },
    },
    {
      title: 'Total Records',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: '7%',
      render: (created_at: string) => {
        const date = new Date(created_at)
        const formattedDate =
          date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }) +
          ' ' +
          date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        return <p>{formattedDate}</p>
      },
    },
  ]
  return (
    <MainLayout>
      <div className="mb-12">
        <h2>Import users</h2>
      </div>
      <div>
        <Form
          form={form}
          name="createForm"
          onFinish={(value) => onFinish(value)}
          className={''}
          scrollToFirstError
        >
          <Form.Item {...summitButtonLayout}>
            <Upload {...props} maxCount={1}>
              <Button icon={<UploadOutlined />}>Input file</Button>
            </Upload>
          </Form.Item>
          <Form.Item {...summitButtonLayout}>
            <Button
              className={'w-28'}
              type="primary"
              htmlType="submit"
              loading={loadings}
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={dataImport} bordered />
      </div>
    </MainLayout>
  )
}

export default UsersImprot
