import { Typography, List, ListItem, ListItemText } from '@mui/material'

const UserView = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <>
      <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
        {user.name}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Added blogs
      </Typography>

      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default UserView
