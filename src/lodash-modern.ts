import { isPlainObject, isArrayLike, isSymbol } from './is-type'

export { default as equal } from 'fast-deep-equal/es6/react.js'
export { default as memoize } from 'moize'
/**
 * NOTICE: All methods not exported from `lodash` are deprecated.
 * you can replace with ES6
 *
 * @see https://youmightnotneed.com/lodash/
 *
 * @see https://radash-docs.vercel.app/docs/getting-started
 */
export {
  camel as camelCase,
  capitalize,
  chain,
  cluster as chunk,
  compose,
  counting,
  dash as kebabCase,
  diff,
  draw as sample,
  first,
  fork as partition,
  get,
  group,
  intersects,
  invert,
  isEqual,
  last,
  listify,
  mapEntries,
  mapKeys,
  mapValues,
  max,
  min,
  partial,
  partob,
  pick,
  select,
  series,
  snake as snakeCase,
  sum,
  throttle,
  zip,
  callable,
  alphabetical,
  assign,
  boil,
  construct,
  crush,
  defer,
  guard,
  inRange,
  iterate,
  keys as deepKeys,
  parallel,
  proxied,
  shake,
  sift,
  zipToObject
} from 'radash'

/**
 * ES Version of `lodash.compact`
 * Creates an array with all falsey values removed.
 * The values false, null, 0, "", undefined, and NaN are falsey.
 * @param arr - The array to compact.
 * @returns Returns the new array of filtered values.
 */
export const compact = <T>(arr: T[]): T[] => arr.filter(x => !!x)

/**
 * ES Version of `lodash.drop`
 * Creates a slice of array with n elements dropped from the beginning.
 * @param arr - The array to query.
 * @param n - The number of elements to drop.
 * @returns Returns the slice of array.
 */
export const drop = <T>(arr: T[], n = 1): T[] => arr.slice(n)

/**
 * ES Version of `lodash.dropRight`
 * Creates a slice of array with n elements dropped from the end.
 * @param arr - The array to query.
 * @param n - The number of elements to drop.
 * @returns The slice of array.
 */
export const dropRight = <T>(arr: T[], n = 1): T[] => arr.slice(0, -n || arr.length)

/**
 * ES Version of `lodash.initial`
 * Gets all but the last element of array.
 * @param arr - The array to query.
 * @returns Returns the slice of array.
 */
export const initial = <T>(arr: T[]): T[] => arr.slice(0, -1)

/**
 * ES Version of `lodash.uniq`
 * Creates a duplicate-free version of an array, in which only the first occurrence of each element is kept.
 * The order of result values is determined by the order they occur in the array.
 * @param arr - The array to inspect.
 * @returns Returns the new duplicate free array.
 */
export const uniq = <T>(arr: T[]): T[] => [...new Set(arr)]

/**
 * ES Version of `lodash.reject`
 * The opposite of `filter`; this method returns the elements of collection that predicate does not return truthy for.
 * @param arr - The array to iterate over.
 * @param predicate - The function invoked per iteration.
 * @returns Returns the new filtered array.
 */
export const reject = <T>(arr: T[], predicate: (value: T, index: number, array: T[]) => boolean): T[] =>
  arr.filter((x, i, a) => !predicate(x, i, a))

/** ES Version of `lodash.cloneDeep`
 * Creates a shallow clone of `value`. Assumes that the values of the object are primitive types.
 * @param value - The value to clone.
 * @returns Returns the cloned value.
 */
export const cloneDeep = (value: any): any | never => {
  // @see https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
  if (typeof globalThis?.structuredClone === 'function') return globalThis.structuredClone(value)

  const typeofValue = typeof value
  // primatives are copied by value.
  if (
    ['bigint', 'boolean', 'function', 'null', 'number', 'string', 'string', 'symbol', 'undefined'].includes(typeofValue)
  ) {
    return value
  }
  if (Array.isArray(value)) return value.map(cloneDeep)
  if (typeofValue === 'object') {
    const clone: any = {}
    for (const prop in value) {
      clone[prop] = cloneDeep(value[prop])
    }
    return clone
  }
  throw new Error(`You've tried to clone something that can't be cloned`)
}

