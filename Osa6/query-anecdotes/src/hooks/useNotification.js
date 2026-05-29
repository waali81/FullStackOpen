import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const useNotification = () => {
  return useContext(NotificationContext)
}

export default useNotification