import { describe, expect, it } from 'vitest'

import {
  isBlank,
  isEmail,
  isNonEmptyArray,
  isNonEmptyString,
  isNullOrUndefined,
  isNumber,
  isString,
  isUrl,
  isUUID,
  isRegExp,
  isPlainObject,
  isBoolean,
  isNaN,
  isNull,
  isFile,
  isLength,
  isArrayLike
} from './is-type'

describe('.isString', () => {
  it('should work', () => {
    expect(isString('text')).toBe(true)
    // eslint-disable-next-line no-new-wrappers
    expect(isString(new String('some thing'))).toBe(true)
    expect(isString({})).toBe(false)
  })
})

describe('.isNumber', () => {
  it('should work', () => {
    expect(isNumber('1')).toBe(false)
    expect(isNumber(233)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)
    expect(isNumber(isNumber, true)).toBe(false)
    expect(isNumber(Infinity, true)).toBe(false)
    expect(isNumber(Number.NaN, true)).toBe(false)
  })
})

describe('.isNullOrUndefined', () => {
  it('should work', () => {
    expect(isNullOrUndefined('1')).toBe(false)
    expect(isNullOrUndefined(null)).toBe(true)
    expect(isNullOrUndefined(undefined)).toBe(true)
  })
})

describe('.isBlank', () => {
  it('should work', () => {
    expect(isBlank(() => {})).toBe(false)
    expect(isBlank(true)).toBe(false)
    expect(isBlank(3)).toBe(false)
    expect(isBlank('test')).toBe(false)
    expect(isBlank({ a: 2 })).toBe(false)
    expect(isBlank(false)).toBe(true)
    expect(isBlank({})).toBe(true)
    expect(isBlank(undefined)).toBe(true)
    expect(isBlank(null)).toBe(true)
    expect(isBlank('')).toBe(true)
    expect(isBlank([])).toBe(true)
  })
})

describe('.isUUID', () => {
  it('should work', () => {
    expect(isUUID('1xx-xs2')).toBe(false)
    expect(isUUID('aabd8c7b-818c-4223-a404-392fe6324a20')).toBe(true)
  })
})

describe('.isNonEmptyArray', () => {
  it('should work', () => {
    expect(isNonEmptyArray([])).toBe(false)
    expect(isNonEmptyArray([1, 2, 3])).toBe(true)
    expect(isNonEmptyArray({})).toBe(false)
  })
})

describe('.isNonEmptyString', () => {
  it('should work', () => {
    expect(isNonEmptyString('')).toBe(false)
    expect(isNonEmptyString('test')).toBe(true)
    expect(isNonEmptyString(null)).toBe(false)
  })
})

describe('.isUrl', () => {
  it('should work', () => {
    expect(isUrl('mashpod://example?pageId=233')).toBe(true)
    expect(isUrl('https://test.com', 'https')).toBe(true)
    expect(isUrl('mashpod.cloud')).toBe(false)
    expect(isUrl('sftp://foss.mashpod.cloud', 'https')).toBe(false)
    expect(isUrl('http://test.com', 'https')).toBe(false)
    expect(isUrl('ftp://test.com')).toBe(true)
    expect(isUrl(123 as any)).toBe(false)
  })
})

describe('.isEmail', () => {
  it('should work', () => {
    expect(isEmail('people@pleisto.net')).toBe(true)
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('invalid-email')).toBe(false)
    expect(isEmail('test@.com')).toBe(false)
    expect(isEmail('@example.com')).toBe(false)
  })
})

describe('.isRegExp', () => {
  it('should work', () => {
    expect(isRegExp(/abc/)).toBe(true)
    // eslint-disable-next-line prefer-regex-literals
    expect(isRegExp(new RegExp('abc'))).toBe(true)
    expect(isRegExp('/abc/')).toBe(false)
    expect(isRegExp({})).toBe(false)
    expect(isRegExp(null)).toBe(false)
  })
})

