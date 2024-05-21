import React from 'react'
import UserGridCard from './UserGridCard'
import { User } from '../../types/user'

interface Props {
  data: Array<User>
  setCurrentUserId: React.Dispatch<React.SetStateAction<any>>
  showModal: () => void
}

const UserGridCardView = ({ data, setCurrentUserId, showModal }: Props) => {
  return (
    <>
      <div className="">
        <div className="mr-[10px] flex flex-wrap gap-x-[35px] gap-y-[15px]">
          {data.map((user, index) => (
            <div
              className="w-[30%] mmb:min-w-[200px] min-w-[300px] h-full bg-white"
              style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow:
                  'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
              }}
            >
              <UserGridCard
                user={user}
                setCurrentUserId={setCurrentUserId}
                showModal={showModal}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default UserGridCardView
