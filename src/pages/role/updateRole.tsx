import { Button, Col, Form, Input, Row, Spin, notification } from 'antd'
import { useState, useEffect, Fragment } from 'react'
import { getRole, listRoute, updateRole } from '../../services/role'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../components/layouts/main'
import { Role } from '../../types/role'
import { ROLES } from '../../libs/constants/roles'

const UpdateRolePage = () => {
  const [permissions, setPermissions] = useState<string[]>()
  const [role, setRole] = useState<Role>()
  const [antForm] = Form.useForm()
  const navigate = useNavigate()
  const [isloading, setIsloading] = useState<boolean>(false)
  const { id } = useParams<{ id: string }>()
  const [checkedItems, setCheckedItems] = useState<any>([])
  const [groupName, setGroupName] = useState<string[]>()
  const handleChange = (event: any) => {
    const { name, checked } = event.target
    if (!checked) {
      const newChecked = checkedItems.filter((item: string) => item !== name)
      setCheckedItems(newChecked)
    } else {
      setCheckedItems((prevCheckedItems: any) => [...prevCheckedItems, name])
    }
  }
  const handleChangeGroup = (event: any) => {
    const { name, checked } = event.target
    if (!checked) {
      let foo = checkedItems
      permissions?.map((permission) => {
        if (permission.split('.')[0] === name) {
          foo = foo.filter((item: string) => item !== permission)
        }
      })
      setCheckedItems(foo)
    } else {
      permissions?.map((permission) => {
        if (
          permission.split('.')[0] === name &&
          !checkedItems.includes(permission)
        ) {
          setCheckedItems((prevCheckedItems: any) => [
            ...prevCheckedItems,
            permission,
          ])
        }
      })
    }
  }
  const handleSubmit = async () => {
    const values = antForm.getFieldsValue()
    try {
      if (id) {
        const res = await updateRole(
          { ...values, role: checkedItems },
          parseInt(id),
        )
        notification['success']({
          message: 'Update role successful',
          description: res.data.message,
        })
        navigate('/role/')
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
          message: 'Update Role failed',
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
          message: 'Update Role failed',
          description: err.response.data.message,
        })
        navigate('/role/')
      }
    }
  }
  const handleCancel = () => {
    navigate('/role/')
  }
  useEffect(() => {
    handleGetPermissions()
    handleGetRole()
  }, [])
  const handleGetRole = async () => {
    setIsloading(true)
    try {
      if (id) {
        const response = await getRole(parseInt(id))
        // if (response.data.data.role_name === ROLES.ADMIN) {
        //   navigate('/role/')
        // }
        setRole(response.data.data)
        setCheckedItems(response.data.data.role_permissions)
      }
    } catch (err: any) {
      notification['error']({
        duration: 5,
        message: 'get type failed',
        description: err.message,
      })
    }
    setIsloading(false)
  }
  const handleGetPermissions = async () => {
    try {
      const response = await listRoute()
      setPermissions(response.data.data)
      const uniqueNames = new Set<string>(
        response.data.data.map(
          (permission: string) => permission.split('.')[0],
        ),
      )

      setGroupName(Array.from(uniqueNames))
    } catch (err: any) {
      notification['error']({
        duration: 5,
        message: 'get type failed',
        description: err.message,
      })
    }
  }
  return (
    <MainLayout>
      <h1 className="text-sky-500 flex justify-center">Update role </h1>
      {isloading ? (
        <Spin className="flex justify-center" key="spin" />
      ) : (
        <Form name="update-profile" layout="vertical" form={antForm}>
          <Row>
            <Col span={12}>
              <Form.Item
                className="ml-10 mr-10"
                name="role_name"
                label="Role name"
                initialValue={role?.role_name}
                rules={[
                  {
                    required: true,
                    message: 'Role name is required!',
                    whitespace: true,
                  },
                ]}
              >
                <Input key="role_name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            className="ml-10 mr-10 "
            label="Description"
            initialValue={role?.description}
            rules={[
              {
                required: true,
                message: 'Role description is required!',
                whitespace: true,
              },
            ]}
          >
            <Input.TextArea rows={3} key="description" />
          </Form.Item>

          <div className="h-[300px] w-[full] ml-[40px] overflow-y-scroll">
            <p>Role Permission</p>
            <table>
              <tbody>
                {groupName?.map((name: string) => {
                  return (
                    <Fragment key={`role-${name}`}>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            name={name}
                            id={`role-${name}`}
                            value={name}
                            onChange={handleChangeGroup}
                          />
                          <label htmlFor={`role-${name}`}>{name}</label>
                        </td>
                      </tr>
                      {permissions?.map((permission) => {
                        const checkboxName = `${permission}`
                        let checked = false
                        if (checkedItems.includes(permission)) checked = true
                        if (permission.split('.')[0] === name)
                          return (
                            <tr key={`role-${checkboxName}`}>
                              <td>
                                <input
                                  className="ml-5"
                                  type="checkbox"
                                  name={checkboxName}
                                  id={`role-${checkboxName}`}
                                  value={checkboxName}
                                  checked={checked}
                                  onChange={handleChange}
                                />
                                <label htmlFor={`role-${checkboxName}`}>
                                  {checkboxName}
                                </label>
                              </td>
                            </tr>
                          )
                      })}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          <Form.Item className="pt-5 flex justify-end">
            <Button
              type="primary"
              className="mr-3"
              htmlType="submit"
              onClick={handleSubmit}
              key="edit_button"
            >
              Save
            </Button>
            <Button
              type="primary"
              className="bg-gray-500"
              onClick={handleCancel}
              key="cancel_button"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </MainLayout>
  )
}

export default UpdateRolePage
