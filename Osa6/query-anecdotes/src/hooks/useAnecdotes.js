import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote,
} from '../requests'

import useNotify from './useNotify'

export const useAnecdotes = () => {
  const { showNotification } = useNotify()
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes'],
      })
      showNotification(
        `you created '${newAnecdote.content}'`
      )
    },
    onError: (error) => {
      showNotification(error.message)
    },
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes'],
      })
    },
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,

    addAnecdote: (content) =>
      newAnecdoteMutation.mutate({
        content,
        votes: 0,
      }),

    voteAnecdote: (anecdote) => {
      updateAnecdoteMutation.mutate({
        ...anecdote,
        votes: anecdote.votes + 1,
      })
      showNotification(
        `you voted '${anecdote.content}'`
      )
    },
  }
}