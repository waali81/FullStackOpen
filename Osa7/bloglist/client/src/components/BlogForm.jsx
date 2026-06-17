import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import useNotificationStore from '../stores/notificationStore'

const BlogForm = ({ createBlog }) => {
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  )
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (newTitle.trim() === '' || newUrl.trim() === '') {
      showNotification('title and url are required', 'error')
      return
    }

    await createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create new blog
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="title"
          margin="normal"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <TextField
          fullWidth
          label="author"
          margin="normal"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />

        <TextField
          fullWidth
          label="url"
          margin="normal"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />

        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          create
        </Button>
      </form>
    </Box>
  )
}

export default BlogForm
