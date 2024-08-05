/**
 * NOTICE: All methods not exported from `lodash` are deprecated.
 * you can replace with ES6
 *
 * @see https://youmightnotneed.com/lodash/
 *
 * @see https://radash-docs.vercel.app/docs/getting-started
 */
export * from 'es-toolkit'
export { default as equal } from 'fast-deep-equal/es6/react'
export { default as memoize } from 'moize'

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
 * Converts the characters “&”, “<”, “>”, ‘"’, and “’”
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
