import ListUsers from '../../../pages/users'
import FormUsers from '../../../pages/users/add'
import UsersEdit from '../../../pages/users/edit'
import UsersImprot from '../../../pages/users/import'
import { USER_ADD, USER_IMPORT, USER_LIST, USER_UPDATE } from '../Permissions'

const user_routes = [
  {
    path: '/users/',
    element: <ListUsers />,
    permissions: USER_LIST,
  },
  {
    path: '/users/add',
    element: <FormUsers />,
    permissions: USER_ADD,
  },
  {
    path: '/users/edit/:id',
    element: <UsersEdit />,
    permissions: USER_UPDATE,
  },
  {
    path: '/users/import',
    element: <UsersImprot />,
    permissions: USER_IMPORT,
  },
]
export default user_routes
