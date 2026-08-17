import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(
    localStorage.getItem('library-user-token')
  )
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      window.alert(
        `New book added: ${data.data.bookAdded.title}`
      )
    },
  })

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('books')
  }

  const [booksView, setBooksView] = useState(0)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button
          onClick={() => {
            setPage('books')
            setBooksView(booksView + 1)
          }}
        >
          books
        </button>
        {/* <button onClick={() => setPage('books')}>books</button> */}
        {token && ( 
          <button onClick={() => setPage('recommend')}>recommend</button>
        )} 
        {!token ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={onLogout}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === 'authors'} token={token} />

      {/* <Books show={page === 'books'} /> */}
      <Books
        show={page === 'books'}
        booksView={booksView}
      />

      <Books
        show={page === 'recommend'}
        favoriteBooks={true}
        token={token}
      />

      <NewBook show={page === 'add'} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  )
}

export default App
