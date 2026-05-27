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
      .toEqual(
        anecdotes.toSorted((a, b) => b.votes - a.votes)
      )
  })

  it('returns anecdotes sorted by votes', () => {
    const anecdotes = [
      {
        id: '1',
        content: 'least votes',
        votes: 1
      },
      {
        id: '2',
        content: 'most votes',
        votes: 10
      },
      {
        id: '3',
        content: 'middle votes',
        votes: 5
      }
    ]

    useAnecdoteStore.setState({
      anecdotes,
      filter: ''
    })

    const { result } = renderHook(() =>
      useAnecdotes()
    )

    expect(result.current).toEqual([
      anecdotes[1],
      anecdotes[2],
      anecdotes[0]
    ])
  })
  
  it('returns filtered anecdotes', () => {
    const anecdotes = [
      {
        id: '1',
        content: 'React is great',
        votes: 1
      },
      {
        id: '2',
        content: 'Zustand is simple',
        votes: 5
      },
      {
        id: '3',
        content: 'Redux is powerful',
        votes: 3
      }
    ]

    useAnecdoteStore.setState({
      anecdotes,
      filter: 'zustand'
    })

    const { result } = renderHook(() =>
      useAnecdotes()
    )

    expect(result.current).toEqual([
      anecdotes[1]
    ])
  })
})