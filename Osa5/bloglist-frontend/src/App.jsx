import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
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
    setNotification({message, type})

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

  // jos ei kirjautunut, näytä login
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification
          message={notification?.message}
          type={notification?.type}
        />

        <form onSubmit={handleLogin}>
          <div>
            username:{" "}
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>

          <div>
            password:{" "}
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // jos kirjautunut, näytä blogit
  return (
    <div>
      <h2>blogs</h2>

      <Notification
        message={notification?.message}
        type={notification?.type}  />

      <p>
        {user.name} logged in{" "}
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm
        createBlog={handleCreateBlog}
        showNotification={showNotification}
        />
      </Togglable>

      {[...blogs]
        .sort((blog1, blog2) => blog2.likes - blog1.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))
      }
    </div>
  )
}

export default App