import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'twaali',
      name: 'Timo Waali'
    }
  }

  const user = {
    username: 'twaali'
  }

  render(
    <Blog
      blog={blog}
      user={user}
    />
  )

  expect(
    screen.getAllByText('React patterns Michael Chan')
  ).toBeDefined()
})

test('shows url, likes and user when view button is clicked', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'twaali',
      name: 'Timo Waali'
    }
  }

  const user = {
    username: 'twaali'
  }

  render(<Blog blog={blog} user={user} />)

  const button = screen.getByText('view')

  const userEventSetup = userEvent.setup()
  await userEventSetup.click(button)

  expect(screen.getByText('https://reactpatterns.com/')).toBeVisible()
  expect(screen.getByText('likes 7')).toBeVisible()
  expect(screen.getByText('Timo Waali')).toBeVisible()
})

test('like button is clicked twice, handler is called twice', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'twaali',
      name: 'Timo Waali'
    }
  }

  const user = {
    username: 'twaali'
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={mockHandler}
    />
  )

  const userEventSetup = userEvent.setup()
  const button = screen.getByText('like')

  await userEventSetup.click(button)
  await userEventSetup.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> calls createBlog with correct data', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')

  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'React testing')
  await user.type(authorInput, 'Timo Waali')
  await user.type(urlInput, 'https://test.com')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React testing',
    author: 'Timo Waali',
    url: 'https://test.com'
  })
})