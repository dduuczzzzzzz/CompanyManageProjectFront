import { User } from '../../types/user'
import { Link } from 'react-router-dom'
import logo from '../../assets/uet.png'
import moment from 'moment'
import React, { useEffect } from 'react'
import { Button } from 'antd'
import { getPermissions } from '../../libs/helpers/getLocalStorage'
import { USER_DELETE, USER_UPDATE } from '../../libs/constants/Permissions'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

type FormItemProps = {
  user: User
  setCurrentUserId: React.Dispatch<React.SetStateAction<any>>
  showModal: () => void
}

const UserGridCard = ({ user, setCurrentUserId, showModal }: FormItemProps) => {
  const permissionsInfo = getPermissions()
  return (
    <div>
      <div className="w-[100%] text-black rounded-md relative">
        <div
          style={{ height: 140 }}
          className=" w-[100%] hover:shadow-lg hover:shadow-slate-400  rounded-md	"
        >
          <div className="flex gap-2 w-[100%] h-[100%] bg-white rounded-md">
            <div className="w-[30%] h-[100%] rounded-md">
              {user?.avatar ? (
                <img
                  className=" rounded-md object-cover w-[100%] h-full "
                  src={process.env.REACT_APP_API_STORAGE_URL + user?.avatar}
                />
              ) : (
                <img
                  className="rounded-md object-contain w-[100%] h-full "
                  src={logo}
                />
              )}
            </div>
            <div className="w-[70%] pt-[10px] ">
              <div className="w-[100%] font-[700]">{user?.name}</div>
              <div className="mt-[10px]">
                <div className="flex">
                  <div className="truncate w-[100%]">
                    {user?.address && 'Address: ' + user?.address}
                  </div>
                </div>
                <div className="flex">
                  <div className="truncate w-[100%]">
                    {user?.email && 'Email: ' + user?.email}
                  </div>
                </div>
                <div className="flex">
                  <div className="truncate w-[100%]">
                    {user?.phone_number && 'Phone: ' + user?.phone_number}
                  </div>
                </div>
                <div className="flex">
                  <div className="truncate w-[100%]">
                    {user?.dob &&
                      'Birthday: ' + moment(user?.dob).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className="absolute flex bottom-[10px] right-[10px]">
                  {permissionsInfo &&
                    USER_UPDATE.every((element: string) =>
                      permissionsInfo.includes(element),
                    ) && (
                      <Link to={`/users/edit/${user.id}`} className="mr-2">
                        <Button
                          size="small"
                          type="primary"
                          className="rounded-full"
                        >
                          <EditOutlined />
                        </Button>
                      </Link>
                    )}
                  {permissionsInfo &&
                    USER_DELETE.every((element: string) =>
                      permissionsInfo.includes(element),
                    ) && (
                      <Link
                        to=""
                        onClick={() => {
                          setCurrentUserId(user.id)
                          showModal()
                        }}
                      >
                        <Button
                          size="small"
                          type="primary"
                          danger
                          className="rounded-full"
                        >
                          <DeleteOutlined />
                        </Button>
                      </Link>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserGridCard
