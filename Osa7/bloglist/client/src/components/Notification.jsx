import { Alert, Box } from '@mui/material'

const Notification = ({ message, type }) => {
  if (!message) return null

  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity={type}>{message}</Alert>
    </Box>
  )
}

export default Notification
