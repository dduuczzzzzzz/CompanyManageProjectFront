import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  redirect,
  useNavigate,
} from 'react-router-dom'
import { Table, Space, Modal, Button, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import MainLayout from '../../components/layouts/main'
import Filter from '../../components/user/filter'
import { User } from '../../types/user'
import { FilterType } from '../../types/user'
import { userApi, userApiDelete } from '../../services/request/user'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import { USER_DELETE, USER_UPDATE } from '../../libs/constants/Permissions'
import Spinner from '../../components/user/spin'
import { getRole } from '../../services/request/user'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const ListUsers = () => {
  const permissionsInfo = getPermissions()
  const [idUser, setIdUser] = useState()
  const [totalUser, setTotalUser] = useState()
  const [roles, setRoles] = useState([])

  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState<FilterType>({
    gender: '',
    status: '',
    role: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>()
  const navigate = useNavigate()
  const handleDelete = async (key: string) => {
    await userApiDelete({ setIdUser, setIsLoading }, key)
  }

  const showDeleteConfirm = (record: any) => {
    Modal.confirm({
      title: 'Delete Record',
      content: `Are you sure you want to delete ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(record.id)
      },
    })
  }
  useEffect(() => {
    setIsLoading(true)
    const url = new URLSearchParams(filter)
    userApi(url, { setUsers, setTotalUser, setIsLoading })
    getRoles()
  }, [])
  useEffect(() => {
    const url = new URLSearchParams(filter)
    userApi(url, { setUsers, setTotalUser, setIsLoading })
  }, [filter, idUser])

  const getRoles = async () => {
    const response = await getRole()
    setRoles(response)
  }
  const columns: ColumnsType<User> = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      width: '15%',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      width: '15%',
    },
    {
      key: 'address',
      title: 'Address',
      dataIndex: 'address',
      align: 'center',
      width: '15%',
    },
    {
      key: 'phone_number',
      title: 'Phone Number',
      dataIndex: 'phone_number',
      align: 'center',
      width: '10%',
    },
    {
      key: 'dob',
      title: 'Birthday',
      dataIndex: 'dob',
      align: 'center',
      width: '10%',
      render: (dob: string) => {
        let awesomeDate: String = ''
        if (dob) {
          const [year, month, day]: string[] = dob.split('-')
          awesomeDate = `${day}/${month}/${year}`
        }
        return <p>{awesomeDate}</p>
      },
    },
    {
      key: 'gender',
      title: 'Gender',
      dataIndex: 'gender',
      align: 'center',
      width: '5%',
      render: (gender) => {
        if (gender == 1) {
          return <p>Male</p>
        } else {
          return <p>Female</p>
        }
      },
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role_id',
      align: 'center',
      width: '5%',
      render: (role) => {
        const matchedRole: any = roles.find(
          (each_role: any) => each_role?.id === role,
        )
        if (matchedRole) {
          return <p>{matchedRole.role_name}</p>
        }
        return null
      },
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: '5%',
      render: (status) => {
        if (status == 1) {
          return <p>Active</p>
        } else {
          return <p>Block</p>
        }
      },
    },
    {
      key: 'id',
      title: 'Action',
      dataIndex: 'id',
      align: 'center',
      width: '15%',

      render: (text, record) => (
        <Space size="middle">
          {permissionsInfo &&
            USER_UPDATE.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <Link to={`/users/edit/${record.id}`}>
                <Button type="primary" className="rounded-full">
                  <EditOutlined />
                </Button>
              </Link>
            )}
          {permissionsInfo &&
            USER_DELETE.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <Link to="" onClick={() => showDeleteConfirm(record)}>
                <Button type="primary" danger className="rounded-full">
                  <DeleteOutlined />
                </Button>
              </Link>
            )}
        </Space>
      ),
    },
  ]

  return (
    <MainLayout>
      <>
        <div className="mb-8">
          <Button
            type="primary"
            className="mb-8 bg-green-500 float-right focus:bg-green-400"
            onClick={() => {
              navigate('/users/add')
            }}
          >
            Create New User
          </Button>
        </div>
        <Filter setFilter={setFilter} filterValue={filter} />
        {isLoading ? (
          <Spin className="flex justify-center" />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              pagination={{
                defaultPageSize: 10,
                total: totalUser,
                onChange: (page) => {
                  setFilter((filter: any) => ({ ...filter, page: page }))
                },
              }}
            />
          </>
        )}
      </>
    </MainLayout>
  )
}

export default ListUsers
