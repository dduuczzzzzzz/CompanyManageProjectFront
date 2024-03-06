import { useEffect, useState, ChangeEvent, useRef } from 'react'
import MainLayout from '../../components/layouts/main'
import { profile, updateProfile } from '../../services/profile'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Avatar,
  notification,
} from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { LIST_GENDER } from '../../libs/constants/Options'
import { validationSchema } from '../../validations/editProfile'

const editProfileRules = {
  async validator({ field }: { field: string }, value: any) {
    await validationSchema.validateSyncAt(field, { [field]: value })
  },
}
const UpdateProfilePage = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState<string | null>(null)
  const [fileSelected, setFileSelected] = useState<any>()
  function handleChangeAvt(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      setFile(URL.createObjectURL(e.target.files[0]))
      setFileSelected(e.target.files[0])
    }
  }
  const inputRef = useRef(null)
  const [res, setRes] = useState<any>(null)
  const [antForm] = Form.useForm()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    const handleGetProfile = async () => {
      setIsLoading(true)
      try {
        const response = await profile()
        // Lưu trữ giá trị res vào state
        setRes(response.data.data)
        setIsLoading(false)
        if (response.data.data?.avatar) {
          setFile(response.data.data.avatar)
        }
      } catch (err) {
        // Xử lý lỗi nếu cần
        setIsLoading(false)
      }
    }

    handleGetProfile()
  }, [])
  const handleUpdate = async (data: any) => {
    try {
      const formData: any = new FormData()
      if (fileSelected) {
        formData.append('avatar', fileSelected)
      }
      formData.append('_method', 'PUT')
      formData.append('name', data.name)
      if (file === null) {
        formData.append('delete_avt', true)
      }
      formData.append('email', data.email)
      formData.append('address', data.address)
      formData.append('details', data.details || '')
      formData.append('phone_number', data.phone_number)
      formData.append('gender', data.gender)
      if (data?.password) {
        formData.append('password', data.password)
        formData.append('password_confirmation', data.password_confirmation)
      }
      formData.append('dob', data.dob)
      const res = await updateProfile(formData)
      localStorage.setItem('user_info', JSON.stringify(res.data.data))
      notification['success']({
        message: 'Update successful',
        description: res.data.message,
      })
      navigate('/profile')
    } catch (err: any) {
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((message) => `- ${message}<br>`)
          .join('')
        const key = 'updatable'
        notification['error']({
          key,
          duration: 5,
          message: 'Update role failed',
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
          message: 'Update role failed',
          description: err.response.data.message,
        })
      }
    }
  }
  const handleSubmit = async () => {
    const values = antForm.getFieldsValue()
    try {
      await antForm.validateFields()
    } catch (err) {
      return
    }
    handleUpdate(values)
  }
  const handleCancel = () => {
    navigate('/profile')
  }
  const handleClear = (inputRef: any) => {
    setFile(null)
    setFileSelected(null)
    inputRef.current.value = ''
  }
  return (
    <MainLayout>
      <h1 className="text-orange-500 flex justify-center">
        Chỉnh sửa trang cá nhân
      </h1>
      {isLoading ? (
        <Spin className="flex justify-center" />
      ) : (
        <Form name="update-profile" layout="vertical" form={antForm}>
          <h3 className="flex justify-center ml-10 mb-4">Avatar</h3>
          <div className="flex justify-center ml-10 mb-4">
            <Avatar
              src={file}
              alt="avatar"
              className="w-[150px] h-[150px] flex justify-center"
            ></Avatar>
            {file && (
              <Button
                icon={<CloseOutlined className="w-[10px] h-[10px]" />}
                onClick={() => handleClear(inputRef)}
              />
            )}
          </div>
          <div className="flex justify-center ml-10 mb-4">
            <input
              ref={inputRef}
              type="file"
              name="avatar"
              onChange={handleChangeAvt}
            />
          </div>
          <Row>
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="name"
                label="Họ tên"
                initialValue={res?.name}
                rules={[editProfileRules as any]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="email"
                label="Email"
                initialValue={res?.email}
                rules={[editProfileRules as any]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="gender"
                label="Giới tính"
                initialValue={res?.gender}
              >
                <Select options={LIST_GENDER} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="dob"
                label="Ngày sinh"
                initialValue={res?.dob}
                rules={[editProfileRules as any]}
              >
                <Input type="date" value={`${res?.dob}`} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="phone_number"
                className="ml-10 mr-10 "
                label="Số điện thoại"
                initialValue={res?.phone_number}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                className="ml-10 mr-10 "
                label="Địa chỉ"
                initialValue={res?.address}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="details"
            className="ml-10 mr-10 "
            label="Description"
            initialValue={res?.details}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                name="password"
                className="ml-10 mr-10 "
                label="Password"
                rules={[editProfileRules as any]}
              >
                <Input type="password" name="password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password_confirmation"
                className="ml-10 mr-10 "
                label="Nhập lại password"
                rules={[editProfileRules as any]}
              >
                <Input type="password" name="password_confirmation" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="flex justify-center">
            <Button
              type="dashed"
              className="w-[100px] text-white m-5 bg-green-500  rounded-full"
              htmlType="submit"
              onClick={handleSubmit}
            >
              Cập nhật
            </Button>
            <Button
              type="dashed"
              className="w-[100px] text-white bg-red-500 m-5  rounded-full"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      )}
    </MainLayout>
  )
}

export default UpdateProfilePage
