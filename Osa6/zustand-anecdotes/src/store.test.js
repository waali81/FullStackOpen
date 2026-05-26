import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'

import useAnecdoteStore, {
  useAnecdotes,
  useAnecdoteActions
} from './store'

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: ''
  })

  vi.clearAllMocks()
})

describe('anecdote store', () => {
  it('initializes anecdotes from backend', async () => {
    const anecdotes = [
      {
        id: '1',
        content: 'first anecdote',
        votes: 0
      },
      {
        id: '2',
        content: 'second anecdote',
        votes: 5
      }
    ]

    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() =>
      useAnecdoteActions()
    )

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } =
      renderHook(() => useAnecdotes())

    expect(anecdotesResult.current)
      .toEqual(anecdotes)
  })
})