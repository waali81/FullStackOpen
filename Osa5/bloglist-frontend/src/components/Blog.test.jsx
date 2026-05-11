import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

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

  screen.getAllByText('React patterns Michael Chan')

  expect(
    screen.queryByText('https://reactpatterns.com/')
  ).not.toBeVisible()

  expect(
    screen.queryByText('likes 7')
  ).not.toBeVisible()
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

  screen.getByText('https://reactpatterns.com/')
  screen.getByText('likes 7')
  screen.getByText('Timo Waali')
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