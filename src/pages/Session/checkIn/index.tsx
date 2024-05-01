import { notification } from 'antd'
import MainLayout from '../../../components/layouts/main'
import { upsertSessionAPI } from '../../../services/request/session'
import TestCam from './TestCam'
import CheckInWebCam from './webCam'

const CheckInPage = () => {
  const handleCheckIn = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]
      const formData = new FormData()
      formData.append('date', currentDate)
      formData.append('get_check_in', '1')
      const res = await upsertSessionAPI(formData)
      notification['success']({
        key: 'upsertSessionSuccess',
        duration: 5,
        message: 'Check in successfully',
      })
      // setSession(res.data.data.records)
      // setIsLoading(false)
    } catch (err: any) {
      console.log(err.response)
      const errorMessages = Object.values(err.response.data.message)
        .map((message) => `- ${message}<br>`)
        .join('')
      const key = 'upsertSessionFail'
      notification['error']({
        key,
        duration: 5,
        message: 'Error!',
        description: (
          <div
            dangerouslySetInnerHTML={{ __html: err.response.data.message }}
            className="text-red-500"
          />
        ),
      })
    }
  }

  return (
    <MainLayout>
      <p>CheckIN pages</p>
      <button onClick={handleCheckIn}>Check In</button>
      {/* <TestCam /> */}
      <CheckInWebCam />
    </MainLayout>
  )
}
export default CheckInPage
