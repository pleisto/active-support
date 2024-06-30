import crypto from 'node:crypto'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { uuidShort } from './uuid'

describe('uuid', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', crypto)
  })
  it('should uuid short is valid', () => {
    const val = uuidShort()
    expect(typeof val).toBe('string')
  })
})
