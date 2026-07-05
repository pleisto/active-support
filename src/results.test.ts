import { describe, expect, it } from 'vitest'

import { ok } from './index'
import { safeJsonParse } from './results'

describe('results', () => {
  it('should safeJsonParse work', () => {
    expect(safeJsonParse('x1').unwrapOr({ a: 1 })).toEqual({ a: 1 })
    expect(safeJsonParse('{"a": 2}').unwrapOr({ a: 1 })).toEqual({ a: 2 })
  })

  it('exports neverthrow from the public entrypoint', () => {
    expect(ok('active-support').unwrapOr('fallback')).toBe('active-support')
  })
})
