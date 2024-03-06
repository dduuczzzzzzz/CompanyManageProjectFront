import React, { useState } from 'react'
import Filter from './Filter'
import { Button, Pagination, Space, Spin, Table } from 'antd'
import { Team } from './interface'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { getPermissions } from '../../libs/helpers/getLocalStorage'

interface Props {
  listTeam: Team[]
  filter: {
    details: string
    name: string
    sort: string
    sortType: string
    page: string
    limit: string
  }
  permissionsUpdate: Array<string>
  permissionsDelete: Array<string>
  setFilter: React.Dispatch<
    React.SetStateAction<{
      details: string
      name: string
      sort: string
      sortType: string
      page: string
      limit: string
    }>
  >
  resetTable: () => void
  deleteTeam: (id: number) => void
  updateTeam: (id: number) => Promise<void>
  handleListSubOrListMem: (id: number) => Promise<void>
  blog: string
  total: number
  onChange: (page: number, pageSize: number) => void
  teamSubId?: number
  isSubteam: boolean
  isLoading: boolean
}
const ListOfTeam: React.FC<Props> = ({
  listTeam,
  filter,
  setFilter,
  resetTable,
  deleteTeam,
  updateTeam,
  handleListSubOrListMem,
  blog,
  total,
  onChange,
  teamSubId,
  permissionsUpdate,
  permissionsDelete,
  isSubteam,
  isLoading,
}) => {
  const permissionsInfo = getPermissions()
  const navigate = useNavigate()
  const teamId = teamSubId
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  const lists: ColumnsType<Team> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, data) => (
        <Space size="middle">
          <a onClick={() => handleListSubOrListMem(data.id)}>{data.name}</a>
        </Space>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: 'Members',
      key: 'total_member',
      dataIndex: 'total_member',
      align: 'center',
    },
    {
      title: 'Created at',
      key: 'created_at',
      dataIndex: 'created_at',
      width: '12%',
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
      render: (_, data) => (
        <Space size="middle">
          <strong> {data.leader?.name}</strong>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: '10%',
      render: (_, data) => (
        <Space size="middle">
          {permissionsInfo &&
            permissionsUpdate.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <Button danger type="primary" onClick={() => deleteTeam(data.id)}>
                Delete
              </Button>
            )}
          {permissionsInfo &&
            permissionsDelete.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <Button type="primary" onClick={() => updateTeam(data.id)}>
                Update
              </Button>
            )}
        </Space>
      ),
    },
  ]

  const listsMain: ColumnsType<Team> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, data) => (
        <Space size="middle">
          <a onClick={() => handleListSubOrListMem(data.id)}>{data.name}</a>
        </Space>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: 'Sub Team',
      key: 'total_subteam',
      dataIndex: 'total_subteam',
    },
    {
      title: 'Members',
      key: 'total_member',
      dataIndex: 'total_member',
    },
    {
      title: 'Created at',
      key: 'created_at',
      dataIndex: 'created_at',
      align: 'center',
      width: '12%',
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
      render: (_, data) => (
        <Space size="middle">
          <strong> {data.leader?.name}</strong>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: '10%',
      render: (_, data) => (
        <Space size="middle">
          {permissionsInfo &&
            permissionsUpdate.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <Button danger type="primary" onClick={() => deleteTeam(data.id)}>
                Delete
              </Button>
            )}
          {permissionsInfo &&
            permissionsDelete.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <Button type="primary" onClick={() => updateTeam(data.id)}>
                Update
              </Button>
            )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Filter
        valueFilter={filter}
        setFilter={setFilter}
        blog={blog}
        handleReset={resetTable}
      />

      <Button
        type="primary"
        onClick={() => {
          navigate('/teams/create', { state: { teamId } })
        }}
        style={{ marginBottom: 10 }}
      >
        Create New Team
      </Button>
      {isLoading ? (
        <Spin className="flex justify-center" />
      ) : isSubteam ? (
        <Table
          columns={lists}
          dataSource={listTeam}
          bordered={true}
          pagination={false}
          rowKey="id"
        />
      ) : (
        <Table
          columns={listsMain}
          dataSource={listTeam}
          bordered={true}
          pagination={false}
          rowKey="id"
        />
      )}

      <Pagination
        showQuickJumper
        defaultCurrent={1}
        total={total}
        showSizeChanger={true}
        onChange={onChange}
        style={{ marginLeft: 500, marginTop: 10 }}
      />
    </>
  )
}

export default ListOfTeam
