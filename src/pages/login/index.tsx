import { Button, Checkbox, Form, Input, notification } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { LoginRequest, login } from '../../services/authentication'
import HomeLayout from '../../components/layouts/home'

import { useNavigate } from 'react-router-dom'
const LoginPage = () => {
  const navigate = useNavigate()
  const user = localStorage.getItem('user_info')
  const [data, setData] = useState<LoginRequest>({
    email: '',
    password: '',
    remember: true,
  })
  const [antForm] = Form.useForm()
  const handleLogin = async (data: any) => {
    try {
      const res = await login(data)
      //  xử lý khi đăng nhập thành công
      localStorage.setItem('accessToken', res.data.data.access_token)
      localStorage.setItem('user_info', JSON.stringify(res.data.data.user))
      localStorage.setItem(
        'permissions',
        JSON.stringify(res.data.data.permission),
      )
      navigate('/')
    } catch (err: any) {
      // xử lý khi đăng nhập thất bại
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((message) => `- ${message}<br>`)
          .join('')
        const key = 'updatable'
        notification['error']({
          key,
          duration: 5,
          message: 'Login failed',
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
          message: 'Login failed',
          description: err.response.data.message,
        })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.currentTarget.name]: e.currentTarget.value })
  }
  const handleSubmit = async () => {
    const values = antForm.getFieldsValue()
    try {
      await antForm.validateFields()
    } catch (err) {
      return
    }
    handleLogin(values)
  }
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])
  return (
    <HomeLayout>
      <div className="bg-sky-500  min-h-screen min-w-screen flex justify-center items-center">
        <div className="bg-white p-6 w-3/5 h-1/2 rounded-30px overflow-hidden flex">
          <div className="w-1/2 hg_login bg-no-repeat border-radius-30px block bg-login bg-center"></div>
          <div className="w-1/2">
            <div className="flex flex-col ml-20 mr-20">
              <h2>Đăng nhập tài khoản của bạn</h2>
              <p>Để sử dụng dịch vụ của chúng tôi</p>
              <br />
              <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                form={antForm}
              >
                <Form.Item label="Email" name="email">
                  <Input onChange={handleChange} />
                </Form.Item>

                <Form.Item label="Password" name="password">
                  <Input.Password onChange={handleChange} />
                </Form.Item>

                {/* <Form.Item
                  name="remember"
                  valuePropName="checked"
                  wrapperCol={{ offset: 8, span: 16 }}
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item> */}

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default LoginPage
