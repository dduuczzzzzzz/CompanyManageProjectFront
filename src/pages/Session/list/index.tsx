import { useState } from 'react'
import MainLayout from '../../../components/layouts/main'
import { SessionFilterType } from '../../../types/session'
import SessionFilter from './Filter'
import SessionTable from './Table'

const SessionList = () => {
  const currentDate = new Date()
  // Get the current year using the getFullYear() method
  const year = currentDate.getFullYear()
  // Get the current month using the getMonth() method
  // Note: Months are zero-based, so January is 0, February is 1, etc.
  const month = currentDate.getMonth() + 1
  const [filter, setFilter] = useState<SessionFilterType>({
    year: year.toString(),
    month: month.toString(),
  })
  return (
    <MainLayout>
      <SessionFilter filter={filter} setFilter={setFilter} />
      <SessionTable filter={filter} setFilter={setFilter} />
    </MainLayout>
  )
}
export default SessionList
