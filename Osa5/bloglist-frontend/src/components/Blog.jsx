/* import { useState } from 'react' */
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <div className="blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

/* const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>

      <div style={hideWhenVisible}>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>

        <button onClick={toggleVisibility}>
          view
        </button>
      </div>


      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>

        <div>{blog.url}</div>

        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        </div>

        <div>{blog.user?.name}</div>


        {blog.user?.username === user?.username && (
          <div>
            <button onClick={() => handleDelete(blog)}>
              remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
} */

export default Blog