import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  useEffect(() => {
    if (props.show && !props.favoriteBooks) {
      setGenre(null)
    }
  }, [props.show, props.favoriteBooks, props.booksView])

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    fetchPolicy: 'network-only',
  })

  const refetchBooks = result.refetch

  const allBooksResult = useQuery(ALL_BOOKS)

  const meResult = useQuery(ME, {
    skip: !props.favoriteBooks || !props.token,
  })

  if (result.loading || allBooksResult.loading || meResult.loading)  {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const allBooks = allBooksResult.data.allBooks
  const favoriteGenre = meResult.data?.me?.favoriteGenre

  const favoriteBooks = favoriteGenre
    ? books.filter((book) => book.genres.includes(favoriteGenre))
    : []

  const genres = [...new Set(allBooks.flatMap((book) => book.genres))]

  const booksToShow = props.favoriteBooks ? favoriteBooks : books

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
      {!props.favoriteBooks && (
        <div>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setGenre(genre)
                refetchBooks({ genre })
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Books