describe('.isPlainObject', () => {
  it('should work', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ key: 'value' })).toBe(true)
    expect(isPlainObject({ key: new Date() })).toBe(true)
    expect(isPlainObject(new Object())).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject({ nested: { key: true } })).toBe(true)

    class Test {}
    expect(isPlainObject(new Test())).toBe(false)
    expect(isPlainObject(10)).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject('hello')).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject(new Uint8Array([1]))).toBe(false)
    expect(isPlainObject(Promise.resolve({}))).toBe(false)
    expect(isPlainObject(Object.create({}))).toBe(false)
    // eslint-disable-next-line prefer-arrow-callback
    expect(isPlainObject(function () {})).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
  })
})

describe('.isBoolean', () => {
  it('should work', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    // eslint-disable-next-line no-new-wrappers
    expect(isBoolean(new Boolean(true))).toBe(true)
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean(null)).toBe(false)
    expect(isBoolean(undefined)).toBe(false)
  })
})

describe('.isNaN', () => {
  it('should work', () => {
    expect(isNaN(Number.NaN)).toBe(true)
    expect(isNaN(Number.NaN)).toBe(true)
    expect(isNaN(123)).toBe(false)
    expect(isNaN(0)).toBe(false)
    expect(isNaN('NaN')).toBe(false)
    expect(isNaN(undefined)).toBe(false)
    expect(isNaN({})).toBe(false)
  })
})

describe('.isNull', () => {
  it('should work', () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull(Number.NaN)).toBe(false)
  })
})

describe('.isFile', () => {
  it('should work', () => {
    // Test with a real File object only if the File constructor is available
    if (typeof globalThis.File === 'function') {
      const realFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(isFile(realFile)).toBe(true) // Should return true for a real File
    } else {
      // Log a warning if File constructor is not available (e.g., basic Node.js env)
      console.warn('[Test Warning] globalThis.File is not available. Skipping positive isFile check.')
    }

    // Test with a Blob object cast as File. isFile should correctly return false.
    const mockFileBlob = new Blob(['content'], { type: 'text/plain' }) as File
    Object.defineProperty(mockFileBlob, 'name', { value: 'test.txt' }) // Adding name doesn't make it a File
    expect(isFile(mockFileBlob)).toBe(false) // It's still a Blob, so isFile returns false

    // Other negative checks remain the same
    expect(isFile(new Blob(['content']))).toBe(false) // A raw Blob is not a File
    expect(isFile({})).toBe(false)
    expect(isFile('file.txt')).toBe(false)
    expect(isFile(null)).toBe(false)
  })
})

describe('.isLength', () => {
  it('should work', () => {
    expect(isLength(0)).toBe(true)
    expect(isLength(10)).toBe(true)
    expect(isLength(Number.MAX_SAFE_INTEGER)).toBe(true)
    expect(isLength(-1)).toBe(false)
    expect(isLength(1.5)).toBe(false)
    expect(isLength(Infinity)).toBe(false)
    expect(isLength(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
    expect(isLength('10')).toBe(false)
    expect(isLength(null)).toBe(false)
    expect(isLength(undefined)).toBe(false)
  })
})

describe('.isArrayLike', () => {
  it('should work', () => {
    expect(isArrayLike([1, 2, 3])).toBe(true)
    expect(isArrayLike('abc')).toBe(true)
    expect(isArrayLike({ 0: 'a', length: 1 })).toBe(true)
    expect(isArrayLike({ length: 0 })).toBe(true)
    expect(isArrayLike({ length: 2 })).toBe(true)
    expect(isArrayLike(new Int8Array(2))).toBe(true)

    expect(isArrayLike({})).toBe(false)
    expect(isArrayLike(null)).toBe(false)
    expect(isArrayLike(undefined)).toBe(false)
    expect(isArrayLike(123)).toBe(false)
    expect(isArrayLike(true)).toBe(false)
    expect(isArrayLike({ length: -1 })).toBe(false)
    expect(isArrayLike({ length: 1.5 })).toBe(false)
    expect(isArrayLike({ length: Number.MAX_SAFE_INTEGER + 1 })).toBe(false)
    expect(isArrayLike(() => {})).toBe(false)
    expect(isArrayLike({ length: '1' } as any)).toBe(false)
  })
})
