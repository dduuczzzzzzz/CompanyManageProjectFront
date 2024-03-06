import RolePage from '../../../pages/role'
import AddRolePage from '../../../pages/role/addRole'
import UpdateRolePage from '../../../pages/role/updateRole'
import { ROLE_ADD, ROLE_LIST, ROLE_UPDATE } from '../Permissions'

const roleRouter = [
  {
    path: '/role/',
    element: <RolePage />,
    permissions: ROLE_LIST,
  },
  {
    path: '/role/add',
    element: <AddRolePage />,
    permissions: ROLE_ADD,
  },
  {
    path: '/role/update/:id',
    element: <UpdateRolePage />,
    permissions: ROLE_UPDATE,
  },
]
export default roleRouter
