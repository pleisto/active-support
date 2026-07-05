import { describe, expect, it } from 'vitest'

import {
  arrayPath,
  compactRecord,
  deepString,
  firstNumber,
  firstString,
  isRecord,
  jsonObject,
  jsonValue,
  objectPath,
  recordArg,
  recordValue,
  safeJsonStringify,
  stringArg
} from './json-utils'

describe('json-utils', () => {
  it('narrows plain JSON objects', () => {
    expect(isRecord({ a: 1 })).toBe(true)
    expect(isRecord(Object.create(null))).toBe(true)
    expect(isRecord([1, 2])).toBe(false)
    expect(isRecord(new Date())).toBe(false)
    expect(recordValue({ a: 1 })).toEqual({ a: 1 })
    expect(recordValue(null)).toBeUndefined()
  })

  it('reads object and string args', () => {
    const args = { user: { name: 'Ada' }, empty: {}, count: 1 }

    expect(recordArg(args, 'user')).toEqual({ name: 'Ada' })
    expect(recordArg(args, 'count')).toBeUndefined()
    expect(stringArg(recordArg(args, 'user'), 'name')).toBe('Ada')
    expect(stringArg(args, 'count')).toBeUndefined()
  })

  it('removes only undefined fields from records', () => {
    expect(compactRecord({ a: 1, b: undefined, c: null, d: false })).toEqual({ a: 1, c: null, d: false })
  })

  it('reads nested JSON paths safely', () => {
    const input = {
      data: {
        item: {
          title: 'Hello',
          tags: ['a', 'b']
        }
      }
    }

    expect(objectPath(input, ['data', 'item'])).toEqual({ title: 'Hello', tags: ['a', 'b'] })
    expect(objectPath(input, ['data', 'missing'])).toEqual({})
    expect(deepString(input, ['data', 'item', 'title'])).toBe('Hello')
    expect(deepString(input, ['data', 'item', 'tags'])).toBeUndefined()
    expect(arrayPath(input, ['data', 'item', 'tags'])).toEqual(['a', 'b'])
    expect(arrayPath(input, ['data', 'item', 'title'])).toEqual([])
  })

  it('picks the first useful candidate value', () => {
    const input = { title: '', name: 'Ada', count: Number.NaN, size: 42 }

    expect(firstString(input, ['title', 'name'])).toBe('Ada')
    expect(firstString(input, ['title', 'missing'])).toBeUndefined()
    expect(firstNumber(input, ['count', 'size'])).toBe(42)
    expect(firstNumber(input, ['missing', 'count'])).toBeUndefined()
  })

  it('stringifies values without throwing', () => {
    const cyclic: Record<string, unknown> = {}
    cyclic.self = cyclic

    expect(safeJsonStringify({ a: 1 })).toBe('{"a":1}')
    expect(safeJsonStringify(Symbol('x'))).toBe('undefined')
    expect(safeJsonStringify(cyclic)).toBe('[object Object]')
  })

  it('normalizes unknown values into JSON-shaped data', () => {
    const date = new Date('2024-01-01T00:00:00.000Z')

    expect(jsonObject({ a: undefined, b: [1, undefined], c: date })).toEqual({
      a: null,
      b: [1, null],
      c: String(date)
    })
    expect(jsonObject('x')).toEqual({})
    expect(jsonValue(undefined)).toBeNull()
    expect(jsonValue(() => 1)).toContain('=>')
  })
})
