import { useState, useEffect, useRef } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography
} from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  // hae blogit
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  // käyttäjän haku localstoragesta
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // notifikaation näyttäminen
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // login handler
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      // tallennus localstorageen
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      showNotification('wrong username/password', 'error')
    }
  }

  // logout handler
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  // blogin luonti handler
  const handleCreateBlog = async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)

    // viimeisin blogi listan loppuun
    setBlogs(prev => prev.concat(createdBlog))

    showNotification(
      `a new blog '${createdBlog.title}' by ${createdBlog.author} added`,
      'success'
    )

    navigate('/')

    blogFormRef.current?.toggleVisibility()
  }

  // like handler
  const handleLike = async (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(prev =>
      prev.map(b =>
        b.id === blog.id ? returnedBlog : b
      )
    )
  }

  // delete handler
  const handleDelete = async (blog) => {
    const ok = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!ok) {
      return
    }

    await blogService.remove(blog.id)

    setBlogs(prev =>
      prev.filter(b => b.id !== blog.id)
    )

    navigate('/')
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(
      b => b.id === match.params.id
    )
    : null

  return (
    <div>

      {/* NAVIGATION */}
      <AppBar position="static">
        <Toolbar>

          {/* vasen puoli: otsikko */}
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>

          {/* navigaatio */}
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>

          {user && (
            <Button color="inherit" component={Link} to="/create">
              create blog
            </Button>
          )}

          {!user && (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}

          {user && (
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          )}

        </Toolbar>
      </AppBar>

      <Notification
        message={notification?.message}
        type={notification?.type}
      />
      <ErrorBoundary>
        {/* ROUTES */}
        <Routes>

          {/* BLOG VIEW */}
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            }
          />

          {/* CREATE BLOG */}
          <Route
            path="/create"
            element={
              user ? (
                <BlogForm
                  createBlog={handleCreateBlog}
                  showNotification={showNotification}
                />
              ) : (
                <div>not authorized</div>
              )
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
              />
            }
          />

          {/* BLOG LIST */}
          <Route
            path="/"
            element={
              <div>
                <h2>blogs</h2>
                <ul>
                  {[...blogs]
                    .sort((a, b) => b.likes - a.likes)
                    .map(blog => (
                      <li key={blog.id}>
                        <Blog
                          blog={blog}
                          user={user}
                          handleLike={handleLike}
                          handleDelete={handleDelete}
                        />
                      </li>
                    ))}
                </ul>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App