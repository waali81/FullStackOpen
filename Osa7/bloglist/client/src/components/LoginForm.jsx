import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword
}) => {
  return (
    <Box sx={{ maxWidth: 300, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Log in to application
      </Typography>

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          login
        </Button>
      </form>
    </Box>
  )
}

export default LoginForm
