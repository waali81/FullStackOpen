import { createContext, useState } from 'react'

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  const showNotification = (message) => {
    setNotification(message)

    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext