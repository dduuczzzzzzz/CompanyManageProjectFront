import { Modal, Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../services/request/base'
import { Team, User } from '../../components/teams/interface'
interface Props {
  openModal: React.Dispatch<React.SetStateAction<boolean>>
  onCreate: (
    parent_team_id: string,
    name: string,
    leader_id: string,
    details: string,
  ) => void
  blog: string

  team: {
    parent_team_id: string
    name: string
    leader_id: string
    details: string
  }
  checkListMain: boolean
}

const ModalCreateTeam: React.FC<Props> = ({
  openModal,
  onCreate,
  blog,
  team,
  checkListMain,
}) => {
  const toggleModalCreate = () => {
    openModal(false)
  }
  const { Option } = Select

  const [name, setName] = useState<string>(team.name)
  const [leader_id, setLeader_id] = useState<string>(team.leader_id)
  const [parent_team_id, setParent_team_id] = useState<string>(
    team.parent_team_id,
  )
  const [details, setDetails] = useState<string>(team.details)
  const [filter, setFilter] = useState({
    search: '',
  })
  const [listAllUser, setListAllUser] = useState<User[]>([])
  const [filterTeam, setFilterTeam] = useState({
    name: '',
  })
  const [listAllTeam, setListAllTeam] = useState<Team[]>([])

  const getAllUser = async () => {
    const url = new URLSearchParams(filter)
    const res = await axiosInstance.get(`/user?${url}`)
    setListAllUser(res.data.data.records)
  }

  const getAllUserVer2 = async () => {
    const res = await axiosInstance.get(`/user/get-all`)
    setListAllUser(res.data.data)
  }
  const getAllTeam2 = async () => {
    const res = await axiosInstance.get(`/team/all-list-main-team`)
    setListAllTeam(res.data.data)
  }

  useEffect(() => {
    getAllUserVer2()
    getAllTeam2()
  }, [])

  const handleSearch = (data: string) => {
    setFilter({ search: data })
    if (data === '') {
    } else {
      getAllUser()
    }
  }

  const handleChange = (value: number | undefined) => {
    if (!value) {
      setLeader_id('')
    } else {
      setLeader_id(value.toString())
    }
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

  const handleChangeTeam = (value: number | undefined) => {
    if (!value) {
      return
    } else {
      setParent_team_id(value.toString())
    }
  }

  const handleSearchTeam = (data: string) => {
    setFilterTeam({ name: data })
    if (data === '') {
    } else {
      getAllTeam()
    }
  }

  return (
    <div>
      <Modal
        open={true}
        title={blog === 'CREATE' ? 'Save' : 'Update'}
        onCancel={() => toggleModalCreate()}
        footer={[
          <Button
            form="myForm"
            key="submit"
            htmlType="submit"
            type="primary"
            onClick={(e) => onCreate(parent_team_id, name, leader_id, details)}
          >
            {blog}
          </Button>,
          <Button key="back" onClick={() => toggleModalCreate()}>
            Cancel
          </Button>,
        ]}
      >
        <>
          <Form id="myForm">
            <Form.Item label="Name">
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
              <></>
            </Form.Item>
            <Form.Item label="Details">
              <Input.TextArea
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value)
                }}
              />
            </Form.Item>
            <Form.Item label="Leader">
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                placeholder={blog}
                onChange={handleChange}
                onSearch={(e) => handleSearch(e)}
                filterOption={() => true}
                defaultValue={parseInt(leader_id)}
              >
                {listAllUser.map((user: User) => (
                  <Option key={user.id} value={user.id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {checkListMain ? (
              <label></label>
            ) : (
              <Form.Item name="parent_team" label="Parent Team">
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  placeholder={'Choose parent team'}
                  onChange={handleChangeTeam}
                  onSearch={(e) => handleSearchTeam(e)}
                  filterOption={() => true}
                  defaultValue={parseInt(parent_team_id)}
                >
                  {listAllTeam.map((team: Team) => (
                    <Option key={team.id} value={team.id}>
                      {team.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        </>
      </Modal>
    </div>
  )
}

export default ModalCreateTeam
