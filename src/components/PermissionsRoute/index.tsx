import { Navigate, useLocation } from 'react-router-dom'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import { ReactNode, PropsWithChildren } from 'react'

interface ProtectedRoutePermissions extends PropsWithChildren {
  permissions: string[]
}
const PermissionsRoute: React.FC<ProtectedRoutePermissions> = (props) => {
  const permissionsInfo = getPermissions()
  const { children, permissions } = props
  const location = useLocation()
  if (
    permissionsInfo &&
    permissions.every((element: string) => permissionsInfo.includes(element))
  ) {
    return <>{children}</>
  }
  return <Navigate to="/" state={{ from: location.pathname }} replace />
}

export default PermissionsRoute
