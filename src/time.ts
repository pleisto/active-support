// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import ms, { type StringValue } from 'ms'

// Copy for `ms` since it not export.
interface Options {
  /**
   * Set to `true` to use verbose formatting. Defaults to `false`.
   */
  long?: boolean
}

/**
 * Convert human readable time to seconds or vice versa.
 * @param value
 * @param options
 */
export function seconds(value: number, options?: Options): string
export function seconds(value: StringValue, options?: Options): number
export function seconds(value: StringValue | number, options?: Options): number | string {
  if (typeof value === 'string' && value.length > 0) {
    return Math.round(ms(value, options) / 1000)
  } else if (typeof value === 'number') {
    return ms(value * 1000, options)
  } else {
    throw new TypeError('value must be a non-empty string or a number')
  }
}

export { ms }
