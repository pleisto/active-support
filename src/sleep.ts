/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { type Integer, type Positive } from './ts-types'

export const AbortException = 'Aborted'
/**
 * Sleeps for the specified amount of time.
 * @param milliseconds
 * @returns
 */
export const sleep = <T extends number>(
  milliseconds: Positive<Integer<T>>
): { promise: Promise<void>; cancel: () => void } => {
  let timeout: ReturnType<typeof setTimeout>
  const controller = new AbortController()
  return {
    promise: new Promise((resolve, reject) => {
      controller.signal.addEventListener('abort', () => {
        reject(AbortException)
      })
      timeout = setTimeout(resolve, milliseconds)
    }),
    cancel: () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }
}

/**
 * Sleeps for a specified duration, with optional intervals and callbacks.
 * Returns a cancellable promise that resolves when the sleep is complete.
 *
 * - duration (required): The duration, in milliseconds, to sleep for.
 * - interval (optional): The interval, in milliseconds, at which to execute the callback. Defaults to undefined.
 * - callback (optional): The callback function to execute at each interval. Defaults to undefined.
 */
export const sleepWithIntervals = <T extends number>(
  ms: Positive<Integer<T>>,
  interval?: Positive<Integer<T>>,
  callback?: () => void
): { promise: Promise<void>; cancel: () => void } => {
  let timeout: ReturnType<typeof setTimeout>
  let timer: ReturnType<typeof setInterval>
  const controller = new AbortController()

  return {
    promise: new Promise((resolve, reject) => {
      controller.signal.addEventListener('abort', () => {
        reject(AbortException)
      })
      if (interval && callback) {
        timer = setInterval(() => {
          callback()
        }, interval)
      }

      timeout = setTimeout(() => {
        resolve()
        if (timer) clearInterval(timer)
      }, ms)
    }),
    cancel: () => {
      clearTimeout(timeout)
      if (timer) clearInterval(timer)
      controller.abort()
    }
  }
}
