import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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
      console.log('wrong credentials')
    }
  }

  // logout handler
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const createdBlog = await blogService.create(newBlog)

    setBlogs(blogs.concat(createdBlog))

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const blogForm = () => (
    <div>
      <h3>Create new blog</h3>

      <form onSubmit={handleCreateBlog}>
        <div>
          title:{" "}
          <input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>

        <div>
          author:{" "}
          <input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>

        <div>
          url: {" "}
          <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )

  // jos ei kirjautunut, näytä login
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

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

      <p>
        {user.name} logged in{" "}
        <button onClick={handleLogout}>logout</button>
      </p>

      {blogForm()}

      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App