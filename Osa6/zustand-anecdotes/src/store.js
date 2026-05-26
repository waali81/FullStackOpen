
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',

  actions: {
    vote: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes
        .find((a) => a.id === id)

      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      const returnedAnecdote = await anecdoteService.update(
        id,
        updatedAnecdote
      )

      set((state) => ({
        anecdotes: state.anecdotes
          .map((anecdote) =>
            anecdote.id === id
              ? returnedAnecdote
              : anecdote
          )
      }))
    },

    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)

      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote)
      }))
    },

    remove: async (id) => {
      await anecdoteService.remove(id)

      set((state) => ({
        anecdotes: state.anecdotes.filter(
          (anecdote) => anecdote.id !== id
        )
      }))
    },

    setFilter: (filter) =>
      set(() => ({ filter })),

    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()

      set(() => ({ anecdotes }))
    }
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(
    (state) => state.anecdotes
  )

  const filter = useAnecdoteStore(
    (state) => state.filter
  )

  return anecdotes.filter((anecdote) =>
    anecdote.content
      .toLowerCase()
      .includes(filter.toLowerCase())
  )
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export default useAnecdoteStore
