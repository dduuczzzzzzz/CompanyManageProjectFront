import { Link } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import { Layout, Button, Avatar, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
import { getUser } from '../../../libs/helpers/getLocalStorage'
import { logout } from '../../../services/authentication'
import { useCollapsedProvider } from '../../../libs/contexts/CollapsedContext'

const { Header } = Layout
interface Props {
  colorBgContainer?: string
}

const handleLogout = async () => {
  try {
    await logout() // Chờ hàm logout() hoàn thành
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user_info')
    localStorage.removeItem('permissions')
    window.location.href = '/login'
  } catch (err) {
    // Xử lý lỗi nếu cần
  }
}
const items: MenuProps['items'] = [
  {
    label: (
      <Link to="/profile">
        <div>
          <ProfileOutlined className="mr-2" />
          Profile
        </div>
      </Link>
    ),
    key: 'profile',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <div onClick={handleLogout}>
        <LogoutOutlined className="mr-2" />
        Log Out
      </div>
    ),
    key: 'logout',
  },
  {
    type: 'divider',
  },
]

const CustomHeader = ({ colorBgContainer }: Props) => {
  let user = getUser()
  const context = useCollapsedProvider()

  // Truy cập các thuộc tính của userInfo
  return (
    <>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Button
          type="text"
          icon={
            context.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          onClick={() => context.setCollapsed(!context.collapsed)}
          className="text-base w-16 h-16"
        />
        <Dropdown menu={{ items }} trigger={['click']}>
          <a
            onClick={(e: any) => e.preventDefault()}
            style={{ float: 'right', paddingRight: '16px' }}
          >
            <Space>
              <Avatar
                src={user?.avatar ? `${user?.avatar}` : './uet.png'}
                className="h-8 ml-6 mb-6 mt-4"
              />
              {user?.name || 'user name'}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  )
}

export default CustomHeader
