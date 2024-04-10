import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Select, Spin, message, notification } from 'antd'
import MainLayout from '../../components/layouts/main'
import axiosInstance from '../../services/request/base'
import { User, Team } from '../../components/teams/interface'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useLocation, useNavigate } from 'react-router-dom'
import { FormInstance } from 'antd/es/form'
import TextArea from 'antd/es/input/TextArea'

const summitButtonLayout = {
  wrapperCol: {
    sm: {
      offset: 10,
    },
  },
}

const errorValidate = {
  wrapperCol: {
    sm: {
      offset: 4,
    },
  },
}

const CreateTeam = () => {
  const navigate = useNavigate()
  const [listAllUser, setListAllUser] = useState<User[]>([])
  const [leader_id, setLeader_id] = useState<string>('')
  const [filter, setFilter] = useState({
    search: '',
  })
  const [filterTeam, setFilterTeam] = useState({
    name: '',
  })
  const { Option } = Select
  const [listAllTeam, setListAllTeam] = useState<Team[]>([])
  const location = useLocation()
  const formRef = React.useRef<FormInstance>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getAllUserVer2()
    getAllTeam2()
  }, [])

  const getAllTeam2 = async () => {
    const res = await axiosInstance.get(`/team/all-list-main-team`)
    setListAllTeam(res.data.data)
    setIsLoading(false)
  }

  const getAllUserVer2 = async () => {
    const res = await axiosInstance.get(`/user/get-all`)
    setListAllUser(res.data.data)
  }

  const getAllTeam = async () => {
    const url = new URLSearchParams(filterTeam)
    const res = await axiosInstance.get(`/team?${url}`)
    if (filterTeam.name === '') {
      setListAllTeam([])
    } else {
      setListAllTeam(res.data.data.records)
    }
  }

  const getAllUser = async () => {
    const url = new URLSearchParams(filter)
    const res = await axiosInstance.get(`/user?${url}`)
    if (filter.search === '') {
      setListAllUser([])
    } else {
      setListAllUser(res.data.data.records)
    }
  }

  const handleChange = (value: number | undefined) => {
    if (!value) {
      return
    } else {
      setLeader_id(value.toString())
    }
  }

  const handleSearch = (data: string) => {
    setFilter({ search: data })
    if (data === '') {
    } else {
      getAllUser()
    }
  }

  const handleSearchTeam = (data: string) => {
    setFilterTeam({ name: data })
    if (data === '') {
    } else {
      getAllTeam()
    }
  }

  async function onCreate(
    parent_team_id: string,
    name: string,
    leader_id: string,
    details: string,
  ) {
    const data = {
      parent_team_id: parent_team_id,
      name: name,
      leader_id: leader_id,
      details: details,
    }

    await axiosInstance
      .post(`/team/create-new-team`, data)
      .then(() => {
        formRef.current?.resetFields()
        setTimeout(() => {
          notification['success']({
            key: 'add team success',
            duration: 5,
            message: 'Add team successfully',
          })
          setTimeout(() => {
            navigate(`/teams`)
          }, 50)
        }, 50)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          if (Number(error.response.status) === 422) {
            setTimeout(() => {
              notification['error']({
                duration: 5,
                message: 'Error',
                description: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: error.response.data.errors.name,
                    }}
                    className="text-red-500"
                  />
                ),
              })
            }, 50)
          } else if (Number(error.response.status) === 404) {
            setTimeout(() => {
              notification['error']({
                duration: 5,
                message: 'Error',
                description: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: error.response.data.message,
                    }}
                    className="text-red-500"
                  />
                ),
              })
            }, 50)
          }
        }
      })
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      details: '',
      parent_team_id: location?.state?.teamId,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Required')
        .min(4, 'Must be 4 characters or more'),
      details: Yup.string()
        .required('Required')
        .min(10, 'Must be 10 characters or more'),
    }),
    onSubmit: (values) => {
      onCreate(
        formik.values.parent_team_id,
        formik.values.name,
        leader_id,
        formik.values.details,
      )
    },
  })

  return (
    <MainLayout>
      <>
        <div className="... flex items-center justify-center">
          <h1>Create new team</h1>
        </div>
        {isLoading ? (
          <Spin className="flex justify-center" />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Form
              id="myForm"
              onFinish={formik.handleSubmit}
              name="createForm"
              className={'w-3/4'}
              scrollToFirstError
            >
              <Form.Item name="Name" label="Name">
                <Input
                  size="large"
                  value={formik.values.name}
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Form.Item
                {...errorValidate}
                style={{ marginTop: -30, marginBottom: -10 }}
              >
                {formik.errors.name && formik.touched.name ? (
                  <p
                    style={{
                      color: 'red',
                    }}
                  >
                    {formik.errors.name}
                  </p>
                ) : null}
              </Form.Item>
              <Form.Item name="Details" label="Details" className="mb-8">
                <TextArea
                  rows={4}
                  showCount
                  maxLength={100}
                  size="large"
                  value={formik.values.details}
                  id="details"
                  name="details"
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Form.Item
                {...errorValidate}
                style={{ marginTop: -30, marginBottom: -10 }}
              >
                {formik.errors.details && formik.touched.details ? (
                  <p
                    style={{
                      color: 'red',
                    }}
                  >
                    {formik.errors.details}
                  </p>
                ) : null}
              </Form.Item>
              <Form.Item name="Leader" label="Leader">
                <Select
                  size="large"
                  allowClear
                  showSearch
                  placeholder={'Choose leader'}
                  onChange={handleChange}
                  onSearch={(e) => handleSearch(e)}
                  filterOption={() => true}
                >
                  {listAllUser.map((user) => {
                    return (
                      <Option key={user.id} value={user.id}>
                        {user.name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>{' '}
              <Form.Item
                name="parent_team_id"
                id="parent_team_id"
                label="Choose Parent Team"
              >
                <Select
                  size="large"
                  allowClear
                  showSearch
                  placeholder={'Choose parent team'}
                  onChange={(parent_team_id) => {
                    formik.setFieldValue('parent_team_id', parent_team_id)
                  }}
                  onSearch={(e) => handleSearchTeam(e)}
                  filterOption={() => true}
                  defaultValue={location?.state?.teamId}
                >
                  {listAllTeam.map((team: Team) => (
                    <Option key={team.id} value={team.id}>
                      {team.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item {...summitButtonLayout}>
                <Button
                  form="myForm"
                  key="submit"
                  htmlType="submit"
                  type="primary"
                >
                  Create
                </Button>
                <Button
                  onClick={() => {
                    navigate(-1)
                  }}
                  style={{ marginLeft: 10 }}
                >
                  Back
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </>
    </MainLayout>
  )
}

export default CreateTeam
