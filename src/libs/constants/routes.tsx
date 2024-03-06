import ListUsers from '../../pages/users'
import UsersAdd from '../../pages/users/add'
import UsersEdit from '../../pages/users/edit'
import UserImport from '../../pages/users/import'

const user_routes = [
  {
    path: '/users/',
    element: <ListUsers />,
  },
  {
    path: '/users/add',
    element: <UsersAdd />,
  },
  {
    path: '/users/edit/:id',
    element: <UsersEdit />,
  },
  {
    path: '/users/import',
    element: <UserImport />,
  },
]
export default user_routes
