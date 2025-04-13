import { describe, expect, it } from 'vitest'

import { seconds, ms } from './time'

describe('seconds', () => {
  it('should convert string to seconds', () => {
    expect(seconds('1s')).toBe(1)
    expect(seconds('1m')).toBe(60)
    expect(seconds('1h')).toBe(3600)
    expect(seconds('1d')).toBe(86400)
  })

  it('should convert seconds to readable string', () => {
    expect(seconds(1)).toBe('1s')
    expect(seconds(60)).toBe('1m')
    expect(seconds(3600)).toBe('1h')
    expect(seconds(86400)).toBe('1d')
  })

  it('should handle decimal seconds correctly', () => {
    expect(seconds('1.5s')).toBe(2) // round up
    expect(seconds('0.5s')).toBe(1) // round up
  })

  it('supports long format option', () => {
    expect(seconds(60, { long: true })).toBe('1 minute')
    expect(seconds(3600, { long: true })).toBe('1 hour')
  })

  it('should throw error for invalid input', () => {
    // @ts-expect-error - testing error case
    expect(() => seconds('')).toThrow('value must be a non-empty string or a number')
  })
})

describe('ms', () => {
  it('should convert time correctly', () => {
    expect(ms('1s')).toBe(1000)
    expect(ms('1m')).toBe(60000)
    expect(ms(1000)).toBe('1s')
  })
})