/**
 * The _merge helper iterates through all props on source and assigns them to target.
 * When the value is an object, we will create a deep clone of the object. However if
 * there is a circular reference, the value will not be deep cloned and will persist
 * the reference.
 *
 * Forked from third-party library
 * @see https://github.com/microsoft/fluentui/blob/master/packages/utilities/src/merge.ts
 * @author Microsoft Corporation
 * @license MIT
 */
const _merge = <T extends object>(target: T, source: T, circularReferences: any[] = []): T => {
  circularReferences.push(source)

  for (const name in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(name)) {
      if (name !== '__proto__' && name !== 'constructor' && name !== 'prototype') {
        const value: T[Extract<keyof T, string>] = source[name]
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const isCircularReference = circularReferences.includes(value)
          target[name] = (
            isCircularReference ? value : _merge(target[name] || {}, value, circularReferences)
          ) as T[Extract<keyof T, string>]
        } else {
          target[name] = value
        }
      }
    }
  }

  circularReferences.pop()

  return target
}

/**
 * Simple deep merge function. Takes all arguments and returns a deep copy of the objects merged
 * together in the order provided. If an object creates a circular reference, it will assign the
 * original reference.
 */
export function deepMerge<T = object>(target: Partial<T>, ...args: Array<Partial<T> | false | null | undefined>): T {
  for (const arg of args) {
    _merge(target || {}, arg as Partial<T>)
  }

  return target as T
}

/**
 * A debounced function that will be delayed by a given `wait`
 * time in milliseconds. If the method is called again before
 * the timeout expires, the previous call will be aborted.
 */
interface DebouncedFunction<T extends unknown[]> {
  (...args: T): void
  /** Clears the debounce timeout and omits calling the debounced function. */
  clear: () => void
  /** Clears the debounce timeout and calls the debounced function immediately. */
  flush: () => void
  /** Returns a boolean wether a debounce call is pending or not. */
  readonly pending: boolean
}

/**
 * Creates a debounced function that delays the given `func`
 * by a given `wait` time in milliseconds. If the method is called
 * again before the timeout expires, the previous call will be
 * aborted.
 *
 * @param fn    The function to debounce.
 * @param wait  The time in milliseconds to delay the function.
 *
 * @example
 * ``` *
 * const log = debounce(
 *   (event: Deno.FsEvent) =>
 *     console.log("[%s] %s", event.kind, event.paths[0]),
 *   200,
 * );
 *
 * for await (const event of Deno.watchFs("./")) {
 *   log(event);
 * }
 * ```
 * Forked from third-party library
 * @see https://github.com/denoland/deno_std/blob/main/async/debounce.ts
 * @author The Deno authors
 * @license MIT
 */
export function debounce<T extends any[]>(
  fn: (this: DebouncedFunction<T>, ...args: T) => void,
  wait: number
): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout | null | number = null
  let flush: (() => void) | null = null

  const debounced: DebouncedFunction<T> = ((...args: T) => {
    debounced.clear()
    flush = () => {
      debounced.clear()
      fn.call(debounced, ...args)
    }
    timeout = setTimeout(flush, wait)
  }) as DebouncedFunction<T>

  debounced.clear = () => {
    if (typeof timeout === 'number') {
      clearTimeout(timeout)
      timeout = null
      flush = null
    }
  }

  debounced.flush = () => {
    flush?.()
  }

  Object.defineProperty(debounced, 'pending', {
    get: () => typeof timeout === 'number'
  })

  return debounced
}

/**
 * Converts the characters "&", "<", ">", '"', and "'"
 * in string to their corresponding HTML entities.
 * @param str The string to escape.
 * @return Returns the escaped string.
 */
