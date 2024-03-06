import ProfilePage from '../../../pages/profile'
import UpdateProfilePage from '../../../pages/profile/editProfile'
import { PROFILE, UPDATE_PROFILE } from '../Permissions'
const profileRouter = [
  {
    path: '/profile',
    element: <ProfilePage />,
    permissions: PROFILE,
  },
  {
    path: '/updateProfile',
    element: <UpdateProfilePage />,
    permissions: UPDATE_PROFILE,
  },
]
export default profileRouter
