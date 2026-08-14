import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  /* const meResult = useQuery(ME) */
  const meResult = useQuery(ME, {
    skip: !props.favoriteBooks || !props.token,
  })

  if (result.loading || meResult.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const favoriteGenre = meResult.data?.me?.favoriteGenre

  const favoriteBooks = favoriteGenre
    ? books.filter((book) => book.genres.includes(favoriteGenre))
    : []

  const genres = [...new Set(books.flatMap((book) => book.genres))]

  const filteredBooks = genre
    ? books.filter((book) => book.genres.includes(genre))
    : books

  const booksToShow = props.favoriteBooks ? favoriteBooks : filteredBooks

  return (
    <div>
      <h2>
        {props.favoriteBooks
          ? `books in your favorite genre: ${favoriteGenre}`
          : 'books'}
      </h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
