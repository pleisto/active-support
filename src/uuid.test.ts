import { describe, test, expect, beforeAll, vi } from 'vitest'
import { uuidShort } from './uuid'
import crypto from 'node:crypto'

describe('uuid', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', crypto)
  })
  test('should uuid short is valid', () => {
    const val = uuidShort()
    expect(typeof val).toBe('string')
  })
})
