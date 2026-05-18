import { useState, useEffect, useRef } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

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
  }

  return (
    <div>
      <div>
        <Link style={{ paddingRight: 5 }} to="/">
          blogs
        </Link>

        {!user && (
          <Link to="/login">
            login
          </Link>
        )}

        {user && (
          <button onClick={handleLogout}>
            logout
          </button>
        )}
      </div>

      <Notification
        message={notification?.message}
        type={notification?.type}
      />

      <Routes>

        <Route
          path="/login"
          element={
            <div>
              <h2>Log in to application</h2>

              <form onSubmit={handleLogin}>
                <div>
                  <label>
                    username:
                    <input
                      type="text"
                      value={username}
                      onChange={({ target }) =>
                        setUsername(target.value)
                      }
                    />
                  </label>
                </div>

                <div>
                  <label>
                    password:
                    <input
                      type="password"
                      value={password}
                      onChange={({ target }) =>
                        setPassword(target.value)
                      }
                    />
                  </label>
                </div>

                <button type="submit">
                  login
                </button>
              </form>
            </div>
          }
        />

        <Route
          path="/"
          element={
            <div>

              {user && (
                <p>
                  {user.name} logged in
                </p>
              )}

              <h2>blogs</h2>

              {user && (
                <>

                  <Togglable
                    buttonLabel="create new blog"
                    ref={blogFormRef}
                  >
                    <BlogForm
                      createBlog={handleCreateBlog}
                      showNotification={showNotification}
                    />
                  </Togglable>
                </>
              )}

              {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map(blog => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    handleLike={handleLike}
                    handleDelete={handleDelete}
                    user={user}
                  />
                ))}
            </div>
          }
        />

      </Routes>
    </div>
  )
}

export default App