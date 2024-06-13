import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest'
import {
  compact,
  drop,
  dropRight,
  initial,
  uniq,
  reject,
  cloneDeep,
  deepMerge,
  debounce,
  flattenObject
} from './lodash-modern'

describe('.compact', () => {
  test('should work', () => {
    expect(compact([0, undefined, 1, false, NaN, 2, '', 3, null])).toEqual([1, 2, 3])
  })
})

describe('.drop', () => {
  test('should work', () => {
    const testArr = [1, 2, 3]
    expect(drop(testArr)).toEqual([2, 3])
    expect(drop(testArr, 2)).toEqual([3])
    expect(drop(testArr, 5)).toEqual([])
    expect(drop(testArr, 0)).toEqual(testArr)
  })
})

describe('.dropRight', () => {
  test('should work', () => {
    const testArr = [1, 2, 3]
    expect(dropRight(testArr)).toEqual([1, 2])
    expect(dropRight(testArr, 2)).toEqual([1])
    expect(dropRight(testArr, 5)).toEqual([])
    expect(dropRight(testArr, 0)).toEqual(testArr)
  })
})

describe('.initial', () => {
  test('should work', () => {
    expect(initial([1, 2, 3])).toEqual([1, 2])
    expect(initial([3])).toEqual([])
  })
})

describe('.uniq', () => {
  test('should work', () => {
    expect(uniq([1, 2, 1])).toEqual([1, 2])
  })
})

describe('.reject', () => {
  test('should work', () => {
    expect(reject([1, 2, 3], n => n === 2)).toEqual([1, 3])
  })
})

describe('.cloneDeep', () => {
  test('should work', () => {
    const obj = [{ a: 1 }, { b: 2 }]
    expect(cloneDeep(obj)[0] === obj[0]).toBeFalsy()
  })
})

describe('.deepMerge', () => {
  test('can handle falsey', () => {
    expect(
      deepMerge<{ a: string; b: string | undefined }>(
        {},
        null,
        undefined,
        false,
        { a: '1' },
        { b: '2' },
        { b: undefined }
      )
    ).toEqual({
      a: '1',
      b: undefined
    })
  })

  test('can handle null values', () => {
    expect(deepMerge({}, { a: null })).toEqual({
      a: null
    })
  })

  test('can handle array values', () => {
    expect(deepMerge({}, { a: [1, 2] })).toEqual({ a: [1, 2] })
  })

  test('can handle deep cycles', () => {
    const obj: { foo: { bar: { baz: Record<string, unknown> | undefined } } } = {
      foo: {
        bar: {
          baz: undefined
        }
      }
    }

    obj.foo.bar.baz = obj

    const result = deepMerge({}, obj)

    expect(result).toEqual({ foo: { bar: { baz: obj } } })
    expect(result.foo).not.toBe(obj.foo)
    expect(result.foo.bar.baz).toBe(obj)
  })
})

describe('.debounce', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })
  test('debounced function runs after the wait time is up', async () => {
    const mock = vi.fn()
    const debounced = debounce(mock, 10)

    debounced(1, 2)

    vi.advanceTimersByTime(9)
    expect(mock).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(1)
    expect(mock).toHaveBeenCalledTimes(1)
  })
})

describe('.flattenObject', () => {
  test('should work', () => {
    expect(flattenObject({ a: { b: 1, c: undefined, d: { '1': { '-bal': 'hello' } } } })).toEqual({
      'a.b': 1,
      'a.c': undefined,
      'a.d.1.-bal': 'hello'
    })
  })
})
