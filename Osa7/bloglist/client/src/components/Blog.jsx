import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  /* throw new Error('ota yhteys tuotekehittäjään') */
  return (
    <div className="blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

export default Blog