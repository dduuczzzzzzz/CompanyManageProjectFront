import TeamPage from '../../../pages/team'
import CreateTeam from '../../../pages/team/CreateTeam'
import ListAllTeamSub from '../../../pages/team/ListAllTeamSub'
import ListMemberOfTeam from '../../../pages/team/ListMemberOfTeam'
import ListSub from '../../../pages/team/ListSub'
import {
  TEAM_ADD,
  TEAM_LIST,
  TEAM_LIST_SUB,
  TEAM_LIST_MEMBER,
} from '../Permissions'

export const teamRouter = [
  {
    path: '/teams',
    element: <TeamPage />,
    permissions: TEAM_LIST,
  },
  {
    path: '/teams/sub-teams',
    element: <ListAllTeamSub />,
    permissions: TEAM_LIST_SUB,
  },
  {
    path: '/teams/create',
    element: <CreateTeam />,
    permissions: TEAM_ADD,
  },
  {
    path: '/teams/:id',
    element: <ListSub />,
    permissions: TEAM_LIST_MEMBER,
  },
  {
    path: '/member-of-team/:id',
    element: <ListMemberOfTeam />,
    permissions: TEAM_LIST_MEMBER,
  },
]
export default teamRouter
