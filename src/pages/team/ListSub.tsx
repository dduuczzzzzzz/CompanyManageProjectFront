import React, { useEffect, useState } from 'react'
import { Button, message, notification } from 'antd'
import ListMemberOfTeam from './ListMemberOfTeam'
import ModalRemove from './ModalRemove'
import ModalCreateTeam from './ModalCreateTeam'
import axiosInstance from '../../services/request/base'
import { Team } from '../../components/teams/interface'
import { useNavigate, useParams } from 'react-router-dom'
import ListOfTeam from '../../components/teams/ListOfTeam'
import { TEAM_DELETE, TEAM_UPDATE } from '../../libs/constants/Permissions'
import MainLayout from '../../components/layouts/main'

const ListSub = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [listSubTeam, setListSubTeam] = useState<Team[]>([])
  const [showMember, setShowMember] = useState<boolean>(false)
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [teamId, setTeamId] = useState<number>(1)
  const [openModalUpdateTeam, setOpenModalUpdateTeam] = useState<boolean>(false)
  const [totalTeamSub, setTotalTeamSub] = useState<number>(1)
  const [title, setTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [teamCheck, setTeamCheck] = useState({
    parent_team_id: '',
    name: '',
    leader_id: '',
    details: '',
  })
  const [filter, setFilter] = useState({
    details: '',
    name: '',
    sort: 'created_at',
    sortType: '1',
    page: '1',
    limit: '10',
  })

  const getSubListTeam = async () => {
    const url = new URLSearchParams(filter)
    const res = await axiosInstance.get(`/team/get-list-sub/${id}?${url}`)
    setListSubTeam(res.data.data.records)
    setTotalTeamSub(res.data.data.total)
    setIsLoading(false)
  }

  const getInfoParrentTeam = async () => {
    const res = await axiosInstance.get(`/team/get-detail-team/${id}`)
    setTitle(res.data.data.name)
  }

  useEffect(() => {
    getInfoParrentTeam()
    getSubListTeam()
  }, [filter])

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

  const onRemove = async (id: number) => {
    const res = await axiosInstance.delete(`/team/delete-team/${id}`)
    if (res.data.status) {
      setOpenModalDelete(false)
      await getSubListTeam()
      setTimeout(() => {
        notification['success']({
          key: 'delete',
          duration: 5,
          message: 'Delete team successfully',
        })
      }, 500)
    } else {
      setOpenModalDelete(false)
      setTimeout(() => {
        notification['error']({
          duration: 5,
          message: 'Error',
          description: (
            <div
              dangerouslySetInnerHTML={{
                __html: 'Delete fail!',
              }}
              className="text-red-500"
            />
          ),
        })
      }, 1000)
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
        await getSubListTeam()
        setTimeout(() => {
          notification['success']({
            key: 'update',
            duration: 5,
            message: 'Update team successfully',
          })
        }, 50)
      }
    } catch (error) {
      setTimeout(() => {
        notification['error']({
          duration: 5,
          message: 'Error',
          description: (
            <div
              dangerouslySetInnerHTML={{
                __html: 'The name is already taken',
              }}
              className="text-red-500"
            />
          ),
        })
      }, 50)
    }
  }

  const handleListSubOrListMem = async (id: number) => {
    const res = await axiosInstance.get(`/team/get-list-sub/${id}`)
    if (res.data.data.total === 0) {
      setShowMember(true)
      navigate(`/member-of-team/${id}`)
    }
  }

  const resetTable = () => {
    setFilter({
      details: '',
      name: '',
      sort: 'created_at',
      sortType: '',
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
      {!showMember ? (
        <>
          <Button
            onClick={() => {
              navigate(-1)
            }}
          >
            Back
          </Button>
          <ListOfTeam
            listTeam={listSubTeam}
            filter={filter}
            setFilter={setFilter}
            resetTable={resetTable}
            deleteTeam={deleteTeam}
            updateTeam={updateTeam}
            permissionsUpdate={TEAM_UPDATE}
            permissionsDelete={TEAM_DELETE}
            handleListSubOrListMem={handleListSubOrListMem}
            blog={title}
            total={totalTeamSub}
            onChange={onChange}
            teamSubId={Number(id)}
            isSubteam={true}
            isLoading={isLoading}
          />
          {openModalDelete && (
            <ModalRemove
              openModalDelete={setOpenModalDelete}
              blog={'Are you sure to delete this team ?'}
              onDelete={() => onRemove(teamId)}
            />
          )}

          {openModalUpdateTeam && (
            <ModalCreateTeam
              openModal={setOpenModalUpdateTeam}
              onCreate={onUpdate}
              blog={'Update'}
              team={teamCheck}
              checkListMain={false}
            />
          )}
        </>
      ) : (
        <div>
          <ListMemberOfTeam />
        </div>
      )}
    </MainLayout>
  )
}

export default ListSub
