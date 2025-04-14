export const AbortException = 'Aborted'
/**
 * Sleeps for the specified amount of time.
 * @param milliseconds
 * @returns
 */
export const sleep = (milliseconds: number): { cancel: () => void; promise: Promise<void> } => {
  let timeout: ReturnType<typeof setTimeout>
  const controller = new AbortController()
  return {
    cancel: () => {
      clearTimeout(timeout)
      controller.abort()
    },
    promise: new Promise((resolve, reject) => {
      controller.signal.addEventListener('abort', () => {
        reject(AbortException)
      })
      timeout = setTimeout(resolve, milliseconds)
    })
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
export const sleepWithIntervals = (
  ms: number,
  interval?: number,
  callback?: () => void
): { cancel: () => void; promise: Promise<void> } => {
  let timeout: ReturnType<typeof setTimeout>
  let timer: ReturnType<typeof setInterval>
  const controller = new AbortController()

  return {
    cancel: () => {
      clearTimeout(timeout)
      if (timer) clearInterval(timer)
      controller.abort()
    },
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
    })
  }
}
