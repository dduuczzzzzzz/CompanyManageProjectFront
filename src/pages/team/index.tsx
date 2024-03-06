import MainLayout from '../../components/layouts/main'
import axiosInstance from '../../services/request/base'
import { useEffect, useState } from 'react'
import { Alert, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Team } from '../../components/teams/interface'
import ModalRemove from '../team/ModalRemove'
import ModalCreateTeam from './ModalCreateTeam'
import ListOfTeam from '../../components/teams/ListOfTeam'
import { TEAM_DELETE, TEAM_UPDATE } from '../../libs/constants/Permissions'

const TeamPage = () => {
  const navigate = useNavigate()
  const [listTeam, setListTeam] = useState<Team[]>([])
  const [checkListSub, setCheckListSub] = useState<boolean>(false)
  const [teamId, setTeamId] = useState<number>(1)
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [openModalUpdateTeam, setOpenModalUpdateTeam] = useState<boolean>(false)
  const [totalTeam, setTotalTeam] = useState<number>(1)
  const [filter, setFilter] = useState({
    details: '',
    name: '',
    sort: 'created_at',
    sortType: '1',
    page: '1',
    limit: '10',
  })
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getListTeam()
  }, [filter])

  const confirmDelete: string = 'Are you sure to delete this team ?'
  const [teamCheck, setTeamCheck] = useState({
    parent_team_id: '',
    name: '',
    leader_id: '',
    details: '',
  })

  const getListTeam = async () => {
    const url = new URLSearchParams(filter)
    const res = await axiosInstance.get(`/team?${url}`)
    setListTeam(res.data.data.records)
    setTotalTeam(res.data.data.total)
    setIsLoading(false)
  }

  const updateTeam = async (id: number) => {
    const res = await axiosInstance.get(`/team/get-detail-team/${id}`)
    setTeamCheck({
      parent_team_id: res.data.data.parent_team_id,
      name: res.data.data.name,
      leader_id: res.data.data.leader?.id,
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
    setCheckListSub(!checkListSub)
    const res = await axiosInstance.get(`/team/get-list-sub/${id}`)
    if (res.data.data.total === 0) {
      navigate(`/member-of-team/${id}`)
    } else {
      navigate(`/teams/${id}`)
    }
  }

  const onRemove = async (id: number) => {
    try {
      const res = await axiosInstance.delete(`/team/delete-team/${id}`)
      if (res.data.status) {
        setOpenModalDelete(false)
        await getListTeam()
        setTimeout(() => {
          message.success('Delete Successful')
        }, 50)
      }
    } catch (error) {
      setTimeout(() => {
        message.error('It is not possible to delete a team that has sub teams')
      }, 50)
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
        await getListTeam()
        setTimeout(() => {
          message.success('Update Team Successful')
          setShowAlert(true)
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
        blog="List main team"
        total={totalTeam}
        onChange={onChange}
        permissionsUpdate={TEAM_UPDATE}
        permissionsDelete={TEAM_DELETE}
        isSubteam={false}
        isLoading={isLoading}
      />
      {showAlert && (
        <Alert
          message="Informational Notes"
          description="Additional description and information about copywriting."
          type="info"
          showIcon
        />
      )}

      {openModalUpdateTeam && (
        <ModalCreateTeam
          openModal={setOpenModalUpdateTeam}
          onCreate={onUpdate}
          blog={'UPDATE'}
          team={teamCheck}
          checkListMain={true}
        />
      )}

      {openModalDelete && (
        <ModalRemove
          openModalDelete={setOpenModalDelete}
          blog={confirmDelete}
          onDelete={() => onRemove(teamId)}
        />
      )}
    </MainLayout>
  )
}

export default TeamPage
