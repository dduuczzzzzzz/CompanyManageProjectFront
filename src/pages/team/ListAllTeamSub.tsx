import React, { useEffect, useState } from 'react'
import MainLayout from '../../components/layouts/main'
import axiosInstance from '../../services/request/base'
import { message } from 'antd'
import ModalCreateTeam from './ModalCreateTeam'
import ModalRemove from './ModalRemove'
import ListOfTeam from '../../components/teams/ListOfTeam'
import { Team } from '../../components/teams/interface'
import { useNavigate } from 'react-router-dom'
import { TEAM_DELETE, TEAM_UPDATE } from '../../libs/constants/Permissions'

const ListAllTeamSub = () => {
  const [listTeam, setListTeam] = useState<Team[]>([])
  const [teamId, setTeamId] = useState<number>(1)
  const navigate = useNavigate()
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [openModalUpdateTeam, setOpenModalUpdateTeam] = useState<boolean>(false)
  const [totalTeamSub, setTotalTeamSub] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [filter, setFilter] = useState({
    details: '',
    name: '',
    sort: 'created_at',
    sortType: '1',
    page: '1',
    limit: '10',
  })

  const [teamCheck, setTeamCheck] = useState({
    parent_team_id: '',
    name: '',
    leader_id: '',
    details: '',
  })

  useEffect(() => {
    getListSubTeam()
  }, [filter])

  const getListSubTeam = async () => {
    const url = new URLSearchParams(filter)
    const res = await axiosInstance.get(`/team/all-list-sub-team?${url}`)
    setListTeam(res.data.data.records)
    setTotalTeamSub(res.data.data.total)
    setIsLoading(false)
  }

  const updateTeam = async (id: number) => {
    const res = await axiosInstance.get(`/team/get-detail-team/${id}`)

    setTeamCheck({
      parent_team_id: res.data.data.parent_team_id,
      name: res.data.data.name,
      leader_id: res.data.data.leader.id,
      details: res.data.data.details,
    })
    setOpenModalUpdateTeam(true)
    setTeamId(id)
  }

  const deleteTeam = (id: number) => {
    setOpenModalDelete(true)
    setTeamId(id)
  }

  const handleListSubOrListMem = async (id: number) => {
    const res = await axiosInstance.get(`/team/get-list-sub/${id}`)
    if (res.data.data.total === 0) {
      navigate(`/member-of-team/${id}`)
    }
  }

  const onRemove = async (id: number) => {
    const res = await axiosInstance.delete(`/team/delete-team/${id}`)
    if (res.data.status) {
      setOpenModalDelete(false)
      await getListSubTeam()
      setTimeout(() => {
        message.success('Delete Successful')
      }, 500)
    } else {
      setTimeout(() => {
        message.error('Delete Fail')
      }, 500)
    }
  }

  async function onUpdate(
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

    try {
      const res = await axiosInstance.put(`/team/update-team/${teamId}`, data)
      if (res.data.status) {
        setOpenModalUpdateTeam(false)
        await getListSubTeam()
        setTimeout(() => {
          message.success('Update Team Successful')
        }, 50)
      }
    } catch (error) {
      setTimeout(() => {
        message.error('The name has already been taken.')
      }, 50)
    }
  }

  const resetTable = () => {
    setFilter({
      details: '',
      name: '',
      sort: 'created_at',
      sortType: '1',
      page: '1',
      limit: '10',
    })
  }

  const onChange = (page: number, pageSize: number) => {
    setFilter({
      ...filter,
      page: page.toString(),
      limit: pageSize.toString(),
    })
  }

  return (
    <MainLayout>
      <ListOfTeam
        listTeam={listTeam}
        filter={filter}
        setFilter={setFilter}
        resetTable={resetTable}
        deleteTeam={deleteTeam}
        updateTeam={updateTeam}
        handleListSubOrListMem={handleListSubOrListMem}
        blog="List all sub team"
        total={totalTeamSub}
        onChange={onChange}
        permissionsUpdate={TEAM_UPDATE}
        permissionsDelete={TEAM_DELETE}
        isSubteam={true}
        isLoading={isLoading}
      />

      {openModalUpdateTeam && (
        <ModalCreateTeam
          openModal={setOpenModalUpdateTeam}
          onCreate={onUpdate}
          blog={'UPDATE'}
          team={teamCheck}
          checkListMain={false}
        />
      )}

      {openModalDelete && (
        <ModalRemove
          openModalDelete={setOpenModalDelete}
          blog={'Are you sure to delete this team ?'}
          onDelete={() => onRemove(teamId)}
        />
      )}
    </MainLayout>
  )
}

export default ListAllTeamSub
