import { useAnecdoteActions } from '../store'

const Filter = () => {
  const { setFilter } = useAnecdoteActions()

  const handleChange = (e) => {
    setFilter(e.target.value)
  }

  const style = {
    marginBottom: 10,
    display: 'flex',
    gap: 5,
  }

  return (
    <div style={style}>
      filter

      <input onChange={handleChange} />
    </div>
  )
}

export default Filter