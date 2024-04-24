import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import HomePage from './pages/home'
import AboutPage from './pages/about'
import LoginPage from './pages/login'
import './styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import user_routes from './libs/constants/router/user'
import profileRouter from './libs/constants/router/profile'
import ProtectedRoute from './components/ProtectedRoute'
import eventRouter from './libs/constants/router/event'
import roleRouter from './libs/constants/router/role'
import PermissionsRoute from './components/PermissionsRoute'
import attendanceRouter from './libs/constants/router/attendance'
import teamRouter from './libs/constants/router/team'
import CheckInPage from './pages/Session/checkIn'
import CheckOutPage from './pages/Session/checkOut'
import sessionRouter from './libs/constants/router/session'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} key="home" />
        <Route path="/about" element={<AboutPage />} key="about" />
        {profileRouter.map((router: any) => (
          <Route
            key={router.path}
            path={router.path}
            element={
              <PermissionsRoute permissions={router.permissions}>
                {router.element}
              </PermissionsRoute>
            }
          />
        ))}
        {eventRouter.map((router: any) => (
          <Route
            key={router.path}
            path={router.path}
            element={
              <PermissionsRoute permissions={router.permissions}>
                {router.element}
              </PermissionsRoute>
            }
          />
        ))}
        {teamRouter.map((router: any) => (
          <Route
            key={router.path}
            path={router.path}
            element={
              <PermissionsRoute permissions={router.permissions}>
                {router.element}
              </PermissionsRoute>
            }
          />
        ))}
        {roleRouter.map((router: any) => (
          <Route
            key={router.path}
            path={router.path}
            element={
              <PermissionsRoute permissions={router.permissions}>
                {router.element}
              </PermissionsRoute>
            }
          />
        ))}
        {user_routes.map((router) => {
          return (
            <Route
              key={router.path}
              path={router.path}
              element={
                <PermissionsRoute permissions={router.permissions}>
                  {router.element}
                </PermissionsRoute>
              }
            />
          )
        })}
        {attendanceRouter.map((router) => {
          return (
            <Route
              key={router.path}
              path={router.path}
              element={
                <PermissionsRoute permissions={router.permissions}>
                  {router.element}
                </PermissionsRoute>
              }
            />
          )
        })}
        {sessionRouter.map((router) => {
          return (
            <Route
              key={router.path}
              path={router.path}
              element={
                <PermissionsRoute permissions={router.permissions}>
                  {router.element}
                </PermissionsRoute>
              }
            />
          )
        })}
        <Route
          path="session/check-in"
          element={<CheckInPage />}
          key="session/check-in"
        />
        <Route
          path="session/check-out"
          element={<CheckOutPage />}
          key="session/check-in"
        />
      </Route>
      <Route path="/login" element={<LoginPage />} key="login" />
    </>,
  ),
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
