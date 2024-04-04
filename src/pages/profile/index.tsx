import { useEffect, useState } from 'react'
import MainLayout from '../../components/layouts/main'
import { profile } from '../../services/profile'
import { Avatar, Button, Spin, notification } from 'antd'
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { UPDATE_PROFILE } from '../../libs/constants/Permissions'
import { getPermissions } from '../../libs/helpers/getLocalStorage'

const ProfilePage = () => {
  const permissionsInfo = getPermissions()
  const [res, setRes] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    setIsLoading(true)
    const handleGetProfile = async () => {
      try {
        const response = await profile()
        // Lưu trữ giá trị res vào state
        setIsLoading(false)
        setRes(response.data.data)
      } catch (err: any) {
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors)
            .map((message) => `- ${message}<br>`)
            .join('')
          const key = 'updatable'
          notification['error']({
            key,
            duration: 5,
            message: 'Get profile failed',
            description: (
              <div
                dangerouslySetInnerHTML={{ __html: errorMessages }}
                className="text-red-500"
              />
            ),
          })
        } else {
          notification['error']({
            message: 'Get profile failed',
            duration: 5,
            description: err.response.data.message,
          })
        }
        setIsLoading(false)
      }
    }

    handleGetProfile()
  }, [])

  const genderLabel = (gender: number): string => {
    switch (gender) {
      case 1:
        return 'Nam'
      case 2:
        return 'Nữ'
      default:
        return 'Khác'
    }
  }

  return (
    <MainLayout>
      <h1 className="text-blue-500 flex justify-center">Personal info</h1>
      {isLoading ? (
        <Spin className="flex justify-center" />
      ) : (
        <>
          <div className=" w-full h-[550px] flex ">
            <div className="bg-blue-300 w-1/3 h-550 ">
              <div className="flex justify-center mt-[5%]">
                <Avatar
                  src={res?.avatar || './logo512.png'}
                  className="w-[200px] h-[200px] rounded-full flex justify-center"
                ></Avatar>
              </div>
              <h2 className="text-white flex justify-center">
                {res?.name || ''}
              </h2>
              <h3 className="text-white flex justify-center">
                {res?.role || ''}
              </h3>
              <p className="text-base text-white flex justify-center m-10">
                {res?.details || ''}
              </p>
            </div>
            <div className="w-1/3 h-full m-[20px] ">
              <h3 className="ml-10">
                <MailOutlined className="mr-2" />
                Email:
              </h3>
              <span className="ml-10">{res?.email || ''}</span>
              <h3 className="ml-10">
                <PhoneOutlined className="mr-2" />
                Phone number:
              </h3>
              <span className="ml-10">{res?.phone_number || ''}</span>
              <h3 className="ml-10">
                <CalendarOutlined className="mr-2" />
                Date of birth:
              </h3>
              <span className="ml-10">{res?.dob || ''}</span>
              <h3 className="ml-10">
                <UserOutlined className="mr-2" />
                Gender:
              </h3>
              <span className="ml-10">{genderLabel(res?.gender) || ''}</span>
            </div>
            {/* <div className="w-1/3 h-full m-[20px] ">
              {' '}
              <h1 className="flex justify-center">About me</h1>
              <span className="ml-10 read-only:true ">
                {' '}
                {res?.details || ''}
              </span>
            </div> */}
          </div>
          {permissionsInfo &&
            UPDATE_PROFILE.every((element: string) =>
              permissionsInfo.includes(element),
            ) && (
              <div className="flex justify-center ">
                <Link to={'/updateProfile'}>
                  <Button className="h-[40px] rounded-full border-10 border-blue-500">
                    Personal profile setting
                  </Button>
                </Link>
              </div>
            )}
        </>
      )}
    </MainLayout>
  )
}
export default ProfilePage
