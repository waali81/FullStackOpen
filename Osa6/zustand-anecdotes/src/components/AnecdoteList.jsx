import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const sortedAnecdotes = anecdotes.toSorted((a, b) => {
    return b.votes - a.votes
  })

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div style={{ display: 'flex', gap: '5px' }}>
            has {anecdote.votes}

            <button
              onClick={() => {
                vote(anecdote.id)
                setNotification(
                  `you voted '${anecdote.content}'`
                )
              }}
            >vote</button>

            {anecdote.votes === 0 && (
              <button
                onClick={() => {
                  remove(anecdote.id)

                  setNotification(
                    `you removed '${anecdote.content}'`
                  )
                }}
              >remove</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList