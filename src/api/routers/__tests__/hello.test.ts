import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/api/trpc'
import { appRouter } from '@/api/root'

const createCaller = createCallerFactory(appRouter)
const caller = createCaller({})

describe('hello router', () => {
  it('world returns greeting message', async () => {
    const result = await caller.hello.world()
    expect(result).toEqual({ message: 'Hello, World!' })
  })
})
