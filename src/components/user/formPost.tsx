import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Select, Spin, DatePicker } from 'antd'
import { UploadPicture } from './upload'
import 'react-datepicker/dist/react-datepicker.css'
import {
  getAllRole,
  userApiCreate,
  userApiUpdate,
} from '../../services/request/user'
import '../../styles/user/user.css'
import dayjs from 'dayjs'
import Spinner from './spin'
import { RoleSelect } from './roleSelect'
import { getRole } from '../../services/request/user'
import { react } from '@babel/types'

const { Option } = Select

const FormPost = (props: any) => {
  const { id } = props
  const { userData } = props
  const { startDate } = props
  const { setStartDate } = props
  const { setIsLoading } = props
  const { isLoading } = props
  const [error, setError] = useState({
    email: undefined,
    dob: undefined,
  })

  useEffect(() => {
    getAllRoles()
  }, [])

  useEffect(() => {}, [error])

  const getAllRoles = async () => {
    const response = await getAllRole()
    setRole(response)
  }
  const [roles, setRole] = useState([])
  const [user, setUser] = useState()
  const [selectedFile, setSelectedFile] = useState()
  const [isDeleteAvt, setIsDeleteAvt] = useState(undefined)
  // const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(userData)
    if (id) {
      form.setFieldsValue({
        gender: `${userData?.gender}`,
        status: `${userData?.status}`,
        role_id: `${userData?.role_id}`,
        details: userData?.details,
        address: userData?.address,
      })
    }
  }, [userData])

  const onFinish = async (values: any) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('email', values.email)
    formData.append('gender', values.gender)
    formData.append('role_id', values.role_id)
    formData.append('status', values.status)
    formData.append(
      'dob',
      startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
    )
    formData.append(
      'details',
      values.details == null || undefined ? ' ' : values.details,
    )
    formData.append(
      'address',
      values.address == null || undefined ? ' ' : values.address,
    )
    formData.append(
      'phone_number',
      values.phone_number ? values.phone_number : '',
    )

    if (selectedFile) {
      formData.append('avatar', selectedFile)
    }

    if (id) {
      if (isDeleteAvt !== undefined) {
        formData.append('delete_avatar', 'true')
      }

      formData.append('_method', 'put')
      const [resultUpdate, apiErrors] = await userApiUpdate(
        { setError },
        error,
        formData,
        id,
      )

      if (resultUpdate !== undefined) {
        navigate('/users/')
      } else {
        if (apiErrors) {
          const formErrors = Object.keys(apiErrors).map((errorKey) => ({
            name: errorKey,
            value: values[errorKey],
            errors: [apiErrors[errorKey]],
          }))
          form.setFields(formErrors)
        }
      }
    } else {
      formData.append('password', values.password)
      formData.append('password_confirmation', values.password_confirmation)
      const [resultCreate, apiErrors] = await userApiCreate(
        { setError },
        formData,
      )

      if (resultCreate) {
        navigate('/users/')
      } else {
        if (apiErrors) {
          const formErrors = Object.keys(apiErrors).map((errorKey) => ({
            name: errorKey,
            value: values[errorKey],
            errors: [apiErrors[errorKey]],
          }))
          form.setFields(formErrors)
        }
      }
    }
    setIsLoading(false)
  }
  const handleEmailChange = () => {}
  const handleDatePickerChange = async (date: any) => {
    await setStartDate(date)
    await setError((preError: any) => ({ ...preError, dob: undefined }))
  }

  return (
    <>
      <Form
        form={form}
        name="createForm"
        onFinish={(value) => onFinish(value)}
        className={'w-3/4'}
        scrollToFirstError
      >
        {/* <Form.Item {...summitButtonLayout}>
          <UploadPicture
            avatar={userData?.avatar}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setIsDeleteAvt={setIsDeleteAvt}
          />
        </Form.Item> */}

        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'User name is required!',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              pattern: new RegExp(
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
              ),
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'User email is required!',
            },
          ]}
        >
          <Input onBlur={handleEmailChange} />
        </Form.Item>
        <Form.Item
          style={id ? { display: 'none' } : {}}
          name="password"
          label="Password"
          rules={
            id
              ? []
              : [
                  {
                    required: true,
                    message: 'User password is required!',
                  },
                  {
                    min: 6,
                    message: 'Your password must be at least 6 characters',
                  },
                ]
          }
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          style={id ? { display: 'none' } : {}}
          name="password_confirmation"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={
            id
              ? []
              : [
                  {
                    required: true,
                    message: 'Please confirm user password!',
                  },
                ]
          }
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="gender" label="Gender">
          <Select placeholder="Select user gender">
            <Option value="1">Male</Option>
            <Option value="2">Female</Option>
            <Option value="3">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select placeholder="Select user status">
            <Option value="0">Active</Option>
            <Option value="1">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="role_id"
          label="Role"
          rules={[{ required: true, message: 'User role is required!' }]}
        >
          <Select placeholder="Select user role">
            {roles.map((role: any) => {
              return (
                <Option key={role.id} value={`${role.id}`}>
                  {role.role_name}
                </Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[
            {
              pattern: new RegExp(/^(0[1-9][0-9]{8})$/, 'g'),
              message: 'This is not a phone number',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="details" label="Description">
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>
        <div className="flex justify-end">
          <Form.Item className="mr-3">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
          <Button
            type="primary"
            className="bg-gray-500"
            onClick={() => {
              navigate('/users/')
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </>
  )
}

export default FormPost
