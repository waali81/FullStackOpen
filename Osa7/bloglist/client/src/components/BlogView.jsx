import { Card, CardContent, Typography, Button, Box, Link } from '@mui/material'
import useUserStore from '../stores/userStore'

const BlogView = ({ blog, handleLike, handleDelete }) => {
  const user = useUserStore((state) => state.user)
  if (!blog) {
    return null
  }
  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto', p: 2 }}>
      <CardContent>
        {/* TITLE */}
        <Typography variant="h3" gutterBottom>
          {blog.title}
        </Typography>

        {/* AUTHOR */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
        >
          by {blog.author}
        </Typography>

        {/* URL */}
        <Typography sx={{ mb: 1 }}>
          <Link href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </Link>
        </Typography>

        {/* USER */}
        <Typography sx={{ mb: 2 }}>added by {blog.user?.name}</Typography>

        {/* LIKES */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography>likes {blog.likes}</Typography>

          {user && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLike(blog)}
            >
              like
            </Button>
          )}

          {/* DELETE */}
          {blog.user?.username === user?.username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(blog)}
            >
              remove
            </Button>
          )}
        </Box>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Comments
        </Typography>

        <ul>
          {blog.comments?.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default BlogView
