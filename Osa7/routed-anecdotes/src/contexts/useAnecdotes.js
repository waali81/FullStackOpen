import { useContext } from 'react'
import { AnecdoteContext } from './AnecdoteContext'

export const useAnecdotes = () => {
  return useContext(AnecdoteContext)
}