export function escape(str: string): string {
  const escapeChar: Record<string, string> = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  }
  return str.replace(/[<>"&]/g, a => escapeChar[a] ?? a)
}

/**
 * Tiny helper to do the minimal amount of work in duplicating an object but omitting some
 * props. This ends up faster than using object ...rest or reduce to filter.
 *
 * This behaves very much like filteredAssign, but does not merge many objects together,
 * uses an exclusion object map, and avoids spreads all for optimal performance.
 *
 * See perf test for background:
 * https://jsperf.com/omit-vs-rest-vs-reduce/1
 *
 * @param obj - The object to clone
 * @param exclusions - The array of keys to exclude
 */
export function omit<TObj extends Record<string, any>, Exclusions extends Array<keyof TObj>>(
  obj: TObj,
  exclusions: Exclusions
): Omit<TObj, Exclusions[number]> {
  const result: Record<string, any> = {}

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (!exclusions.includes(key) && obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  }

  return result as TObj
}

/**
 * Creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end
 * If end is not specified, it's set to start with start then set to 0.
 * @param start
 * @param end
 * @returns
 */
export function range(start: number, end?: number): number[] {
  if (end === undefined) {
    return [...Array(start).keys()]
  }

  const length = Math.abs(end - start) + 1
  const step = start < end ? 1 : -1

  return Array.from({ length }, (_, i) => start + i * step)
}

/**
 * Receives a tree-like object and returns a plain object which depth is 1.
 *
 * - Input:
 *
 *  {
 *    name: 'John',
 *    address: {
 *      street: 'Fake St. 123',
 *      coordinates: {
 *        longitude: 55.6779627,
 *        latitude: 12.5964313
 *      }
 *    }
 *  }
 *
 * - Output:
 *
 *  {
 *    name: 'John',
 *    address.street: 'Fake St. 123',
 *    address.coordinates.latitude: 55.6779627,
 *    address.coordinates.longitude: 12.5964313
 *  }
 *
 * @param value an Object
 * @returns a flattened object
 * @private
 */
export function flattenObject<T extends object>(value: T): T extends object ? Flatten<T> : T {
  if (!isPlainObject(value)) {
    // TypeScript doesn't know T is an object due to isPlainObject's typings. Cast to any.
    return value as any
  }

  const flattenedObj: Record<string, any> = Object.create(null)

  function _flattenObject(obj: Record<string, any>, subPath?: string): Record<string, any> {
    for (const key of Object.keys(obj)) {
      const pathToProperty = subPath ? `${subPath}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        _flattenObject(obj[key], pathToProperty)
      } else {
        flattenedObj[pathToProperty] = obj[key]
      }
    }

    return flattenedObj
  }

  return _flattenObject(value) as any
}

// taken from
// https://stackoverflow.com/questions/66614528/flatten-object-with-custom-keys-in-typescript
// because this is typescript black magic
type Flatten<T extends object> = object extends T
  ? object
  : {
        [K in keyof T]-?: (
          x: NonNullable<T[K]> extends infer V
            ? V extends object
              ? V extends readonly any[]
                ? Pick<T, K>
                : Flatten<V> extends infer FV
                  ? {
                      [P in keyof FV as `${Extract<K, number | string>}.${Extract<P, number | string>}`]: FV[P]
                    }
                  : never
              : Pick<T, K>
            : never
        ) => void
      } extends Record<keyof T, (y: infer O) => void>
    ? O extends unknown
      ? { [K in keyof O]: O[K] }
      : never
    : never

/**
 * Gets n random elements at unique keys from collection up to the size of collection.
 * @param collection The array from which elements will be sampled.
 * @param n The number of elements to sample. default is 1.
 * @returns An array containing n random elements from the provided collection.
 */
export function sampleSize<T>(collection: readonly T[], n = 1): T[] {
  // Ensure that n does not exceed the number of elements in the collection
  const count = Math.min(n, collection.length)

  const result = collection.slice()
  for (let i = 0; i < count; i++) {
    const rand = i + Math.floor(Math.random() * (collection.length - i))
    ;[result[i], result[rand]] = [result[rand] as T, result[i] as T]
  }

  return result.slice(0, count)
}

/**
 * Converts `value` to a string.
 *
 * An empty string is returned for `null` and `undefined` values.
 * The sign of `-0` is preserved.
 *
 * @param {unknown} value - The value to convert.
 * @returns {string} Returns the converted string.
 *
 * @example
 * toString(null) // returns ''
 * toString(undefined) // returns ''
 * toString(-0) // returns '-0'
 * toString([1, 2, -0]) // returns '1,2,-0'
 * toString([Symbol('a'), Symbol('b')]) // returns 'Symbol(a),Symbol(b)'
 */
export function toString(value?: unknown): string {
  if (value == null) {
    return ''
  }

  if (Array.isArray(value)) {
    return value.map(toString).join(',')
  }

  const result = String(value)

  if (result === '0' && Object.is(Number(value), -0)) {
    return '-0'
  }

  return result
}

/**
 * Converts `value` to a number.
 *
 * Unlike `Number()`, this function returns `NaN` for symbols.
 *
 * @param {unknown} value - The value to convert.
 * @returns {number} Returns the number.
 *
 * @example
 * toNumber(3.2); // => 3.2
 * toNumber(Number.MIN_VALUE); // => 5e-324
 * toNumber(Infinity); // => Infinity
 * toNumber('3.2'); // => 3.2
 * toNumber(Symbol.iterator); // => NaN
 * toNumber(NaN); // => NaN
 */
export function toNumber(value?: unknown): number {
  if (isSymbol(value)) {
    return Number.NaN
  }

  return Number(value)
}

/**
 * Creates a new object composed of the properties that do not satisfy the predicate function.
 *
 * This function takes an object and a predicate function, and returns a new object that
 * includes only the properties for which the predicate function returns false.
 *
 * @template T - The type of object.
 * @param {T} obj - The object to omit properties from.
 * @param {(value: T[string], key: keyof T) => boolean} shouldOmit - A predicate function that determines
 * whether a property should be omitted. It takes the property's key and value as arguments and returns `true`
 * if the property should be omitted, and `false` otherwise.
 * @returns {Partial<T>} A new object with the properties that do not satisfy the predicate function.
 *
 * @example
 * const obj = { a: 1, b: 'omit', c: 3 };
 * const shouldOmit = (value) => typeof value === 'string';
 * const result = omitBy(obj, shouldOmit);
 * // result will be { a: 1, c: 3 }
 */
export function omitBy<T extends Record<string, any>>(
  obj: T,
  shouldOmit: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result: Partial<T> = {}

  const keys = Object.keys(obj) as Array<keyof T>

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = obj[key!]

    if (!shouldOmit(value, key!)) {
      result[key!] = value
    }
  }

  return result
}

/**
 * Creates a new object composed of the properties that satisfy the predicate function.
 *
 * This function takes an object and a predicate function, and returns a new object that
 * includes only the properties for which the predicate function returns true.
 *
 * @template T - The type of object.
 * @param {T} obj - The object to pick properties from.
 * @param {(value: T[keyof T], key: keyof T) => boolean} shouldPick - A predicate function that determines
 * whether a property should be picked. It takes the property's key and value as arguments and returns `true`
 * if the property should be picked, and `false` otherwise.
 * @returns {Partial<T>} A new object with the properties that satisfy the predicate function.
 *
 * @example
 * const obj = { a: 1, b: 'pick', c: 3 };
 * const shouldPick = (value) => typeof value === 'string';
 * const result = pickBy(obj, shouldPick);
 * // result will be { b: 'pick' }
 */
export function pickBy<T extends Record<string, any>>(
  obj: T,
  shouldPick?: (value: T[keyof T], key: keyof T, obj: T) => boolean
): Partial<T> {
  if (obj == null) {
    return {}
  }

  const result: Partial<T> = {}

  if (shouldPick == null) {
    return obj
  }

  const keys = isArrayLike(obj) ? range(obj.length) : (Object.keys(obj) as Array<keyof T>)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!.toString() as keyof T
    const value = obj[key]

    if (shouldPick(value, key, obj)) {
      result[key] = value
    }
  }

  return result
}
