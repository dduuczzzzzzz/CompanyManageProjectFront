import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  UserOutlined,
  ProfileOutlined,
  TeamOutlined,
  CalendarOutlined,
  AuditOutlined,
  CarryOutOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import SideBarLogo from './SideBarLogo'
import { useCollapsedProvider } from '../../../libs/contexts/CollapsedContext'
import {
  checkChildrenSidebar,
  checkParentSidebar,
  getPermissions,
} from '../../../libs/helpers/getLocalStorage'
import {
  ATTENDANCE_ADD,
  ATTENDANCE_IMPORT,
  ATTENDANCE_LIST,
  EVENT_ADD,
  EVENT_LIST,
  PROFILE,
  ROLE_ADD,
  ROLE_LIST,
  TEAM_ADD,
  TEAM_LIST,
  TEAM_LIST_SUB,
  USER_ADD,
  USER_DELETE_MULTI,
  USER_IMPORT,
  USER_LIST,
} from '../../../libs/constants/Permissions'
import { key } from 'localforage'

const { Sider } = Layout

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedKeys, setSelectedKeys] = useState('/')
  const context = useCollapsedProvider()
  useEffect(() => {
    const pathName = location.pathname
    setSelectedKeys(pathName)
  }, [location.pathname])

  const permissionsInfor = getPermissions()

  const item = useMemo(() => {
    return [
      checkParentSidebar([], {
        key: 'users',
        icon: <UserOutlined />,
        label: 'Users',
        children: [
          checkChildrenSidebar(USER_LIST, {
            label: 'User list',
            key: '/users/',
          }),
          checkChildrenSidebar(USER_ADD, {
            label: 'Add user',
            key: '/users/add',
          }),
          checkChildrenSidebar(USER_IMPORT, {
            label: 'Import user',
            key: '/users/import/',
          }),
        ],
      }),

      checkParentSidebar([], {
        key: 'roles',
        icon: <AuditOutlined />,
        label: 'Roles',
        children: [
          checkChildrenSidebar(ROLE_LIST, {
            label: 'Roles list',
            key: '/role/',
          }),
          checkChildrenSidebar(ROLE_ADD, {
            label: 'Add role',
            key: '/role/add',
          }),
        ],
      }),
      checkParentSidebar([], {
        key: 'teams',
        icon: <TeamOutlined />,
        label: 'Teams',
        children: [
          checkChildrenSidebar(TEAM_ADD, {
            label: 'Create New Team',
            key: '/teams/create',
          }),
          checkChildrenSidebar(TEAM_LIST, {
            label: 'Main Teams',
            key: '/teams/',
          }),
          checkChildrenSidebar(TEAM_LIST_SUB, {
            label: 'Sub Teams',
            key: '/teams/sub-teams',
          }),
        ],
      }),
      checkParentSidebar([], {
        key: 'attendances',
        icon: <CalendarOutlined />,
        label: 'Attendances',
        children: [
          checkChildrenSidebar(ATTENDANCE_LIST, {
            label: 'Attendances list',
            key: '/attendance',
          }),
          checkChildrenSidebar(ATTENDANCE_IMPORT, {
            label: 'Import attendance',
            key: '/attendance/import',
          }),
        ],
      }),
      checkParentSidebar([], {
        key: 'events',
        icon: <CarryOutOutlined />,
        label: 'Events',
        children: [
          checkChildrenSidebar(EVENT_LIST, {
            label: 'Events list',
            key: '/event',
          }),
          checkChildrenSidebar(EVENT_ADD, {
            label: 'Add event',
            key: '/event/add',
          }),
        ],
      }),
      checkParentSidebar(PROFILE, {
        key: '/profile',
        icon: <ProfileOutlined />,
        label: 'Profile',
        children: null,
      }),
    ]
  }, [permissionsInfor])
  return (
    <>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={context.collapsed}
      >
        <SideBarLogo />
        <Menu
          mode="inline"
          selectedKeys={[selectedKeys]}
          onClick={({ key }) => {
            navigate(key)
          }}
          items={item}
        />
      </Sider>
    </>
  )
}

export default Sidebar
