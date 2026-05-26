import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const addAnecdote = async (e) => {
    e.preventDefault()

    const content = e.target.anecdote.value
    await create(content)
    setNotification(
      `you created '${content}'`
    )
    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div style={{ marginBottom: 5 }}>
          <input name="anecdote" />
        </div>
        <button type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm