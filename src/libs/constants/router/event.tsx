import EventPage from '../../../pages/event'
import AddEventPage from '../../../pages/event/addEvent'
import UpdateEventPage from '../../../pages/event/updateEvent'
import { EVENT_ADD, EVENT_LIST, EVENT_UPDATE } from '../Permissions'

const eventRouter = [
  {
    path: '/event',
    element: <EventPage />,
    permissions: EVENT_LIST,
  },
  {
    path: '/event/add',
    element: <AddEventPage />,
    permissions: EVENT_ADD,
  },
  {
    path: '/event/update/:id',
    element: <UpdateEventPage />,
    permissions: EVENT_UPDATE,
  },
]
export default eventRouter
