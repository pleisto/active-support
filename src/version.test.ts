import { describe, it, expect } from 'vitest'
import { meetsMinimumVersion } from './version'

describe('meetsMinimumVersion', () => {
  it('should return true when current version equals minimum version', () => {
    expect(meetsMinimumVersion('1.2.3', '1.2.3')).toBe(true)
  })

  it('should return true when current version is greater than minimum version', () => {
    expect(meetsMinimumVersion('1.2.3', '1.2.4')).toBe(true)
    expect(meetsMinimumVersion('1.2.3', '1.3.0')).toBe(true)
    expect(meetsMinimumVersion('1.2.3', '2.0.0')).toBe(true)
  })

  it('should return false when current version is less than minimum version', () => {
    expect(meetsMinimumVersion('1.2.3', '1.2.2')).toBe(false)
    expect(meetsMinimumVersion('1.2.3', '1.1.9')).toBe(false)
    expect(meetsMinimumVersion('1.2.3', '0.9.9')).toBe(false)
  })

  it('should throw an error for invalid version format', () => {
    expect(() => meetsMinimumVersion('1.2', '1.2.3')).toThrow('Invalid minimum version format')
    expect(() => meetsMinimumVersion('1.2.3', '1.2')).toThrow('Invalid current version format')
    expect(() => meetsMinimumVersion('a.b.c', '1.2.3')).toThrow('Invalid minimum version format')
    expect(() => meetsMinimumVersion('1.2.3', '1.x.3')).toThrow('Invalid current version format')
  })
})
