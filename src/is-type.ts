import { isArray, isEmpty, isFunction } from 'radash'

export { isFloat, isInt, isSymbol } from 'radash'
export { isArray, isEmpty, isFunction }

/**
 * Checks if a given value is a string.
 *
 * @see {@link https://bambielli.com/til/2017-06-18-typeof-vs-instanceof/}
 * @param value
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String
}

/**
 * Checks if a given value is a number.
 * @param value
 * @param finiteness - if true, checks if the value is a finite number.
 */
export function isNumber(value: unknown, finiteness = false): value is number {
  if (typeof value !== 'number') return false
  return finiteness ? Number.isFinite(value) : true
}

/**
 * Checks if a given value is a null or undefined.
 * @param value
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  // eslint-disable-next-line eqeqeq
  return value == undefined
}

/**
 * Checks if a given value is a uuid.
 * @param value
 */
export const isUUID = <U>(value: U | string): value is string => {
  return isString(value) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

/**
 * Checks if a given value is non empty array.
 * @param value
 */
export const isNonEmptyArray = <T, U>(value: T[] | U): value is [T, ...T[]] =>
  isArray(value) && (value as T[]).length > 0

/**
 * Checks if a given value is a non empty string.
 * @param value
 */
export const isNonEmptyString = <U>(value: U | string): value is string => isString(value) && value.length > 0

/**
 * Checks if a given value is a empty like Ruby on Rails.
 * @param value
 */
export const isBlank = (value: unknown): boolean =>
  isNumber(value) || isFunction(value) || value === true ? false : isEmpty(value)

/**
 * Checks if a given value is a url.
 * @param value
 * @param schema - if not null, checks if the uri is valid with the given schema.
 * @returns true if the value is a url, false otherwise.
 */
export const isUrl = (value: string, schema?: string): boolean => {
  if (!isString(value)) return false
  try {
    const url = new URL(value)
    return schema ? url.protocol === `${schema}:` : true
  } catch (_e) {
    return false
  }
}

/**
 * Checks if a given value is a email
 * @param value
 * @returns true if the value is a email, false otherwise.
 */
// eslint-disable-next-line regexp/strict
export const isEmail = (value: string): boolean => /^[\w-\\.]+@(?:[\w-]+\.)+[\w-]+$/.test(value)

/**
 * Checks if a given value is a file
 * @param obj
 * @returns
 */
export const isFile = (obj: any): obj is File => {
  // return Object.prototype.toString.call(obj) === '[object File]'
  return obj instanceof File
}
