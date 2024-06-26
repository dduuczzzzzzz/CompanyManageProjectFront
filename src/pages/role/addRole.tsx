import { Button, Col, Form, Input, Row, notification } from 'antd'
import MainLayout from '../../components/layouts/main'
import { useNavigate } from 'react-router-dom'
import { addRole } from '../../services/role'

const AddRolePage = () => {
  const [antForm] = Form.useForm()
  const navigate = useNavigate()
  const handleSubmit = async () => {
    const values = antForm.getFieldsValue()

    try {
      const res = await addRole(values)
      notification['success']({
        message: 'Add role successful',
        description: res.data.message,
      })
      navigate('/role/')
    } catch (err: any) {
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((message) => `- ${message}<br>`)
          .join('')
        const key = 'updatable'
        notification['error']({
          key,
          duration: 5,
          message: 'Add role failed',
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
          message: 'Add role failed',
          description: err.response.data.message,
        })
      }
    }
  }
  const handleCancel = () => {
    navigate('/role/')
  }

  return (
    <MainLayout>
      <h1 className="text-sky-500 flex justify-center">Add role </h1>
      <div className="w-full flex justify-center">
        <Form
          className="w-3/4"
          name="update-profile"
          layout="vertical"
          form={antForm}
        >
          <Form.Item
            className="ml-10 mr-10"
            name="role_name"
            label="Role name:"
            rules={[
              {
                required: true,
                message: 'Role name is required!',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            className="ml-10 mr-10 "
            label="Description:"
            rules={[
              {
                required: true,
                message: 'Role description is required!',
                whitespace: true,
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Button
              type="primary"
              className="mr-3"
              htmlType="submit"
              onClick={handleSubmit}
            >
              Save
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
      </div>
    </MainLayout>
  )
}

export default AddRolePage
