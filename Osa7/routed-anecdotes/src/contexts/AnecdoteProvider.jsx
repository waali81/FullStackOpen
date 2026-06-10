import { useState, useEffect } from 'react'
import { AnecdoteContext } from './AnecdoteContext'
import anecdoteService from '../services/anecdotes'

export const AnecdoteProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => {
      setAnecdotes(data)
    })
  }, [])

  const addAnecdote = async (anecdote) => {
    const createdAnecdote = await anecdoteService.createNew(anecdote)

    setAnecdotes(prev =>
      prev.concat(createdAnecdote)
    )
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteAnecdote(id)

    setAnecdotes(prev =>
      prev.filter(anecdote => anecdote.id !== id)
    )
  }

  return (
    <AnecdoteContext.Provider
      value={{
        anecdotes,
        addAnecdote,
        deleteAnecdote
      }}
    >
      {children}
    </AnecdoteContext.Provider>
  )
}