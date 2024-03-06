import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute: React.FC = () => {
  let location = useLocation()
  if (!localStorage.getItem('user_info')) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}

export default ProtectedRoute
