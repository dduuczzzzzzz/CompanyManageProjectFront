import SessionList from '../../../pages/Session/list'
import { SESSION_LIST } from '../Permissions'

const sessionRouter = [
  {
    path: '/session/',
    element: <SessionList />,
    permissions: SESSION_LIST,
  },
]
export default sessionRouter
