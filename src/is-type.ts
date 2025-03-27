import { isArray, isEmpty, isFunction } from 'radash'

export { isFloat, isInt, isSymbol, isDate, isObject, isPrimitive, isPromise } from 'radash'
export { isArray, isEmpty, isFunction }

/**
 * Checks if `value` is a RegExp.
 *
 * @param {unknown} value The value to check.
 * @returns {value is RegExp} Returns `true` if `value` is a RegExp, `false` otherwise.
 *
 * @example
 * const value1 = /abc/;
 * const value2 = '/abc/';
 *
 * console.log(isRegExp(value1)); // true
 * console.log(isRegExp(value2)); // false
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp
}

/**
 * Checks if a given value is a plain object.
 *
 * @param {object} value - The value to check.
 * @returns {value is Record<PropertyKey, any>} - True if the value is a plain object, otherwise false.
 *
 * @example
 * ```typescript
 * // ✅👇 True
 *
 * isPlainObject({ });                       // ✅
 * isPlainObject({ key: 'value' });          // ✅
 * isPlainObject({ key: new Date() });       // ✅
 * isPlainObject(new Object());              // ✅
 * isPlainObject(Object.create(null));       // ✅
 * isPlainObject({ nested: { key: true} });  // ✅
 * isPlainObject(new Proxy({}, {}));         // ✅
 * isPlainObject({ [Symbol('tag')]: 'A' });  // ✅
 *
 * // ✅👇 (cross-realms, node context, workers, ...)
 * const runInNewContext = await import('node:vm').then(
 *     (mod) => mod.runInNewContext
 * );
 * isPlainObject(runInNewContext('({})'));   // ✅
 *
 * // ❌👇 False
 *
 * class Test { };
 * isPlainObject(new Test())           // ❌
 * isPlainObject(10);                  // ❌
 * isPlainObject(null);                // ❌
 * isPlainObject('hello');             // ❌
 * isPlainObject([]);                  // ❌
 * isPlainObject(new Date());          // ❌
 * isPlainObject(new Uint8Array([1])); // ❌
 * isPlainObject(Buffer.from('ABC'));  // ❌
 * isPlainObject(Promise.resolve({})); // ❌
 * isPlainObject(Object.create({}));   // ❌
 * isPlainObject(new (class Cls {}));  // ❌
 * isPlainObject(globalThis);          // ❌,
 * ```
 */
export function isPlainObject(value: unknown): value is Record<PropertyKey, any> {
  if (!value || typeof value !== 'object') {
    return false
  }

  const proto = Object.getPrototypeOf(value) as typeof Object.prototype | null

  const hasObjectPrototype =
    proto === null ||
    proto === Object.prototype ||
    // Required to support node:vm.runInNewContext({})
    Object.getPrototypeOf(proto) === null

  if (!hasObjectPrototype) return false

  return Object.prototype.toString.call(value) === '[object Object]'
}

export function isBoolean(value?: unknown): value is boolean {
  return typeof value === 'boolean' || value instanceof Boolean
}

export function isNaN(value?: unknown): value is typeof Number.NaN {
  return Number.isNaN(value)
}

export function isNull(x: unknown): x is null {
  return x === null
}

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

/**
 * Checks if a given value is a valid length.
 *
 * A valid length is of type `number`, is a non-negative integer, and is less than or equal to
 * JavaScript's maximum safe integer (`Number.MAX_SAFE_INTEGER`).
 * It returns `true` if the value is a valid length, and `false` otherwise.
 *
 * This function can also serve as a type predicate in TypeScript, narrowing the type of the
 * argument to a valid length (`number`).
 *
 * @param {unknown} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 *
 * @example
 * isLength(0); // true
 * isLength(42); // true
 * isLength(-1); // false
 * isLength(1.5); // false
 * isLength(Number.MAX_SAFE_INTEGER); // true
 * isLength(Number.MAX_SAFE_INTEGER + 1); // false
 */
export function isLength(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0
}

/**
 * Checks if `value` is array-like.
 *
 * @param {unknown} value The value to check.
 * @returns {value is ArrayLike<unknown>} Returns `true` if `value` is array-like, else `false`.
 *
 * @example
 * isArrayLike([1, 2, 3]); // true
 * isArrayLike('abc'); // true
 * isArrayLike({ 0: 'a', length: 1 }); // true
 * isArrayLike({}); // false
 * isArrayLike(null); // false
 * isArrayLike(undefined); // false
 */
export function isArrayLike(value?: unknown): value is ArrayLike<unknown> {
  return value != null && typeof value !== 'function' && isLength((value as ArrayLike<unknown>).length)
}
