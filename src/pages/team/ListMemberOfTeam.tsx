import React from 'react'
import { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Space, Button, Modal, Table, message, Spin } from 'antd'
import ModalRemove from './ModalRemove'
import axiosInstance from '../../services/request/base'
import SelectOption from '../../components/teams/SelectOption'
import { User } from '../../components/teams/interface'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../components/layouts/main'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import { TEAM_DELETE_MEMBER } from '../../libs/constants/Permissions'
import { DeleteOutlined } from '@ant-design/icons'

const permissionsInfo = getPermissions()

const ListMemberOfTeam = () => {
  const [listUser, setListUser] = useState<User[]>([])
  const [showModalAddMem, setShowModalAddMem] = useState<boolean>(false)
  const [showModalDeleteMem, setShowModalDeleteMem] = useState<boolean>(false)
  const blog: string = 'Are you sure to delete member?'
  const [listAllUser, setListAllUser] = useState<User[]>([])
  const [filter, setFilter] = useState({
    search: '',
  })
  const [newMem, setNewMem] = useState<number>(1)
  const [chooseUserToAt, setChooseUserToAt] = useState<number[]>([])
  const { id } = useParams()
  const teamId = id
  const navigate = useNavigate()
  const [title, setTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getInfoTeam()
    getListMember()
  }, [teamId])

  useEffect(() => {
    getAllUserVer2()
  }, [])

  const getListMember = async () => {
    const res = await axiosInstance.get(`/team/get-list-user-of-team/${teamId}`)
    setListUser(res.data.data.records)
    setIsLoading(false)
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

  const getInfoTeam = async () => {
    const res = await axiosInstance.get(`/team/get-detail-team/${id}`)
    setTitle(`${res.data.data.name}'s Members`)
  }

  const handleSearch = (data: string) => {
    setFilter({ search: data })
    if (data === '') {
    } else {
      getAllUser()
    }
  }

  const onRemove = async (id: number) => {
    const res = await axiosInstance.delete(
      `/team/remove-member/${teamId}?ids[]=${id}`,
    )
    if (res.data.status) {
      setShowModalDeleteMem(false)
      await getListMember()
      setTimeout(() => {
        message.success('Delete Successful')
      }, 250)
    } else {
      setTimeout(() => {
        message.error('Delete Fail')
      }, 250)
    }
  }

  const lists: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Details',
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'leader',
      align: 'center',
      width: '12%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: '10%',
      render: (gender: number) => {
        if (gender === 1) {
          return <span>Male</span>
        } else if (gender === 2) {
          return <span>Female</span>
        } else {
          return <span>Other</span>
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: '10%',
      render: (_, data) => (
        <Space size="middle">
          {permissionsInfo &&
            TEAM_DELETE_MEMBER.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <Button
                danger
                type="primary"
                onClick={() => deleteUser(data.id)}
                className="rounded-full"
              >
                <DeleteOutlined />
              </Button>
            )}
        </Space>
      ),
    },
  ]

  const getAllUserVer2 = async () => {
    const res = await axiosInstance.get(`/user/get-all`)
    setListAllUser(res.data.data)
  }

  const deleteUser = (id: number) => {
    setShowModalDeleteMem(true)
    setNewMem(id)
  }

  const AddUser = async () => {
    const data = {
      ids: chooseUserToAt,
    }

    try {
      const res = await axiosInstance.post(`/team/add-member/${teamId}`, data)
      if (res.data.status) {
        setShowModalAddMem(false)
        await getListMember()
        setTimeout(() => {
          message.success('Add member successful')
        }, 50)
      }
    } catch (error) {
      setTimeout(() => {
        message.error('The user is already in the team')
      }, 50)
    }
  }

  const handleChange = (value: number[]) => {
    setChooseUserToAt(value)
  }

  return (
    <MainLayout>
      <div>
        <div className="... flex items-center justify-center">
          <h1>{title}</h1>
        </div>
        <Button
          onClick={() => {
            navigate(-1)
          }}
        >
          Back
        </Button>
        <Button
          type="primary"
          className="bg-orange-500 float-right"
          onClick={() => {
            setShowModalAddMem(true)
          }}
        >
          Add member
        </Button>

        {isLoading ? (
          <Spin className="flex justify-center" />
        ) : (
          <Table className="pt-5" columns={lists} dataSource={listUser} />
        )}
      </div>
      {
        <Modal
          open={showModalAddMem}
          destroyOnClose={true}
          onCancel={() => {
            setShowModalAddMem(false)
          }}
          title={'ADD USERS'}
          footer={[
            <Button
              style={{ backgroundColor: 'green' }}
              onClick={() => AddUser()}
            >
              Add
            </Button>,
            <Button
              color="secondary"
              onClick={() => {
                setShowModalAddMem(false)
              }}
            >
              Cancel
            </Button>,
          ]}
        >
          <>
            <SelectOption
              blog="Please choose user"
              handleChange={handleChange}
              handleSearch={handleSearch}
              data={listAllUser}
              mode="multiple"
            />
          </>
        </Modal>
      }
      {showModalDeleteMem && (
        <ModalRemove
          openModalDelete={setShowModalDeleteMem}
          blog={blog}
          onDelete={() => onRemove(newMem)}
        />
      )}
    </MainLayout>
  )
}

export default ListMemberOfTeam
