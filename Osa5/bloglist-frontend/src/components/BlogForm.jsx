import { useState } from 'react'

const BlogForm = ({ createBlog, showNotification }) => {
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
    <div>
      <h3>Create new blog</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title{' '}
            <input
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            author{' '}
            <input
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            url{' '}
            <input
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </label>
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm