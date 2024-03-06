import MainLayout from '../../components/layouts/main'
import FormPost from '../../components/user/formPost'
import { useEffect, useState } from 'react'

const UsersAdd = () => {
  const [startDate, setStartDate] = useState()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <MainLayout>
      <div className="mb-12">
        <h2>Create a new user</h2>
      </div>
      <div className={'w-full grid place-items-center'}>
        <FormPost
          setStartDate={setStartDate}
          startDate={startDate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </MainLayout>
  )
}

export default UsersAdd
