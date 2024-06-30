import { describe, expect, it, vi } from 'vitest'

import { AbortException, sleep, sleepWithIntervals } from './sleep'

describe('sleep', () => {
  it('should work', async () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const promise = sleep(2000).promise.then(callback)
    const start = Date.now()

    vi.runAllTimers()
    await promise
    expect(callback).toHaveBeenCalledTimes(1)
    const end = Date.now()
    expect(end - start >= 2000).toBe(true)
  })
})

describe('sleepWithIntervals', () => {
  it('sleep for 2 seconds without interval or callback', async () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const promise = sleepWithIntervals(2000).promise.then(callback)
    const start = Date.now()
    vi.runAllTimers()
    await expect(promise).resolves.toBe(undefined)
    expect(callback).toHaveBeenCalledTimes(1)
    const end = Date.now()
    expect(end - start >= 2000).toBe(true)
  })

  it('cancelling sleep should reject the promise', async () => {
    const { cancel, promise } = sleep(2000)
    vi.useFakeTimers()
    setTimeout(cancel, 1000)
    vi.advanceTimersByTime(1000)

    await expect(promise).rejects.toEqual(AbortException)
  })

  it('sleep for 2 seconds with interval of 500ms and callback', async () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const { promise } = sleepWithIntervals(2000, 500, callback)
    vi.runAllTimers()
    await expect(promise).resolves.toBe(undefined)
    expect(callback).toHaveBeenCalledTimes(4)
  })

  it('sleep for 0.1 seconds with interval of 500ms and callback', async () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const { promise } = sleepWithIntervals(100, 500, callback)
    vi.runAllTimers()
    await expect(promise).resolves.toBe(undefined)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  // eslint-disable-next-line vitest/no-identical-title
  it('cancelling sleep should reject the promise', async () => {
    const { cancel, promise } = sleepWithIntervals(2000)
    vi.useFakeTimers()
    setTimeout(cancel, 1000)
    vi.advanceTimersByTime(1000)

    await expect(promise).rejects.toEqual(AbortException)
  })

  it('cancelling sleep should stop the interval timer', async () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const { cancel, promise } = sleepWithIntervals(2000, 500, callback)
    setTimeout(cancel, 1500)
    vi.advanceTimersByTime(1500)
    await expect(promise).rejects.toEqual(AbortException)
    expect(callback).toHaveBeenCalledTimes(3)
  })
})
