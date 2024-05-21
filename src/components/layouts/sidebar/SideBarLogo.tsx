import Avatar from 'antd/es/avatar/avatar'
import { Link } from 'react-router-dom'
import logo from '../../../assets/uet.png'
const SideBarLogo = () => {
  return (
    <Link to="/profile" className="w-200 text-black">
      <Avatar src={logo} className="h-8 ml-6 mb-6 mt-4" />
    </Link>
  )
}

export default SideBarLogo
