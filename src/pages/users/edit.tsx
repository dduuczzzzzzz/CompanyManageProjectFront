import { useEffect, useState } from 'react'
import MainLayout from '../../components/layouts/main'
import FormPost from '../../components/user/formPost'
import { userApiGetUser } from '../../services/request/user'
import Spinner from '../../components/user/spin'

const UsersEdit = () => {
  const [userData, setUserData] = useState({})
  const [startDate, setStartDate] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const currentUrl = window.location.href
  let id: string = currentUrl.split('/')[5]
  useEffect(() => {
    userApiGetUser({ setUserData, setStartDate, setIsLoading }, id)   
  }, [])

  return (
    <MainLayout>
      <div className="mb-12">
        <h2>Update a new user</h2>
      </div>

      <div className={'w-full grid place-items-center'}>
        <FormPost
          id={id}
          userData={userData}
          setStartDate={setStartDate}
          startDate={startDate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
      {isLoading ? <Spinner /> : ''}
    </MainLayout>
  )
}

export default UsersEdit
