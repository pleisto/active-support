import { expect, test, describe } from 'vitest'
import { safeJsonParse } from './results'

describe('results', () => {
  test('should safeJsonParse work', () => {
    expect(safeJsonParse('x1').unwrapOr({ a: 1 })).toEqual({ a: 1 })
    expect(safeJsonParse('{"a": 2}').unwrapOr({ a: 1 })).toEqual({ a: 2 })
  })
})
