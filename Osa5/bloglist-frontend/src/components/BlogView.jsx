const BlogView = ({
  blog,
  handleLike,
  handleDelete,
  user
}) => {

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div>
        <a
          href={blog.url}
          target="_blank"
          rel="noreferrer"
        >
          {blog.url}
        </a>
      </div>

      <div>
        likes {blog.likes}

        {user && (
          <button
            onClick={() => handleLike(blog)}
          >
            like
          </button>
        )}
      </div>

      <div>
        added by {blog.user?.name}
      </div>

      {blog.user?.username ===
        user?.username && (
        <button
          onClick={() =>
            handleDelete(blog)
          }
        >
          remove
        </button>
      )}
    </div>
  )
}

export default BlogView