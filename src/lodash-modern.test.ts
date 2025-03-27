import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  cloneDeep,
  compact,
  debounce,
  deepMerge,
  drop,
  dropRight,
  flattenObject,
  initial,
  pickBy,
  reject,
  uniq
} from './lodash-modern'

describe('.compact', () => {
  it('should work', () => {
    expect(compact([0, undefined, 1, false, Number.NaN, 2, '', 3, null])).toEqual([1, 2, 3])
  })
})

describe('.drop', () => {
  it('should work', () => {
    const testArr = [1, 2, 3]
    expect(drop(testArr)).toEqual([2, 3])
    expect(drop(testArr, 2)).toEqual([3])
    expect(drop(testArr, 5)).toEqual([])
    expect(drop(testArr, 0)).toEqual(testArr)
  })
})

describe('.dropRight', () => {
  it('should work', () => {
    const testArr = [1, 2, 3]
    expect(dropRight(testArr)).toEqual([1, 2])
    expect(dropRight(testArr, 2)).toEqual([1])
    expect(dropRight(testArr, 5)).toEqual([])
    expect(dropRight(testArr, 0)).toEqual(testArr)
  })
})

describe('.initial', () => {
  it('should work', () => {
    expect(initial([1, 2, 3])).toEqual([1, 2])
    expect(initial([3])).toEqual([])
  })
})

describe('.uniq', () => {
  it('should work', () => {
    expect(uniq([1, 2, 1])).toEqual([1, 2])
  })
})

describe('.reject', () => {
  it('should work', () => {
    expect(reject([1, 2, 3], n => n === 2)).toEqual([1, 3])
  })
})

describe('.cloneDeep', () => {
  it('should work', () => {
    const obj = [{ a: 1 }, { b: 2 }]
    expect(cloneDeep(obj)[0] === obj[0]).toBeFalsy()
  })
})

describe('.deepMerge', () => {
  it('can handle falsey', () => {
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

  it('can handle null values', () => {
    expect(deepMerge({}, { a: null })).toEqual({
      a: null
    })
  })

  it('can handle array values', () => {
    expect(deepMerge({}, { a: [1, 2] })).toEqual({ a: [1, 2] })
  })

  it('can handle deep cycles', () => {
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
  it('debounced function runs after the wait time is up', async () => {
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
  it('should work', () => {
    expect(flattenObject({ a: { b: 1, c: undefined, d: { '1': { '-bal': 'hello' } } } })).toEqual({
      'a.b': 1,
      'a.c': undefined,
      'a.d.1.-bal': 'hello'
    })
  })
})

describe('pickBy', () => {
  it('should work with a predicate argument', () => {
    const object = { a: 1, b: 2, c: 3, d: 4 }

    const actual = pickBy(object, n => n === 1 || n === 3)

    expect(actual).toEqual({ a: 1, c: 3 })
  })

  it('should pick properties based on the predicate function', () => {
    const obj = { a: 1, b: 'pick', c: 3 }
    const shouldPick = (value: string | number) => typeof value === 'string'
    const result = pickBy(obj, shouldPick)
    expect(result).toEqual({ b: 'pick' })
  })

  it('should return an empty object if no properties satisfy the predicate', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const shouldPick = (value: number) => typeof value === 'string'
    const result = pickBy(obj, shouldPick)
    expect(result).toEqual({})
  })

  it('should return the same object if all properties satisfy the predicate', () => {
    const obj = { a: 'pick', b: 'pick', c: 'pick' }
    const shouldPick = (value: string) => typeof value === 'string'
    const result = pickBy(obj, shouldPick)
    expect(result).toEqual(obj)
  })

  it('should work with an empty object', () => {
    const obj = {}
    const shouldPick = (value: never) => value
    const result = pickBy(obj, shouldPick)
    expect(result).toEqual({})
  })

  it('should work with nested objects', () => {
    const obj = { a: 1, b: { nested: 'pick' }, c: 3 }
    const shouldPick = (value: number | { nested: string }, key: string) => key === 'b'
    const result = pickBy(obj, shouldPick)
    expect(result).toEqual({ b: { nested: 'pick' } })
  })

  it('should work with no predicate function', () => {
    const obj = { a: 1, b: 'pick', c: 3 }
    const result = pickBy(obj)
    expect(result).toEqual(obj)
  })

  it('should return an empty object if the object is null', () => {
    const obj = null
    const shouldPick = (value: string) => typeof value === 'string'
    const result = pickBy(obj as unknown as object, shouldPick)
    expect(result).toEqual({})
  })

  it('should return an empty object if the object is undefined', () => {
    const obj = undefined
    const shouldPick = (value: string) => typeof value === 'string'
    const result = pickBy(obj as unknown as object, shouldPick)
    expect(result).toEqual({})
  })

  it(`should provide correct iteratee arguments`, () => {
    const array = [1, 2, 3]

    let args: any
    const expected: any = [1, 0, array]

    // eslint-disable-next-line
    // @ts-ignore
    pickBy(array, function () {
      // eslint-disable-next-line
      args || (args = Array.prototype.slice.call(arguments))
    })

    expected[1] += ''

    expect(args).toEqual(expected)
  })

  it(`iterates over own string keyed properties of objects`, () => {
    function Foo(this: any) {
      // eslint-disable-next-line
      // @ts-ignore
      this.a = 1
    }
    Foo.prototype.b = 2

    const values: any[] = []
    // eslint-disable-next-line
    // @ts-ignore
    pickBy(new Foo(), value => {
      values.push(value)
    })
    expect(values).toEqual([1])
  })

  it(`should ignore changes to \`length\``, () => {
    let count = 0
    const array = [1]

    pickBy(array, () => {
      if (++count === 1) {
        array.push(2)
      }
      return true
    })

    expect(count).toBe(1)
  })

  it(`should ignore added \`object\` properties`, () => {
    let count = 0
    const object = { a: 1 }

    pickBy(object, () => {
      if (++count === 1) {
        // eslint-disable-next-line
        // @ts-ignore
        object.b = 2
      }
      return true
    })

    expect(count).toBe(1)
  })
})
