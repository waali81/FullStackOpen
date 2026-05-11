import { render, screen } from '@testing-library/react'
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