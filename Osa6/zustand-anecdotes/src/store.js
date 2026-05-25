
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',

  actions: {
    vote: (id) => set((state) => ({
      anecdotes: state.anecdotes
        .map((anecdote) =>
          anecdote.id === id
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote
        )
        .toSorted((a, b) => b.votes - a.votes)
    })),

    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)

      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote)
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
